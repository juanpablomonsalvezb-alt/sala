import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { MP_API, getHeaders } from '@/lib/mercadopago'
import crypto from 'crypto'

function getSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('[MP webhook] SUPABASE_SERVICE_ROLE_KEY no configurada — abortando')
    throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')
  }
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
}

function verifyMPSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true // En dev sin secret, pasar (advertencia en log)

  const signature = request.headers.get('x-signature') ?? ''
  const requestId = request.headers.get('x-request-id') ?? ''
  const dataId = new URL(request.url).searchParams.get('data.id') ?? ''

  // Formato: ts=<timestamp>,v1=<hash>
  const tsMatch = signature.match(/ts=(\d+)/)
  const v1Match = signature.match(/v1=([a-f0-9]+)/)
  if (!tsMatch || !v1Match) return false

  const ts = tsMatch[1]
  const receivedHash = v1Match[1]
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const computedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
  return computedHash === receivedHash
}

// external_reference = "subscriber_id:creator_id:price_clp"
function parseRef(ref: string): { subscriberId: string; creatorId: string; priceCLP: number } | null {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const parts = ref.split(':')
  if (parts.length < 3) return null
  const [subscriberId, creatorId, priceStr] = parts
  if (!UUID.test(subscriberId) || !UUID.test(creatorId)) return null
  const priceCLP = parseInt(priceStr, 10)
  if (isNaN(priceCLP)) return null
  return { subscriberId, creatorId, priceCLP }
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
    .eq('status', 'active')
  if (error) throw new Error(`cancelSubscription: ${error.message}`)
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    // Validar firma HMAC de MercadoPago
    if (!verifyMPSignature(request, rawBody)) {
      console.error('[MP webhook] firma inválida — rechazando')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const body = JSON.parse(rawBody)
    const { type, data } = body

    // ── Pago único (checkout preference) ─────────────────────────────────────
    if (type === 'payment') {
      const paymentId = data?.id
      if (!paymentId) return NextResponse.json({ received: true })

      const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, { headers: getHeaders() })
      if (!res.ok) return NextResponse.json({ received: true })

      const payment = await res.json()
      const parsed = parseRef(payment.external_reference ?? '')
      if (!parsed) return NextResponse.json({ received: true })

      if (payment.status === 'approved') {
        await activateSubscription(
          parsed.subscriberId,
          parsed.creatorId,
          parsed.priceCLP,
          `mp_payment:${paymentId}`
        )
      }
    }

    // ── Suscripción recurrente (preapproval) ──────────────────────────────────
    if (type === 'subscription_preapproval') {
      const preapprovalId = data?.id
      if (!preapprovalId) return NextResponse.json({ received: true })

      const res = await fetch(`${MP_API}/preapproval/${preapprovalId}`, { headers: getHeaders() })
      if (!res.ok) return NextResponse.json({ error: 'MP API error' }, { status: 502 })

      const preapproval = await res.json()
      const parsed = parseRef(preapproval.external_reference ?? '')
      if (!parsed) return NextResponse.json({ received: true })

      if (preapproval.status === 'authorized') {
        await activateSubscription(
          parsed.subscriberId,
          parsed.creatorId,
          parsed.priceCLP,
          `mp_sub:${preapprovalId}`
        )
      } else if (preapproval.status === 'cancelled' || preapproval.status === 'paused') {
        await cancelSubscription(parsed.subscriberId, parsed.creatorId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[MP webhook] error:', err)
    // Devolver 500 para que MercadoPago reintente la notificación
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
