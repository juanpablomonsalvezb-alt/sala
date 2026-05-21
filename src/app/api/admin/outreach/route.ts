// ─────────────────────────────────────────────────────────────────────────────
// GET / PATCH / POST /api/admin/outreach
//
// CRUD del pipeline de outreach LinkedIn. Solo superadmin.
//
// GET   → lista targets paginados, con filtros por status/country/specialty
// PATCH → actualiza un target: status, ai_pitch_draft, notes
// POST  → action: 'generate_invite' — crea un sala_invite_code y lo linkea al
//                                     target. Devuelve { code } para copiar.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createUserSupabase, isSuperadmin } from '@/lib/supabase/server'
import { generateInviteCode } from '@/lib/invite-helpers'

export const runtime = 'nodejs'

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

async function reviewerId(): Promise<string | null> {
  try {
    const sb = await createUserSupabase()
    const {
      data: { user },
    } = await sb.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const country = url.searchParams.get('country')
  const specialty = url.searchParams.get('specialty')
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 200), 500)
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0)

  const admin = adminSupabase()
  let q = admin
    .from('sala_outreach_targets')
    .select(
      'id, platform, profile_url, full_name, headline, country, specialty, followers_count, signal_post_url, signal_post_excerpt, signal_engagement, signal_reason, ai_score, ai_pitch_draft, status, invite_code_id, notes, detected_at, reviewed_at, sent_at',
      { count: 'exact' }
    )
    .order('detected_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && status !== 'all') q = q.eq('status', status)
  if (country) q = q.eq('country', country)
  if (specialty) q = q.eq('specialty', specialty)

  const { data, count, error } = await q
  if (error) {
    console.error('[admin/outreach] list:', error.code, error.message)
    return NextResponse.json({ error: 'lookup_error' }, { status: 500 })
  }

  // KPIs agregados (siempre sobre el total, no el filtro)
  const { data: kpiData } = await admin
    .from('sala_outreach_targets')
    .select('status, sent_at')

  type StatusRow = { status: string; sent_at: string | null }
  const rows = (kpiData ?? []) as StatusRow[]
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const kpis = {
    pending: rows.filter((r) => r.status === 'pending').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    sent_this_week: rows.filter(
      (r) => r.status !== 'pending' && r.sent_at && new Date(r.sent_at).getTime() > weekAgo
    ).length,
    sent_total: rows.filter((r) => r.status === 'sent' || r.status === 'contacted').length,
    converted: rows.filter((r) => r.status === 'converted').length,
    conversion_rate:
      rows.length > 0
        ? Number((rows.filter((r) => r.status === 'converted').length / rows.length).toFixed(3))
        : 0,
  }

  return NextResponse.json({
    targets: data ?? [],
    total: count ?? 0,
    kpis,
  })
}

// ── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: {
    id?: string
    status?: string
    ai_pitch_draft?: string
    notes?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  if (typeof body.id !== 'string' || body.id.length < 10) {
    return NextResponse.json({ error: 'id_required' }, { status: 400 })
  }

  const ALLOWED_STATUSES = [
    'pending',
    'approved',
    'sent',
    'contacted',
    'converted',
    'rejected',
    'blocked',
  ]

  const update: Record<string, unknown> = {}
  if (body.status) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
    }
    update.status = body.status
    if (body.status === 'sent' || body.status === 'contacted') {
      update.sent_at = new Date().toISOString()
    }
  }
  if (typeof body.ai_pitch_draft === 'string') {
    update.ai_pitch_draft = body.ai_pitch_draft.slice(0, 1200)
  }
  if (typeof body.notes === 'string') {
    update.notes = body.notes.slice(0, 4000)
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'no_fields' }, { status: 400 })
  }

  const reviewer = await reviewerId()
  if (reviewer) {
    update.reviewed_by = reviewer
    update.reviewed_at = new Date().toISOString()
  }

  const admin = adminSupabase()
  const { data, error } = await admin
    .from('sala_outreach_targets')
    .update(update)
    .eq('id', body.id)
    .select(
      'id, platform, profile_url, full_name, headline, country, specialty, followers_count, signal_post_url, signal_post_excerpt, signal_engagement, signal_reason, ai_score, ai_pitch_draft, status, invite_code_id, notes, detected_at, reviewed_at, sent_at'
    )
    .single()

  if (error) {
    console.error('[admin/outreach] patch:', error.code, error.message)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ target: data })
}

// ── POST ─ acciones complejas ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { id?: string; action?: string; max_uses?: number; days?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  if (typeof body.id !== 'string' || body.id.length < 10) {
    return NextResponse.json({ error: 'id_required' }, { status: 400 })
  }

  if (body.action !== 'generate_invite') {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
  }

  const admin = adminSupabase()

  // 1. Cargar target
  const { data: target, error: targetErr } = await admin
    .from('sala_outreach_targets')
    .select('id, full_name, invite_code_id')
    .eq('id', body.id)
    .single()

  if (targetErr || !target) {
    return NextResponse.json({ error: 'target_not_found' }, { status: 404 })
  }

  // 2. Si ya tiene código linkeado, devolverlo (idempotente)
  if (target.invite_code_id) {
    const { data: existing } = await admin
      .from('sala_invite_codes')
      .select('id, code')
      .eq('id', target.invite_code_id)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ invite: existing, reused: true })
    }
  }

  // 3. Generar código nuevo (retry hasta 5 veces si colisiona)
  const reviewer = await reviewerId()
  const days = Number.isFinite(body.days) && body.days! > 0 ? body.days! : 60
  const max_uses =
    Number.isInteger(body.max_uses) && body.max_uses! > 0 && body.max_uses! <= 10
      ? body.max_uses!
      : 1
  const expires_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

  let code = ''
  for (let i = 0; i < 5; i++) {
    code = generateInviteCode()
    const { data: clash } = await admin
      .from('sala_invite_codes')
      .select('id')
      .eq('code', code)
      .maybeSingle()
    if (!clash) break
  }

  const { data: invite, error: insertErr } = await admin
    .from('sala_invite_codes')
    .insert({
      code,
      created_by: reviewer,
      assigned_name: target.full_name ?? null,
      notes: `Outreach LinkedIn — target ${target.id}`,
      max_uses,
      expires_at,
      grants_plan: 'creator',
    })
    .select('id, code')
    .single()

  if (insertErr || !invite) {
    console.error('[admin/outreach] invite insert:', insertErr?.code, insertErr?.message)
    return NextResponse.json({ error: 'invite_create_failed' }, { status: 500 })
  }

  // 4. Linkear código al target
  const { error: linkErr } = await admin
    .from('sala_outreach_targets')
    .update({
      invite_code_id: invite.id,
      status: 'approved',
      reviewed_by: reviewer,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', body.id)

  if (linkErr) {
    console.error('[admin/outreach] link:', linkErr.code, linkErr.message)
    return NextResponse.json({ error: 'link_failed' }, { status: 500 })
  }

  return NextResponse.json({ invite, reused: false })
}
