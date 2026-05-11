import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'

interface CreateCheckoutBody {
  creatorSlug: string
}

export async function POST(request: NextRequest) {
  let body: CreateCheckoutBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { creatorSlug } = body
  if (!creatorSlug) {
    return NextResponse.json({ error: 'creatorSlug requerido' }, { status: 400 })
  }

  const supabase = await createClient()

  // userId SIEMPRE desde la sesión server-side — nunca aceptarlo del body
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  const userId = user.id

  const { data: creatorRaw, error: creatorError } = await supabase
    .from('sala_creators')
    .select('*')
    .eq('slug', creatorSlug)
    .single()

  const creator = creatorRaw as Creator | null

  if (creatorError || !creatorRaw || !creator) {
    return NextResponse.json({ error: 'Creador no encontrado' }, { status: 404 })
  }

  if (!creator.stripe_account_id) {
    return NextResponse.json(
      { error: 'El creador aún no tiene pagos configurados' },
      { status: 422 }
    )
  }

  const { data: existingSub } = await supabase
    .from('sala_subscriptions')
    .select('id, status')
    .eq('subscriber_id', userId)
    .eq('creator_id', creator.id)
    .eq('status', 'active')
    .maybeSingle()

  if (existingSub) {
    return NextResponse.json(
      { error: 'Ya tienes una suscripción activa con este creador' },
      { status: 409 }
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  const price = await stripe.prices.create(
    {
      currency: 'clp',
      unit_amount: creator.price_clp,
      recurring: { interval: 'month' },
      product_data: {
        name: `Nebbuler — ${creator.name}`,
        metadata: { creator_id: creator.id, creator_slug: creator.slug },
      },
    },
    { stripeAccount: creator.stripe_account_id }
  )

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${baseUrl}/${creator.slug}?suscrito=1`,
      cancel_url: `${baseUrl}/${creator.slug}`,
      metadata: {
        subscriber_id: userId,
        creator_id: creator.id,
        price_clp: String(creator.price_clp),
      },
      subscription_data: {
        metadata: {
          subscriber_id: userId,
          creator_id: creator.id,
        },
      },
    },
    { stripeAccount: creator.stripe_account_id }
  )

  if (!session.url) {
    return NextResponse.json(
      { error: 'No se pudo crear la sesión de pago' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: session.url })
}
