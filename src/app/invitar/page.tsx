'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ReferralStats {
  count: number
}

function generateRefCode(userId: string): string {
  return btoa(userId).slice(0, 12).replace(/\+/g, '-').replace(/\//g, '_')
}

export default function InvitarPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [refCode, setRefCode] = useState<string | null>(null)
  const [stats, setStats] = useState<ReferralStats>({ count: 0 })
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        // Import dinámico para evitar SSR issues
        const { createBrowserClient } = await import('@supabase/ssr')
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setUserId(user.id)
          const code = generateRefCode(user.id)
          setRefCode(code)

          // Fetch stats
          try {
            const res = await fetch(`/api/referrals/stats?userId=${encodeURIComponent(user.id)}`)
            if (res.ok) {
              const data: ReferralStats = await res.json()
              setStats(data)
            }
          } catch {
            // Stats no críticas — silenciar error
          }
        }
      } catch {
        // Supabase no disponible
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const shareUrl = refCode ? `https://nebbuler.com/?ref=${refCode}` : ''

  async function handleCopy() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const whatsappText = `Te comparto el directorio de profesionales que cobran por su análisis en Nebbuler. Economistas, abogados y más: ${shareUrl}`
  const twitterText = `Descubrí Nebbuler — el directorio de profesionales que cobran por su conocimiento. Economistas, abogados, médicos y más en ${shareUrl}`
  const linkedinText = shareUrl

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-[#121212]">
        <div className="h-[3px] w-full bg-[#C41C1C]" />
        <div className="max-w-2xl mx-auto px-6 py-24 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#121212]">
      {/* Barra roja top */}
      <div className="h-[3px] w-full bg-[#C41C1C]" />

      {/* Header */}
      <header className="border-b border-[#F0F0F0] px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif font-bold text-lg tracking-widest text-[#121212] hover:text-[#C41C1C] transition-colors"
          >
            NEBBULER
          </Link>
          <Link
            href="/directorio"
            className="font-sans text-xs uppercase tracking-wider text-[#666] hover:text-[#121212] transition-colors"
          >
            Directorio
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">

        {/* Título */}
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-[#C41C1C] mb-3">
            Programa de referidos
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#121212] mb-4 leading-tight">
            Invita a tu red
          </h1>
          <p className="font-sans text-base text-[#666] leading-relaxed">
            Comparte el directorio de profesionales de Nebbuler con colegas y conocidos que valoran el conocimiento serio.
          </p>
        </div>

        {/* Estado: no autenticado */}
        {!userId && (
          <div className="border border-[#E8E8E8] p-8 mb-12 text-center">
            <p className="font-sans text-xs uppercase tracking-widest text-[#999] mb-3">
              Para obtener tu link personal
            </p>
            <p className="font-serif text-xl text-[#121212] mb-6">
              Crea tu cuenta en Nebbuler
            </p>
            <Link
              href="/registro"
              className="inline-block bg-[#121212] text-white font-sans text-sm px-6 py-3 hover:bg-[#C41C1C] transition-colors"
            >
              Crear cuenta gratis
            </Link>
            <p className="font-sans text-xs text-[#999] mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link href="/entrar" className="underline underline-offset-4 hover:text-[#121212] transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        )}

        {/* Estado: autenticado */}
        {userId && refCode && (
          <>
            {/* Contador */}
            <div className="flex gap-6 mb-10">
              <div className="flex-1 bg-[#F7F7F7] border border-[#E8E8E8] p-6 text-center">
                <p className="font-serif text-4xl font-bold text-[#121212] mb-1">{stats.count}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[#999]">
                  Referidos traídos
                </p>
              </div>
              <div className="flex-1 bg-[#F7F7F7] border border-[#E8E8E8] p-6 text-center">
                <p className="font-serif text-4xl font-bold text-[#C41C1C] mb-1">{refCode}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-[#999]">
                  Tu código
                </p>
              </div>
            </div>

            {/* Link de referido */}
            <div className="mb-10">
              <p className="font-sans text-xs uppercase tracking-widest text-[#999] mb-3">
                Tu link personal
              </p>
              <div className="flex gap-2">
                <div className="flex-1 border border-[#E8E8E8] px-4 py-3 bg-[#F7F7F7] overflow-hidden">
                  <p className="font-sans text-sm text-[#444] truncate">{shareUrl}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-5 py-3 border border-[#121212] font-sans text-sm text-[#121212] hover:bg-[#121212] hover:text-white transition-colors whitespace-nowrap flex items-center gap-2"
                  aria-label="Copiar link de referido"
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      Copiar link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Compartir */}
            <div className="mb-14">
              <p className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4">
                Compartir directamente
              </p>
              <div className="flex flex-wrap gap-3">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#E8E8E8] px-4 py-2.5 font-sans text-sm text-[#121212] hover:border-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                  aria-label="Compartir por WhatsApp"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>

                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#E8E8E8] px-4 py-2.5 font-sans text-sm text-[#121212] hover:border-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                  aria-label="Compartir en X (Twitter)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Compartir en X
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#E8E8E8] px-4 py-2.5 font-sans text-sm text-[#121212] hover:border-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-colors"
                  aria-label="Compartir en LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </>
        )}

        {/* Separador */}
        <div className="w-full h-px bg-[#F0F0F0] my-14" />

        {/* Cómo funciona */}
        <section aria-labelledby="como-funciona-heading" className="mb-14">
          <h2
            id="como-funciona-heading"
            className="font-sans text-xs uppercase tracking-widest text-[#999] mb-8"
          >
            ¿Cómo funciona?
          </h2>
          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Obtén tu link',
                description: 'Al crear una cuenta, Nebbuler genera automáticamente un link único con tu código de referido.',
              },
              {
                step: '02',
                title: 'Compártelo',
                description: 'Envíalo por WhatsApp, X, LinkedIn o donde prefieras. Cada clic queda registrado con tu código.',
              },
              {
                step: '03',
                title: 'Tu referido accede',
                description: 'Cuando alguien entra a Nebbuler por tu link, queda vinculado a tu perfil de referido.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="w-10 h-10 border border-[#C41C1C] flex items-center justify-center flex-shrink-0">
                  <span className="font-sans text-xs text-[#C41C1C] font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#121212] mb-1">{item.title}</h3>
                  <p className="font-sans text-sm text-[#666] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Qué gana el referido */}
        <section aria-labelledby="beneficios-heading">
          <h2
            id="beneficios-heading"
            className="font-sans text-xs uppercase tracking-widest text-[#999] mb-6"
          >
            ¿Qué gana tu referido?
          </h2>
          <div className="border-l-2 border-[#C41C1C] pl-6">
            <p className="font-serif text-lg text-[#121212] mb-4">
              Acceso al directorio completo de profesionales
            </p>
            <ul className="space-y-3">
              {[
                'Ver los perfiles de todos los economistas, abogados, médicos y más',
                'Explorar los últimos análisis publicados antes de suscribirse',
                'Comparar precios y especializaciones para elegir bien',
                'Suscribirse directamente al profesional que más les aporta',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 font-sans text-sm text-[#444]">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#C41C1C] flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#F0F0F0] px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="font-sans text-sm text-[#999] hover:text-[#121212] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </footer>
    </main>
  )
}
