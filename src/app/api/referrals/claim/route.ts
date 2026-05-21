// GET /api/referrals/claim?ref=username&next=/registro|/abrir
//
// Setea la cookie nb_referrer (HttpOnly, 30 días) con el slug del referrer
// y redirige al next destino seguro. Si el username no existe en sala_creators,
// igualmente redirige al next sin setear cookie — el link nunca se ve roto.
//
// Rate limit: 30 req / 10 min por IP (anti-spam y anti-scraping de slugs).

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import {
  REFERRER_COOKIE,
  REFERRER_COOKIE_MAX_AGE,
  normalizeUsername,
  safeNext,
} from '@/lib/referral-helpers'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const username = normalizeUsername(url.searchParams.get('ref'))
  const next = safeNext(url.searchParams.get('next'))

  // Rate limit por IP — best-effort, no bloquea si la BD falla.
  const ip = getClientIp(request)
  const rl = await rateLimit({
    bucket: 'referrals_claim',
    key: ip,
    limit: 30,
    windowSec: 600,
  })
  if (!rl.ok) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!username) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verificar que el slug exista en sala_creators. Si no existe, redirigimos
  // sin cookie (no exponemos el error — UX: el link nunca debe verse roto).
  let validSlug = false
  try {
    const supabase = adminSupabase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('sala_creators') as any)
      .select('slug')
      .eq('slug', username)
      .maybeSingle()
    validSlug = !!data
  } catch {
    // Si Supabase falla, seguimos sin cookie.
    validSlug = false
  }

  // Construir target con UTM tracking
  const target = new URL(next, request.url)
  if (validSlug) {
    target.searchParams.set('ref', username)
    target.searchParams.set('utm_source', 'referral')
    target.searchParams.set('utm_medium', 'link')
    target.searchParams.set('utm_campaign', `r_${username}`)
  }

  const res = NextResponse.redirect(target)

  if (validSlug) {
    res.cookies.set(REFERRER_COOKIE, username, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: REFERRER_COOKIE_MAX_AGE,
    })
  }

  return res
}
