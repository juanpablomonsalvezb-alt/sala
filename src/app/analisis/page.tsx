import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'

export const metadata: Metadata = {
  title: 'Análisis de expertos por tema — Nebbuler',
  description: 'Análisis independiente sobre economía, derecho, finanzas, medicina y más. Publicado por profesionales verificados en Nebbuler para todos los mercados de América Latina.',
  alternates: { canonical: 'https://nebbuler.com/analisis' },
}

export default function AnalisisIndexPage() {
  const disciplinas = Array.from(new Set(TOPICS.map(t => t.discipline)))

  return (
    <div className="min-h-screen bg-white">
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <nav className="font-sans text-[12px] text-[#999] mb-8">
          <Link href="/" className="hover:text-[#121212]">Inicio</Link>
          <span className="mx-2">·</span>
          <span className="text-[#121212]">Análisis</span>
        </nav>

        <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            Nebbuler
          </p>
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
            Análisis de expertos
          </h1>
          <p className="font-sans text-[17px] text-[#555] leading-relaxed">
            Análisis independiente sobre los temas que más importan a profesionales y empresas de América Latina. Publicado por expertos verificados.
          </p>
        </div>

        {/* Temas por disciplina */}
        {disciplinas.map(disc => {
          const topicsInDisc = TOPICS.filter(t => t.discipline === disc)
          return (
            <section key={disc} className="mb-12">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6 pb-2 border-b border-[#DEDEDE]">
                {disc.replace('-', ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topicsInDisc.map(topic => (
                  <Link
                    key={topic.slug}
                    href={`/analisis/${topic.slug}`}
                    className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] transition-colors group"
                  >
                    <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2">
                      {topic.label}
                    </p>
                    <p className="font-sans text-[13px] text-[#666] leading-snug mb-3">{topic.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {MARKETS.slice(0, 4).map(m => (
                        <span key={m.slug} className="font-sans text-[10px] text-[#999] border border-[#ECECEC] px-2 py-0.5">
                          {m.flag} {m.label}
                        </span>
                      ))}
                      <span className="font-sans text-[10px] text-[#C41C1C] px-2 py-0.5">
                        +{MARKETS.length - 4} más
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* Grid de mercados */}
        <section className="mt-8 pt-8 border-t border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Análisis por país
          </h2>
          <div className="flex flex-wrap gap-2">
            {MARKETS.map(m => (
              <Link
                key={m.slug}
                href={`/analisis/${TOPICS[0].slug}/${m.slug}`}
                className="font-sans text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#666] hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
              >
                {m.flag} {m.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
