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
          href="/directorio"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          Explorar otros creadores
        </Link>

        {/* Loop viral — compartir + invitar creadores */}
        <div className="mt-16 w-full max-w-sm border border-[#DEDEDE] p-6 text-left">
          <p className="font-serif text-[15px] font-bold text-[#121212] mb-1">
            ¿También creás contenido?
          </p>
          <p className="font-sans text-[12px] text-[#666666] mb-4 leading-relaxed">
            Abrí tu sala en Nebbuler. 0% comisión los primeros 6 meses. Tus suscriptores pagan en tu moneda.
          </p>
          <Link
            href="/abrir"
            className="font-sans text-[12px] font-medium text-[#C41C1C] hover:underline block mb-4"
          >
            Empezar gratis →
          </Link>
          <hr className="border-[#EBEBEB] mb-4" />
          <p className="font-sans text-[11px] text-[#999] mb-3">Compartir con alguien que crea contenido:</p>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Acabo de suscribirme a una newsletter en Nebbuler — la plataforma de membresías para creadores LATAM con 0% comisión. Te puede interesar: https://nebbuler.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-sans text-[11px] font-medium py-2 border border-[#DEDEDE] text-[#121212] hover:border-[#121212] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nebbuler.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-sans text-[11px] font-medium py-2 border border-[#DEDEDE] text-[#121212] hover:border-[#121212] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Acabo de unirme a una sala en @nebbuler — newsletters de pago para profesionales LATAM. 0% comisión los primeros 6 meses. nebbuler.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-sans text-[11px] font-medium py-2 border border-[#DEDEDE] text-[#121212] hover:border-[#121212] transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-[#DEDEDE]">
        <p className="font-sans text-[11px] text-[#666666]">Nebbuler · hello@nebbuler.com</p>
      </footer>
    </div>
  )
}
