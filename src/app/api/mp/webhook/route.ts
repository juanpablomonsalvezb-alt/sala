import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { MP_API } from '@/lib/mercadopago'
import crypto from 'crypto'
import {
  PLATFORM_FEE_CLP,
  buildEventId,
  validatePlatformAmount,
  parseRef,
  parsePlatformRef,
} from '@/lib/payments/mp-helpers'

export const runtime = 'nodejs'
export const maxDuration = 30

function getSupabase() {
  // Las legacy API keys (SUPABASE_SERVICE_ROLE_KEY, JWT) fueron deshabilitadas
  // por Supabase el 2026-04-19. La nueva es SUPABASE_SECRET_KEY (sb_secret_*).
  // Mantenemos fallback al legacy por si algún entorno aún no migró.
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('[MP webhook] SUPABASE_SECRET_KEY no configurada — abortando')
    throw new Error('SUPABASE_SECRET_KEY missing')
  }
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
}

const PLATFORM_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''

function mpHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

// Resuelve qué token usar para consultar MP API:
// - Si MP envía ?user_id=<seller> (preapproval de lector→creador via Connect), usar token del creador
// - Si no hay seller (tarifa Nebbuler), usar token de plataforma
async function resolveMPToken(request: NextRequest): Promise<string> {
  const sellerId = new URL(request.url).searchParams.get('user_id')
  if (!sellerId) return PLATFORM_TOKEN

  try {
    const supabase = getSupabase()
    // C10: tokens viven en sala_creator_secrets (no en sala_creators).
    // Lookup directo por mp_user_id (indexado).
    const { data } = await supabase
      .from('sala_creator_secrets')
      .select('mp_access_token')
      .eq('mp_user_id', sellerId)
      .maybeSingle()
    const token = (data as { mp_access_token: string | null } | null)?.mp_access_token
    if (token) return token
  } catch (err) {
    console.error('[MP webhook] resolveMPToken lookup error:', err)
  }
  return PLATFORM_TOKEN
}

// Consulta a MP API con fallback de token. MP Connect a veces permite a la plataforma
// consultar transacciones de sus sellers — usamos esto como red de seguridad.
async function fetchMPWithFallback(url: string, primaryToken: string): Promise<Response> {
  const primary = await fetch(url, { headers: mpHeaders(primaryToken) })
  if (primary.ok) return primary
  if (primaryToken === PLATFORM_TOKEN) return primary
  return fetch(url, { headers: mpHeaders(PLATFORM_TOKEN) })
}

function verifyMPSignature(request: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) {
    console.error('[MP webhook] MERCADOPAGO_WEBHOOK_SECRET no configurada — rechazando')
    return false
  }

  const signature = request.headers.get('x-signature') ?? ''
  const requestId = request.headers.get('x-request-id') ?? ''
  const dataId = new URL(request.url).searchParams.get('data.id') ?? ''

  const tsMatch = signature.match(/ts=(\d+)/)
  const v1Match = signature.match(/v1=([a-f0-9]+)/)
  if (!tsMatch || !v1Match) return false

  const ts = tsMatch[1]
  const receivedHash = v1Match[1]

  // FIX C7: timingSafeEqual lanza RangeError si los buffers son de distinta
  // longitud. Una firma malformada (hash != 64 hex chars) provocaba 500 en
  // lugar de 400. Validamos longitud primero.
  if (receivedHash.length !== 64) return false

  // Anti-replay: ventana ±5 min
  const nowSec = Math.floor(Date.now() / 1000)
  const tsSec = parseInt(ts, 10)
  if (isNaN(tsSec) || Math.abs(nowSec - tsSec) > 300) {
    console.error('[MP webhook] timestamp fuera de ventana — posible replay')
    return false
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const computedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(receivedHash))
}

// parseRef / parsePlatformRef: importados desde @/lib/payments/mp-helpers

// Reserva un event_id atómicamente para evitar reentrada concurrente.
// El COMMIT real (status='done') se hace solo si el procesamiento llega al final
// sin lanzar. Si lanza, el registro queda como 'processing' y el siguiente
// reintento de MP lo puede recuperar tras el TTL.
async function reserveEvent(eventId: string): Promise<'fresh' | 'duplicate' | 'retry'> {
  const supabase = getSupabase()
  const TTL_MS = 5 * 60 * 1000 // 5 min — MP reintenta varias veces en este rango

  // Intento 1: insertar como 'processing'
  const { error: insertErr } = await supabase
    .from('sala_webhook_events')
    .insert({
      provider:    'mercadopago',
      event_id:    eventId,
      status:      'processing',
      attempted_at: new Date().toISOString(),
    })

  if (!insertErr) return 'fresh'
  if (insertErr.code !== '23505') {
    throw new Error(`reserveEvent insert: ${insertErr.message}`)
  }

  // Ya existe: chequear si está terminado o si es retry tras crash
  const { data: existing } = await supabase
    .from('sala_webhook_events')
    .select('status, attempted_at')
    .eq('provider', 'mercadopago')
    .eq('event_id', eventId)
    .maybeSingle()

  const row = existing as { status?: string; attempted_at?: string } | null
  if (row?.status === 'done') return 'duplicate'

  // Sigue 'processing' — si han pasado más del TTL, asumimos que el intento
  // anterior crasheó y dejamos que este reintento lo procese.
  const attemptedAt = row?.attempted_at ? new Date(row.attempted_at).getTime() : 0
  if (Date.now() - attemptedAt > TTL_MS) {
    await supabase
      .from('sala_webhook_events')
      .update({ attempted_at: new Date().toISOString() })
      .eq('provider', 'mercadopago')
      .eq('event_id', eventId)
    return 'retry'
  }

  // Otro intento concurrente está procesando ahora — devolver duplicate para
  // que MP reintente más tarde si era distinto.
  return 'duplicate'
}

async function commitEvent(eventId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('sala_webhook_events')
    .update({ status: 'done', processed_at: new Date().toISOString() })
    .eq('provider', 'mercadopago')
    .eq('event_id', eventId)
}

async function validateAmount(creatorId: string, amountPaid: number, tolerance = 0.01): Promise<boolean> {
  const supabase = getSupabase()
  const { data: creator } = await supabase
    .from('sala_creators')
    .select('price_clp')
    .eq('id', creatorId)
    .single()
  if (!creator) return false
  const expected = (creator as { price_clp: number }).price_clp
  return Math.abs(amountPaid - expected) <= expected * tolerance
}

// PLATFORM_FEE_CLP / validatePlatformAmount: importados desde @/lib/payments/mp-helpers

async function activateCreatorPlan(creatorId: string, userId: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('sala_creators')
    .update({ plan: 'creator' })
    .eq('id', creatorId)
    .eq('user_id', userId)
  if (error) throw new Error(`activateCreatorPlan: ${error.message}`)
}

// Activa o renueva la suscripción + retorna si era nueva (para enviar welcome
// email solo en la primera activación, fix I2).
//
// FIX I1: ya NO pisamos created_at en renovaciones. Mantenemos last_paid_at
// separado. created_at = primera suscripción; last_paid_at = último cobro.
// El bloqueo a los 35 días debe leer last_paid_at, no created_at.
async function activateSubscription(
  subscriberId: string,
  creatorId: string,
  priceCLP: number,
  mpRef: string
): Promise<{ isNewSubscription: boolean }> {
  const supabase = getSupabase()
  const now = new Date().toISOString()

  // Detectar si ya existía una activa (para no re-enviar welcome email)
  const { data: existing } = await supabase
    .from('sala_subscriptions')
    .select('id, status')
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .maybeSingle()

  const row = existing as { id?: string; status?: string } | null
  const wasActiveBefore = row?.status === 'active'

  const { error } = await supabase.from('sala_subscriptions').upsert(
    {
      subscriber_id:          subscriberId,
      creator_id:             creatorId,
      status:                 'active' as const,
      stripe_subscription_id: mpRef,
      price_clp:              priceCLP,
      cancelled_at:           null,
      last_paid_at:           now,
      // NO pisamos created_at — Postgres lo respeta en UPDATE (solo se setea al INSERT)
    },
    { onConflict: 'subscriber_id,creator_id', ignoreDuplicates: false }
  )
  if (error) throw new Error(`activateSubscription: ${error.message}`)

  return { isNewSubscription: !wasActiveBefore }
}

async function cancelSubscription(subscriberId: string, creatorId: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('sala_subscriptions')
    .update({ status: 'cancelled' as const, cancelled_at: new Date().toISOString() })
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .in('status', ['active', 'past_due'])
  if (error) throw new Error(`cancelSubscription: ${error.message}`)
}

// Refund automático cuando el monto cobrado no coincide con el esperado.
// Caso: lector pagó pero Nebbuler no le da acceso por precio incorrecto →
// devolver el dinero para no quedar con un cobro huérfano.
async function refundPayment(paymentId: string, token: string, reason: string): Promise<boolean> {
  try {
    const res = await fetch(`${MP_API}/v1/payments/${paymentId}/refunds`, {
      method: 'POST',
      headers: {
        ...mpHeaders(token),
        'X-Idempotency-Key': `refund:${paymentId}`,
      },
      body: JSON.stringify({}),
    })
    if (!res.ok) {
      console.error(`[MP webhook] refund failed for ${paymentId} (${reason}): ${res.status}`)
      return false
    }
    console.error(`[MP webhook] refund issued for ${paymentId} reason=${reason}`)
    return true
  } catch (err) {
    console.error(`[MP webhook] refund exception for ${paymentId}:`, err)
    return false
  }
}

// Procesa un preapproval ya consultado (status + external_reference) sin importar
// con qué token se obtuvo.
async function processPreapproval(preapproval: {
  status: string
  external_reference?: string
  auto_recurring?: { transaction_amount?: number }
}, preapprovalId: string): Promise<NextResponse> {
  const extRef: string = preapproval.external_reference ?? ''
  const transactionAmount = Number(preapproval.auto_recurring?.transaction_amount ?? 0)

  // Tarifa de plataforma — creador → Nebbuler
  const platformParsed = parsePlatformRef(extRef)
  if (platformParsed) {
    if (preapproval.status === 'authorized') {
      if (!validatePlatformAmount(transactionAmount)) {
        console.error(`[MP webhook] platform amount mismatch: ${transactionAmount}`)
        return NextResponse.json({ error: 'Platform amount mismatch' }, { status: 400 })
      }
      await activateCreatorPlan(platformParsed.creatorId, platformParsed.userId)
    }
    return NextResponse.json({ received: true })
  }

  // Suscripción lector → creador (Connect, 100% al creador)
  const parsed = parseRef(extRef)
  if (!parsed) return NextResponse.json({ received: true })

  if (preapproval.status === 'authorized') {
    const amountOK = await validateAmount(parsed.creatorId, transactionAmount)
    if (!amountOK) {
      console.error(`[MP webhook] sub amount mismatch: ${transactionAmount} creator=${parsed.creatorId}`)
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }
    const { isNewSubscription } = await activateSubscription(
      parsed.subscriberId,
      parsed.creatorId,
      transactionAmount,
      `mp_sub:${preapprovalId}`
    )
    // FIX I2: welcome email SOLO en la primera activación. En renovaciones
    // (isNewSubscription=false) o reactivaciones tras cancelación no se
    // re-envía. Antes este código se ejecutaba en cada webhook authorized.
    if (isNewSubscription) {
      try {
        const supabase = getSupabase()
        const [{ data: subscriber }, { data: creator }] = await Promise.all([
          supabase.from('sala_profiles').select('email, full_name').eq('id', parsed.subscriberId).maybeSingle(),
          supabase.from('sala_creators').select('username, display_name, name, slug').eq('id', parsed.creatorId).maybeSingle(),
        ])
        const subscriberEmail = (subscriber as { email: string | null; full_name: string | null } | null)?.email
        const creatorRow = creator as { username: string | null; display_name: string | null; name: string | null; slug: string | null } | null
        // Fallback display_name → name → 'el creador'  (si columnas no existen aún en BD)
        const creatorName = creatorRow?.display_name ?? creatorRow?.name ?? 'el creador'
        const creatorUsername = creatorRow?.username ?? creatorRow?.slug ?? ''
        if (subscriberEmail && process.env.RESEND_API_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Nebbuler <hola@nebbuler.com>',
              to: subscriberEmail,
              subject: `Ya eres parte de ${creatorName} en Nebbuler`,
              html: `<p>¡Bienvenido/a!</p><p>Tu suscripción a <strong>${creatorName}</strong> está activa. Puedes acceder al contenido en <a href="https://nebbuler.com/${creatorUsername}">nebbuler.com/${creatorUsername}</a>.</p><p>Si deseas cancelar tu suscripción, hazlo desde tu perfil en <a href="https://nebbuler.com/dashboard">nebbuler.com/dashboard</a>.</p>`,
            }),
          })
        }
      } catch (emailErr) {
        console.error('[MP webhook] welcome email failed:', emailErr)
      }
    }
  } else if (preapproval.status === 'paused') {
    const supabase = getSupabase()
    await supabase
      .from('sala_subscriptions')
      .update({ status: 'past_due' as const })
      .eq('subscriber_id', parsed.subscriberId)
      .eq('creator_id', parsed.creatorId)
      .in('status', ['active'])
  } else if (['cancelled', 'finished'].includes(preapproval.status)) {
    await cancelSubscription(parsed.subscriberId, parsed.creatorId)
  }

  return NextResponse.json({ received: true })
}

// buildEventId: importado desde @/lib/payments/mp-helpers
// Construye un eventId único por webhook usando x-request-id (no solo data.id),
// para que webhooks distintos del MISMO recurso (created→approved) no se traten
// como duplicados.

export async function POST(request: NextRequest) {
  let eventId: string | null = null
  try {
    const rawBody = await request.text()

    if (!verifyMPSignature(request)) {
      console.error('[MP webhook] firma inválida — rechazando')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const body = JSON.parse(rawBody)
    const { type, data, id: bodyEventId } = body
    const requestId = request.headers.get('x-request-id') ?? ''
    eventId = buildEventId(type, data?.id, bodyEventId, requestId)

    const reservation = await reserveEvent(eventId)
    if (reservation === 'duplicate') {
      return NextResponse.json({ received: true, duplicate: true })
    }

    const mpToken = await resolveMPToken(request)

    // ── Pago único ───────────────────────────────────────────────────────────
    if (type === 'payment') {
      const paymentId = data?.id
      if (!paymentId) {
        await commitEvent(eventId)
        return NextResponse.json({ received: true })
      }

      const res = await fetchMPWithFallback(`${MP_API}/v1/payments/${paymentId}`, mpToken)
      if (!res.ok) {
        // NO commiteamos — el reintento de MP lo verá como 'processing' expirado y reprocesará
        console.error('[MP webhook] payment lookup failed:', res.status)
        return NextResponse.json({ error: 'MP API error' }, { status: 502 })
      }

      const payment = await res.json()
      const parsed = parseRef(payment.external_reference ?? '')
      if (!parsed) {
        await commitEvent(eventId)
        return NextResponse.json({ received: true })
      }

      if (payment.status === 'approved') {
        const amountPaid = Number(payment.transaction_amount ?? 0)
        // Validación SOLO contra el precio actual del creador. El precio del ref
        // viaja en la URL del checkout y es manipulable por el cliente —
        // mantenerlo como fuente de verdad permite ataques de price tampering.
        // Para preservar la mitigación de race condition (creador cambia precio
        // entre checkout y cobro), se acepta el monto si está cerca del precio
        // del ref Y del creador.
        const creatorPriceOK = await validateAmount(parsed.creatorId, amountPaid)
        const refPriceOK = Math.abs(amountPaid - parsed.priceCLP) <= parsed.priceCLP * 0.01
        if (!creatorPriceOK && !refPriceOK) {
          // El usuario pagó pero el monto no coincide → reembolsar y NO dar acceso.
          console.error(`[MP webhook] amount mismatch: paid=${amountPaid} ref=${parsed.priceCLP} creator=${parsed.creatorId}`)
          await refundPayment(String(paymentId), mpToken, 'amount_mismatch')
          await commitEvent(eventId)
          return NextResponse.json({ error: 'Amount mismatch — refund issued' }, { status: 400 })
        }
        await activateSubscription(
          parsed.subscriberId,
          parsed.creatorId,
          amountPaid,
          `mp_payment:${paymentId}`
        )
      } else if (['refunded', 'charged_back', 'cancelled'].includes(payment.status)) {
        await cancelSubscription(parsed.subscriberId, parsed.creatorId)
      }
    }

    // ── Suscripción recurrente ────────────────────────────────────────────────
    if (type === 'subscription_preapproval') {
      const preapprovalId = data?.id
      if (!preapprovalId) {
        await commitEvent(eventId)
        return NextResponse.json({ received: true })
      }

      const res = await fetchMPWithFallback(`${MP_API}/preapproval/${preapprovalId}`, mpToken)
      if (!res.ok) {
        // NO commiteamos — reintento de MP reprocesará
        console.error('[MP webhook] preapproval lookup failed:', res.status)
        return NextResponse.json({ error: 'MP API error' }, { status: 502 })
      }

      const preapproval = await res.json()
      const result = await processPreapproval(preapproval, preapprovalId)
      // Solo commitear si el resultado fue exitoso (2xx). Errores como amount
      // mismatch devuelven 400 y NO deben quedar marcados como procesados —
      // así MP reintenta y queda traza para investigación.
      if (result.status >= 200 && result.status < 300) {
        await commitEvent(eventId)
      }
      return result
    }

    await commitEvent(eventId)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[MP webhook] error:', err)
    // No commit → la reserva queda 'processing' y expira en 5 min para reintento
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
