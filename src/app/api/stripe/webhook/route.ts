import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import type { Subscription } from '@/types/database'
import { stripe } from '@/lib/stripe'

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('sala_subscriptions').insert(newSub)

      if (error) {
        console.error('Error insertando subscription:', error)
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

  return new Response('OK', { status: 200 })
}
