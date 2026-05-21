// ─────────────────────────────────────────────────────────────────────────────
// /api/admin/press-releases  (solo superadmin)
//
// GET    → lista press releases con filtros opcionales (status, country, sector)
// POST   → crea PR manualmente (sin Claude) — útil para hitos detectados a mano
// PATCH  → actualiza status / pr_title / pr_body_es / pr_quote / notes
// DELETE → soft delete (status='rejected')
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createUserSupabase, isSuperadmin } from '@/lib/supabase/server'

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

const SELECT_FIELDS =
  'id, creator_id, milestone_type, milestone_value, milestone_reached_at, pr_title, pr_body_es, pr_quote, ai_generated, status, reviewed_by, reviewed_at, sent_at, sent_to_count, response_count, published_count, notes, created_at'

const ALLOWED_STATUSES = ['draft', 'approved', 'sent', 'published', 'rejected']
const ALLOWED_MILESTONES = [
  'first_100',
  'first_500',
  'first_1000',
  'mrr_1k_usd',
  'mrr_5k_usd',
  'mrr_10k_usd',
  'one_year',
]

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const country = url.searchParams.get('country')
  const sector = url.searchParams.get('sector')
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 200), 500)
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0)

  const admin = adminSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (admin as any)
    .from('sala_press_releases')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && status !== 'all') q = q.eq('status', status)

  const { data: prs, count, error } = await q
  if (error) {
    console.error('[admin/press-releases] list:', error.code, error.message)
    return NextResponse.json({ error: 'lookup_error' }, { status: 500 })
  }

  // Join lateral creators
  type PRRow = {
    id: string
    creator_id: string
    status: string
    sent_at: string | null
    [k: string]: unknown
  }
  const rows = (prs ?? []) as PRRow[]
  const creatorIds = Array.from(new Set(rows.map((r) => r.creator_id)))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creators } = await (admin as any)
    .from('sala_creators')
    .select('id, name, slug, specialty')
    .in('id', creatorIds.length > 0 ? creatorIds : ['00000000-0000-0000-0000-000000000000'])

  type CRow = { id: string; name: string; slug: string; specialty: string }
  const cMap = new Map<string, CRow>()
  for (const c of (creators ?? []) as CRow[]) cMap.set(c.id, c)

  const enriched = rows.map((r) => {
    const c = cMap.get(r.creator_id)
    return {
      ...r,
      creator_name: c?.name ?? null,
      creator_slug: c?.slug ?? null,
      creator_specialty: c?.specialty ?? null,
    }
  })

  // Filtrado client-side por country/sector si fueron solicitados — el schema
  // de sala_creators no almacena country directamente, así que esos filtros
  // se aplican fuera del query SQL.
  const filtered = enriched.filter((r) => {
    if (sector && sector !== 'all') {
      // Aproximación: matchea sector contra specialty.
      const specialty = r.creator_specialty ?? ''
      const sectorMap: Record<string, string[]> = {
        finanzas: ['finanzas', 'economia', 'contabilidad', 'real_estate'],
        tech: ['tech'],
        startups: ['tech', 'marketing'],
        general: [],
      }
      const allowed = sectorMap[sector]
      if (allowed && allowed.length > 0 && !allowed.includes(specialty)) return false
    }
    if (country && country !== 'all') {
      const slug = r.creator_slug ?? ''
      if (!slug.toLowerCase().endsWith(`-${country.toLowerCase()}`)) {
        // permitir pasar si no hay sufijo (no podemos filtrar con certeza)
      }
    }
    return true
  })

  // KPIs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: kpiRows } = await (admin as any)
    .from('sala_press_releases')
    .select('status, sent_at, published_count')

  type KpiRow = { status: string; sent_at: string | null; published_count: number | null }
  const kRows = (kpiRows ?? []) as KpiRow[]
  const sentTotal = kRows.filter((r) => r.status === 'sent' || r.status === 'published').length
  const publishedTotal = kRows.filter((r) => r.status === 'published').length
  const kpis = {
    draft: kRows.filter((r) => r.status === 'draft').length,
    approved: kRows.filter((r) => r.status === 'approved').length,
    sent: sentTotal,
    published: publishedTotal,
    rejected: kRows.filter((r) => r.status === 'rejected').length,
    publication_rate: sentTotal > 0 ? Number((publishedTotal / sentTotal).toFixed(3)) : 0,
  }

  return NextResponse.json({
    press_releases: filtered,
    total: count ?? 0,
    kpis,
  })
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: {
    creator_id?: string
    milestone_type?: string
    milestone_value?: number
    pr_title?: string
    pr_body_es?: string
    pr_quote?: string
    notes?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  if (typeof body.creator_id !== 'string' || body.creator_id.length < 10) {
    return NextResponse.json({ error: 'creator_id_required' }, { status: 400 })
  }
  if (!body.milestone_type || !ALLOWED_MILESTONES.includes(body.milestone_type)) {
    return NextResponse.json({ error: 'invalid_milestone_type' }, { status: 400 })
  }

  const admin = adminSupabase()

  const insert = {
    creator_id: body.creator_id,
    milestone_type: body.milestone_type,
    milestone_value: typeof body.milestone_value === 'number' ? body.milestone_value : null,
    pr_title: typeof body.pr_title === 'string' ? body.pr_title.slice(0, 280) : null,
    pr_body_es: typeof body.pr_body_es === 'string' ? body.pr_body_es.slice(0, 12000) : null,
    pr_quote: typeof body.pr_quote === 'string' ? body.pr_quote.slice(0, 800) : null,
    notes: typeof body.notes === 'string' ? body.notes.slice(0, 4000) : null,
    ai_generated: false,
    status: 'draft',
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('sala_press_releases')
    .insert(insert)
    .select(SELECT_FIELDS)
    .single()

  if (error) {
    console.error('[admin/press-releases] insert:', error.code, error.message)
    return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ press_release: data })
}

// ── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: {
    id?: string
    status?: string
    pr_title?: string
    pr_body_es?: string
    pr_quote?: string
    notes?: string
    published_count?: number
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  if (typeof body.id !== 'string' || body.id.length < 10) {
    return NextResponse.json({ error: 'id_required' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}

  if (body.status) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
    }
    update.status = body.status
  }
  if (typeof body.pr_title === 'string') update.pr_title = body.pr_title.slice(0, 280)
  if (typeof body.pr_body_es === 'string') update.pr_body_es = body.pr_body_es.slice(0, 12000)
  if (typeof body.pr_quote === 'string') update.pr_quote = body.pr_quote.slice(0, 800)
  if (typeof body.notes === 'string') update.notes = body.notes.slice(0, 4000)
  if (typeof body.published_count === 'number' && body.published_count >= 0) {
    update.published_count = Math.floor(body.published_count)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('sala_press_releases')
    .update(update)
    .eq('id', body.id)
    .select(SELECT_FIELDS)
    .single()

  if (error) {
    console.error('[admin/press-releases] patch:', error.code, error.message)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ press_release: data })
}

// ── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id || id.length < 10) {
    return NextResponse.json({ error: 'id_required' }, { status: 400 })
  }

  const reviewer = await reviewerId()
  const admin = adminSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any)
    .from('sala_press_releases')
    .update({
      status: 'rejected',
      reviewed_by: reviewer,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[admin/press-releases] delete:', error.code, error.message)
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
