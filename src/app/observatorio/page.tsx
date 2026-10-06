import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Observatorio · Newsletters profesionales en español | Nebbuler',
  description:
    'Análisis comparativos del mercado de newsletters profesionales de pago en América Latina. Substack, alternativas, creadores verificados.',
  alternates: { canonical: 'https://nebbuler.com/observatorio' },
  openGraph: {
    title: 'Observatorio · Newsletters profesionales en español | Nebbuler',
    description:
      'Análisis comparativos del mercado de newsletters profesionales de pago en América Latina.',
    url: 'https://nebbuler.com/observatorio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Observatorio · Nebbuler',
    description:
      'Análisis del ecosistema de newsletters profesionales en español y América Latina.',
  },
}

const pillars = [
  {
    href: '/observatorio/datos',
    title: 'Datos Económicos América Latina 2026',
    subtitle: 'Inflación, PIB per cápita, tipo de cambio y desempleo con visualizaciones',
    description:
      'Indicadores macroeconómicos curados de fuentes públicas: bancos centrales de la región, Banco Mundial y CEPAL. Gráficos interactivos del período 2022–2026 con análisis editorial.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Nebbuler',
      item: 'https://nebbuler.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Observatorio',
      item: 'https://nebbuler.com/observatorio',
    },
  ],
}

export default function ObservatorioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
            ÍNDICE
          </p>
          <h1 className="font-serif text-[36px] sm:text-[44px] font-bold text-[#121212] leading-tight mb-4">
            Observatorio Nebbuler
          </h1>
          <p className="font-sans text-[16px] text-[#555] leading-relaxed max-w-xl">
            Análisis del ecosistema de newsletters profesionales en español y América Latina. Datos de mercado, comparativas de plataformas y perfiles de creadores verificados.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5E5E5] mb-10" />

        {/* Pillar pages list */}
        <nav aria-label="Páginas del observatorio">
          <ol className="space-y-8">
            {pillars.map((pillar, i) => (
              <li key={pillar.href}>
                <Link
                  href={pillar.href}
                  className="group block"
                >
                  <div className="flex gap-4 items-start">
                    <span className="font-serif text-[13px] text-[#C41C1C] font-bold mt-1 tabular-nums w-4 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2 className="font-serif text-[19px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors leading-snug mb-1">
                        {pillar.title}
                      </h2>
                      <p className="font-sans text-[12px] font-semibold text-[#888] uppercase tracking-wider mb-2">
                        {pillar.subtitle}
                      </p>
                      <p className="font-sans text-[14px] text-[#555] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </Link>
                {i < pillars.length - 1 && (
                  <div className="h-px bg-[#F0F0F0] mt-8" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Bottom CTA */}
        <div className="mt-14 bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6">
          <p className="font-serif text-[17px] font-bold text-[#121212] mb-2">
            ¿Eres profesional con criterio que cobrar?
          </p>
          <p className="font-sans text-[14px] text-[#555] mb-4 leading-relaxed">
            Nebbuler es la plataforma de newsletters de pago para economistas, abogados, médicos y arquitectos de América Latina. Sin algoritmos. Sin comisión.
          </p>
          <Link
            href="/para-creadores"
            className="inline-block bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase"
          >
            Abrir mi newsletter →
          </Link>
        </div>
      </div>
    </>
  )
}
