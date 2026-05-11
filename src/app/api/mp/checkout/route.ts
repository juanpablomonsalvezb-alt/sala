import { NextRequest, NextResponse } from 'next/server'
import { MP_API, getHeaders, isMPConfigured } from '@/lib/mercadopago'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  if (!isMPConfigured()) {
    return NextResponse.json({ error: 'MercadoPago no está configurado.' }, { status: 503 })
  }

  try {
    const { creator_slug } = await request.json()

    if (!creator_slug) {
      return NextResponse.json({ error: 'Falta el slug del creador.' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verificar usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para suscribirte.' }, { status: 401 })
    }

    // Obtener creador
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creator, error: creatorError } = await (supabase as any)
      .from('sala_creators')
      .select('id, name, slug, price_clp, bio')
      .eq('slug', creator_slug)
      .single() as { data: import('@/types/database').Creator | null; error: unknown }

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Creador no encontrado.' }, { status: 404 })
    }

    // Verificar si ya está suscrito
    const { data: existing } = await supabase
      .from('sala_subscriptions')
      .select('id')
      .eq('subscriber_id', user.id)
      .eq('creator_id', creator.id)
      .eq('status', 'active')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Ya estás suscrito a este creador.' }, { status: 409 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

    const body = {
      items: [
        {
          title: `Nebbuler — ${creator.name}`,
          description: creator.bio?.slice(0, 255) ?? `Suscripción a ${creator.name}`,
          quantity: 1,
          unit_price: creator.price_clp,
          currency_id: 'CLP',
        },
      ],
      payer: { email: user.email },
      back_urls: {
        success: `${baseUrl}/suscribirse/${creator_slug}/exito`,
        failure: `${baseUrl}/${creator_slug}?payment=failure`,
        pending: `${baseUrl}/${creator_slug}?payment=pending`,
      },
      auto_return: 'approved',
      external_reference: `${user.id}:${creator.id}:${creator.price_clp}`,
      notification_url: `${baseUrl}/api/mp/webhook`,
    }

    const response = await fetch(`${MP_API}/checkout/preferences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.error('[MP checkout] error:', response.status, errData)
      return NextResponse.json({ error: 'Error creando preferencia de pago.' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ init_point: data.init_point })
  } catch (err) {
    console.error('[MP checkout] unexpected error:', err)
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 })
  }
}
