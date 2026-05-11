'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

function safeNext(raw: string | null, fallback: string): string {
  if (!raw) return fallback
  if (!raw.startsWith('/')) return fallback
  if (raw.startsWith('//') || raw.startsWith('/\\')) return fallback
  return raw
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})
type FormValues = z.infer<typeof schema>

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <EntrarInner />
    </Suspense>
  )
}

function EntrarInner() {
  const searchParams = useSearchParams()
  // Soporta tanto ?next= como ?redirect= (legacy de algunos links)
  const nextParam = searchParams.get('next') ?? searchParams.get('redirect')

  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setLoading(true); setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    if (error) {
      setAuthError(error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos.' : error.message)
      setLoading(false); return
    }
    window.location.href = safeNext(nextParam, '/dashboard')
  }

  async function handleLinkedIn() {
    setLinkedinLoading(true); setAuthError(null)
    const supabase = createClient()
    const next = safeNext(nextParam, '/dashboard')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) { setAuthError(error.message); setLinkedinLoading(false) }
  }

  async function handleGoogle() {
    setGoogleLoading(true); setAuthError(null)
    const supabase = createClient()
    const next = safeNext(nextParam, '/directorio')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) { setAuthError(error.message); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-[3px] bg-[#C41C1C] w-full" />

      <header className="pt-10 pb-0 text-center px-6">
        <Link href="/" className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none inline-block" style={{ letterSpacing: '-0.01em' }}>
          NEBBULER
        </Link>
        <hr className="mt-5 border-t border-[#121212]" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px]">

          <div className="mb-8 text-center">
            <h1 className="font-serif text-[#121212] mb-2 leading-tight" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Bienvenido de vuelta
            </h1>
            <p className="font-sans text-[14px] text-[#666666]">Accede a tu cuenta en Nebbuler</p>
          </div>

          {authError && (
            <div className="mb-5 border-l-2 border-[#C41C1C] pl-3 py-1">
              <p className="font-sans text-[13px] text-[#C41C1C]">{authError}</p>
            </div>
          )}

          {/* OAuth */}
          <div className="flex flex-col gap-3 mb-7">
            <button type="button" onClick={handleLinkedIn} disabled={linkedinLoading}
              className="w-full bg-[#0A66C2] text-white font-sans text-[13px] font-semibold py-3.5 hover:bg-[#004182] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50">
              <LinkedInIcon />
              {linkedinLoading ? 'Redirigiendo…' : 'Entrar con LinkedIn'}
            </button>

            <button type="button" onClick={handleGoogle} disabled={googleLoading}
              className="w-full border border-[#DEDEDE] bg-white text-[#121212] font-sans text-[13px] font-medium py-3.5 hover:border-[#121212] hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50">
              <GoogleIcon />
              {googleLoading ? 'Redirigiendo…' : 'Entrar con Google'}
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <hr className="flex-1 border-t border-[#DEDEDE]" />
            <span className="font-sans text-[11px] font-medium text-[#666666] uppercase tracking-widest">O</span>
            <hr className="flex-1 border-t border-[#DEDEDE]" />
          </div>

          {/* Email fallback */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-sans text-[12px] font-medium text-[#121212] uppercase tracking-wide">Email</label>
              <input id="email" type="email" autoComplete="email" placeholder="tu@email.com" {...register('email')}
                className="w-full border-b border-[#DEDEDE] px-0 py-2.5 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white focus:outline-none focus:border-[#121212]" />
              {errors.email && <p className="font-sans text-[12px] text-[#C41C1C]">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-sans text-[12px] font-medium text-[#121212] uppercase tracking-wide">Contraseña</label>
              <input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')}
                className="w-full border-b border-[#DEDEDE] px-0 py-2.5 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white focus:outline-none focus:border-[#121212]" />
              {errors.password && <p className="font-sans text-[12px] text-[#C41C1C]">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end -mt-1">
              <Link href="/recuperar-contrasena" className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#121212] text-white font-sans text-[13px] font-medium py-3.5 hover:bg-[#333] transition-colors mt-1 disabled:opacity-50">
              {loading ? 'Entrando…' : 'Entrar →'}
            </button>
          </form>

          <p className="font-sans text-[12px] text-[#666666] text-center mt-7">
            ¿No tienes cuenta?{' '}
            <Link
              href={nextParam ? `/registro?next=${encodeURIComponent(nextParam)}` : '/registro'}
              className="text-[#121212] font-medium hover:underline underline-offset-2"
            >Regístrate</Link>
          </p>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-[#DEDEDE]">
        <p className="font-sans text-[11px] text-[#666666]">Nebbuler · hello@nebbuler.com</p>
      </footer>
    </div>
  )
}
