// POST /api/subscriptions/cancel
// Permite al SUSCRIPTOR cancelar una de sus suscripciones activas desde
// /mis-suscripciones. Cancela el preapproval en MercadoPago (deja de cobrar) y
// marca la fila en sala_subscriptions como cancelled.
//
// Cumple requisito SERNAC (Chile) / GDPR: el usuario debe poder cancelar sin
// fricción desde la propia plataforma.
//
// Auth: cookie de sesión Supabase. Verificamos que el subscriber_id de la
// suscripción coincide con auth.uid() — un usuario no puede cancelar
// suscripciones de otro.

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { MP_API } from '@/lib/mercadopago'

export const runtime = 'nodejs'
export const maxDuration = 15

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

const PLATFORM_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''

interface SubscriptionRow {
  id: string
  subscriber_id: string
  creator_id: string
  status: string
  stripe_subscription_id: string | null
}

interface SecretsRow {
  mp_access_token: string | null
}

export async function POST(request: NextRequest) {
  // 1. Verificar sesión
  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
  }

  // 2. Parsear body
  let subscriptionId: string
  try {
    const body = (await request.json()) as { subscription_id?: unknown }
    if (typeof body.subscription_id !== 'string' || body.subscription_id.length < 10) {
      return NextResponse.json({ error: 'subscription_id requerido.' }, { status: 400 })
    }
    subscriptionId = body.subscription_id
  } catch {
    return NextResponse.json({ error: 'Body JSON inválido.' }, { status: 400 })
  }

  // 3. Buscar la suscripción con service role (bypasea RLS) y validar dueño
  const admin = adminSupabase()
  const { data: sub, error: subErr } = await admin
    .from('sala_subscriptions')
    .select('id, subscriber_id, creator_id, status, stripe_subscription_id')
    .eq('id', subscriptionId)
    .maybeSingle()

  if (subErr) {
    console.error('[cancel] subscription lookup:', subErr.code, subErr.message)
    return NextResponse.json({ error: 'Error consultando suscripción.' }, { status: 500 })
  }
  const row = sub as SubscriptionRow | null
  if (!row) {
    return NextResponse.json({ error: 'Suscripción no encontrada.' }, { status: 404 })
  }
  if (row.subscriber_id !== user.id) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }
  if (!['active', 'past_due'].includes(row.status)) {
    return NextResponse.json({ error: 'La suscripción no está activa.' }, { status: 409 })
  }

  // 4. Cancelar el preapproval en MercadoPago si tenemos el ID
  let mpCancelled = false
  let mpError: string | null = null
  const preapprovalId = row.stripe_subscription_id?.startsWith('mp_sub:')
    ? row.stripe_subscription_id.slice('mp_sub:'.length)
    : null

  if (preapprovalId) {
    // Obtener token del creador (Connect). Si no existe, usar token de plataforma.
    const { data: secrets } = await admin
      .from('sala_creator_secrets')
      .select('mp_access_token')
      .eq('creator_id', row.creator_id)
      .maybeSingle()
    const token = (secrets as SecretsRow | null)?.mp_access_token ?? PLATFORM_TOKEN

    try {
      const res = await fetch(`${MP_API}/preapproval/${preapprovalId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (res.ok) {
        mpCancelled = true
      } else {
        mpError = `MP API status ${res.status}`
        console.error(`[cancel] MP preapproval ${preapprovalId} returned ${res.status}`)
      }
    } catch (err) {
      mpError = err instanceof Error ? err.message : 'unknown'
      console.error('[cancel] MP API exception:', err)
    }
  }

  // 5. Marcar como cancelled en DB (independiente del resultado en MP).
  // Si MP falló, el cron de reconciliación lo arreglará — pero el usuario ya
  // no debería ver acceso al contenido pagado.
  const { error: updErr } = await admin
    .from('sala_subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', row.id)
    .eq('subscriber_id', user.id) // doble defensa

  if (updErr) {
    console.error('[cancel] DB update:', updErr.code, updErr.message)
    return NextResponse.json({ error: 'Error guardando cancelación.' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    mp_cancelled: mpCancelled,
    mp_error: mpError,
  })
}
