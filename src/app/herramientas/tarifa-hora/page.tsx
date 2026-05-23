import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import TarifaHoraCalculator from './_client'

export const metadata: Metadata = {
  title: 'Calculadora de tarifa por hora para profesionales independientes — Nebbuler',
  description: 'Calcula cuánto cobrar por hora como profesional independiente en LATAM. Ingresa tus ingresos objetivo y gastos fijos. Resultado instantáneo en pesos.',
  keywords: [
    'cuanto cobrar por hora profesional independiente',
    'calculadora tarifa hora consultor',
    'cuanto cobrar por sesion psicologo',
    'tarifa hora coach latam',
    'como calcular honorarios profesionales',
    'precio por hora consultor colombia',
    'cuanto cobrar por hora diseñador mexico',
    'tarifa hora abogado chile',
    'calculadora honorarios freelancer latam',
    'cuanto cobrar sesion nutricionista',
  ],
  alternates: { canonical: 'https://nebbuler.com/herramientas/tarifa-hora' },
  openGraph: {
    title: 'Calculadora de tarifa por hora — Profesionales independientes LATAM',
    description: 'Descubre cuánto cobrar por hora según tus ingresos objetivo, gastos y horas disponibles. Gratis.',
    url: 'https://nebbuler.com/herramientas/tarifa-hora',
    type: 'website',
  },
}

export default function TarifaHoraPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-12">

          {/* Breadcrumb */}
          <nav className="text-xs text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            {' / '}
            <Link href="/herramientas" className="hover:text-[#121212]">Herramientas</Link>
            {' / '}
            <span className="text-[#555]">Tarifa por hora</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-3">
              Calculadora gratuita
            </p>
            <h1 className="font-serif text-[2rem] md:text-[2.4rem] font-bold text-[#121212] leading-tight mb-4">
              ¿Cuánto cobrar por hora?
            </h1>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed">
              Para psicólogos, coaches, consultores, nutricionistas, abogados y cualquier profesional independiente en América Latina. Ingresa tus números y obtén tu tarifa real.
            </p>
          </div>

          <div className="h-px bg-[#DEDEDE] mb-10" />

          {/* Calculator */}
          <TarifaHoraCalculator />

          <div className="h-px bg-[#DEDEDE] mt-12 mb-10" />

          {/* Explicación metodológica */}
          <section className="mb-10">
            <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-4">
              ¿Cómo se calcula?
            </h2>
            <div className="space-y-4 font-sans text-[14px] text-[#555] leading-relaxed">
              <p>
                La fórmula base es simple: <strong className="text-[#121212]">(ingreso objetivo + gastos fijos) ÷ horas facturables al mes</strong>.
              </p>
              <p>
                El error más común de los profesionales independientes es calcular su tarifa sobre 8 horas diarias. En la práctica, solo 3 a 5 horas del día generan ingresos directos — el resto se va en administración, marketing, estudio y gestión.
              </p>
              <p>
                Por eso la calculadora usa horas <em>facturables</em> (las que cobras a clientes), no horas trabajadas totales.
              </p>
              <p>
                Una regla práctica: tu tarifa calculada es el <strong className="text-[#121212]">mínimo viable</strong>. Considera cobrar entre un 15% y 30% más para tener margen de negociación y absorber meses con menos clientes.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-[15px] font-bold text-[#121212] mb-0.5">
                Cobra tu tarifa con Nebbuler
              </p>
              <p className="font-sans text-[12px] text-[#666]">
                Crea tu sala, fija tus precios y recibe pagos en tu moneda local. 0% comisión.
              </p>
            </div>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] text-white font-sans text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              Abre tu sala →
            </Link>
          </div>

          {/* Otras herramientas */}
          <div className="mt-8">
            <Link
              href="/herramientas/contrato-simple"
              className="block border border-[#DEDEDE] p-4 hover:border-[#C41C1C] transition-colors group"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] block mb-1">Otra herramienta</span>
              <span className="font-serif text-[15px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                Generador de contrato de servicios →
              </span>
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
