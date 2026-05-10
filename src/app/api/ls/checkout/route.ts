import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckout } from '@/lib/lemonsqueezy'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Buscar el creator profile del usuario
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creator } = await (supabase as any)
    .from('sala_creators')
    .select('id, plan')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!creator) {
    return NextResponse.json({ error: 'No tienes un perfil de creador' }, { status: 404 })
  }

  if (creator.plan !== 'free') {
    return NextResponse.json({ error: 'Ya tienes un plan activo' }, { status: 409 })
  }

  const variantId = process.env.LS_VARIANT_STARTER
  if (!variantId) {
    return NextResponse.json({ error: 'Configuración de pagos incompleta' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  try {
    const checkoutUrl = await createCheckout({
      variantId,
      email: user.email!,
      userId: user.id,
      creatorId: creator.id,
      redirectUrl: `${baseUrl}/dashboard?activado=1`,
    })

    return NextResponse.json({ url: checkoutUrl })
  } catch (err) {
    console.error('[ls/checkout]', err)
    return NextResponse.json({ error: 'No se pudo crear el checkout' }, { status: 500 })
  }
}
