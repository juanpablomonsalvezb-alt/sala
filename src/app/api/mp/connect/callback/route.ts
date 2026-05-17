import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

type MPTokenResponse = {
  access_token:  string
  refresh_token: string
  user_id:       number
  expires_in:    number
  token_type:    string
  scope:         string
}

/**
 * GET /api/mp/connect/callback
 * Recibe el código de autorización de MercadoPago, lo intercambia por tokens
 * y guarda el access_token + refresh_token del creador en sala_creators.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const mpErr = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'
  const configUrl = `${baseUrl}/dashboard/configuracion`

  // MP rechazó la autorización
  if (mpErr || !code) {
    return NextResponse.redirect(`${configUrl}?mp_error=access_denied`)
  }

  // Validar state anti-CSRF (comparación constant-time vía Buffer)
  const cookieState = request.cookies.get('mp_oauth_state')?.value
  if (!cookieState || !state || cookieState.length !== state.length) {
    return NextResponse.redirect(`${configUrl}?mp_error=invalid_state`)
  }
  // Comparación segura para evitar timing attacks
  let stateMismatch = 0
  for (let i = 0; i < cookieState.length; i++) {
    stateMismatch |= cookieState.charCodeAt(i) ^ state.charCodeAt(i)
  }
  if (stateMismatch !== 0) {
    return NextResponse.redirect(`${configUrl}?mp_error=invalid_state`)
  }

  // userId SIEMPRE desde la sesión actual — nunca confiar en el state.
  // El state solo sirve para CSRF; si lo usáramos como source of truth para
  // user_id, un atacante con el state robado podría asociar su cuenta MP
  // a la cuenta Nebbuler de la víctima (hijacking de cobros).
  const sessionClient = await createClient()
  const { data: { user: sessionUser } } = await sessionClient.auth.getUser()
  if (!sessionUser) {
    return NextResponse.redirect(`${configUrl}?mp_error=session_expired`)
  }
  const userId = sessionUser.id

  // Defensa adicional: el user_id codificado en el state debe coincidir con la
  // sesión actual. Si difiere → state robado/reutilizado.
  const stateUserId = state.split(':')[0]
  if (stateUserId !== userId) {
    console.error('[mp/connect/callback] state user mismatch:', { stateUserId, sessionUserId: userId })
    return NextResponse.redirect(`${configUrl}?mp_error=state_user_mismatch`)
  }

  const APP_ID        = process.env.MP_APP_ID
  const CLIENT_SECRET = process.env.MP_CLIENT_SECRET
  const REDIRECT_URI  = process.env.MP_REDIRECT_URI ?? `${baseUrl}/api/mp/connect/callback`

  if (!APP_ID || !CLIENT_SECRET) {
    console.error('[mp/connect/callback] MP_APP_ID o MP_CLIENT_SECRET no configurados')
    return NextResponse.redirect(`${configUrl}?mp_error=server_config`)
  }

  try {
    // Intercambiar code por access_token
    const tokenRes = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     APP_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri:  REDIRECT_URI,
        grant_type:    'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      console.error('[mp/connect/callback] token exchange error:', tokenRes.status, errText)
      return NextResponse.redirect(`${configUrl}?mp_error=token_exchange`)
    }

    const tokenData = (await tokenRes.json()) as MPTokenResponse

    // Guardar tokens con service role (los tokens no deben ser accesibles por anon key)
    const supabase = createServiceClient()

    // FIX I5: guardar expires_at para que el cron de refresh sepa cuándo renovar
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

    // Necesitamos el creator.id para insertar en sala_creator_secrets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creatorRow } = await (supabase as any)
      .from('sala_creators')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!creatorRow?.id) {
      console.error('[mp/connect/callback] creator no encontrado para user_id:', userId)
      return NextResponse.redirect(`${configUrl}?mp_error=creator_missing`)
    }

    // C10: tokens en tabla separada (sala_creator_secrets), no en sala_creators.
    // Upsert porque puede ser primera conexión o reconexión.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: secretsError } = await (supabase as any)
      .from('sala_creator_secrets')
      .upsert(
        {
          creator_id:          creatorRow.id,
          mp_access_token:     tokenData.access_token,
          mp_refresh_token:    tokenData.refresh_token,
          mp_user_id:          String(tokenData.user_id),
          mp_connected_at:     new Date().toISOString(),
          mp_token_expires_at: expiresAt,
        },
        { onConflict: 'creator_id' }
      )

    if (secretsError) {
      console.error('[mp/connect/callback] DB secrets error:', secretsError)
      return NextResponse.redirect(`${configUrl}?mp_error=db_error`)
    }

    // Limpiar cookie y redirigir con éxito
    const successRes = NextResponse.redirect(`${configUrl}?mp_connected=1`)
    successRes.cookies.delete('mp_oauth_state')
    return successRes

  } catch (err) {
    console.error('[mp/connect/callback] unexpected error:', err)
    return NextResponse.redirect(`${configUrl}?mp_error=unknown`)
  }
}
