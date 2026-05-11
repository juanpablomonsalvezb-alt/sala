import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Observatorio · Newsletters profesionales en español | Nebbuler',
  description:
    'Análisis comparativos del mercado de newsletters profesionales de pago en Chile y Latinoamérica. Substack, alternativas, creadores verificados.',
  alternates: { canonical: 'https://nebbuler.com/observatorio' },
  openGraph: {
    title: 'Observatorio · Newsletters profesionales en español | Nebbuler',
    description:
      'Análisis comparativos del mercado de newsletters profesionales de pago en Chile y Latinoamérica.',
    url: 'https://nebbuler.com/observatorio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Observatorio · Nebbuler',
    description:
      'Análisis del ecosistema de newsletters profesionales en español y LATAM.',
  },
}

const pillars = [
  {
    href: '/observatorio/substack-en-espanol-2026',
    title: 'Substack en Español 2026',
    subtitle: 'Alternativas, plataformas y el auge del newsletter profesional',
    description:
      'Qué es Substack, por qué no escala para LATAM y cuáles son las mejores alternativas en español con pagos locales en CLP, ARS, COP y MXN sin conversión de divisa.',
  },
  {
    href: '/observatorio/economistas-chile-2026',
    title: 'Economistas Chilenos con Newsletter en 2026',
    subtitle: 'Ex Banco Central, PhDs y analistas independientes que cobran por su análisis',
    description:
      'El fenómeno de los economistas chilenos que dejaron los think-tanks institucionales para publicar análisis de política monetaria, inflación y ciclo económico directamente a sus suscriptores.',
  },
  {
    href: '/observatorio/derecho-tributario-latam',
    title: 'Newsletters de Derecho Tributario en Chile y LATAM',
    subtitle: 'Abogados tributarios que monetizan su expertise de forma independiente',
    description:
      'Abogados tributarios con LLM internacional que publican análisis sobre el SII, reforma fiscal y tributación internacional para contadores, CFOs y directores financieros de la región.',
  },
  {
    href: '/observatorio/think-tanks-individuales-chile',
    title: 'Think Tanks Individuales en Chile',
    subtitle: 'El auge de los analistas independientes que cobran por su análisis',
    description:
      'Una generación de profesionales con credenciales de primer nivel rompe con las instituciones y construye audiencias directas. Modelo económico, casos reales y diferencias con los think-tanks tradicionales.',
  },
  {
    href: '/observatorio/macroeconomia-latam',
    title: 'Macroeconomía en Latinoamérica 2026',
    subtitle: 'Dónde leer análisis independientes sobre Chile, Argentina, Colombia y México',
    description:
      'Estado macroeconómico de los principales países de la región y por qué los analistas independientes en plataformas de suscripción superan en profundidad a los medios masivos.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            Análisis del ecosistema de newsletters profesionales en español y LATAM. Datos de mercado, comparativas de plataformas y perfiles de creadores verificados.
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
            Nebbuler es la plataforma de newsletters de pago para economistas, abogados, médicos y arquitectos de Chile y LATAM. Sin algoritmos. Sin comisión.
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
