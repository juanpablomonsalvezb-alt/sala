import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { MP_API } from '@/lib/mercadopago'
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

const PLATFORM_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''

function mpHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

// Resuelve qué token usar para consultar MP API:
// - Si MP envía ?user_id=<seller> (preapproval de lector→creador via Connect), usar token del creador
// - Si no hay seller (tarifa Nebbuler), usar token de plataforma
async function resolveMPToken(request: NextRequest): Promise<string> {
  const sellerId = new URL(request.url).searchParams.get('user_id')
  if (!sellerId) return PLATFORM_TOKEN

  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('sala_creators')
      .select('mp_access_token')
      .eq('mp_user_id', sellerId)
      .maybeSingle()
    const token = (data as { mp_access_token: string | null } | null)?.mp_access_token
    if (token) return token
  } catch (err) {
    console.error('[MP webhook] resolveMPToken lookup error:', err)
  }
  return PLATFORM_TOKEN
}

// Consulta a MP API con fallback de token. MP Connect a veces permite a la plataforma
// consultar transacciones de sus sellers — usamos esto como red de seguridad.
async function fetchMPWithFallback(url: string, primaryToken: string): Promise<Response> {
  const primary = await fetch(url, { headers: mpHeaders(primaryToken) })
  if (primary.ok) return primary
  if (primaryToken === PLATFORM_TOKEN) return primary
  return fetch(url, { headers: mpHeaders(PLATFORM_TOKEN) })
}

function verifyMPSignature(request: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
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

  // Anti-replay: ventana ±5 min
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

// external_reference = "subscriber_id:creator_id:price_clp"
function parseRef(ref: string): { subscriberId: string; creatorId: string; priceCLP: number } | null {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const parts = ref.split(':')
  if (parts.length < 3) return null
  const [subscriberId, creatorId, priceStr] = parts
  if (!UUID.test(subscriberId) || !UUID.test(creatorId)) return null
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
  const [, creatorId, userId] = parts
  if (!UUID.test(creatorId) || !UUID.test(userId)) return null
  return { creatorId, userId }
}

async function markEventProcessed(eventId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('sala_webhook_events')
    .insert({ provider: 'mercadopago', event_id: eventId })
  if (error) {
    if (error.code === '23505') return false
    throw new Error(`markEventProcessed: ${error.message}`)
  }
  return true
}

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

// Activa o renueva la suscripción.
// IMPORTANTE: piso `created_at` con NOW() en cada cobro/renovación.
// El frontend usa `created_at` como "fecha del último ciclo de pago" para
// bloquear acceso si > 35 días (regla "día 30/31 sin renovación → bloqueo").
async function activateSubscription(
  subscriberId: string,
  creatorId: string,
  priceCLP: number,
  mpRef: string
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('sala_subscriptions').upsert(
    {
      subscriber_id:          subscriberId,
      creator_id:             creatorId,
      status:                 'active' as const,
      stripe_subscription_id: mpRef,
      price_clp:              priceCLP,
      cancelled_at:           null,
      created_at:             new Date().toISOString(),
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

// Procesa un preapproval ya consultado (status + external_reference) sin importar
// con qué token se obtuvo.
async function processPreapproval(preapproval: {
  status: string
  external_reference?: string
  auto_recurring?: { transaction_amount?: number }
}, preapprovalId: string): Promise<NextResponse> {
  const extRef: string = preapproval.external_reference ?? ''
  const transactionAmount = Number(preapproval.auto_recurring?.transaction_amount ?? 0)

  // Tarifa de plataforma — creador → Nebbuler
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

  // Suscripción lector → creador (Connect, 100% al creador)
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

  return NextResponse.json({ received: true })
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

    const fresh = await markEventProcessed(eventId)
    if (!fresh) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    const mpToken = await resolveMPToken(request)

    // ── Pago único ───────────────────────────────────────────────────────────
    if (type === 'payment') {
      const paymentId = data?.id
      if (!paymentId) return NextResponse.json({ received: true })

      const res = await fetchMPWithFallback(`${MP_API}/v1/payments/${paymentId}`, mpToken)
      if (!res.ok) {
        console.error('[MP webhook] payment lookup failed:', res.status)
        return NextResponse.json({ error: 'MP API error' }, { status: 502 })
      }

      const payment = await res.json()
      const parsed = parseRef(payment.external_reference ?? '')
      if (!parsed) return NextResponse.json({ received: true })

      if (payment.status === 'approved') {
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

      const res = await fetchMPWithFallback(`${MP_API}/preapproval/${preapprovalId}`, mpToken)
      if (!res.ok) {
        console.error('[MP webhook] preapproval lookup failed:', res.status)
        return NextResponse.json({ error: 'MP API error' }, { status: 502 })
      }

      const preapproval = await res.json()
      return await processPreapproval(preapproval, preapprovalId)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[MP webhook] error:', err)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
