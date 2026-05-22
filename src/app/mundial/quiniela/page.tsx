import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'
import { QuinielaClient } from './_client'

export const revalidate = 3600

const TITLE = 'Quiniela Nebbuler Mundial 2026 · Predecí y compartí en 60 segundos'
const DESCRIPTION =
  'Quiniela interactiva del Mundial 2026: predecí campeón, semifinalistas, goleador y partidos clave. Compartí tu pronóstico en WhatsApp y desafiá a tu hinchada. Gratis, sin registro.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://nebbuler.com/mundial/quiniela' },
  openGraph: {
    title: 'Quiniela Nebbuler Mundial 2026',
    description: 'Predecí el Mundial y desafiá a tu hinchada. Gratis, sin registro.',
    url: 'https://nebbuler.com/mundial/quiniela',
    type: 'website',
    images: [{ url: '/api/og/mundial', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Quiniela Nebbuler Mundial 2026',
  description: DESCRIPTION,
  url: 'https://nebbuler.com/mundial/quiniela',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  inLanguage: 'es',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function QuinielaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD) }}
      />
      <div className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link href="/mundial" className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase">
                ← La Sombra
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <div className="mb-10">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Quiniela Nebbuler · Mundial 2026
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1] tracking-tight mb-4">
              Predecí el Mundial.<br />
              <span className="italic text-white/70">Desafiá a tu hinchada.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              5 preguntas, 60 segundos, sin registro. Compartí tu predicción en WhatsApp con tu
              hinchada y veamos quién la pega más.
            </p>
          </div>

          <QuinielaClient />

          <section className="mt-16 pt-12 border-t border-white/10">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              ¿Eres periodista o analista deportivo?
            </p>
            <h2 className="font-serif text-3xl mb-4">
              Convertí tus análisis en una sala de membresías
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl">
              El Programa La Sombra de Nebbuler te abre tu sala en 24h. 0% comisión hasta el 31
              de julio. Cobra en pesos a tu audiencia hispanohablante.
            </p>
            <Link
              href="/mundial"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
            >
              Ver Programa La Sombra →
            </Link>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-12 py-8 px-6">
          <div className="max-w-4xl mx-auto text-xs text-white/40">
            <p>© 2026 Nebbuler · No afiliado con FIFA ni con el Mundial 2026 oficial.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
