import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import UnitEconomicsCalculator from './_client'
import { computeUnitEconomics, parseUnitEconParams } from '@/lib/tools/unit-economics'

type SP = Promise<Record<string, string | string[] | undefined>>

const BASE = 'https://nebbuler.com/herramientas/unit-economics'

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const input = parseUnitEconParams(await searchParams)
  const r = computeUnitEconomics(input)

  const og = new URLSearchParams({ t: 'LTV : CAC de mi negocio' })
  if (r.ratio !== null) {
    og.set('v', `${r.ratio.toLocaleString('es-CL', { maximumFractionDigits: 1 })} : 1`)
    if (r.paybackMonths !== null) {
      og.set('s', `Payback del CAC: ${r.paybackMonths.toLocaleString('es-CL', { maximumFractionDigits: 1 })} meses`)
    }
  } else {
    og.set('s', 'Calcula tu LTV, CAC y payback gratis en Nebbuler')
  }
  const image = `https://nebbuler.com/api/og/herramienta?${og.toString()}`

  return {
    title: 'Calculadora de LTV, CAC y payback para startups — Nebbuler',
    description:
      'Calcula tu LTV, la relación LTV:CAC y el payback del costo de adquisición. Gratis, sin registro.',
    alternates: { canonical: BASE },
    openGraph: {
      title:
        r.ratio !== null
          ? `Mi LTV:CAC es ${r.ratio.toLocaleString('es-CL', { maximumFractionDigits: 1 })}:1`
          : 'Calculadora de LTV, CAC y payback',
      description: 'Calcula la economía por cliente de tu negocio. Gratis en Nebbuler.',
      url: BASE,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [image] },
  }
}

export default async function UnitEconomicsPage({ searchParams }: { searchParams: SP }) {
  const initial = parseUnitEconParams(await searchParams)

  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <nav className="text-xs text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            {' / '}
            <Link href="/herramientas" className="hover:text-[#121212]">Herramientas</Link>
            {' / '}
            <span className="text-[#555]">LTV, CAC y payback</span>
          </nav>

          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-3">Calculadora gratuita</p>
            <h1 className="font-serif text-[2rem] md:text-[2.4rem] font-bold text-[#121212] leading-tight mb-4">
              ¿Vale la pena lo que gastas en conseguir clientes?
            </h1>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed">
              Calcula el LTV de tus clientes, cuántos meses tardas en recuperar el CAC y si la relación LTV:CAC sostiene tu
              crecimiento. Sirve para startups SaaS, newsletters de pago, servicios y cualquier negocio con suscripción.
            </p>
          </div>

          <div className="h-px bg-[#DEDEDE] mb-10" />

          <UnitEconomicsCalculator initial={initial} />

          <div className="h-px bg-[#DEDEDE] mt-12 mb-10" />

          <section className="mb-10">
            <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-4">¿Cómo se calcula?</h2>
            <div className="space-y-4 font-sans text-[14px] text-[#555] leading-relaxed">
              <p>
                <strong className="text-[#121212]">Margen mensual por cliente</strong> = ingreso mensual × margen bruto.{' '}
                <strong className="text-[#121212]">Vida media</strong> = 1 ÷ churn mensual.{' '}
                <strong className="text-[#121212]">LTV</strong> = margen mensual × vida media.
              </p>
              <p>
                <strong className="text-[#121212]">Payback</strong> = CAC ÷ margen mensual: los meses que tardas en recuperar
                lo que gastaste en conseguir al cliente. <strong className="text-[#121212]">LTV:CAC</strong> = LTV ÷ CAC.
              </p>
              <p>
                Los umbrales (por ejemplo, 3:1) son reglas prácticas de uso común, no leyes. Tu contexto, tu caja y tu
                mercado pueden justificar otros números.
              </p>
            </div>
          </section>

          <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-[15px] font-bold text-[#121212] mb-0.5">Monetiza lo que sabes con Nebbuler</p>
              <p className="font-sans text-[12px] text-[#666]">
                Crea tu sala, publica análisis de pago y recibe suscripciones en tu moneda local. 0% comisión.
              </p>
            </div>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] text-white font-sans text-[12px] font-semibold uppercase tracking-[0.08em] hover:bg-[#C41C1C] transition-colors"
            >
              Abre tu sala →
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/herramientas/runway"
              className="block border border-[#DEDEDE] p-4 hover:border-[#C41C1C] transition-colors group"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] block mb-1">Otra herramienta</span>
              <span className="font-serif text-[15px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                Calculadora de runway y burn rate →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
