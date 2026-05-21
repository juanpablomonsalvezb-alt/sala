import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { INVITE_COOKIE } from '@/lib/invite-helpers'

function safeRedirectPath(next: string | null): string | null {
  if (!next) return null
  // Solo paths absolutos del propio sitio — bloquea protocol-relative URLs (//evil.com)
  if (!next.startsWith('/')) return null
  if (next.startsWith('//')) return null
  if (next.startsWith('/\\')) return null
  return next
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next')
  const next = safeRedirectPath(rawNext)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      const provider = user?.app_metadata?.provider as string | undefined

      // Si trae cookie de invite VIP, SIEMPRE va a /abrir (flujo creator gratis).
      // Esto bypassea cualquier next default que lleve a /directorio.
      const cookieStore = await cookies()
      const hasInvite = Boolean(cookieStore.get(INVITE_COOKIE)?.value)
      if (hasInvite) {
        return NextResponse.redirect(new URL('/abrir', origin))
      }

      // Si hay un `next` explícito y seguro, lo respetamos (paywall → suscribirse, etc.)
      if (next) {
        return NextResponse.redirect(new URL(next, origin))
      }

      // LinkedIn → creador
      if (provider === 'linkedin_oidc') {
        const { data: creator } = await supabase
          .from('sala_creators')
          .select('slug')
          .eq('user_id', user!.id)
          .maybeSingle()

        const destination = creator ? '/dashboard' : '/abrir'
        return NextResponse.redirect(new URL(destination, origin))
      }

      // Google / email → lector
      return NextResponse.redirect(new URL('/directorio', origin))
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth`)
}
