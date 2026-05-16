import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // ISR: revalidate every hour

interface GeneratedPage {
  id: string
  keyword: string
  content_html: string
  seo_score: number
  created_at: string
  country_code: string
}

interface Creator {
  id: string
  name: string
  specialty: string
  slug: string
  bio?: string
  subscriber_count?: number
  price_clp?: number
}

interface Params {
  params: Promise<{ slug: string }>
}

function normalizeSlug(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function findPage(supabase: ReturnType<typeof createServiceClient>, slug: string) {
  const keywordFromSlug = decodeURIComponent(slug).replace(/-/g, ' ')
  const { data: pages } = await supabase
    .from('generated_pages')
    .select('*')
    .ilike('keyword', keywordFromSlug)
    .order('created_at', { ascending: false })
    .limit(1)

  if (pages && pages.length > 0) return pages[0]

  // Fallback: normalized slug match (handles accented keywords like tributación → tributacion)
  const { data: all } = await supabase
    .from('generated_pages')
    .select('id, keyword, country_code')
    .limit(200)

  const match = (all || []).find(p => normalizeSlug(p.keyword) === slug)
  if (!match) return null

  const { data: full } = await supabase
    .from('generated_pages')
    .select('*')
    .eq('id', match.id)
    .limit(1)
  return full?.[0] ?? null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const page = await findPage(supabase, slug)

  if (!page) {
    return {
      title: 'Tendencia no encontrada',
      description: 'El artículo que buscas no existe.',
    }
  }

  const typedPage = page as GeneratedPage
  const title = `${typedPage.keyword} · Tendencias Profesionales · Nebbuler`
  const description = `Artículo profesional actualizado sobre ${typedPage.keyword}. Análisis de tendencias en tiempo real para profesionales independientes. Puntuación SEO: ${typedPage.seo_score}/100.`

  return {
    title,
    description,
    openGraph: {
      title: `${typedPage.keyword} · Tendencia Profesional`,
      description,
      type: 'article',
      url: `https://nebbuler.com/tendencia/${slug}`,
      siteName: 'Nebbuler',
      publishedTime: new Date(typedPage.created_at).toISOString(),
      authors: ['Nebbuler'],
      images: [
        {
          url: 'https://nebbuler.com/og-default.png',
          width: 1200,
          height: 630,
          alt: typedPage.keyword,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${typedPage.keyword} · Tendencia en Nebbuler`,
      description,
      images: ['https://nebbuler.com/og-default.png'],
    },
  }
}

export default async function TrendingArticlePage({ params }: Params) {
  const { slug } = await params
  const supabase = createServiceClient()
  const page = await findPage(supabase, slug)

  if (!page) {
    notFound()
  }

  const typedPage = page as GeneratedPage

  // Find creators matching this keyword's specialty
  const specialtyKeywords = {
    legal: ['abogado', 'abogada', 'asesor legal', 'derecho', 'tributario'],
    accounting: ['contador', 'contadora', 'CPA', 'auditor', 'fiscal'],
    business: ['consultor', 'consultora', 'asesor', 'negocios'],
    tech: ['desarrollador', 'desarrolladora', 'diseñador', 'diseñadora', 'programador'],
    health: ['psicólogo', 'psicóloga', 'médico', 'médica', 'doctor'],
    marketing: ['marketing', 'publicidad', 'copywriter', 'community manager'],
  }

  let matchedSpecialty = 'General'
  for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
    if (keywords.some(kw => typedPage.keyword.toLowerCase().includes(kw))) {
      matchedSpecialty = specialty
      break
    }
  }

  const { data: creators = [] } = await supabase
    .from('sala_creators')
    .select('id, name, specialty, slug, bio, subscriber_count, price_clp')
    .ilike('specialty', `%${matchedSpecialty}%`)
    .gt('subscriber_count', 0)
    .order('subscriber_count', { ascending: false })
    .limit(4)

  const typedCreators = creators as Creator[]

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e0e0e0] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Tendencia profesional
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] mb-6">
            {typedPage.keyword}
          </h1>
          <div className="flex gap-4 text-sm text-[#999] font-sans">
            <time dateTime={typedPage.created_at}>
              {new Date(typedPage.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>Puntuación SEO: {typedPage.seo_score}/100</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div
          className="prose prose-lg max-w-none
            [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#121212] [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#121212] [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:font-sans [&_p]:text-base [&_p]:text-[#333] [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
            [&_li]:font-sans [&_li]:text-base [&_li]:text-[#333] [&_li]:mb-2
            [&_strong]:font-semibold [&_strong]:text-[#121212]
            [&_em]:italic [&_em]:text-[#666]"
          dangerouslySetInnerHTML={{ __html: typedPage.content_html }}
        />
      </div>

      {/* Creator Success Stories */}
      {typedCreators.length > 0 && (
        <div className="bg-gradient-to-b from-white to-[#f5f5f5] border-t border-[#e0e0e0] py-12 px-6 mt-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-4">
              Historias de éxito
            </p>
            <h2 className="font-serif text-3xl font-bold text-[#121212] mb-3">
              Creadores ganando con {matchedSpecialty.toLowerCase()}
            </h2>
            <p className="font-sans text-base text-[#666] mb-8 max-w-xl">
              Mira cómo estos profesionales generan ingresos mensuales con sus newsletters especializadas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typedCreators.map(creator => {
                const monthlyIncome = (creator.subscriber_count || 0) * (creator.price_clp || 0)
                const isHighEarner = monthlyIncome > 1000000

                return (
                  <Link
                    key={creator.id}
                    href={`/${creator.slug}`}
                    className={`block p-6 border transition-all group ${
                      isHighEarner
                        ? 'border-[#C41C1C] bg-white shadow-md hover:shadow-lg'
                        : 'border-[#e0e0e0] bg-white hover:border-[#121212] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-sans font-semibold text-[#121212] group-hover:text-[#C41C1C] mb-1 text-lg">
                          {creator.name}
                        </h3>
                        <p className="text-xs text-[#999] font-sans capitalize">
                          {creator.specialty}
                        </p>
                      </div>
                      {isHighEarner && (
                        <span className="text-xs font-sans font-bold text-[#C41C1C] bg-[#FFF5F5] px-2 py-1">
                          TOP
                        </span>
                      )}
                    </div>

                    {creator.bio && (
                      <p className="font-sans text-sm text-[#666] mb-4 line-clamp-2">
                        {creator.bio}
                      </p>
                    )}

                    <div className="space-y-2 pt-4 border-t border-[#e0e0e0]">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs text-[#999]">Suscriptores</span>
                        <span className="font-sans font-semibold text-[#121212]">
                          {(creator.subscriber_count || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs text-[#999]">Ingreso mensual</span>
                        <span className="font-sans font-bold text-[#C41C1C] text-sm">
                          ${monthlyIncome.toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs text-[#999]">Precio/mes</span>
                        <span className="font-sans text-sm text-[#333]">
                          ${(creator.price_clp || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>

                    <p className="font-sans text-[11px] text-[#999] mt-4 pt-4 border-t border-[#e0e0e0]">
                      Ver newsletter →
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA - Become Creator */}
      <div className="bg-[#121212] border-t border-[#e0e0e0] py-12 px-6 mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-4">
            Oportunidad para ti
          </p>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Crea tu newsletter y empieza a ganar
          </h2>
          <p className="font-sans text-base text-[#ccc] mb-8 max-w-xl mx-auto leading-relaxed">
            Hay demanda real por contenido en {matchedSpecialty.toLowerCase()}. Los mejores creadores ganan hasta $2,000,000/mes. Tú puedes ser el próximo.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/registro?type=creator"
              className="inline-block font-sans text-sm font-semibold text-[#121212] bg-white px-8 py-3 hover:bg-[#f0f0f0] transition-colors"
            >
              Crear newsletter gratis
            </a>
            <a
              href="/"
              className="inline-block font-sans text-sm font-semibold text-white border border-white px-8 py-3 hover:bg-white hover:text-[#121212] transition-colors"
            >
              Ver más creadores
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
