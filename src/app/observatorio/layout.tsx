import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    template: '%s | Observatorio Nebbuler',
    default: 'Observatorio · Newsletters profesionales en español | Nebbuler',
  },
  description:
    'Análisis comparativos del mercado de newsletters profesionales de pago en América Latina. Substack, alternativas, creadores verificados.',
  alternates: { canonical: 'https://nebbuler.com/observatorio' },
  openGraph: {
    siteName: 'Nebbuler',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function ObservatorioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E5E5]">
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[20px] font-bold tracking-tight text-[#121212] hover:text-[#C41C1C] transition-colors"
          >
            NEBBULER
          </Link>
          <Link
            href="/observatorio"
            className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors flex items-center gap-1"
          >
            <span aria-hidden="true">←</span> Observatorio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-[15px] font-bold text-[#121212] hover:text-[#C41C1C] transition-colors"
          >
            NEBBULER
          </Link>
          <nav className="flex flex-wrap gap-4">
            <Link
              href="/directorio"
              className="font-sans text-[12px] text-[#666] hover:text-[#121212] transition-colors"
            >
              Directorio
            </Link>
            <Link
              href="/para-creadores"
              className="font-sans text-[12px] text-[#666] hover:text-[#121212] transition-colors"
            >
              Para creadores
            </Link>
            <Link
              href="/precios"
              className="font-sans text-[12px] text-[#666] hover:text-[#121212] transition-colors"
            >
              Precios
            </Link>
            <Link
              href="/observatorio"
              className="font-sans text-[12px] text-[#C41C1C] font-semibold"
            >
              Observatorio
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
