// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/dashboard/churn/mark-reviewed
//
// Marca manualmente un churn signal como 'snoozed' — útil cuando el creator
// ya hizo outreach personal al subscriber por fuera del sistema y no quiere
// que se le envíe el save offer automático.
//
// Body: { "signal_id": "uuid" }
//
// Auth: requiere usuario autenticado, y el signal debe pertenecer a uno de
// sus creators (verificación via JOIN implícito).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const signalId =
    body && typeof body === 'object' && typeof (body as Record<string, unknown>).signal_id === 'string'
      ? ((body as Record<string, unknown>).signal_id as string)
      : null

  if (!signalId || !UUID_RE.test(signalId)) {
    return NextResponse.json({ error: 'invalid_signal_id' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Verificar ownership: el signal pertenece a un creator del user
  const { data: signal, error: sigErr } = await db
    .from('sala_churn_signals')
    .select('id, creator_id, outcome')
    .eq('id', signalId)
    .maybeSingle()

  if (sigErr || !signal) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const { data: creator } = await db
    .from('sala_creators')
    .select('id')
    .eq('id', signal.creator_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!creator) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  if (signal.outcome !== 'pending') {
    return NextResponse.json({ ok: true, already: signal.outcome })
  }

  const { error: updErr } = await db
    .from('sala_churn_signals')
    .update({ outcome: 'snoozed', outcome_at: new Date().toISOString() })
    .eq('id', signalId)

  if (updErr) {
    return NextResponse.json({ error: 'update_failed', detail: updErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
