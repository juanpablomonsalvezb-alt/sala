import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/data/seo-guides'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'
import { safeJsonLd } from '@/lib/rateLimit'
import { generateBreadcrumb } from '@/lib/internal-linking'

let caseStudies: Record<string, { slug: string; title: string; country: string; content: string; generatedAt: string }> = {}

try {
  const casesData = require('@/data/generated-content/case-studies.json')
  caseStudies = casesData
} catch (e) {
  // Fallback if JSON not available
  caseStudies = {}
}

const CASE_SLUGS = Object.keys(caseStudies)

export const revalidate = false

export async function generateStaticParams() {
  return CASE_SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = caseStudies[slug]
  if (!study) return {}
  return {
    title: `${study.title} — Nebbuler`,
    description: `Caso de estudio: ${study.title}`,
    alternates: { canonical: `https://nebbuler.com/caso-estudio/${slug}` },
    openGraph: {
      title: `${study.title} — Nebbuler`,
      description: `Caso de estudio: ${study.title}`,
      type: 'article',
      url: `https://nebbuler.com/caso-estudio/${slug}`,
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = caseStudies[slug]
  if (!study) notFound()

  // Obtener contenido relacionado
  const relatedGuides = GUIDES.slice(0, 3)
  const relatedTopics = TOPICS.slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.title,
    author: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: 'https://nebbuler.com/logo.png'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/logo.png', width: 200, height: 60 }
    },
    url: `https://nebbuler.com/caso-estudio/${slug}`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
        { '@type': 'ListItem', position: 2, name: 'Casos de Estudio', item: 'https://nebbuler.com/caso-estudio' },
        { '@type': 'ListItem', position: 3, name: study.title, item: `https://nebbuler.com/caso-estudio/${slug}` },
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
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">Caso de estudio</span>
          </nav>

          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Caso de estudio
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
              {study.title}
            </h1>
            <p className="font-sans text-[13px] text-[#666]">{study.country}</p>
          </div>

          <article className="prose prose-sm max-w-none mb-16">
            <div
              className="font-sans text-[16px] leading-[1.7] text-[#333]"
              dangerouslySetInnerHTML={{ __html: study.content }}
            />
          </article>

          <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 mb-16 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              ¿Tienes un caso de estudio similar?
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
              Publica tu expertise en Nebbuler
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed">
              Monetiza tus casos de estudio y análisis profesionales con una tarifa fija. 0% de comisión.
            </p>
            <Link
              href="/abrir"
              className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Crear cuenta →
            </Link>
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <section className="border-t border-[#DEDEDE] pt-12 mb-12">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Guías relacionadas
              </h3>
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

          {/* Related analyses */}
          {relatedTopics.length > 0 && (
            <section>
              <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Análisis del mercado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTopics.map(topic => (
                  <Link
                    key={topic.slug}
                    href={`/analisis/${topic.slug}/${MARKETS[0]?.slug || 'chile'}`}
                    className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                      {topic.label}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  )
}
