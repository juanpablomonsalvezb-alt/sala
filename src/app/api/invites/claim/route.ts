// GET /api/invites/claim?code=XXX&next=/registro
// Setea la cookie nb_invite y redirige a /registro o /abrir.
// Necesario porque cookies().set() no funciona desde server components,
// solo desde Route Handlers o Server Actions.

import { NextRequest, NextResponse } from 'next/server'
import { normalizeInviteCode, INVITE_COOKIE } from '@/lib/invite-helpers'

export const runtime = 'nodejs'

const ALLOWED_NEXT = new Set(['/registro', '/abrir', '/entrar'])

export async function GET(request: NextRequest) {
  const code = normalizeInviteCode(request.nextUrl.searchParams.get('code'))
  const nextParam = request.nextUrl.searchParams.get('next') ?? '/registro'
  const safeNext = ALLOWED_NEXT.has(nextParam) ? nextParam : '/registro'

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const target = new URL(safeNext, request.url)
  target.searchParams.set('invite', code)
  const res = NextResponse.redirect(target)
  res.cookies.set(INVITE_COOKIE, code, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
