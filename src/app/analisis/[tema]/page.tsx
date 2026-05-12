import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

export async function generateStaticParams() {
  return TOPICS.map(t => ({ tema: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tema: string }>
}): Promise<Metadata> {
  const { tema } = await params
  const topic = TOPICS.find(t => t.slug === tema)
  if (!topic) return {}

  return {
    title: `${topic.label} en América Latina — Análisis de expertos | Nebbuler`,
    description: `${topic.description}. Análisis de expertos verificados en Nebbuler para Chile, México, Colombia, Argentina y toda América Latina.`,
    alternates: { canonical: `https://nebbuler.com/analisis/${tema}` },
  }
}

export default async function AnalisisTemaPage({
  params,
}: {
  params: Promise<{ tema: string }>
}) {
  const { tema } = await params
  const topic = TOPICS.find(t => t.slug === tema)
  if (!topic) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic.label} en América Latina`,
    description: topic.description,
    url: `https://nebbuler.com/analisis/${tema}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
        { '@type': 'ListItem', position: 2, name: 'Análisis', item: 'https://nebbuler.com/analisis' },
        { '@type': 'ListItem', position: 3, name: topic.label, item: `https://nebbuler.com/analisis/${tema}` },
      ],
    },
  }

  const relatedTopics = TOPICS.filter(t => t.slug !== tema && t.discipline === topic.discipline).slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
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
          <nav className="font-sans text-[12px] text-[#999] mb-8 flex flex-wrap gap-1 items-center">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span>›</span>
            <Link href="/analisis" className="hover:text-[#121212]">Análisis</Link>
            <span>›</span>
            <span className="text-[#121212]">{topic.label}</span>
          </nav>

          <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {topic.discipline} · América Latina
            </p>
            <h1 className="font-serif text-[2.8rem] font-bold text-[#121212] leading-[1.1] mb-5">
              {topic.label} en América Latina
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed max-w-2xl">
              {topic.description}. Selecciona tu país para acceder al análisis más relevante para tu mercado.
            </p>
          </div>

          {/* Grid de países */}
          <section className="mb-12">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
              Selecciona tu país
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MARKETS.map(m => (
                <Link
                  key={m.slug}
                  href={`/analisis/${tema}/${m.slug}`}
                  className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] transition-colors group flex items-center gap-3"
                >
                  <span className="text-2xl">{m.flag}</span>
                  <div>
                    <p className="font-serif text-[15px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                      {m.label}
                    </p>
                    <p className="font-sans text-[11px] text-[#999]">{m.currency}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Preguntas del tema */}
          {topic.questions.length > 0 && (
            <section className="mb-12">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Preguntas clave sobre {topic.label.toLowerCase()}
              </h2>
              <div className="space-y-3">
                {topic.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border border-[#DEDEDE]">
                    <span className="font-serif text-[#C41C1C] text-lg leading-none mt-0.5 flex-shrink-0">?</span>
                    <p className="font-sans text-[15px] text-[#333]">{q}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Temas relacionados */}
          {relatedTopics.length > 0 && (
            <section className="mb-12 pt-8 border-t border-[#DEDEDE]">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
                Temas relacionados en {topic.discipline.replace('-', ' ')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedTopics.map(t => (
                  <Link
                    key={t.slug}
                    href={`/analisis/${t.slug}`}
                    className="font-sans text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#666] hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="bg-[#121212] text-white p-8">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Nebbuler
            </p>
            <h2 className="font-serif text-[1.8rem] font-bold mb-3">
              ¿Publicas sobre {topic.label.toLowerCase()}?
            </h2>
            <p className="font-sans text-[15px] text-[#CCC] mb-6 leading-relaxed">
              Crea tu sala en Nebbuler y cobra directamente por tu análisis. Sin comisión. Tarifa fija mensual.
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
