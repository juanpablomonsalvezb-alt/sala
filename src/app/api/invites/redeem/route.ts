// POST /api/invites/redeem
// Redime un código de invitación VIP: marca al creador como plan='creator'
// sin cobrar la tarifa de plataforma (US$19/mes).
//
// Auth: requiere sesión Supabase activa.
// Body: { code: string }
// Response: { success, plan, message }
//
// Idempotente: si el usuario ya redimió el mismo código, devuelve success sin
// volver a incrementar times_used (gracias al UNIQUE(invite_id, redeemed_by)).

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { normalizeInviteCode } from '@/lib/invite-helpers'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 15

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

interface InviteRow {
  id: string
  code: string
  assigned_email: string | null
  max_uses: number
  times_used: number
  expires_at: string | null
  revoked_at: string | null
  grants_plan: 'creator' | 'pro'
}

export async function POST(request: NextRequest) {
  // 1. Sesión obligatoria
  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Debes iniciar sesión para redimir un código.' }, { status: 401 })
  }

  // 2. Rate limit anti-fuerza-bruta: 10 intentos / 10 min por user
  const ip = getClientIp(request)
  const rl = await rateLimit({
    bucket: 'invite-redeem',
    key: `${user.id}:${ip}`,
    limit: 10,
    windowSec: 10 * 60,
  })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Inténtalo más tarde.' },
      { status: 429, headers: { 'Retry-After': String(rl.resetIn ?? 600) } }
    )
  }

  // 3. Parsear body — el `code` es opcional; si falta, leemos la cookie HttpOnly
  // nb_invite (set en /api/invites/claim). Esto permite que /abrir/page.tsx
  // llame al redeem sin tener que leer la cookie en el cliente.
  let codeRaw: string | null = null
  try {
    const body = (await request.json().catch(() => ({}))) as { code?: unknown }
    if (typeof body.code === 'string' && body.code.length > 0) {
      codeRaw = body.code
    }
  } catch {
    // Body vacío o inválido — caer a cookie
  }

  if (!codeRaw) {
    const cookieCode = request.cookies.get('nb_invite')?.value
    if (cookieCode) codeRaw = cookieCode
  }

  if (!codeRaw) {
    return NextResponse.json({ error: 'Código requerido.' }, { status: 400 })
  }

  const code = normalizeInviteCode(codeRaw)
  if (!code) {
    return NextResponse.json({ error: 'Formato de código inválido.' }, { status: 400 })
  }

  const admin = adminSupabase()

  // 4. Buscar el código
  const { data: invite, error: lookupErr } = await admin
    .from('sala_invite_codes')
    .select('id, code, assigned_email, max_uses, times_used, expires_at, revoked_at, grants_plan')
    .eq('code', code)
    .maybeSingle()

  if (lookupErr) {
    console.error('[invites/redeem] lookup:', lookupErr.code, lookupErr.message)
    return NextResponse.json({ error: 'Error consultando código.' }, { status: 500 })
  }

  const row = invite as InviteRow | null
  if (!row) {
    return NextResponse.json({ error: 'Código no encontrado.' }, { status: 404 })
  }

  // 5. Validaciones
  if (row.revoked_at) {
    return NextResponse.json({ error: 'Este código fue revocado.' }, { status: 410 })
  }
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Este código ha expirado.' }, { status: 410 })
  }
  if (row.times_used >= row.max_uses) {
    return NextResponse.json({ error: 'Este código ya fue utilizado.' }, { status: 410 })
  }
  if (row.assigned_email && row.assigned_email.toLowerCase() !== (user.email ?? '').toLowerCase()) {
    return NextResponse.json(
      { error: 'Este código está asignado a otro email.' },
      { status: 403 }
    )
  }

  // 6. Verificar si ya redimió ANTES (idempotencia)
  const { data: existingRedemption } = await admin
    .from('sala_invite_redemptions')
    .select('id, creator_id')
    .eq('invite_id', row.id)
    .eq('redeemed_by', user.id)
    .maybeSingle()

  if (existingRedemption) {
    return NextResponse.json({
      success: true,
      already_redeemed: true,
      plan: row.grants_plan,
      message: 'Ya habías redimido este código.',
    })
  }

  // 7. Buscar (o esperar) el sala_creator del usuario
  // Nota: el creator se crea en /abrir o /registro. Si aún no existe,
  // marcamos la redención y la próxima vez que entre a /abrir le aplicamos
  // el plan. Para simplificar, requerimos que exista creator.
  const { data: creator } = await admin
    .from('sala_creators')
    .select('id, plan')
    .eq('user_id', user.id)
    .maybeSingle()

  const creatorRow = creator as { id: string; plan: string } | null

  // 8. Registrar redención + actualizar contador en una operación
  const { error: insertErr } = await admin.from('sala_invite_redemptions').insert({
    invite_id: row.id,
    redeemed_by: user.id,
    creator_id: creatorRow?.id ?? null,
    ip_address: ip,
    user_agent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
  })

  if (insertErr) {
    // Si fue un race condition (unique violation), tratamos como idempotente
    if (insertErr.code === '23505') {
      return NextResponse.json({
        success: true,
        already_redeemed: true,
        plan: row.grants_plan,
        message: 'Ya habías redimido este código.',
      })
    }
    console.error('[invites/redeem] insert:', insertErr.code, insertErr.message)
    return NextResponse.json({ error: 'Error registrando redención.' }, { status: 500 })
  }

  // 9. Incrementar times_used (con CAS para evitar overflow concurrente)
  const { error: incrErr } = await admin
    .from('sala_invite_codes')
    .update({ times_used: row.times_used + 1 })
    .eq('id', row.id)
    .lt('times_used', row.max_uses)

  if (incrErr) {
    console.error('[invites/redeem] incr:', incrErr.code, incrErr.message)
    // No revertimos: la redención está registrada, el contador puede
    // reconciliarse después con un cron.
  }

  // 10. Si ya existe el creator, activar plan inmediatamente
  if (creatorRow && creatorRow.plan !== row.grants_plan && creatorRow.plan !== 'pro') {
    const { error: upgradeErr } = await admin
      .from('sala_creators')
      .update({ plan: row.grants_plan })
      .eq('id', creatorRow.id)
      .eq('user_id', user.id)
    if (upgradeErr) {
      console.error('[invites/redeem] upgrade:', upgradeErr.code, upgradeErr.message)
    }
  }

  return NextResponse.json({
    success: true,
    plan: row.grants_plan,
    creator_activated: Boolean(creatorRow),
    message: creatorRow
      ? '¡Tu plan está activo! Ya puedes empezar a publicar.'
      : 'Código redimido. Completa la creación de tu sala para activar el plan.',
  })
}
