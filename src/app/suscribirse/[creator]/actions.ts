'use server'

import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY ?? ''
  return !key.includes('placeholder') && key.startsWith('sk_')
}

export async function createCheckoutSession(
  creatorSlug: string
): Promise<{ error: string } | void> {
  if (!isSupabaseConfigured()) {
    return { error: 'Los pagos aún no están activos en esta demo.' }
  }

  const supabase = await createClient()

  // Verificar usuario autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(`/entrar?redirect=/suscribirse/${creatorSlug}`)
  }

  // Obtener creator
  const { data: creator, error: creatorError } = await supabase
    .from('sala_creators')
    .select('*')
    .eq('slug', creatorSlug)
    .single()

  if (creatorError || !creator) {
    return { error: 'Creador no encontrado.' }
  }

  // Verificar suscripción existente
  const { data: existingSub } = await supabase
    .from('sala_subscriptions')
    .select('id')
    .eq('subscriber_id', user.id)
    .eq('creator_id', creator.id)
    .eq('status', 'active')
    .maybeSingle()

  if (existingSub) {
    redirect(`/${creatorSlug}`)
  }

  // Si Stripe no está configurado → demo
  if (!isStripeConfigured()) {
    return { error: 'Los pagos con Stripe aún no están activos. Vuelve pronto.' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  // Si el creator no tiene cuenta Stripe Connect → checkout directo a la plataforma
  // (modo simplificado: el pago va a la cuenta principal)
  const sessionConfig: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'clp',
          unit_amount: creator.price_clp,
          recurring: { interval: 'month' },
          product_data: {
            name: `Nebbuler — ${creator.name}`,
            description: creator.bio,
            metadata: {
              creator_id: creator.id,
              creator_slug: creator.slug,
            },
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/suscribirse/${creatorSlug}/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${creatorSlug}`,
    metadata: {
      subscriber_id: user.id,
      creator_id: creator.id,
      creator_slug: creator.slug,
      price_clp: String(creator.price_clp),
    },
    subscription_data: {
      metadata: {
        subscriber_id: user.id,
        creator_id: creator.id,
      },
    },
    client_reference_id: user.id,
  }

  let session: { url: string | null }

  if (creator.stripe_account_id) {
    // Modo Connect: el pago va directo al creador con fee del 5%
    session = await stripe.checkout.sessions.create(
      {
        ...sessionConfig,
        payment_intent_data: {
          application_fee_amount: Math.round(creator.price_clp * 0.05),
          transfer_data: {
            destination: creator.stripe_account_id,
          },
        },
      },
      { stripeAccount: creator.stripe_account_id }
    )
  } else {
    session = await stripe.checkout.sessions.create(sessionConfig)
  }

  if (!session.url) {
    return { error: 'No se pudo iniciar el pago. Intenta de nuevo.' }
  }

  redirect(session.url)
}
