import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'

export const metadata: Metadata = {
  title: 'Herramientas gratis para profesionales independientes — Nebbuler',
  description: 'Calculadoras y generadores gratuitos para profesionales independientes en América Latina. Calcula tu tarifa por hora, genera contratos de servicio y más.',
  keywords: [
    'calculadora tarifa hora consultor latam',
    'generador contrato freelancer latam',
    'cuanto cobrar por hora profesional independiente',
    'contrato servicios profesionales gratis',
    'herramientas profesional independiente latinoamerica',
    'calcular honorarios consultor',
  ],
  alternates: { canonical: 'https://nebbuler.com/herramientas' },
  openGraph: {
    title: 'Herramientas gratis para profesionales independientes',
    description: 'Calcula tu tarifa, genera contratos y gestiona tu negocio independiente en LATAM.',
    url: 'https://nebbuler.com/herramientas',
    type: 'website',
  },
}

const TOOLS = [
  {
    slug: 'tarifa-hora',
    title: 'Calculadora de tarifa por hora',
    description: 'Ingresa tus ingresos objetivo, gastos y horas disponibles. La calculadora te dice exactamente cuánto cobrar por hora de trabajo.',
    cta: 'Calcular mi tarifa',
    icon: '⏱',
    keywords: ['consultor', 'coach', 'psicólogo', 'nutricionista', 'abogado'],
  },
  {
    slug: 'contrato-simple',
    title: 'Generador de contrato de servicios',
    description: 'Genera un contrato de prestación de servicios profesionales listo para usar, adaptado a tu país y tipo de trabajo.',
    cta: 'Generar mi contrato',
    icon: '📄',
    keywords: ['contrato', 'acuerdo', 'servicios', 'honorarios'],
  },
]

export default function HerramientasPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-14">

          {/* Breadcrumb */}
          <nav className="text-xs text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            {' / '}
            <span className="text-[#555]">Herramientas</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-3">
              Recursos gratuitos
            </p>
            <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-bold text-[#121212] leading-tight mb-4">
              Herramientas para el profesional independiente
            </h1>
            <p className="font-sans text-[16px] text-[#555] leading-relaxed max-w-xl">
              Calculadoras y generadores gratuitos para que cobres bien, trabajes con contratos claros y gestiones tu negocio independiente en América Latina.
            </p>
          </div>

          {/* Tools grid */}
          <div className="space-y-4 mb-16">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/herramientas/${tool.slug}`}
                className="block border border-[#DEDEDE] bg-white p-6 hover:border-[#C41C1C] transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{tool.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2 leading-snug">
                      {tool.title}
                    </h2>
                    <p className="font-sans text-[14px] text-[#666] leading-relaxed mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap mb-2">
                      {tool.keywords.map((kw) => (
                        <span key={kw} className="font-sans text-[10px] uppercase tracking-[0.08em] text-[#999] border border-[#EBEBEB] px-2 py-0.5">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <span className="font-sans text-[13px] font-semibold text-[#C41C1C]">
                      {tool.cta} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Nebbuler */}
          <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-[15px] font-bold text-[#121212] mb-0.5">
                ¿Listo para cobrar por tu conocimiento?
              </p>
              <p className="font-sans text-[12px] text-[#666]">
                Abre tu sala en Nebbuler y empieza a recibir pagos en tu moneda local. 0% comisión.
              </p>
            </div>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] text-white font-sans text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              Abre tu sala →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
