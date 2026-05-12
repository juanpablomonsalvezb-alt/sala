import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/data/seo-guides'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'

export const metadata: Metadata = {
  title: 'Guías para creadores — Nebbuler',
  description: 'Guías para profesionales que quieren monetizar su conocimiento publicando análisis de pago en Nebbuler. Economistas, abogados, médicos, analistas financieros.',
  alternates: { canonical: 'https://nebbuler.com/guia' },
}

export default function GuiasIndexPage() {
  const generalGuides = GUIDES.filter(g => g.profession === 'general')
  const professionalGuides = GUIDES.filter(g => g.profession !== 'general')

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
          <span className="text-[#121212]">Guías para creadores</span>
        </nav>

        <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            Nebbuler
          </p>
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
            Guías para creadores
          </h1>
          <p className="font-sans text-[17px] text-[#555] leading-relaxed">
            Todo lo que necesitas saber para monetizar tu conocimiento profesional publicando análisis de pago en Nebbuler.
          </p>
        </div>

        {professionalGuides.length > 0 && (
          <section className="mb-12">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
              Por profesión
            </h2>
            <div className="space-y-4">
              {professionalGuides.map(g => (
                <Link key={g.slug} href={`/guia/${g.slug}`} className="flex items-start gap-4 group border border-[#DEDEDE] p-5 hover:border-[#C41C1C] transition-colors">
                  <div className="flex-1">
                    <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-1">
                      {g.title}
                    </p>
                    <p className="font-sans text-[13px] text-[#666] leading-snug">{g.description}</p>
                  </div>
                  <span className="font-sans text-[#C41C1C] text-[13px] font-semibold flex-shrink-0 mt-0.5">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {generalGuides.length > 0 && (
          <section className="mb-12">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
              Guías generales
            </h2>
            <div className="space-y-4">
              {generalGuides.map(g => (
                <Link key={g.slug} href={`/guia/${g.slug}`} className="flex items-start gap-4 group border border-[#DEDEDE] p-5 hover:border-[#C41C1C] transition-colors">
                  <div className="flex-1">
                    <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-1">
                      {g.title}
                    </p>
                    <p className="font-sans text-[13px] text-[#666] leading-snug">{g.description}</p>
                  </div>
                  <span className="font-sans text-[#C41C1C] text-[13px] font-semibold flex-shrink-0 mt-0.5">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Relacionado: Análisis */}
        <section className="mt-12 pt-8 border-t border-[#DEDEDE] mb-12">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Profundiza con análisis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOPICS.slice(0, 3).map(topic => (
              <Link
                key={topic.slug}
                href={`/analisis/${topic.slug}/${MARKETS[0]?.slug || 'chile'}`}
                className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
              >
                <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                  {topic.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-8">
          <h2 className="font-serif text-[1.5rem] font-bold text-[#121212] mb-3">
            ¿Listo para empezar?
          </h2>
          <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed">
            Crea tu sala en Nebbuler hoy. Tarifa fija mensual, 0% de comisión.
          </p>
          <Link
            href="/abrir"
            className="inline-flex items-center font-sans text-[13px] font-semibold bg-[#121212] text-white px-6 py-3 hover:bg-[#C41C1C] transition-colors"
          >
            Abrir mi sala en Nebbuler →
          </Link>
        </div>
      </main>
    </div>
  )
}
