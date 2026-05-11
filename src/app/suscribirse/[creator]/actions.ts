'use server'

import { createClient } from '@/lib/supabase/server'
import { MP_API, getHeaders, isMPConfigured } from '@/lib/mercadopago'

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

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; needsAuth: true; loginUrl: string }
  | { ok: false; alreadySubscribed: true; profileUrl: string }
  | { ok: false; error: string }

export async function createCheckoutSession(creatorSlug: string): Promise<CheckoutResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Los pagos aún no están activos en esta demo.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      needsAuth: true,
      loginUrl: `/entrar?next=${encodeURIComponent(`/suscribirse/${creatorSlug}`)}`,
    }
  }

  const { data: creator, error: creatorError } = await supabase
    .from('sala_creators')
    .select('*')
    .eq('slug', creatorSlug)
    .single()

  if (creatorError || !creator) {
    return { ok: false, error: 'Creador no encontrado.' }
  }

  const { data: existingSub } = await supabase
    .from('sala_subscriptions')
    .select('id')
    .eq('subscriber_id', user.id)
    .eq('creator_id', creator.id)
    .eq('status', 'active')
    .maybeSingle()

  if (existingSub) {
    return { ok: false, alreadySubscribed: true, profileUrl: `/${creatorSlug}` }
  }

  if (!isMPConfigured()) {
    return { ok: false, error: 'Los pagos aún no están activos. Vuelve pronto.' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  const body = {
    reason: `Nebbuler — ${creator.publication_name ?? creator.name}`,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: creator.price_clp,
      currency_id: 'CLP',
    },
    payer_email: user.email,
    back_url: `${baseUrl}/suscribirse/${creatorSlug}/exito`,
    status: 'pending',
    external_reference: `${user.id}:${creator.id}:${creator.price_clp}`,
    notification_url: `${baseUrl}/api/mp/webhook`,
  }

  const response = await fetch(`${MP_API}/preapproval`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    console.error('[MP checkout] error:', response.status, errData)
    return { ok: false, error: 'Error iniciando el pago. Intenta de nuevo.' }
  }

  const data = await response.json()
  if (!data.init_point) {
    return { ok: false, error: 'No se pudo obtener el link de pago.' }
  }

  return { ok: true, url: data.init_point }
}
