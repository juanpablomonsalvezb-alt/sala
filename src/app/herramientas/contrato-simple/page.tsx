import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import ContratoSimpleGenerator from './_client'

export const metadata: Metadata = {
  title: 'Generador de contrato de servicios profesionales gratis — Nebbuler',
  description: 'Genera un contrato de prestación de servicios profesionales en segundos. Gratis para consultores, coaches, psicólogos y profesionales independientes en LATAM.',
  keywords: [
    'contrato servicios profesionales gratis latam',
    'generador contrato consultor',
    'contrato prestacion servicios independiente',
    'contrato coach freelancer chile colombia mexico',
    'modelo contrato psicólogo independiente',
    'plantilla contrato servicios profesionales',
    'contrato honorarios profesionales',
    'formato contrato consultor independiente',
  ],
  alternates: { canonical: 'https://nebbuler.com/herramientas/contrato-simple' },
  openGraph: {
    title: 'Generador de contrato de servicios — Profesionales independientes',
    description: 'Genera tu contrato profesional en segundos. Gratis. Adaptado a tu país en América Latina.',
    url: 'https://nebbuler.com/herramientas/contrato-simple',
    type: 'website',
  },
}

export default function ContratoSimplePage() {
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
            <span className="text-[#555]">Contrato de servicios</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-3">
              Generador gratuito
            </p>
            <h1 className="font-serif text-[2rem] md:text-[2.4rem] font-bold text-[#121212] leading-tight mb-4">
              Genera tu contrato de servicios
            </h1>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed">
              Para psicólogos, coaches, consultores, diseñadores y cualquier profesional independiente en América Latina. Completa los datos y copia el texto listo para firmar.
            </p>
          </div>

          <div className="h-px bg-[#DEDEDE] mb-10" />

          {/* Generator */}
          <ContratoSimpleGenerator />

          <div className="h-px bg-[#DEDEDE] mt-12 mb-10" />

          {/* Por qué usar un contrato */}
          <section className="mb-10">
            <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-4">
              Por qué siempre debes trabajar con contrato
            </h2>
            <div className="space-y-3 font-sans text-[14px] text-[#555] leading-relaxed">
              <p>
                Un contrato claro protege a ambas partes: define qué se entrega, en qué plazo y a qué precio. Evita malentendidos que terminan en conflictos o en trabajo no pagado.
              </p>
              <p>
                Para profesionales independientes en LATAM, trabajar sin contrato es el error más común — y el más costoso. Un cliente puede pedirte más de lo acordado, retrasar pagos o simplemente desaparecer.
              </p>
              <p>
                Este generador crea un contrato básico. Para proyectos de alto valor o con implicancias legales importantes, complementa con asesoría de un abogado en tu país.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-[15px] font-bold text-[#121212] mb-0.5">
                Cobra online con Nebbuler
              </p>
              <p className="font-sans text-[12px] text-[#666]">
                Una vez firmado el contrato, recibe los pagos de tus clientes en tu moneda local. 0% comisión.
              </p>
            </div>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] text-white font-sans text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              Abre tu sala →
            </Link>
          </div>

          {/* Otra herramienta */}
          <div className="mt-8">
            <Link
              href="/herramientas/tarifa-hora"
              className="block border border-[#DEDEDE] p-4 hover:border-[#C41C1C] transition-colors group"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] block mb-1">Otra herramienta</span>
              <span className="font-serif text-[15px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                Calculadora de tarifa por hora →
              </span>
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
