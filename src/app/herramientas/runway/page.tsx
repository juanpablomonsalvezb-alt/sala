import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import RunwayCalculator from './_client'
import { computeRunway, parseRunwayParams, runwayHeadline } from '@/lib/tools/runway'

type SP = Promise<Record<string, string | string[] | undefined>>

const BASE = 'https://nebbuler.com/herramientas/runway'

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const input = parseRunwayParams(await searchParams)
  const hasData = input.cash > 0 && input.expenses > 0
  const result = computeRunway(input)
  const profitable = hasData && result.netBurn <= 0

  const og = new URLSearchParams({ t: 'Runway de mi startup' })
  if (hasData) {
    og.set('v', profitable ? 'Sostenible' : runwayHeadline(result))
    og.set('s', 'Calcula el runway de tu startup gratis en Nebbuler')
  } else {
    og.set('s', 'Calcula cuántos meses de caja le quedan a tu startup')
  }
  const image = `https://nebbuler.com/api/og/herramienta?${og.toString()}`

  return {
    title: 'Calculadora de runway y burn rate para startups — Nebbuler',
    description:
      'Calcula cuántos meses de caja le quedan a tu startup según tus gastos, ingresos y crecimiento. Gratis, sin registro.',
    alternates: { canonical: BASE },
    openGraph: {
      title: hasData
        ? `Mi runway: ${profitable ? 'sostenible' : runwayHeadline(result)}`
        : 'Calculadora de runway para startups',
      description: 'Calcula cuántos meses de caja le quedan a tu startup. Gratis en Nebbuler.',
      url: BASE,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [image] },
  }
}

export default async function RunwayPage({ searchParams }: { searchParams: SP }) {
  const initial = parseRunwayParams(await searchParams)

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
            <span className="text-[#555]">Runway</span>
          </nav>

          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-3">Calculadora gratuita</p>
            <h1 className="font-serif text-[2rem] md:text-[2.4rem] font-bold text-[#121212] leading-tight mb-4">
              ¿Cuántos meses de caja te quedan?
            </h1>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed">
              Para fundadores y equipos de startups. Ingresa tu caja, tus gastos e ingresos mensuales y el crecimiento que
              esperas. Calculamos tu burn neto y la fecha en que te quedarías sin caja.
            </p>
          </div>

          <div className="h-px bg-[#DEDEDE] mb-10" />

          <RunwayCalculator initial={initial} />

          <div className="h-px bg-[#DEDEDE] mt-12 mb-10" />

          <section className="mb-10">
            <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-4">¿Cómo se calcula?</h2>
            <div className="space-y-4 font-sans text-[14px] text-[#555] leading-relaxed">
              <p>
                Simulamos mes a mes: a tu caja le sumamos los ingresos del mes y le restamos los gastos. Si indicas
                crecimiento, los ingresos suben ese porcentaje cada mes. El runway es el último mes en que la caja sigue
                siendo positiva.
              </p>
              <p>
                El <strong className="text-[#121212]">burn neto</strong> es gastos menos ingresos. Si tus ingresos cubren tus
                gastos, no hay burn y el resultado es «sostenible».
              </p>
              <p>
                Es un modelo simple: no incluye impuestos, estacionalidad ni contrataciones futuras. Úsalo como punto de
                partida y actualízalo cada mes.
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
              href="/herramientas/unit-economics"
              className="block border border-[#DEDEDE] p-4 hover:border-[#C41C1C] transition-colors group"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] block mb-1">Siguiente herramienta</span>
              <span className="font-serif text-[15px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                Calculadora de LTV, CAC y payback →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
