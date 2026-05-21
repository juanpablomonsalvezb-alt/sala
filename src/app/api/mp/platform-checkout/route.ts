import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MP_API, getHeaders, isMPConfigured } from '@/lib/mercadopago'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { PLATFORM_PRICE_CLP as PLATFORM_FEE_CLP } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Rate limit: 5 intentos de checkout por user / 5 min
  const rl = await rateLimit({
    bucket: 'mp_platform_checkout',
    key: `user:${user.id}`,
    limit: 5,
    windowSec: 300,
  })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Intentá de nuevo en unos minutos.', retryAfter: rl.resetIn },
      { status: 429, headers: { 'Retry-After': String(rl.resetIn) } },
    )
  }

  const { data: creator } = await db
    .from('sala_creators')
    .select('id, plan, name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!creator) {
    return NextResponse.json({ error: 'No tienes un perfil de creador' }, { status: 404 })
  }

  if (creator.plan !== 'free') {
    return NextResponse.json({ error: 'Ya tienes un plan activo' }, { status: 409 })
  }

  if (!isMPConfigured()) {
    return NextResponse.json({ error: 'Pagos no configurados' }, { status: 503 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  const body = {
    reason: 'Nebbuler — Tarifa de plataforma mensual',
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: PLATFORM_FEE_CLP,
      currency_id: 'CLP',
    },
    payer_email: user.email,
    back_url: `${baseUrl}/dashboard?activado=1`,
    status: 'pending',
    // prefijo "platform:" para distinguirlo en el webhook
    external_reference: `platform:${creator.id}:${user.id}`,
    notification_url: `${baseUrl}/api/mp/webhook`,
  }

  const response = await fetch(`${MP_API}/preapproval`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    console.error('[mp/platform-checkout] error:', response.status, err)
    return NextResponse.json({ error: 'Error iniciando el pago. Intenta de nuevo.' }, { status: 502 })
  }

  const data = await response.json()

  if (!data.init_point) {
    return NextResponse.json({ error: 'No se pudo obtener el link de pago.' }, { status: 500 })
  }

  return NextResponse.json({ url: data.init_point })
}
