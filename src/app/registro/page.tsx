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
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})
type FormValues = z.infer<typeof schema>
type Path = 'reader' | 'creator' | null

function EmailFallbackForm({ path, nextDest, onSuccess }: { path: Path; nextDest: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setLoading(true)
    setAuthError(null)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextDest)}`
    const { error } = await supabase.auth.signUp({
      email: data.email, password: data.password,
      options: { data: { full_name: data.name }, emailRedirectTo: redirectTo },
    })
    if (error) { setAuthError(error.message); setLoading(false); return }
    const { data: { session } } = await supabase.auth.getSession()
    if (session) { window.location.href = nextDest }
    else onSuccess()
    void path // suprimir unused
  }

  return (
    <div className="mt-6">
      <hr className="border-[#DEDEDE] mb-6" />
      {authError && <div className="mb-4 border-l-2 border-[#C41C1C] pl-3 py-1"><p className="font-sans text-[13px] text-[#C41C1C]">{authError}</p></div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {([['name','Nombre completo','text','Tu nombre'],['email','Email','email','tu@email.com'],['password','Contraseña','password','Mínimo 8 caracteres']] as const).map(([field, label, type, placeholder]) => (
          <div key={field} className="flex flex-col gap-1.5">
            <label htmlFor={field} className="font-sans text-[12px] font-medium text-[#121212] uppercase tracking-wide">{label}</label>
            <input id={field} type={type} placeholder={placeholder} {...register(field)}
              className="w-full border-b border-[#DEDEDE] px-0 py-2.5 font-sans text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white focus:outline-none focus:border-[#121212]" />
            {errors[field] && <p className="font-sans text-[12px] text-[#C41C1C]">{errors[field]?.message}</p>}
          </div>
        ))}
        <button type="submit" disabled={loading}
          className="w-full bg-[#121212] text-white font-sans text-[13px] font-medium py-3.5 hover:bg-[#333] transition-colors mt-1 disabled:opacity-50">
          {loading ? 'Creando cuenta…' : path === 'creator' ? 'Crear mi cuenta →' : 'Crear cuenta →'}
        </button>
      </form>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense fallback={null}>
      <RegistroInner />
    </Suspense>
  )
}

function RegistroInner() {
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')

  const [path, setPath] = useState<Path>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showEmailFallback, setShowEmailFallback] = useState(false)
  const [success, setSuccess] = useState(false)

  // Destinos por tipo de usuario — respetan el `next` explícito si viene del paywall
  const creatorDest = safeNext(nextParam, '/abrir')
  const readerDest = safeNext(nextParam, '/directorio')

  async function handleLinkedIn() {
    setLinkedinLoading(true); setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(creatorDest)}` },
    })
    if (error) { setAuthError(error.message); setLinkedinLoading(false) }
  }

  async function handleGoogle() {
    setGoogleLoading(true); setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(readerDest)}` },
    })
    if (error) { setAuthError(error.message); setGoogleLoading(false) }
  }

  function reset() { setPath(null); setAuthError(null); setShowEmailFallback(false) }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="h-[3px] bg-[#C41C1C] w-full" />

      <header className="pt-10 pb-0 text-center px-6">
        <Link href="/" className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none inline-block" style={{ letterSpacing: '-0.01em' }}>
          NEBBULER
        </Link>
        <hr className="mt-5 border-t border-[#121212]" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-6 py-14">
        <div className="w-full max-w-[480px]">

          <div className="mb-10 text-center">
            <h1 className="font-serif text-[#121212] leading-tight" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Únete a Nebbuler
            </h1>
          </div>

          {/* ── Selector ── */}
          {path === null && (
            <div className="flex flex-col gap-4">
              <button type="button" onClick={() => setPath('reader')}
                className="group w-full border border-[#DEDEDE] hover:border-[#121212] bg-white text-left px-7 py-7 transition-colors">
                <span className="font-sans text-[11px] font-medium text-[#666666] uppercase tracking-widest mb-2 inline-block">LECTOR</span>
                <p className="font-serif text-[20px] text-[#121212] mb-3 leading-tight" style={{ fontWeight: 700 }}>Soy lector</p>
                <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-5">Accede al conocimiento de los mejores profesionales</p>
                <span className="font-sans text-[12px] font-medium text-[#121212] group-hover:underline underline-offset-2">Registrarme como lector →</span>
              </button>

              <button type="button" onClick={() => setPath('creator')}
                className="group w-full border border-[#DEDEDE] hover:border-[#121212] bg-white text-left px-7 py-7 transition-colors">
                <span className="font-sans text-[11px] font-medium text-[#666666] uppercase tracking-widest mb-2 inline-block">CREADOR</span>
                <p className="font-serif text-[20px] text-[#121212] mb-3 leading-tight" style={{ fontWeight: 700 }}>Soy creador</p>
                <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-5">Abre tu sala en Nebbuler y cobra por lo que sabes</p>
                <span className="font-sans text-[12px] font-medium text-[#C41C1C] group-hover:underline underline-offset-2">Empezar en Nebbuler →</span>
              </button>
            </div>
          )}

          {/* ── CREADOR — LinkedIn ── */}
          {path === 'creator' && !success && (
            <div>
              <button type="button" onClick={reset} className="font-sans text-[12px] text-[#666666] hover:text-[#121212] mb-8 inline-flex items-center gap-1 transition-colors">
                ← Volver
              </button>

              <div className="mb-7 pl-4 border-l-[3px] border-[#C41C1C]">
                <p className="font-sans text-[13px] text-[#666666] leading-relaxed">
                  En Nebbuler los lectores saben exactamente con quién están hablando. Por eso los creadores se verifican con LinkedIn.
                </p>
              </div>

              {authError && <div className="mb-5 border-l-2 border-[#C41C1C] pl-3 py-1"><p className="font-sans text-[13px] text-[#C41C1C]">{authError}</p></div>}

              <button type="button" onClick={handleLinkedIn} disabled={linkedinLoading}
                className="w-full bg-[#0A66C2] text-white font-sans text-[13px] font-semibold py-4 hover:bg-[#004182] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50">
                <LinkedInIcon />
                {linkedinLoading ? 'Redirigiendo…' : 'Continuar con LinkedIn'}
              </button>

              {!showEmailFallback && (
                <button type="button" onClick={() => setShowEmailFallback(true)}
                  className="w-full mt-4 font-sans text-[11px] text-[#AAAAAA] hover:text-[#666] transition-colors text-center">
                  ¿Problemas con LinkedIn? Registrarte con email
                </button>
              )}
              {showEmailFallback && <EmailFallbackForm path="creator" nextDest={creatorDest} onSuccess={() => setSuccess(true)} />}
            </div>
          )}

          {/* ── LECTOR — Google ── */}
          {path === 'reader' && !success && (
            <div>
              <button type="button" onClick={reset} className="font-sans text-[12px] text-[#666666] hover:text-[#121212] mb-8 inline-flex items-center gap-1 transition-colors">
                ← Volver
              </button>

              {authError && <div className="mb-5 border-l-2 border-[#C41C1C] pl-3 py-1"><p className="font-sans text-[13px] text-[#C41C1C]">{authError}</p></div>}

              <button type="button" onClick={handleGoogle} disabled={googleLoading}
                className="w-full border border-[#DEDEDE] bg-white text-[#121212] font-sans text-[13px] font-medium py-4 hover:border-[#121212] hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50">
                <GoogleIcon />
                {googleLoading ? 'Redirigiendo…' : 'Continuar con Google'}
              </button>

              {!showEmailFallback && (
                <button type="button" onClick={() => setShowEmailFallback(true)}
                  className="w-full mt-4 font-sans text-[11px] text-[#AAAAAA] hover:text-[#666] transition-colors text-center">
                  ¿Problemas? Registrarte con email
                </button>
              )}
              {showEmailFallback && <EmailFallbackForm path="reader" nextDest={readerDest} onSuccess={() => setSuccess(true)} />}
            </div>
          )}

          {/* ── Éxito ── */}
          {success && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border border-[#121212] flex items-center justify-center mx-auto mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-serif text-[#121212] mb-3 leading-tight" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Revisa tu email</h2>
              <p className="font-sans text-[14px] text-[#666666] leading-relaxed">Te enviamos un enlace de confirmación.</p>
            </div>
          )}

          {!success && (
            <p className="font-sans text-[12px] text-[#666666] text-center mt-8">
              ¿Ya tienes cuenta?{' '}
              <Link
                href={nextParam ? `/entrar?next=${encodeURIComponent(nextParam)}` : '/entrar'}
                className="text-[#121212] font-medium hover:underline underline-offset-2"
              >Entra</Link>
            </p>
          )}
        </div>
      </main>

      <footer className="py-6 text-center border-t border-[#DEDEDE]">
        <p className="font-sans text-[11px] text-[#666666]">Nebbuler · hello@nebbuler.com</p>
      </footer>
    </div>
  )
}
