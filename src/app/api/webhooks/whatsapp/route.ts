/**
 * WhatsApp Cloud API webhook
 *
 * GET  → verificación inicial (hub.mode=subscribe + hub.verify_token)
 * POST → eventos entrantes (delivery, read, opt-outs, mensajes inbound)
 *
 * Política de opt-out: si un usuario nos envía "STOP" o "BAJA" (case-insensitive),
 * marcamos sus suscripciones activas con channel_preference='email' (no las
 * cancelamos — el usuario aún quiere los posts, pero por email).
 *
 * Seguridad:
 *   - GET valida hub.verify_token contra WHATSAPP_WEBHOOK_VERIFY_TOKEN.
 *   - POST: la validación de firma X-Hub-Signature-256 es opcional (Meta lo
 *     ofrece pero no lo requiere). Si WHATSAPP_APP_SECRET está configurado
 *     validamos HMAC; si no, aceptamos pero loguemos warning.
 *   - No requiere auth de usuario — es webhook público.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { normalizeE164 } from '@/lib/whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── GET: verificación de webhook ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

  if (!expected) {
    console.warn('[whatsapp:webhook] WHATSAPP_WEBHOOK_VERIFY_TOKEN missing')
    return new NextResponse('not_configured', { status: 500 })
  }

  if (mode === 'subscribe' && token === expected && challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  return new NextResponse('forbidden', { status: 403 })
}

// ─── POST: eventos del Cloud API ─────────────────────────────────────────────

interface WhatsAppValueChange {
  field?: string
  value?: {
    messaging_product?: string
    metadata?: { display_phone_number?: string; phone_number_id?: string }
    contacts?: { wa_id?: string; profile?: { name?: string } }[]
    messages?: {
      from?: string
      id?: string
      timestamp?: string
      type?: string
      text?: { body?: string }
    }[]
    statuses?: {
      id?: string
      status?: string
      timestamp?: string
      recipient_id?: string
      errors?: { code?: number; title?: string }[]
    }[]
  }
}

interface WhatsAppWebhookPayload {
  object?: string
  entry?: {
    id?: string
    changes?: WhatsAppValueChange[]
  }[]
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret) return true // no secret configured → skip
  if (!signatureHeader) return false
  const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
  } catch {
    return false
  }
}

function isOptOut(text: string | undefined): boolean {
  if (!text) return false
  const t = text.trim().toLowerCase()
  return t === 'stop' || t === 'baja' || t === 'cancelar' || t === 'unsubscribe'
}

export async function POST(request: NextRequest) {
  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const sigHeader = request.headers.get('x-hub-signature-256')
  if (!verifySignature(rawBody, sigHeader)) {
    console.warn('[whatsapp:webhook] signature mismatch')
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let payload: WhatsAppWebhookPayload
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // Meta espera 200 rápido siempre — procesamos best-effort
  let admin
  try {
    admin = createServiceClient()
  } catch (err) {
    console.error('[whatsapp:webhook] service client init failed:', (err as Error).message)
    return NextResponse.json({ ok: true })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value
      if (!value) continue

      // ─── 1. Mensajes inbound (opt-out detection) ────────────────────
      for (const msg of value.messages ?? []) {
        if (msg.type !== 'text') continue
        const from = msg.from ? normalizeE164(`+${msg.from}`) : null
        const text = msg.text?.body

        if (!from) continue
        if (!isOptOut(text)) continue

        try {
          // Buscar profile por phone verificado
          const { data: profiles } = await db
            .from('sala_profiles')
            .select('id')
            .eq('phone_number', from)
            .eq('phone_verified', true)

          const ids = ((profiles as { id: string }[] | null) ?? []).map((p) => p.id)
          if (ids.length === 0) {
            console.warn('[whatsapp:webhook] opt-out from unknown phone')
            continue
          }

          // Degradar a solo email en TODAS sus suscripciones activas
          const { error: updErr } = await db
            .from('sala_subscriptions')
            .update({ channel_preference: 'email' })
            .in('subscriber_id', ids)
            .in('channel_preference', ['whatsapp', 'both'])

          if (updErr) {
            console.error('[whatsapp:webhook] opt-out update error:', updErr.message)
          } else {
            console.log('[whatsapp:webhook] opt-out applied to %d profile(s)', ids.length)
          }

          // Log
          for (const sid of ids) {
            await db.from('sala_notification_log').insert({
              subscriber_id: sid,
              channel: 'whatsapp',
              status: 'opted_out',
              provider_id: msg.id ?? null,
            })
          }
        } catch (err) {
          console.error('[whatsapp:webhook] opt-out exception:', (err as Error).message)
        }
      }

      // ─── 2. Status updates (delivered, read, failed) ────────────────
      for (const st of value.statuses ?? []) {
        if (!st.id || !st.status) continue
        const mappedStatus =
          st.status === 'sent'
            ? 'sent'
            : st.status === 'delivered'
            ? 'delivered'
            : st.status === 'read'
            ? 'read'
            : st.status === 'failed'
            ? 'failed'
            : null
        if (!mappedStatus) continue

        try {
          await db
            .from('sala_notification_log')
            .update({
              status: mappedStatus,
              error: st.errors?.[0]?.title ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq('provider_id', st.id)
        } catch (err) {
          console.warn(
            '[whatsapp:webhook] status update failed:',
            (err as Error).message
          )
        }
      }
    }
  }

  return NextResponse.json({ ok: true })
}
