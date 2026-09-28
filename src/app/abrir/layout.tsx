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
  let email: string | null = null
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect('/registro?next=/abrir')
    }
    // Ya tiene sala → no mostrar el formulario de alta de nuevo
    const { data: creator } = await supabase
      .from('sala_creators')
      .select('slug')
      .eq('user_id', user.id)
      .maybeSingle()
    if (creator) {
      redirect('/dashboard')
    }
    email = user.email ?? null
  }
  return (
    <>
      {email && (
        // Deja claro con qué cuenta queda asociado el espacio
        <div className="bg-[#121212] text-white px-6 py-2.5 text-center font-sans text-[12px]">
          Creando tu espacio con la cuenta <strong className="font-semibold">{email}</strong>
          <span className="mx-2 text-[#666]">·</span>
          <form action="/api/auth/signout" method="post" className="inline">
            <button type="submit" className="underline text-[#BBBBBB] hover:text-white">¿No eres tú? Cambiar cuenta</button>
          </form>
        </div>
      )}
      {children}
    </>
  )
}
