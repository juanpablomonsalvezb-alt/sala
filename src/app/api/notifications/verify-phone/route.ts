import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import {
  isWhatsAppConfigured,
  normalizeE164,
  sendWhatsAppMessage,
  buildVerificationTemplateParams,
} from '@/lib/whatsapp'
import { randomInt } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CODE_TTL_MS = 10 * 60 * 1000 // 10 min
const RESEND_COOLDOWN_MS = 60 * 1000 // 1 min entre reenvíos

// ─── POST /api/notifications/verify-phone ────────────────────────────────────
// Body: { phone: string }  (E.164 o normalizable)
// Genera un código de 6 dígitos y lo envía vía WhatsApp.

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { phone?: string }
  try {
    body = (await request.json()) as { phone?: string }
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const phone = normalizeE164(body.phone ?? '')
  if (!phone) {
    return NextResponse.json(
      { error: 'invalid_phone', message: 'Usa formato internacional, ej. +56912345678' },
      { status: 400 }
    )
  }

  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any

  // Cooldown anti-abuso
  const { data: existing } = await db
    .from('sala_profiles')
    .select('phone_verification_sent_at')
    .eq('id', user.id)
    .maybeSingle()

  if (existing?.phone_verification_sent_at) {
    const elapsed = Date.now() - new Date(existing.phone_verification_sent_at).getTime()
    if (elapsed < RESEND_COOLDOWN_MS) {
      return NextResponse.json(
        { error: 'cooldown', retry_in: Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000) },
        { status: 429 }
      )
    }
  }

  // Código 6 dígitos criptográficamente seguro
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')

  const { error: updateErr } = await db
    .from('sala_profiles')
    .update({
      phone_number: phone,
      phone_verified: false,
      phone_verification_code: code,
      phone_verification_sent_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateErr) {
    console.error('[verify-phone] db update error:', updateErr.message)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  // Si WhatsApp no está configurado, devolvemos OK pero anotamos modo dev.
  // El usuario verá el código devuelto SOLO si NODE_ENV !== 'production'.
  if (!isWhatsAppConfigured()) {
    const devEcho = process.env.NODE_ENV !== 'production' ? code : undefined
    console.warn('[verify-phone] WhatsApp no configurado — código guardado, no enviado')
    return NextResponse.json({
      ok: true,
      delivered: false,
      reason: 'whatsapp_not_configured',
      dev_code: devEcho,
    })
  }

  const result = await sendWhatsAppMessage({
    to: phone,
    templateName: 'verificacion_codigo',
    params: buildVerificationTemplateParams(code),
    language: 'es',
  })

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? 'send_failed' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true, delivered: true })
}

// ─── GET /api/notifications/verify-phone?code=XXXXXX ─────────────────────────
// Valida el código y marca el teléfono como verificado.

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const code = (request.nextUrl.searchParams.get('code') ?? '').trim()
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'invalid_code_format' }, { status: 400 })
  }

  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any

  const { data: profile } = await db
    .from('sala_profiles')
    .select('phone_verification_code, phone_verification_sent_at, phone_number')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.phone_verification_code) {
    return NextResponse.json({ error: 'no_pending_verification' }, { status: 404 })
  }

  const sentAt = profile.phone_verification_sent_at
    ? new Date(profile.phone_verification_sent_at).getTime()
    : 0
  if (Date.now() - sentAt > CODE_TTL_MS) {
    return NextResponse.json({ error: 'code_expired' }, { status: 410 })
  }

  if (profile.phone_verification_code !== code) {
    return NextResponse.json({ error: 'code_mismatch' }, { status: 400 })
  }

  const { error: updateErr } = await db
    .from('sala_profiles')
    .update({
      phone_verified: true,
      phone_verified_at: new Date().toISOString(),
      phone_verification_code: null,
      whatsapp_consent_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, phone: profile.phone_number })
}
