import { createClient } from '@/lib/supabase/server'
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
  avatar_url?: string
  bio?: string
  followers?: number
  username: string
}

interface Params {
  slug: string
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const supabase = await createClient()
  const keyword = decodeURIComponent(params.slug).replace(/-/g, ' ')

  const { data: page } = await supabase
    .from('generated_pages')
    .select('*')
    .ilike('keyword', keyword)
    .single()

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
      url: `https://nebbuler.com/tendencia/${params.slug}`,
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

export default async function TrendingArticlePage({ params }: { params: Params }) {
  const supabase = await createClient()
  const keyword = decodeURIComponent(params.slug).replace(/-/g, ' ')

  const { data: page } = await supabase
    .from('generated_pages')
    .select('*')
    .ilike('keyword', keyword)
    .single()

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
    if (keywords.some(kw => keyword.toLowerCase().includes(kw))) {
      matchedSpecialty = specialty
      break
    }
  }

  const { data: creators = [] } = await supabase
    .from('creators')
    .select('id, name, specialty, avatar_url, bio, followers, username')
    .or(`specialty.ilike.%${matchedSpecialty}%,specialty.ilike.%${matchedSpecialty === 'General' ? 'professional' : matchedSpecialty}%`)
    .eq('country_code', typedPage.country_code)
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

      {/* Related Creators */}
      {typedCreators.length > 0 && (
        <div className="bg-white border-t border-[#e0e0e0] py-12 px-6 mt-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
              Creadores relevantes
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#121212] mb-8">
              Profesionales que escriben sobre {matchedSpecialty.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {typedCreators.map(creator => (
                <Link
                  key={creator.id}
                  href={`/${creator.username}`}
                  className="block p-6 border border-[#e0e0e0] hover:border-[#121212] hover:shadow-sm transition-all group"
                >
                  <div className="flex gap-4 mb-4">
                    {creator.avatar_url && (
                      <img
                        src={creator.avatar_url}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-sans font-semibold text-[#121212] group-hover:text-[#333]">
                        {creator.name}
                      </h3>
                      <p className="text-xs text-[#999] font-sans">
                        {creator.specialty}
                      </p>
                    </div>
                  </div>
                  {creator.bio && (
                    <p className="font-sans text-sm text-[#666] mb-3 line-clamp-2">
                      {creator.bio}
                    </p>
                  )}
                  {creator.followers && (
                    <p className="text-xs text-[#999] font-sans">
                      👥 {creator.followers.toLocaleString()} suscriptores
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#f5f5f5] border-t border-[#e0e0e0] py-12 px-6 mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-[#121212] mb-4">
            ¿Quieres mantenerte al día con tendencias como esta?
          </h2>
          <p className="font-sans text-base text-[#666] mb-6 max-w-xl mx-auto">
            Suscríbete a una newsletter profesional y recibe artículos personalizados según tu especialidad.
          </p>
          <a
            href="/"
            className="inline-block font-sans text-sm font-semibold text-white bg-[#121212] px-8 py-3 hover:bg-[#333] transition-colors"
          >
            Explorar plataforma
          </a>
        </div>
      </div>
    </article>
  )
}
