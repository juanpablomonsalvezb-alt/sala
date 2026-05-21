// GET /api/invites/validate?code=NEBB-XXXX-XXXX-XXXX
// Endpoint público (sin auth) que valida un código de invitación.
// Solo devuelve metadatos seguros (display name, plan que otorga, estado).
// Se usa en la landing /invite/[code] para preview antes del signup.

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { normalizeInviteCode } from '@/lib/invite-helpers'

export const runtime = 'nodejs'
export const maxDuration = 10

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

interface ValidateRow {
  is_valid: boolean
  reason: string
  display_name: string | null
  grants_plan: string | null
}

export async function GET(request: NextRequest) {
  const code = normalizeInviteCode(request.nextUrl.searchParams.get('code'))
  if (!code) {
    return NextResponse.json(
      { valid: false, reason: 'invalid_format' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const admin = adminSupabase()
  const { data, error } = await admin.rpc('sala_validate_invite', { p_code: code })

  if (error) {
    console.error('[invites/validate] rpc error:', error.code, error.message)
    return NextResponse.json(
      { valid: false, reason: 'error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const row = Array.isArray(data) ? (data[0] as ValidateRow | undefined) : (data as ValidateRow | null)
  if (!row || !row.is_valid) {
    return NextResponse.json(
      { valid: false, reason: row?.reason ?? 'not_found' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  return NextResponse.json(
    {
      valid: true,
      display_name: row.display_name,
      grants_plan: row.grants_plan,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
