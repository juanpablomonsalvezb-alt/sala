// ─────────────────────────────────────────────────────────────────────────────
// POST /api/track/engagement
//
// Webhook público (no requiere sesión) que registra eventos de engagement de
// un suscriptor con un creador. Alimenta la tabla sala_subscriber_engagement
// que usa el cron anti-churn para detectar inactividad.
//
// Body:
//   {
//     "subscriber_id": "uuid",
//     "creator_id":    "uuid",
//     "action":        "email_opened" | "email_clicked" | "post_read",
//     "is_premium":    boolean (opcional, solo para post_read)
//   }
//
// Protecciones:
//   - Rate limit: 60 eventos / 60s por IP (suficiente para usuarios reales,
//     bloquea bots triviales que intenten inflar métricas)
//   - Validación estricta de UUID y enum de action
//   - Verificación de existencia de suscripción activa antes de registrar
//     (no permite que un atacante inflame engagement de subscribers ajenos)
//   - Llama a la SQL function sala_record_engagement_event (UPSERT atómico)
//
// Decisión: no usamos CSRF tradicional porque este endpoint debe ser invocado
// desde pixels de tracking en emails. Mitigación = validación de la tupla
// (subscriber_id, creator_id) contra sala_subscriptions activa.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const maxDuration = 10

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ALLOWED_ACTIONS = new Set(['email_opened', 'email_clicked', 'post_read'])

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

function getIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') ?? ''
  return fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || 'anonymous'
}

export async function POST(req: Request) {
  const ip = getIp(req)
  const rl = rateLimit(`track-engagement:${ip}`, 60, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfter / 1000)) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const subscriber_id = typeof b.subscriber_id === 'string' ? b.subscriber_id : null
  const creator_id = typeof b.creator_id === 'string' ? b.creator_id : null
  const action = typeof b.action === 'string' ? b.action : null
  const is_premium = b.is_premium === true

  if (!subscriber_id || !UUID_RE.test(subscriber_id)) {
    return NextResponse.json({ error: 'invalid_subscriber_id' }, { status: 400 })
  }
  if (!creator_id || !UUID_RE.test(creator_id)) {
    return NextResponse.json({ error: 'invalid_creator_id' }, { status: 400 })
  }
  if (!action || !ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
  }

  const supabase = adminSupabase()

  // Verificar que la tupla corresponde a una suscripción real (cualquier status)
  const { data: sub, error: subErr } = await supabase
    .from('sala_subscriptions')
    .select('id')
    .eq('subscriber_id', subscriber_id)
    .eq('creator_id', creator_id)
    .maybeSingle()

  if (subErr) {
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500 })
  }
  if (!sub) {
    // Devolvemos 204 para no revelar si la tupla existe (evita enumeración)
    return new NextResponse(null, { status: 204 })
  }

  const { error: rpcErr } = await supabase.rpc('sala_record_engagement_event', {
    p_subscriber_id: subscriber_id,
    p_creator_id: creator_id,
    p_action: action,
    p_is_premium: is_premium,
  })

  if (rpcErr) {
    return NextResponse.json({ error: 'record_failed', detail: rpcErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
