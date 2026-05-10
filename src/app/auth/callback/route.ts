import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      const provider = user?.app_metadata?.provider as string | undefined

      // LinkedIn → creador: verificar si ya tiene sala o necesita crearla
      if (provider === 'linkedin_oidc') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: creator } = await (supabase as any)
          .from('sala_creators')
          .select('slug')
          .eq('user_id', user!.id)
          .maybeSingle()

        const destination = creator ? '/dashboard' : '/abrir'
        return NextResponse.redirect(new URL(destination, origin))
      }

      // Google → lector: ir a explorar o al next param
      const safeNext = next.startsWith('/') ? next : '/explorar'
      return NextResponse.redirect(new URL(safeNext, origin))
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth`)
}
