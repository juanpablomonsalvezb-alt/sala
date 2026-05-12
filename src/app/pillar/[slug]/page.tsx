import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'
import { GUIDES } from '@/data/seo-guides'
import { creators } from '@/data/creators'
import { safeJsonLd } from '@/lib/rateLimit'

let generatedPillars: Record<string, { slug: string; title: string; content: string; generatedAt: string }> = {}
try {
  const pillarsData = require('@/data/generated-content/pillars.json')
  generatedPillars = pillarsData
} catch {
  generatedPillars = {}
}

export const revalidate = false

export async function generateStaticParams() {
  return TOPICS.map(topic => ({ slug: topic.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const topic = TOPICS.find(t => t.slug === slug)
  if (!topic) return {}

  const title = `${topic.label} — Guía Completa y Análisis Profundo`
  return {
    title: `${title} | Nebbuler`,
    description: `${topic.description} Análisis integral por expertos verificados en mercados latinoamericanos. ${topic.questions[0]}`,
    keywords: [topic.label, topic.discipline, 'análisis', 'guía', 'expertos'].join(', '),
    alternates: { canonical: `https://nebbuler.com/pillar/${slug}` },
    openGraph: {
      title: `${title} | Nebbuler`,
      description: `${topic.description} Análisis integral en ${MARKETS.length} mercados latinoamericanos.`,
      type: 'article',
      url: `https://nebbuler.com/pillar/${slug}`,
    },
  }
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = TOPICS.find(t => t.slug === slug)
  if (!topic) notFound()

  const generatedContent = generatedPillars[slug]?.content
  const relatedCreators = creators.filter(c => c.discipline === topic.discipline).slice(0, 6)
  const relatedGuides = GUIDES.filter(g => g.profession === topic.discipline || g.profession === topic.label.toLowerCase()).slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${topic.label} — Guía Completa`,
    description: topic.description,
    mainEntity: {
      '@type': 'Topic',
      name: topic.label,
      description: topic.description,
      sameAs: MARKETS.map(m => `https://nebbuler.com/analisis/${slug}/${m.slug}`),
    },
    author: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: 'https://nebbuler.com/logo.png',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/logo.png', width: 200, height: 60 },
    },
    url: `https://nebbuler.com/pillar/${slug}`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
        { '@type': 'ListItem', position: 2, name: 'Pillar Pages', item: 'https://nebbuler.com/pillar' },
        { '@type': 'ListItem', position: 3, name: topic.label, item: `https://nebbuler.com/pillar/${slug}` },
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
          <nav className="font-sans text-[12px] text-[#999] mb-8 flex flex-wrap gap-1 items-center">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span>›</span>
            <Link href="/pillar" className="hover:text-[#121212]">Pillar Pages</Link>
            <span>›</span>
            <span className="text-[#121212]">{topic.label}</span>
          </nav>

          {/* Hero */}
          <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {topic.discipline} · Guía de referencia
            </p>
            <h1 className="font-serif text-[3rem] font-bold text-[#121212] leading-[1.15] mb-4">
              {topic.label}
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed">
              {topic.description}
            </p>
          </div>

          {/* Main content */}
          {generatedContent && (
            <article className="mb-16">
              <div
                className="font-sans text-[16px] leading-[1.7] text-[#333] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            </article>
          )}

          {/* FAQ from topic questions */}
          <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
            <h2 className="font-serif text-[24px] font-bold text-[#121212] mb-8">
              Preguntas clave
            </h2>
            <div className="space-y-6">
              {topic.questions.map((q, i) => (
                <div key={i}>
                  <h3 className="font-sans text-[15px] font-bold text-[#121212] mb-3">
                    {i + 1}. {q}
                  </h3>
                  <p className="font-sans text-[14px] text-[#666] leading-relaxed">
                    Análisis detallado disponible en los expertos verificados de Nebbuler. Explora los mercados específicos para respuestas localizadas.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Mercados disponibles */}
          <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
              Análisis por mercado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MARKETS.map(market => (
                <Link
                  key={market.slug}
                  href={`/analisis/${slug}/${market.slug}`}
                  className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <p className="font-sans text-[24px] mb-2">{market.flag}</p>
                  <p className="font-serif text-[14px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                    {market.label}
                  </p>
                  <p className="font-sans text-[12px] text-[#999] mt-1">
                    Análisis específico
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Related creators */}
          {relatedCreators.length > 0 && (
            <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Expertos en {topic.label.toLowerCase()}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedCreators.map(creator => (
                  <Link
                    key={creator.slug}
                    href={`/${creator.slug}`}
                    className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] transition-colors group"
                  >
                    <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2">
                      {creator.name}
                    </p>
                    <p className="font-sans text-[12px] text-[#999] mb-3">
                      {creator.specialty}
                    </p>
                    <p className="font-sans text-[13px] text-[#666] line-clamp-2">
                      {creator.bio}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
              <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Guías prácticas relacionadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedGuides.map(guide => (
                  <Link
                    key={guide.slug}
                    href={`/guia/${guide.slug}`}
                    className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2">
                      {guide.title}
                    </p>
                    <p className="font-sans text-[13px] text-[#666]">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Profundiza más
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
              Acceso a análisis de expertos verificados
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed">
              Lee análisis en profundidad escritos por especialistas en {topic.label.toLowerCase()}.
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
    </>
  )
}
