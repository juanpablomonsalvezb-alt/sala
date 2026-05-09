import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { MP_API, getHeaders } from '@/lib/mercadopago'

function getSupabase() {
  return createServiceSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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
) {
  const supabase = getSupabase()

  // Upsert suscripción activa
  const { error } = await supabase.from('sala_subscriptions').upsert(
    {
      subscriber_id: subscriberId,
      creator_id: creatorId,
      status: 'active' as const,
      stripe_subscription_id: mpRef, // reutilizamos la columna para guardar la referencia MP
      price_clp: priceCLP,
      cancelled_at: null,
    },
    { onConflict: 'subscriber_id,creator_id', ignoreDuplicates: false }
  )

  if (error) console.error('[MP webhook] activateSubscription error:', error.message)
}

async function cancelSubscription(subscriberId: string, creatorId: string) {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('sala_subscriptions')
    .update({ status: 'cancelled' as const, cancelled_at: new Date().toISOString() })
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .eq('status', 'active')

  if (error) console.error('[MP webhook] cancelSubscription error:', error.message)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
      if (!res.ok) return NextResponse.json({ received: true })

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
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
