import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

export default async function AbrirLayout({ children }: { children: React.ReactNode }) {
  // Guard de autenticación AL ENTRAR — evita que el usuario tipee 5 minutos
  // y descubra al final que necesita registrarse.
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect('/registro?next=/abrir')
    }
  }
  return <>{children}</>
}
