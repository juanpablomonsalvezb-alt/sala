import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suscripción Confirmada — Construyendo Nebbuler',
  robots: 'noindex',
}

export default function ExitoPage() {
  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
            <Link
              href="/directorio"
              className="font-sans text-[12px] font-medium text-[#666] hover:text-[#121212] transition-colors"
            >
              Ver directorio →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#C41C1C] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="font-serif text-[28px] font-bold text-[#121212] mb-3">
            ¡Suscripción Confirmada!
          </h1>

          <p className="font-sans text-[15px] text-[#666] mb-6 leading-relaxed">
            Bienvenido a Construyendo Nebbuler. Te enviaremos semanalmente insights sobre cómo se construye la plataforma.
          </p>

          <p className="font-sans text-[13px] text-[#999] mb-8">
            Revisa tu email (incluyendo spam) para confirmar la suscripción.
          </p>

          <Link
            href="/"
            className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
          >
            Volver a Nebbuler →
          </Link>
        </div>
      </main>
    </div>
  )
}
