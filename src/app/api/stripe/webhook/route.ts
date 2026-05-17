import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import type { Subscription } from '@/types/database'
import { stripe } from '@/lib/stripe'

// Reserva el event.id de Stripe atómicamente. Devuelve:
//   'fresh'    → primera vez, proceder
//   'duplicate'→ ya completado, ignorar
//   'retry'    → reserva previa expirada (>5min), reprocesar
//
// Misma estrategia que el webhook de MP. Stripe reintenta hasta 72h con backoff.
// Sin esto, cada retry crea suscripciones duplicadas en BD.
async function reserveStripeEvent(eventId: string): Promise<'fresh' | 'duplicate' | 'retry'> {
  const supabase = createServiceClient()
  const TTL_MS = 5 * 60 * 1000

  const { error: insertErr } = await supabase
    .from('sala_webhook_events')
    .insert({
      provider:     'stripe',
      event_id:     eventId,
      status:       'processing',
      attempted_at: new Date().toISOString(),
    })

  if (!insertErr) return 'fresh'
  if (insertErr.code !== '23505') {
    throw new Error(`reserveStripeEvent insert: ${insertErr.message}`)
  }

  const { data: existing } = await supabase
    .from('sala_webhook_events')
    .select('status, attempted_at')
    .eq('provider', 'stripe')
    .eq('event_id', eventId)
    .maybeSingle()

  const row = existing as { status?: string; attempted_at?: string } | null
  if (row?.status === 'done') return 'duplicate'

  const attemptedAt = row?.attempted_at ? new Date(row.attempted_at).getTime() : 0
  if (Date.now() - attemptedAt > TTL_MS) {
    await supabase
      .from('sala_webhook_events')
      .update({ attempted_at: new Date().toISOString() })
      .eq('provider', 'stripe')
      .eq('event_id', eventId)
    return 'retry'
  }
  return 'duplicate'
}

async function commitStripeEvent(eventId: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase
    .from('sala_webhook_events')
    .update({ status: 'done', processed_at: new Date().toISOString() })
    .eq('provider', 'stripe')
    .eq('event_id', eventId)
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Webhook error: invalid signature', { status: 400 })
  }

  // Idempotencia: reservar event.id antes de procesar
  const reservation = await reserveStripeEvent(event.id)
  if (reservation === 'duplicate') {
    return new Response('OK (duplicate)', { status: 200 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Solo procesar suscripciones
      if (session.mode !== 'subscription' || !session.subscription) break

      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id

      // Recuperar la suscripción completa desde Stripe para obtener metadatos
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)

      const subscriberId = session.metadata?.subscriber_id
      const creatorId = session.metadata?.creator_id
      const priceClp = session.metadata?.price_clp
        ? parseInt(session.metadata.price_clp, 10)
        : 0

      if (!subscriberId || !creatorId) {
        console.error('Webhook checkout.session.completed: faltan metadatos', {
          subscriberId,
          creatorId,
        })
        break
      }

      const newSub: Omit<Subscription, 'id' | 'created_at' | 'cancelled_at'> = {
        subscriber_id: subscriberId,
        creator_id: creatorId,
        status: 'active',
        stripe_subscription_id: stripeSubscription.id,
        price_clp: priceClp,
      }

      // UPSERT en lugar de INSERT: si la suscripción ya existe (re-activación
      // tras cancelación, o retry), actualizamos en vez de fallar por unique.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('sala_subscriptions')
        .upsert(
          { ...newSub, cancelled_at: null, created_at: new Date().toISOString() },
          { onConflict: 'subscriber_id,creator_id', ignoreDuplicates: false }
        )

      if (error) {
        console.error('Error upsert subscription:', error)
        return new Response('Error guardando subscription', { status: 500 })
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('sala_subscriptions')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error cancelando subscription:', error)
        return new Response('Error actualizando subscription', { status: 500 })
      }

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice

      // En la API dahlia, la relación con subscription vive en invoice.parent
      const parent = invoice.parent as Stripe.Invoice.Parent | null
      const subscriptionId: string | null =
        parent?.type === 'subscription_details' && parent.subscription_details?.subscription
          ? typeof parent.subscription_details.subscription === 'string'
            ? parent.subscription_details.subscription
            : (parent.subscription_details.subscription as Stripe.Subscription).id
          : null

      if (!subscriptionId) break

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('sala_subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_subscription_id', subscriptionId)

      if (error) {
        console.error('Error marcando past_due:', error)
        return new Response('Error actualizando subscription', { status: 500 })
      }

      break
    }

    default:
      // Evento no manejado — se ignora de forma segura
      break
  }

  // Commit: marca el evento como 'done'. Si arriba lanzamos antes, queda
  // 'processing' y expirará en 5min para que Stripe pueda reintentar.
  await commitStripeEvent(event.id)
  return new Response('OK', { status: 200 })
}
