// GET / POST / PATCH /api/admin/invites
// CRUD de códigos de invitación VIP. Solo superadmin.
//
// GET   → lista todos los códigos con metadatos
// POST  → crea un nuevo código (body: { display_name, assigned_email?, max_uses?, expires_at?, notes? })
// PATCH → revoca un código (body: { id, action: 'revoke' })

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { isSuperadmin } from '@/lib/supabase/server'
import { generateInviteCode } from '@/lib/invite-helpers'

export const runtime = 'nodejs'

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET() {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const admin = adminSupabase()
  const { data, error } = await admin
    .from('sala_invite_codes')
    .select('id, code, assigned_email, assigned_name, notes, max_uses, times_used, expires_at, revoked_at, grants_plan, created_at')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('[admin/invites] list:', error.code, error.message)
    return NextResponse.json({ error: 'lookup_error' }, { status: 500 })
  }

  return NextResponse.json({ invites: data ?? [] })
}

export async function POST(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: {
    display_name?: string
    assigned_email?: string
    max_uses?: number
    expires_at?: string | null
    notes?: string
    grants_plan?: 'creator' | 'pro'
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  const display_name = typeof body.display_name === 'string' ? body.display_name.trim().slice(0, 200) : ''
  const assigned_email = typeof body.assigned_email === 'string' ? body.assigned_email.trim().toLowerCase() : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : ''
  const max_uses = Number.isInteger(body.max_uses) && body.max_uses! > 0 && body.max_uses! <= 1000
    ? body.max_uses!
    : 1
  const grants_plan = body.grants_plan === 'pro' ? 'pro' : 'creator'

  let expires_at: string | null = null
  if (typeof body.expires_at === 'string' && body.expires_at) {
    const parsed = new Date(body.expires_at)
    if (!isNaN(parsed.getTime())) {
      expires_at = parsed.toISOString()
    }
  }

  if (assigned_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assigned_email)) {
    return NextResponse.json({ error: 'email_invalid' }, { status: 400 })
  }

  // Generar código único (retry hasta 5 veces si colisiona)
  const admin = adminSupabase()
  let code = ''
  for (let i = 0; i < 5; i++) {
    code = generateInviteCode()
    const { data: existing } = await admin
      .from('sala_invite_codes')
      .select('id')
      .eq('code', code)
      .maybeSingle()
    if (!existing) break
  }
  if (!code) {
    return NextResponse.json({ error: 'code_generation_failed' }, { status: 500 })
  }

  const { data, error } = await admin
    .from('sala_invite_codes')
    .insert({
      code,
      assigned_name: display_name || null,
      assigned_email: assigned_email || null,
      notes: notes || null,
      max_uses,
      expires_at,
      grants_plan,
    })
    .select('id, code, assigned_email, assigned_name, notes, max_uses, times_used, expires_at, revoked_at, grants_plan, created_at')
    .single()

  if (error) {
    console.error('[admin/invites] insert:', error.code, error.message)
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  return NextResponse.json({ invite: data })
}

export async function PATCH(request: NextRequest) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { id?: string; action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body_invalid' }, { status: 400 })
  }

  if (typeof body.id !== 'string' || body.id.length < 10) {
    return NextResponse.json({ error: 'id_required' }, { status: 400 })
  }
  if (body.action !== 'revoke' && body.action !== 'unrevoke') {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
  }

  const admin = adminSupabase()
  const update = body.action === 'revoke'
    ? { revoked_at: new Date().toISOString() }
    : { revoked_at: null }

  const { error } = await admin
    .from('sala_invite_codes')
    .update(update)
    .eq('id', body.id)

  if (error) {
    console.error('[admin/invites] patch:', error.code, error.message)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
