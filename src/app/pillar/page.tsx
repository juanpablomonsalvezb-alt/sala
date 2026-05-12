import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'

export const metadata: Metadata = {
  title: 'Pillar Pages — Guías de Referencia | Nebbuler',
  description: 'Guías completas y análisis profundos sobre los temas más relevantes en 18 mercados latinoamericanos.',
  alternates: { canonical: 'https://nebbuler.com/pillar' },
  openGraph: {
    title: 'Pillar Pages — Guías de Referencia | Nebbuler',
    description: 'Guías completas sobre temas de economía, finanzas, derecho y medicina.',
    type: 'website',
    url: 'https://nebbuler.com/pillar',
  },
}

export default function PillarHubPage() {
  const disciplines = Array.from(new Set(TOPICS.map(t => t.discipline)))

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
            <Link
              href="/directorio"
              className="font-sans text-[12px] font-medium text-[#666] hover:text-[#121212] transition-colors"
            >
              Ver directorio →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <nav className="font-sans text-[12px] text-[#999] mb-8">
          <Link href="/" className="hover:text-[#121212]">Inicio</Link>
          <span className="mx-2">·</span>
          <span className="text-[#121212]">Pillar Pages</span>
        </nav>

        {/* Header */}
        <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            Guías de Referencia
          </p>
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
            Pillar Pages
          </h1>
          <p className="font-sans text-[17px] text-[#555] leading-relaxed">
            Guías completas que consolidan el conocimiento más profundo sobre cada tema. Análisis integral disponible en {MARKETS.length} mercados latinoamericanos.
          </p>
        </div>

        {/* Topics by discipline */}
        {disciplines.map(discipline => (
          <section key={discipline} className="mb-12 pb-12 border-b border-[#DEDEDE]">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
              {discipline.charAt(0).toUpperCase() + discipline.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOPICS.filter(t => t.discipline === discipline).map(topic => (
                <Link
                  key={topic.slug}
                  href={`/pillar/${topic.slug}`}
                  className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2">
                    {topic.label}
                  </p>
                  <p className="font-sans text-[13px] text-[#666] line-clamp-2">
                    {topic.description}
                  </p>
                  <p className="font-sans text-[11px] text-[#999] mt-3">
                    {MARKETS.length} mercados
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 text-center">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Profundiza más
          </p>
          <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
            Consulta con expertos verificados
          </h2>
          <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed">
            Cada tema tiene análisis detallado por especialistas en múltiples mercados.
          </p>
          <Link
            href="/directorio"
            className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
          >
            Ver expertos →
          </Link>
        </div>
      </main>
    </div>
  )
}
