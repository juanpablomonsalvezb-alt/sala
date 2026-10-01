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

      // Marca para el aviso de bienvenida (components/auth-welcome-toast.tsx):
      // cuenta recién creada → "nuevo", si no → "sesion".
      const isNewUser = user?.created_at
        ? Date.now() - new Date(user.created_at).getTime() < 5 * 60 * 1000
        : false
      const withWelcome = (path: string) => {
        const url = new URL(path, origin)
        url.searchParams.set('bienvenida', isNewUser ? 'nuevo' : 'sesion')
        return url
      }

      // Si trae cookie de invite VIP, SIEMPRE va a /abrir (flujo creator gratis).
      // Esto bypassea cualquier next default que lleve a /directorio.
      const cookieStore = await cookies()
      const hasInvite = Boolean(cookieStore.get(INVITE_COOKIE)?.value)
      if (hasInvite) {
        return NextResponse.redirect(withWelcome('/abrir'))
      }

      // Si hay un `next` explícito y seguro, lo respetamos (paywall → suscribirse, etc.)
      if (next) {
        return NextResponse.redirect(withWelcome(next))
      }

      // LinkedIn → creador
      if (provider === 'linkedin_oidc') {
        const { data: creator } = await supabase
          .from('sala_creators')
          .select('slug')
          .eq('user_id', user!.id)
          .maybeSingle()

        const destination = creator ? '/dashboard' : '/abrir'
        return NextResponse.redirect(withWelcome(destination))
      }

      // Google / email → lector nuevo pasa primero por el onboarding
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase.from('sala_profiles') as any)
        .select('onboarding_completed')
        .eq('id', user!.id)
        .maybeSingle()

      if (profile?.onboarding_completed === false) {
        return NextResponse.redirect(new URL('/onboarding', origin))
      }

      // Vuelve al inicio, ya con sesión
      return NextResponse.redirect(withWelcome('/'))
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth`)
}
