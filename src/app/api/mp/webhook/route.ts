import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { MP_API, getHeaders } from '@/lib/mercadopago'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 30

function getSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('[MP webhook] SUPABASE_SERVICE_ROLE_KEY no configurada — abortando')
    throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')
  }
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
}

function verifyMPSignature(request: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  // Sin secret → rechazar SIEMPRE. Antes el código retornaba `true` (bypass total).
  if (!secret) {
    console.error('[MP webhook] MERCADOPAGO_WEBHOOK_SECRET no configurada — rechazando')
    return false
  }

  const signature = request.headers.get('x-signature') ?? ''
  const requestId = request.headers.get('x-request-id') ?? ''
  const dataId = new URL(request.url).searchParams.get('data.id') ?? ''

  const tsMatch = signature.match(/ts=(\d+)/)
  const v1Match = signature.match(/v1=([a-f0-9]+)/)
  if (!tsMatch || !v1Match) return false

  const ts = tsMatch[1]
  const receivedHash = v1Match[1]

  // Validar ventana temporal — ±5 min para prevenir replay attacks
  const nowSec = Math.floor(Date.now() / 1000)
  const tsSec = parseInt(ts, 10)
  if (isNaN(tsSec) || Math.abs(nowSec - tsSec) > 300) {
    console.error('[MP webhook] timestamp fuera de ventana — posible replay')
    return false
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const computedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(receivedHash))
}

// external_reference = "subscriber_id:creator_id:price_clp"  (lector → creador)
function parseRef(ref: string): { subscriberId: string; creatorId: string; priceCLP: number } | null {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const parts = ref.split(':')
  if (parts.length < 3) return null
  const [subscriberId, creatorId, priceStr] = parts
  if (!UUID.test(subscriberId) || !UUID.test(creatorId)) return null
  // Defensa: un creador no puede ser su propio suscriptor (inflar métricas)
  if (subscriberId === creatorId) return null
  const priceCLP = parseInt(priceStr, 10)
  if (isNaN(priceCLP) || priceCLP <= 0) return null
  return { subscriberId, creatorId, priceCLP }
}

// external_reference = "platform:creator_id:user_id"
function parsePlatformRef(ref: string): { creatorId: string; userId: string } | null {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!ref.startsWith('platform:')) return null
  const parts = ref.split(':')
  if (parts.length < 3) return null
  const creatorId = parts[1]
  const userId = parts[2]
  if (!UUID.test(creatorId) || !UUID.test(userId)) return null
  return { creatorId, userId }
}

// Idempotencia — registrar evento procesado y devolver false si ya existe
async function markEventProcessed(eventId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('sala_webhook_events')
    .insert({ provider: 'mercadopago', event_id: eventId })
  if (error) {
    // 23505 = unique_violation → ya procesado
    if (error.code === '23505') return false
    throw new Error(`markEventProcessed: ${error.message}`)
  }
  return true
}

// Validar que el monto pagado coincide con el precio actual del creador
async function validateAmount(creatorId: string, amountPaid: number, tolerance = 0.01): Promise<boolean> {
  const supabase = getSupabase()
  const { data: creator } = await supabase
    .from('sala_creators')
    .select('price_clp')
    .eq('id', creatorId)
    .single()
  if (!creator) return false
  const expected = (creator as { price_clp: number }).price_clp
  return Math.abs(amountPaid - expected) <= expected * tolerance
}

// Validar que el monto del plan de plataforma es $29.990 CLP (con tolerancia para FX)
function validatePlatformAmount(amountPaid: number): boolean {
  return amountPaid >= 28000 && amountPaid <= 32000
}

async function activateCreatorPlan(creatorId: string, userId: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('sala_creators')
    .update({ plan: 'creator' })
    .eq('id', creatorId)
    .eq('user_id', userId)
  if (error) throw new Error(`activateCreatorPlan: ${error.message}`)
}

async function activateSubscription(
  subscriberId: string,
  creatorId: string,
  priceCLP: number,
  mpRef: string
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('sala_subscriptions').upsert(
    {
      subscriber_id: subscriberId,
      creator_id: creatorId,
      status: 'active' as const,
      stripe_subscription_id: mpRef,
      price_clp: priceCLP,
      cancelled_at: null,
    },
    { onConflict: 'subscriber_id,creator_id', ignoreDuplicates: false }
  )
  if (error) throw new Error(`activateSubscription: ${error.message}`)
}

async function cancelSubscription(subscriberId: string, creatorId: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('sala_subscriptions')
    .update({ status: 'cancelled' as const, cancelled_at: new Date().toISOString() })
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .in('status', ['active', 'past_due'])
  if (error) throw new Error(`cancelSubscription: ${error.message}`)
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    if (!verifyMPSignature(request)) {
      console.error('[MP webhook] firma inválida — rechazando')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const body = JSON.parse(rawBody)
    const { type, data, id: bodyEventId } = body
    const eventId = `${type}:${data?.id ?? bodyEventId ?? 'unknown'}`

    // Idempotencia
    const fresh = await markEventProcessed(eventId)
    if (!fresh) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    // ── Pago único ───────────────────────────────────────────────────────────
    if (type === 'payment') {
      const paymentId = data?.id
      if (!paymentId) return NextResponse.json({ received: true })

      const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, { headers: getHeaders() })
      if (!res.ok) return NextResponse.json({ error: 'MP API error' }, { status: 502 })

      const payment = await res.json()
      const parsed = parseRef(payment.external_reference ?? '')
      if (!parsed) return NextResponse.json({ received: true })

      if (payment.status === 'approved') {
        // Validar amount real cobrado vs precio del creador
        const amountPaid = Number(payment.transaction_amount ?? 0)
        const amountOK = await validateAmount(parsed.creatorId, amountPaid)
        if (!amountOK) {
          console.error(`[MP webhook] amount mismatch: paid=${amountPaid} creator=${parsed.creatorId}`)
          return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
        }
        await activateSubscription(
          parsed.subscriberId,
          parsed.creatorId,
          amountPaid,
          `mp_payment:${paymentId}`
        )
      } else if (['refunded', 'charged_back', 'cancelled'].includes(payment.status)) {
        await cancelSubscription(parsed.subscriberId, parsed.creatorId)
      }
    }

    // ── Suscripción recurrente ────────────────────────────────────────────────
    if (type === 'subscription_preapproval') {
      const preapprovalId = data?.id
      if (!preapprovalId) return NextResponse.json({ received: true })

      const res = await fetch(`${MP_API}/preapproval/${preapprovalId}`, { headers: getHeaders() })
      if (!res.ok) return NextResponse.json({ error: 'MP API error' }, { status: 502 })

      const preapproval = await res.json()
      const extRef: string = preapproval.external_reference ?? ''
      const transactionAmount = Number(preapproval.auto_recurring?.transaction_amount ?? 0)

      // ── Tarifa de plataforma: creador → Nebbuler ──
      const platformParsed = parsePlatformRef(extRef)
      if (platformParsed) {
        if (preapproval.status === 'authorized') {
          if (!validatePlatformAmount(transactionAmount)) {
            console.error(`[MP webhook] platform amount mismatch: ${transactionAmount}`)
            return NextResponse.json({ error: 'Platform amount mismatch' }, { status: 400 })
          }
          await activateCreatorPlan(platformParsed.creatorId, platformParsed.userId)
        }
        return NextResponse.json({ received: true })
      }

      // ── Suscripción lector → creador ──
      const parsed = parseRef(extRef)
      if (!parsed) return NextResponse.json({ received: true })

      if (preapproval.status === 'authorized') {
        const amountOK = await validateAmount(parsed.creatorId, transactionAmount)
        if (!amountOK) {
          console.error(`[MP webhook] sub amount mismatch: ${transactionAmount} creator=${parsed.creatorId}`)
          return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
        }
        await activateSubscription(
          parsed.subscriberId,
          parsed.creatorId,
          transactionAmount,
          `mp_sub:${preapprovalId}`
        )
      } else if (['cancelled', 'paused', 'finished'].includes(preapproval.status)) {
        await cancelSubscription(parsed.subscriberId, parsed.creatorId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[MP webhook] error:', err)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
