// POST /api/referrals/track-signup
//
// Llamado desde /abrir/page.tsx una vez que el usuario completa su perfil de
// creador. Lee la cookie nb_referrer y registra el referral en sala_referrals
// con status='signup'.
//
// Comportamiento:
//   - Requiere sesión activa (auth.uid()).
//   - Si no hay cookie nb_referrer, devuelve { ok: true, tracked: false }.
//   - Si el referrer slug ya redimió un invite VIP, igual trackeamos (invite
//     gana prioridad para el plan, pero el referral se cuenta aparte).
//   - Anti-self-referral: si el slug pertenece al mismo user_id, descartamos.
//   - Idempotente: UNIQUE(referrer_id, referred_id) — si ya existe la fila,
//     simplemente respondemos ok sin error.

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { REFERRER_COOKIE, normalizeUsername } from '@/lib/referral-helpers'

export const runtime = 'nodejs'
export const maxDuration = 10

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function POST(request: NextRequest) {
  // 1. Sesión obligatoria
  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  // 2. Leer cookie
  const username = normalizeUsername(request.cookies.get(REFERRER_COOKIE)?.value)
  if (!username) {
    return NextResponse.json({ ok: true, tracked: false, reason: 'no_cookie' })
  }

  // 3. Resolver referrer (slug -> user_id)
  const admin = adminSupabase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: referrerCreator } = await (admin.from('sala_creators') as any)
    .select('user_id, slug')
    .eq('slug', username)
    .maybeSingle()

  if (!referrerCreator?.user_id) {
    return NextResponse.json({ ok: true, tracked: false, reason: 'referrer_not_found' })
  }

  const referrerId: string = referrerCreator.user_id

  // 4. Anti-self-referral
  if (referrerId === user.id) {
    const res = NextResponse.json({ ok: true, tracked: false, reason: 'self_referral' })
    // Borrar cookie para evitar reintentos
    res.cookies.set(REFERRER_COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }

  // 5. Insert idempotente
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertErr } = await (admin.from('sala_referrals') as any).insert({
      referrer_id: referrerId,
      referred_id: user.id,
      ref_code: username,
      source: 'link',
      status: 'signup',
      reward_type: 'none',
      utm_source: 'referral',
      utm_medium: 'link',
      utm_campaign: `r_${username}`,
    })

    // 23505 = unique_violation — el referral ya estaba registrado, OK.
    if (insertErr && insertErr.code !== '23505') {
      console.error('[track-signup] insert error:', insertErr.message)
      return NextResponse.json({ ok: false, error: 'insert_failed' }, { status: 500 })
    }
  } catch (e) {
    console.error('[track-signup] unexpected:', e)
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }

  // 6. Limpiar cookie — el referral ya quedó registrado en BD.
  const res = NextResponse.json({ ok: true, tracked: true, referrer: username })
  res.cookies.set(REFERRER_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
