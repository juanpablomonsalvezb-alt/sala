// ─────────────────────────────────────────────────────────────────────────────
// /api/admin/media-contacts  (solo superadmin)
//
// GET    → lista media contacts con KPIs
// POST   → crea nuevo medio
// PATCH  → actualiza outlet (status, sector, contact_name, notes…)
// DELETE → elimina medio (hard delete, sin impacto en logs por FK on delete cascade)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { isSuperadmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

const SELECT_FIELDS =
  'id, outlet_name, country, tier, sector, email, contact_name, language, status, last_contacted_at, response_rate, notes, created_at'

const ALLOWED_STATUSES = ['active', 'paused', 'bounced', 'unsubscribed']
const ALLOWED_COUNTRIES = ['CL', 'AR', 'MX', 'CO', 'PE', 'UY', 'EC', 'PA', 'RD', 'BR', 'ES', 'US']

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const country = url.searchParams.get('country')
  const sector = url.searchParams.get('sector')

  const admin = adminSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (admin as any)
    .from('sala_media_contacts')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('outlet_name', { ascending: true })
    .limit(500)

  if (status && status !== 'all') q = q.eq('status', status)
  if (country && country !== 'all') q = q.eq('country', country)
  if (sector && sector !== 'all') q = q.eq('sector', sector)

  const { data, count, error } = await q
  if (error) {
    console.error('[admin/media-contacts] list:', error.code, error.message)
    return NextResponse.json({ error: 'lookup_error' }, { status: 500 })
  }

  // KPIs por outlet — cuántas veces fue contactado y cuántas publicó
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: logRows } = await (admin as any)
    .from('sala_press_outreach_log')
    .select('media_contact_id, response_status')

  type LogRow = { media_contact_id: string; response_status: string | null }
  const logs = (logRows ?? []) as LogRow[]
  const statsMap = new Map<string, { contacted: number; published: number; replied: number }>()
  for (const l of logs) {
    const s = statsMap.get(l.media_contact_id) ?? { contacted: 0, published: 0, replied: 0 }
    s.contacted++
    if (l.response_status === 'published') s.published++
    if (l.response_status === 'replied') s.replied++
    statsMap.set(l.media_contact_id, s)
  }

  type ContactRow = { id: string; [k: string]: unknown }
  const enriched = ((data ?? []) as ContactRow[]).map((c) => ({
    ...c,
    times_contacted: statsMap.get(c.id)?.contacted ?? 0,
    times_published: statsMap.get(c.id)?.published ?? 0,
    times_replied: statsMap.get(c.id)?.replied ?? 0,
  }))

  return NextResponse.json({
    media_contacts: enriched,
    total: count ?? 0,
  })
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: {
    outlet_name?: string
    email?: string
    country?: string
    tier?: number
    sector?: string
    contact_name?: string
    language?: string
    notes?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  if (typeof body.outlet_name !== 'string' || body.outlet_name.length < 2) {
    return NextResponse.json({ error: 'outlet_name_required' }, { status: 400 })
  }
  if (typeof body.email !== 'string' || !body.email.includes('@')) {
    return NextResponse.json({ error: 'email_required' }, { status: 400 })
  }
  if (body.country && !ALLOWED_COUNTRIES.includes(body.country)) {
    return NextResponse.json({ error: 'invalid_country' }, { status: 400 })
  }
  if (typeof body.tier === 'number' && (body.tier < 1 || body.tier > 3)) {
    return NextResponse.json({ error: 'invalid_tier' }, { status: 400 })
  }

  const admin = adminSupabase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('sala_media_contacts')
    .insert({
      outlet_name: body.outlet_name.slice(0, 200),
      email: body.email.trim().toLowerCase().slice(0, 300),
      country: body.country ?? null,
      tier: typeof body.tier === 'number' ? body.tier : null,
      sector: body.sector?.slice(0, 80) ?? 'general',
      contact_name: body.contact_name?.slice(0, 200) ?? null,
      language: body.language?.slice(0, 8) ?? 'es',
      notes: body.notes?.slice(0, 4000) ?? null,
      status: 'active',
    })
    .select(SELECT_FIELDS)
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'email_already_exists' }, { status: 409 })
    }
    console.error('[admin/media-contacts] insert:', error.code, error.message)
    return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ media_contact: data })
}

// ── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: {
    id?: string
    status?: string
    sector?: string
    contact_name?: string
    tier?: number
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

  const update: Record<string, unknown> = {}
  if (body.status) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
    }
    update.status = body.status
  }
  if (typeof body.sector === 'string') update.sector = body.sector.slice(0, 80)
  if (typeof body.contact_name === 'string') update.contact_name = body.contact_name.slice(0, 200)
  if (typeof body.tier === 'number' && body.tier >= 1 && body.tier <= 3) update.tier = body.tier
  if (typeof body.notes === 'string') update.notes = body.notes.slice(0, 4000)

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'no_fields' }, { status: 400 })
  }

  const admin = adminSupabase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('sala_media_contacts')
    .update(update)
    .eq('id', body.id)
    .select(SELECT_FIELDS)
    .single()

  if (error) {
    console.error('[admin/media-contacts] patch:', error.code, error.message)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ media_contact: data })
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

  const admin = adminSupabase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any).from('sala_media_contacts').delete().eq('id', id)

  if (error) {
    console.error('[admin/media-contacts] delete:', error.code, error.message)
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
