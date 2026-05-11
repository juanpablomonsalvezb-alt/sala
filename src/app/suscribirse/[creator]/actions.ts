'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { MP_API } from '@/lib/mercadopago'

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

  // Service client para leer mp_access_token (campo sensible, no expuesto a anon)
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creatorRaw, error: creatorError } = await (service as any)
    .from('sala_creators')
    .select('id, name, publication_name, price_clp, mp_access_token')
    .eq('slug', creatorSlug)
    .single()

  if (creatorError || !creatorRaw) {
    return { ok: false, error: 'Creador no encontrado.' }
  }

  const creator = creatorRaw as {
    id: string
    name: string
    publication_name: string | null
    price_clp: number
    mp_access_token: string | null
  }

  // Modelo: 100% del pago del lector va al creador.
  // Sin cuenta MP conectada, el creador no puede recibir pagos.
  if (!creator.mp_access_token) {
    return {
      ok: false,
      error: 'Este creador aún no ha conectado su cuenta para recibir pagos. Vuelve pronto.',
    }
  }

  // Bloquear duplicados — anon client puede leer subs propias por RLS
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  const body = {
    reason: `Nebbuler — ${creator.publication_name ?? creator.name}`,
    auto_recurring: {
      frequency:          1,
      frequency_type:     'months',
      transaction_amount: creator.price_clp,
      currency_id:        'CLP',
    },
    payer_email:        user.email,
    back_url:           `${baseUrl}/suscribirse/${creatorSlug}/exito`,
    status:             'pending',
    external_reference: `${user.id}:${creator.id}:${creator.price_clp}`,
    notification_url:   `${baseUrl}/api/mp/webhook`,
  }

  // CRÍTICO: usamos el access_token del CREADOR (MP Connect),
  // así el 100% del cobro entra directamente a su cuenta MP.
  const response = await fetch(`${MP_API}/preapproval`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${creator.mp_access_token}`,
      'Content-Type': 'application/json',
    },
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
