// Endpoint de tracking para la secuencia de onboarding.
//
// Soporta dos modos:
//   - GET con ?sub_id=&stage=&action=click|response&to=&data= → redirige a `to`
//     (los botones de los emails llevan estos links para tracking + redirect).
//   - POST JSON { subscription_id, stage, action, data } → respuesta JSON
//     (para integraciones programáticas o cliente).
//
// Idempotente: solo actualiza si la fila aún no tiene timestamp para esa acción.
// Rate-limit in-memory por IP+sub_id+action para mitigar abuso.

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const VALID_STAGES = new Set([
  'welcome',
  'tips_day_3',
  'survey_day_7',
  'viral_day_14',
  'nps_day_30',
])
const VALID_ACTIONS = new Set(['open', 'click', 'response'])

const recent = new Map<string, number>()
function shouldThrottle(key: string): boolean {
  const now = Date.now()
  const last = recent.get(key) ?? 0
  if (now - last < 3_000) return true
  recent.set(key, now)
  if (recent.size > 5000) {
    const cutoff = now - 60_000
    for (const [k, t] of recent) if (t < cutoff) recent.delete(k)
  }
  return false
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function safeRedirect(to: string | null, fallback: string): string {
  if (!to) return fallback
  // Permitir absolutos a dominios nuestros, twitter, linkedin, whatsapp.
  // Si es relativo (empieza con '/') lo dejamos.
  if (to.startsWith('/')) return to
  try {
    const u = new URL(to)
    const allowed = new Set([
      'nebbuler.com',
      'www.nebbuler.com',
      'twitter.com',
      'x.com',
      'www.linkedin.com',
      'linkedin.com',
      'wa.me',
      'api.whatsapp.com',
    ])
    if (allowed.has(u.hostname)) return to
    return fallback
  } catch {
    return fallback
  }
}

async function recordAction(args: {
  subscriptionId: string
  stage: string
  action: 'open' | 'click' | 'response'
  data: string | null
}): Promise<{ ok: boolean; error?: string }> {
  if (!UUID_RE.test(args.subscriptionId)) return { ok: false, error: 'invalid_sub_id' }
  if (!VALID_STAGES.has(args.stage)) return { ok: false, error: 'invalid_stage' }

  let supabase
  try {
    supabase = createServiceClient()
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Buscar fila existente
  const { data: existing } = await db
    .from('sala_onboarding_log')
    .select('id, opened_at, clicked_at, responded_at, response_data')
    .eq('subscription_id', args.subscriptionId)
    .eq('stage', args.stage)
    .maybeSingle()

  if (!existing) {
    // El email pudo haber sido construido pero no logueado todavía — toleramos.
    return { ok: true }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {}
  const now = new Date().toISOString()

  if (args.action === 'open' && !existing.opened_at) {
    updates.opened_at = now
  } else if (args.action === 'click') {
    if (!existing.clicked_at) updates.clicked_at = now
    if (!existing.opened_at) updates.opened_at = now
  } else if (args.action === 'response') {
    if (!existing.responded_at) updates.responded_at = now
    if (!existing.clicked_at) updates.clicked_at = now
    if (!existing.opened_at) updates.opened_at = now
    if (args.data) {
      // Merge defensivo del response_data
      const prev = existing.response_data ?? {}
      const next = { ...prev, latest: args.data, at: now }
      updates.response_data = next
    }
  }

  if (Object.keys(updates).length === 0) {
    return { ok: true }
  }

  const { error } = await db
    .from('sala_onboarding_log')
    .update(updates)
    .eq('id', existing.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function GET(request: NextRequest) {
  const u = new URL(request.url)
  const subscriptionId = u.searchParams.get('sub_id') ?? ''
  const stage = u.searchParams.get('stage') ?? ''
  const action = (u.searchParams.get('action') ?? 'click') as 'open' | 'click' | 'response'
  const data = u.searchParams.get('data')
  const to = u.searchParams.get('to')

  if (!VALID_ACTIONS.has(action)) {
    return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const throttleKey = `${ip}:${subscriptionId}:${stage}:${action}`
  if (!shouldThrottle(throttleKey)) {
    // best-effort, ignoramos resultado
    recordAction({ subscriptionId, stage, action, data }).catch(() => undefined)
  }

  const fallback = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'
  const target = safeRedirect(to, fallback)
  return NextResponse.redirect(target.startsWith('/') ? `${fallback}${target}` : target, 302)
}

export async function POST(request: NextRequest) {
  let body: {
    subscription_id?: unknown
    stage?: unknown
    action?: unknown
    data?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const subscriptionId = typeof body.subscription_id === 'string' ? body.subscription_id : ''
  const stage = typeof body.stage === 'string' ? body.stage : ''
  const action = (typeof body.action === 'string' ? body.action : '') as 'open' | 'click' | 'response'
  const data = typeof body.data === 'string' ? body.data : null

  if (!VALID_ACTIONS.has(action)) {
    return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const throttleKey = `${ip}:${subscriptionId}:${stage}:${action}`
  if (shouldThrottle(throttleKey)) {
    return NextResponse.json({ ok: true, throttled: true })
  }

  const result = await recordAction({ subscriptionId, stage, action, data })
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
  }
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
