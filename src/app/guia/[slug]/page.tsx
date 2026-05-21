import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/data/seo-guides'
import { TOPICS } from '@/data/seo-topics'
import { MARKETS } from '@/data/seo-matrix'
import { safeJsonLd } from '@/lib/rateLimit'
import { generateBreadcrumb, getRelatedAnalyses } from '@/lib/internal-linking'

// Importar contenido generado por IA (ambos archivos: original y expandido)
let generatedGuides: Record<string, { slug: string; title: string; content: string; generatedAt: string }> = {}

try {
  const guidesData = require('@/data/generated-content/guides.json')
  const guidesExpandedData = require('@/data/generated-content/guides-expanded.json')
  generatedGuides = { ...guidesData, ...guidesExpandedData }
} catch (e) {
  // Fallback if JSON not available
  generatedGuides = {}
}

export const revalidate = false

export async function generateStaticParams() {
  // Incluir todas las guías del GUIDES array + las expandidas
  const allSlugs = GUIDES.map(g => ({ slug: g.slug }))
  return allSlugs
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES.find(g => g.slug === slug)
  if (!guide) return {}
  return {
    title: `${guide.title} — Nebbuler`,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `https://nebbuler.com/guia/${slug}` },
    openGraph: {
      title: `${guide.title} — Nebbuler`,
      description: guide.description,
      type: 'article',
      url: `https://nebbuler.com/guia/${slug}`,
    },
  }
}

export default async function GuiaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = GUIDES.find(g => g.slug === slug)
  if (!guide) notFound()

  // Usar contenido generado si está disponible, si no usar contenido fallback
  const generatedContent = generatedGuides[slug]?.content || guide.content

  // Obtener análisis relacionados
  const relatedAnalyses = TOPICS.length > 0 && MARKETS.length > 0
    ? getRelatedAnalyses(TOPICS[0]?.slug, MARKETS[0]?.slug, 3)
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: 'https://nebbuler.com/nebbuler-logo.png'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
      logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png', width: 200, height: 60 }
    },
    url: `https://nebbuler.com/guia/${slug}`,
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    keywords: guide.keywords.join(', '),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
        { '@type': 'ListItem', position: 2, name: 'Guías', item: 'https://nebbuler.com/guia' },
        { '@type': 'ListItem', position: 3, name: guide.title, item: `https://nebbuler.com/guia/${slug}` },
      ],
    },
  }

  // HowTo schema — clave para Google AI Overview y citaciones en IAs
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    totalTime: 'PT30M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: `Identificá tu nicho como ${guide.profession}`,
        text: `Como ${guide.profession}, tu conocimiento más valioso es el que muy pocos pueden ofrecer y muchos necesitan. Definí 1-2 sub-temas donde sos experto y tu audiencia tiene dolor real.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Abrí tu sala en Nebbuler',
        text: 'Creá tu perfil profesional en Nebbuler en menos de 5 minutos. Definí el precio mensual en tu moneda local (COP, MXN, ARS, PEN, CLP).',
        url: 'https://nebbuler.com/abrir',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Publicá tu primer análisis exclusivo',
        text: 'Empezá con un análisis que demuestre tu valor. No imites a los medios masivos: ofrecé interpretación de coyuntura, opinión informada o guías prácticas que tu audiencia no encuentra gratis.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Distribuí en LinkedIn, X y tu newsletter gratuito',
        text: 'Compartí extractos en redes profesionales. La tasa de conversión típica de audiencia gratuita a suscripción paga en LATAM es del 2% al 8%.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Mantené cadencia y mediá retención',
        text: 'Publicá al menos 2 veces por mes para mantener la retención. Los suscriptores que reciben valor consistente renuevan al 80-90% mensual.',
      },
    ],
  }

  const relatedGuides = GUIDES.filter(g => g.slug !== slug && g.profession === guide.profession).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Nav */}
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
          {/* Breadcrumb */}
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <Link href="/guia" className="hover:text-[#121212]">Guías</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">{guide.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Guía para creadores
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
              {guide.title}
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed">
              {guide.description}
            </p>
          </div>

          {/* Content */}
          <article className="prose prose-sm max-w-none mb-16">
            <div
              className="font-sans text-[16px] leading-[1.7] text-[#333]"
              dangerouslySetInnerHTML={{ __html: generatedContent }}
            />
          </article>

          {/* CTA */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 mb-16 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Listo para empezar
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
              Abre tu sala en Nebbuler
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed">
              Sin comisión. Tarifa fija de US$19/mes. 100% de tus suscripciones es tuyo.
            </p>
            <Link
              href="/abrir"
              className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Crear cuenta →
            </Link>
          </div>

          {/* Related analyses */}
          {relatedAnalyses.length > 0 && (
            <section className="border-t border-[#DEDEDE] pt-12 mb-12">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Análisis relacionados
              </h3>
              <div className="grid gap-4">
                {relatedAnalyses.map(analysis => (
                  <Link
                    key={analysis.slug}
                    href={`/analisis/${analysis.slug}`}
                    className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <p className="font-sans text-[11px] text-[#999] mb-1">{analysis.topic} · {analysis.market}</p>
                    <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                      {analysis.topic} en {analysis.market}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <section className="border-t border-[#DEDEDE] pt-12">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Guías relacionadas
              </h3>
              <div className="grid gap-4">
                {relatedGuides.map(rg => (
                  <Link
                    key={rg.slug}
                    href={`/guia/${rg.slug}`}
                    className="border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors mb-2">
                      {rg.title}
                    </p>
                    <p className="font-sans text-[13px] text-[#666]">{rg.description}</p>
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
