import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Suscripción confirmada — Nebbuler',
  description: 'Tu suscripción fue procesada exitosamente.',
}

export default async function ExitoPage({
  params,
}: {
  params: Promise<{ creator: string }>
}) {
  const { creator: slug } = await params

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="font-serif text-[22px] font-bold text-[#121212] leading-none"
              style={{ letterSpacing: '-0.01em' }}
            >
              NEBBULER
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Checkmark */}
        <div className="w-16 h-16 bg-[#121212] flex items-center justify-center mb-8">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <hr className="nyt-rule w-full max-w-[280px] mb-8" />

        <h1
          className="font-serif text-[#121212] mb-5 leading-tight"
          style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Ya eres suscriptor
        </h1>

        <p className="font-sans text-[15px] text-[#666666] leading-relaxed max-w-[360px] mb-10">
          Tu suscripción fue confirmada. A partir de ahora tienes acceso completo a todos los
          artículos de este creador.
        </p>

        <Link
          href={`/${slug}`}
          className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 inline-block mb-5"
        >
          Leer publicaciones →
        </Link>

        <Link
          href="/explorar"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          Explorar otros creadores
        </Link>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-[#DEDEDE]">
        <p className="font-sans text-[11px] text-[#666666]">Nebbuler · hello@nebbuler.com</p>
      </footer>
    </div>
  )
}
