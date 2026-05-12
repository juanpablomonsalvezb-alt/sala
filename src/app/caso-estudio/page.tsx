import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'

let caseStudies: Record<string, { slug: string; title: string; country: string; content: string; generatedAt: string }> = {}

try {
  const casesData = require('@/data/generated-content/case-studies.json')
  caseStudies = casesData
} catch (e) {
  caseStudies = {}
}

const CASE_SLUGS = Object.keys(caseStudies)

export const metadata: Metadata = {
  title: 'Casos de estudio — Nebbuler',
  description: 'Historias reales de profesionales y empresas en Latinoamérica. Aprende cómo resuelven desafíos de economía, finanzas, derecho y negocio.',
  alternates: { canonical: 'https://nebbuler.com/caso-estudio' },
}

export default function CaseStudyIndexPage() {
  // Group by country
  const byCountry: Record<string, typeof caseStudies[string][]> = {}
  CASE_SLUGS.forEach(slug => {
    const study = caseStudies[slug]
    if (!byCountry[study.country]) byCountry[study.country] = []
    byCountry[study.country].push(study)
  })

  const sortedCountries = Object.keys(byCountry).sort()

  return (
    <div className="min-h-screen bg-white">
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
            NEBBULER
          </Link>
          <Link
            href="/abrir"
            className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
          >
            Abrir mi sala →
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <nav className="font-sans text-[12px] text-[#999] mb-8">
          <Link href="/" className="hover:text-[#121212]">Inicio</Link>
          <span className="mx-2">·</span>
          <span className="text-[#121212]">Casos de estudio</span>
        </nav>

        <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            Casos de estudio
          </p>
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
            Historias reales de Latinoamérica
          </h1>
          <p className="font-sans text-[17px] text-[#555] leading-relaxed">
            Aprende de casos reales: cómo empresas y profesionales resuelven desafíos en economía, finanzas, derecho y emprendimiento.
          </p>
        </div>

        {/* Cases by country */}
        {sortedCountries.map(country => (
          <section key={country} className="mb-12">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6 pb-2 border-b border-[#DEDEDE]">
              {country}
            </h2>
            <div className="space-y-3">
              {byCountry[country]!.map(study => (
                <Link
                  key={study.slug}
                  href={`/caso-estudio/${study.slug}`}
                  className="block border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                    {study.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Featured analyses */}
        <section className="mt-12 pt-12 border-t border-[#DEDEDE] mb-12">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Análisis del mercado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOPICS.slice(0, 3).map(topic => (
              <Link
                key={topic.slug}
                href={`/analisis/${topic.slug}/${MARKETS[0]?.slug || 'chile'}`}
                className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
              >
                <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                  {topic.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links to related content */}
        <section className="mt-12 pt-12 border-t border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Aprende más
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/analisis"
              className="border border-[#DEDEDE] p-6 text-center hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
            >
              <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] mb-2">
                Análisis
              </p>
              <p className="font-sans text-[13px] text-[#666]">Expertos analizan mercados</p>
            </Link>
            <Link
              href="/guia"
              className="border border-[#DEDEDE] p-6 text-center hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
            >
              <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] mb-2">
                Guías
              </p>
              <p className="font-sans text-[13px] text-[#666]">Paso a paso para emprender</p>
            </Link>
            <Link
              href="/faq"
              className="border border-[#DEDEDE] p-6 text-center hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
            >
              <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] mb-2">
                FAQ
              </p>
              <p className="font-sans text-[13px] text-[#666]">Respuestas a tus dudas</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
