import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'
import { creators } from '@/data/creators'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

export async function generateStaticParams() {
  return TOPICS.flatMap(topic =>
    MARKETS.map(market => ({ tema: topic.slug, pais: market.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tema: string; pais: string }>
}): Promise<Metadata> {
  const { tema, pais } = await params
  const topic = TOPICS.find(t => t.slug === tema)
  const market = MARKETS.find(m => m.slug === pais)
  if (!topic || !market) return {}

  const title = `${topic.label} en ${market.label} — Análisis de expertos`
  return {
    title: `${title} | Nebbuler`,
    description: `Análisis independiente sobre ${topic.label.toLowerCase()} en ${market.label}. ${topic.description}. Publicaciones de expertos verificados en Nebbuler.`,
    alternates: { canonical: `https://nebbuler.com/analisis/${tema}/${pais}` },
    openGraph: {
      title: `${title} | Nebbuler`,
      description: `Análisis independiente sobre ${topic.label.toLowerCase()} en ${market.label}.`,
      type: 'website',
      url: `https://nebbuler.com/analisis/${tema}/${pais}`,
    },
  }
}

export default async function AnalisisPaisPage({
  params,
}: {
  params: Promise<{ tema: string; pais: string }>
}) {
  const { tema, pais } = await params
  const topic = TOPICS.find(t => t.slug === tema)
  const market = MARKETS.find(m => m.slug === pais)
  if (!topic || !market) notFound()

  // Creadores relacionados con esta disciplina
  const related = creators.filter(c => c.discipline === topic.discipline).slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic.label} en ${market.label}`,
    description: `Análisis independiente sobre ${topic.label.toLowerCase()} en ${market.label}.`,
    url: `https://nebbuler.com/analisis/${tema}/${pais}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `Expertos en ${topic.label} en ${market.label}`,
      itemListElement: related.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: `https://nebbuler.com/${c.slug}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
        { '@type': 'ListItem', position: 2, name: 'Análisis', item: 'https://nebbuler.com/analisis' },
        { '@type': 'ListItem', position: 3, name: topic.label, item: `https://nebbuler.com/analisis/${tema}` },
        { '@type': 'ListItem', position: 4, name: market.label, item: `https://nebbuler.com/analisis/${tema}/${pais}` },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
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
          {/* Breadcrumb */}
          <nav className="font-sans text-[12px] text-[#999] mb-8 flex flex-wrap gap-1 items-center">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span>›</span>
            <Link href="/analisis" className="hover:text-[#121212]">Análisis</Link>
            <span>›</span>
            <Link href={`/analisis/${tema}`} className="hover:text-[#121212]">{topic.label}</Link>
            <span>›</span>
            <span className="text-[#121212]">{market.label}</span>
          </nav>

          {/* Hero */}
          <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {topic.discipline} · {market.flag} {market.label}
            </p>
            <h1 className="font-serif text-[2.8rem] font-bold text-[#121212] leading-[1.1] mb-5">
              {topic.label} en {market.label}
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed max-w-2xl">
              Análisis independiente y riguroso sobre {topic.description.toLowerCase()} en {market.label}.
              Publicado por profesionales verificados en Nebbuler.
            </p>
          </div>

          {/* Preguntas frecuentes */}
          {topic.questions.length > 0 && (
            <section className="mb-12">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Lo que los profesionales de {market.label} necesitan entender
              </h2>
              <div className="space-y-3">
                {topic.questions.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 border border-[#DEDEDE] hover:border-[#C41C1C] transition-colors group"
                  >
                    <span className="font-serif text-[#C41C1C] text-lg leading-none mt-0.5 flex-shrink-0">?</span>
                    <p className="font-sans text-[15px] text-[#333] group-hover:text-[#121212] transition-colors">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Expertos */}
          {related.length > 0 && (
            <section className="mb-12">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Expertos en {topic.label} en Nebbuler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map(c => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] transition-colors group"
                  >
                    <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999] mb-1">
                      {c.specialty}
                    </p>
                    <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2">
                      {c.name}
                    </p>
                    <p className="font-sans text-[13px] text-[#666] leading-snug line-clamp-2">{c.bio}</p>
                    <p className="font-sans text-[12px] text-[#C41C1C] font-semibold mt-3">Leer análisis →</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Otros mercados */}
          <section className="mb-12">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              {topic.label} en otros países
            </h2>
            <div className="flex flex-wrap gap-2">
              {MARKETS.filter(m => m.slug !== pais).map(m => (
                <Link
                  key={m.slug}
                  href={`/analisis/${tema}/${m.slug}`}
                  className="font-sans text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#666] hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                >
                  {m.flag} {m.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Otros temas */}
          <section className="mb-12 pt-8 border-t border-[#DEDEDE]">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Más análisis para {market.label}
            </h2>
            <div className="flex flex-wrap gap-2">
              {TOPICS.filter(t => t.slug !== tema).map(t => (
                <Link
                  key={t.slug}
                  href={`/analisis/${t.slug}/${pais}`}
                  className="font-sans text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#666] hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-[#121212] text-white p-8">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Nebbuler
            </p>
            <h2 className="font-serif text-[1.8rem] font-bold mb-3">
              ¿Eres experto en {topic.label}?
            </h2>
            <p className="font-sans text-[15px] text-[#CCC] mb-6 leading-relaxed">
              Publica tu análisis en Nebbuler y cobra directamente de tus suscriptores. Sin comisión.
              Tarifa fija mensual.
            </p>
            <Link
              href="/abrir"
              className="inline-flex items-center font-sans text-[13px] font-semibold bg-[#C41C1C] text-white px-6 py-3 hover:bg-[#a01515] transition-colors"
            >
              Abrir mi sala →
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
