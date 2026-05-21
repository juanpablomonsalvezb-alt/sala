// POST /api/migrate/substack/subscribers
// Parsea CSV exportado de Substack y registra invitaciones para que el creator
// pueda invitar masivamente a sus suscriptores previos.
//
// Auth: creator autenticado.
// Body: { csv_data: string }
// Response: { invited, duplicates, invalid, invite_code }

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { generateInviteCode } from '@/lib/invite-helpers'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_EMAILS = 500
const BULK_THRESHOLD = 50 // > 50 emails ⇒ generamos un código grupal

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface ParsedRow {
  email: string
  name: string | null
}

function parseCsv(raw: string): ParsedRow[] {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []

  // Detectar cabecera
  const header = lines[0].toLowerCase()
  const hasHeader =
    header.includes('email') || header.includes('correo') || header.includes('e-mail')

  const headerCols = hasHeader ? splitCsvLine(lines[0]) : []
  const emailIdx = hasHeader
    ? headerCols.findIndex((c) => /email|correo|e-?mail/i.test(c))
    : 0
  const nameIdx = hasHeader
    ? headerCols.findIndex((c) => /name|nombre|first|full/i.test(c))
    : -1

  const dataLines = hasHeader ? lines.slice(1) : lines
  const rows: ParsedRow[] = []
  for (const line of dataLines) {
    const cols = splitCsvLine(line)
    const email = (cols[emailIdx >= 0 ? emailIdx : 0] ?? '').trim().toLowerCase()
    const name = nameIdx >= 0 ? (cols[nameIdx] ?? '').trim() : ''
    if (email) rows.push({ email, name: name || null })
  }
  return rows
}

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out.map((s) => s.replace(/^"|"$/g, '').trim())
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creator } = await (supabase as any)
    .from('sala_creators')
    .select('id, slug, name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!creator) {
    return NextResponse.json(
      { error: 'Necesitas un perfil de creator para invitar suscriptores.' },
      { status: 403 }
    )
  }

  let body: { csv_data?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const csv = (body.csv_data ?? '').toString()
  if (!csv.trim()) {
    return NextResponse.json({ error: 'CSV vacío.' }, { status: 400 })
  }
  if (csv.length > 2_000_000) {
    return NextResponse.json({ error: 'CSV demasiado grande (max 2MB).' }, { status: 413 })
  }

  const allRows = parseCsv(csv)
  let invalid = 0
  const valid: ParsedRow[] = []
  const seen = new Set<string>()
  for (const r of allRows) {
    if (!EMAIL_RE.test(r.email)) {
      invalid++
      continue
    }
    if (seen.has(r.email)) continue
    seen.add(r.email)
    valid.push(r)
    if (valid.length >= MAX_EMAILS) break
  }

  if (valid.length === 0) {
    return NextResponse.json({
      invited: 0,
      duplicates: 0,
      invalid,
      message: 'No se encontraron emails válidos en el CSV.',
    })
  }

  const admin = adminSupabase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any

  // Generar código grupal si supera el threshold
  let groupInviteCode: string | null = null
  let groupInviteId: string | null = null

  if (valid.length > BULK_THRESHOLD) {
    const code = generateInviteCode()
    const { data: inviteRow, error: inviteErr } = await db
      .from('sala_invite_codes')
      .insert({
        code,
        created_by: user.id,
        assigned_name: `Migración Substack — ${creator.name ?? creator.slug}`,
        notes: `Auto-creado para migración masiva de ${valid.length} suscriptores`,
        max_uses: valid.length,
        grants_plan: 'creator',
      })
      .select('id, code')
      .single()

    if (!inviteErr && inviteRow) {
      groupInviteCode = inviteRow.code
      groupInviteId = inviteRow.id
    }
  }

  // Pre-cargar duplicados existentes para este creator
  const emails = valid.map((r) => r.email)
  const { data: existingRows } = await db
    .from('sala_migration_invites')
    .select('email')
    .eq('creator_id', creator.id)
    .in('email', emails)

  const existing = new Set<string>((existingRows ?? []).map((r: { email: string }) => r.email))

  let duplicates = 0
  const toInsert: Array<{
    creator_id: string
    email: string
    name: string | null
    status: string
    invite_code_id: string | null
    source: string
  }> = []

  for (const row of valid) {
    if (existing.has(row.email)) {
      duplicates++
      continue
    }
    toInsert.push({
      creator_id: creator.id,
      email: row.email,
      name: row.name,
      status: 'pending',
      invite_code_id: groupInviteId,
      source: 'substack',
    })
  }

  let invited = 0
  if (toInsert.length > 0) {
    const { error: insErr, count } = await db
      .from('sala_migration_invites')
      .insert(toInsert, { count: 'exact' })

    if (insErr) {
      return NextResponse.json(
        { error: `No se pudieron registrar las invitaciones: ${insErr.message}` },
        { status: 500 }
      )
    }
    invited = count ?? toInsert.length
  }

  return NextResponse.json({
    invited,
    duplicates,
    invalid,
    total_in_csv: allRows.length,
    invite_code: groupInviteCode,
    invite_url: groupInviteCode ? `https://nebbuler.com/vip/${groupInviteCode}` : null,
  })
}
