import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

/**
 * GET /api/mp/connect
 * Inicia el flujo OAuth de MercadoPago Marketplace.
 * Redirige al creador autenticado a la página de autorización de MP.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  if (error || !user) {
    return NextResponse.redirect(new URL('/entrar', request.url))
  }

  const APP_ID      = process.env.MP_APP_ID
  const REDIRECT_URI = process.env.MP_REDIRECT_URI ?? `${baseUrl}/api/mp/connect/callback`

  if (!APP_ID) {
    console.error('[mp/connect] MP_APP_ID no está configurado')
    return NextResponse.json({ error: 'Integración MP no configurada.' }, { status: 500 })
  }

  // State anti-CSRF: user_id + bytes aleatorios
  const state = `${user.id}:${randomBytes(16).toString('hex')}`

  const authUrl = new URL('https://auth.mercadopago.cl/authorization')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', APP_ID)
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  authUrl.searchParams.set('state', state)

  const response = NextResponse.redirect(authUrl.toString())

  // Guardar state en cookie HttpOnly (expira en 10 min)
  response.cookies.set('mp_oauth_state', state, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   600,
    path:     '/',
  })

  return response
}
