'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type SessionState = {
  user: User | null
  creatorSlug: string | null
  loading: boolean
}

/** Sesión actual en el cliente — mantiene las páginas estáticas y solo hidrata el header. */
export function useSessionUser(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, creatorSlug: null, loading: true })

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function load(user: User | null) {
      if (!user) {
        if (!cancelled) setState({ user: null, creatorSlug: null, loading: false })
        return
      }
      const { data } = await supabase
        .from('sala_creators')
        .select('slug')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!cancelled) setState({ user, creatorSlug: (data?.slug as string | undefined) ?? null, loading: false })
    }

    supabase.auth.getUser().then(({ data }) => load(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  return state
}

/** Cierra sesión en el cliente (limpia cookies sb-*) y recarga en el mismo dominio. */
export function SignOutButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [pending, setPending] = useState(false)
  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={async () => {
        setPending(true)
        await createClient().auth.signOut()
        window.location.href = '/'
      }}
    >
      {children}
    </button>
  )
}

/** "Tu perfil": creadores → configuración de su sala; lectores → sus suscripciones. */
function profileHref(creatorSlug: string | null): string {
  return creatorSlug ? '/dashboard/configuracion' : '/mis-suscripciones'
}

export function displayName(user: User): string {
  const full = (user.user_metadata?.full_name ?? user.user_metadata?.name) as string | undefined
  return full?.split(' ')[0] || user.email?.split('@')[0] || 'Mi cuenta'
}

/** CTAs del header del home: "Iniciar sesión / Abre tu espacio" o la cuenta del usuario. */
export function HomeAuthActions() {
  const { user, creatorSlug, loading } = useSessionUser()

  const linkCls =
    'h-full flex items-center px-3 sm:px-5 text-[11px] sm:text-[12px] font-medium text-[#555] hover:text-[#111] border-l border-[#E0E0E0] transition-colors whitespace-nowrap'
  const ctaCls =
    'h-full flex items-center px-3 sm:px-6 bg-[#B31C1C] text-white text-[11px] sm:text-[12px] font-bold tracking-[0.04em] uppercase hover:bg-[#8E1515] transition-colors whitespace-nowrap'

  if (!loading && user) {
    const avatar = user.user_metadata?.avatar_url as string | undefined
    return (
      <div className="flex items-center gap-0">
        <SignOutButton className={linkCls}>Salir</SignOutButton>
        <Link href={profileHref(creatorSlug)} className={`${linkCls} gap-2`} title={`Tu perfil · ${user.email ?? ''}`}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" width={22} height={22} className="rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="w-[22px] h-[22px] rounded-full bg-[#111] text-white text-[10px] font-bold flex items-center justify-center">
              {displayName(user).charAt(0).toUpperCase()}
            </span>
          )}
          <span className="hidden sm:inline">{displayName(user)}</span>
        </Link>
        <Link href={creatorSlug ? '/dashboard' : '/abrir'} className={ctaCls}>
          <span className="hidden sm:inline">{creatorSlug ? 'Mi espacio' : 'Abre tu espacio'}</span>
          <span className="sm:hidden">{creatorSlug ? 'Panel' : 'Abrir'}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0">
      <Link href="/entrar" className={linkCls}>
        <span className="hidden sm:inline">Iniciar sesión</span>
        <span className="sm:hidden">Entrar</span>
      </Link>
      <Link href="/abrir" className={ctaCls}>
        <span className="hidden sm:inline">Abre tu espacio</span>
        <span className="sm:hidden">Abrir</span>
      </Link>
    </div>
  )
}

/** Link único para navs secundarios: "Entrar" o "Mi espacio"/"Mi cuenta". */
export function NavAuthLink({ className }: { className?: string }) {
  const { user, creatorSlug, loading } = useSessionUser()
  if (!loading && user) {
    return (
      <Link href={creatorSlug ? '/dashboard' : '/directorio'} className={className} title={user.email ?? undefined}>
        {creatorSlug ? 'Mi espacio' : displayName(user)}
      </Link>
    )
  }
  return <Link href="/entrar" className={className}>Entrar</Link>
}

/** Aviso en /entrar y /registro cuando ya hay sesión: evita "registrarse" dos veces. */
export function AlreadySignedInNotice() {
  const { user, creatorSlug, loading } = useSessionUser()
  if (loading || !user) return null
  return (
    <div className="mb-8 border border-[#121212] px-5 py-4">
      <p className="font-sans text-[13px] text-[#121212]">
        Ya iniciaste sesión como <strong className="font-semibold break-all">{user.email}</strong>.
      </p>
      <div className="mt-3 flex items-center gap-4">
        <Link
          href={creatorSlug ? '/dashboard' : '/'}
          className="bg-[#121212] text-white font-sans text-[12px] font-medium px-4 py-2 hover:bg-[#333] transition-colors"
        >
          {creatorSlug ? 'Ir a mi espacio →' : 'Continuar →'}
        </Link>
        <SignOutButton className="font-sans text-[12px] text-[#666] underline hover:text-[#121212]">
          Usar otra cuenta
        </SignOutButton>
      </div>
    </div>
  )
}

/** Botones secundarios del hero: registro / abrir espacio, o "Tu perfil" / "Mi espacio" con sesión. */
export function HeroAuthButtons() {
  const { user, creatorSlug, loading } = useSessionUser()
  const outlineCls =
    'flex items-center gap-2.5 border border-[#DEDEDE] bg-white px-5 py-3 text-[12px] font-semibold text-[#111] hover:border-[#B31C1C] hover:text-[#B31C1C] transition-all'

  if (!loading && user) {
    return (
      <>
        <Link href={profileHref(creatorSlug)} className={outlineCls}>Tu perfil</Link>
        <Link href={creatorSlug ? '/dashboard' : '/abrir'} className={outlineCls}>
          {creatorSlug ? 'Mi espacio →' : 'Abre tu espacio →'}
        </Link>
      </>
    )
  }

  return (
    <>
      <Link href="/registro" className={outlineCls}>
        <GoogleIcon />
        Continuar con Google
      </Link>
      <Link href="/abrir" className={outlineCls}>Abre tu espacio gratis →</Link>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
