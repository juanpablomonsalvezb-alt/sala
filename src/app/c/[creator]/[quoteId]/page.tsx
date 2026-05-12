import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creator: string; quoteId: string }>
}): Promise<Metadata> {
  const { creator, quoteId } = await params

  const supabase = createServiceClient()

  const { data: quote } = await supabase
    .from('sala_post_quotes')
    .select('text, post_id')
    .eq('id', quoteId)
    .single()

  if (!quote) return {}

  const { data: post } = await supabase
    .from('sala_posts')
    .select('creator_id')
    .eq('id', quote.post_id)
    .single()

  if (!post) return {}

  const { data: creatorData } = await supabase
    .from('sala_creators')
    .select('name, specialty')
    .eq('slug', creator)
    .single()

  if (!creatorData) return {}

  const quotePreview = quote.text.substring(0, 150)
  const ogImageUrl = `https://nebbuler.com/api/og/quote/${quoteId}`

  return {
    title: `"${quotePreview}..." — ${creatorData.name}`,
    description: `Cita de ${creatorData.name}: ${quotePreview}...`,
    alternates: {
      canonical: `https://nebbuler.com/c/${creator}/${quoteId}`,
    },
    openGraph: {
      title: `"${quotePreview}..." — ${creatorData.name}`,
      description: `Cita destacada en Nebbuler`,
      type: 'article',
      url: `https://nebbuler.com/c/${creator}/${quoteId}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Cita de ${creatorData.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `"${quotePreview}..." — ${creatorData.name}`,
      description: `Cita de ${creatorData.name} en Nebbuler`,
      images: [ogImageUrl],
    },
  }
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ creator: string; quoteId: string }>
}) {
  const { creator, quoteId } = await params

  const supabase = createServiceClient()

  const { data: quote } = await supabase
    .from('sala_post_quotes')
    .select('text, post_id')
    .eq('id', quoteId)
    .single()

  if (!quote) notFound()

  const { data: post } = await supabase
    .from('sala_posts')
    .select('creator_id, title, slug')
    .eq('id', quote.post_id)
    .single()

  if (!post) notFound()

  const { data: creatorData } = await supabase
    .from('sala_creators')
    .select('name, specialty, slug')
    .eq('slug', creator)
    .single()

  if (!creatorData || creatorData.slug !== creator) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `"${quote.text}"`,
    author: {
      '@type': 'Person',
      name: creatorData.name,
      url: `https://nebbuler.com/${creatorData.slug}`,
    },
    url: `https://nebbuler.com/c/${creator}/${quoteId}`,
    datePublished: new Date().toISOString(),
  }

  const ogImageUrl = `https://nebbuler.com/api/og/quote/${quoteId}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="min-h-screen bg-white flex flex-col">
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

        <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
          <nav className="font-sans text-[12px] text-[#999] mb-8 flex gap-2 items-center flex-wrap">
            <Link href="/" className="hover:text-[#121212]">
              Inicio
            </Link>
            <span>›</span>
            <Link href={`/${creator}`} className="hover:text-[#121212]">
              {creatorData.name}
            </Link>
            <span>›</span>
            <span className="text-[#121212]">Cita destacada</span>
          </nav>

          <article className="space-y-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              <div className="flex-1">
                <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-4">
                  Cita destacada
                </p>
                <blockquote className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.2] mb-8 border-l-4 border-[#C41C1C] pl-6">
                  {quote.text}
                </blockquote>
                <div className="flex items-start gap-4 p-5 bg-[#F7F7F7] border border-[#E0E0E0]">
                  <div>
                    <p className="font-serif text-[16px] font-bold text-[#121212]">
                      {creatorData.name}
                    </p>
                    <p className="font-sans text-[12px] text-[#999] mt-1">
                      {creatorData.specialty}
                    </p>
                  </div>
                </div>
                <p className="font-sans text-[13px] text-[#666] mt-6">
                  Publicado en{' '}
                  <Link href={`/${creator}/${post.slug}`} className="font-bold text-[#121212] hover:text-[#C41C1C]">
                    {post.title}
                  </Link>
                </p>
              </div>

              <div className="lg:w-[400px] flex-shrink-0">
                <img
                  src={ogImageUrl}
                  alt="Cita en imagen"
                  className="w-full border border-[#DEDEDE] rounded"
                />
              </div>
            </div>

            <section className="space-y-6 pt-8 border-t border-[#DEDEDE]">
              <h2 className="font-serif text-[28px] font-bold text-[#121212]">
                Compartir cita
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" — ${creatorData.name}\n\nhttps://nebbuler.com/c/${creator}/${quoteId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Compartir en X →
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://nebbuler.com/c/${creator}/${quoteId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Compartir en LinkedIn →
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://nebbuler.com/c/${creator}/${quoteId}`)
                  }}
                  className="font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Copiar enlace →
                </button>
              </div>
            </section>

            <section className="space-y-6 pt-8 border-t border-[#DEDEDE]">
              <h2 className="font-serif text-[24px] font-bold text-[#121212]">
                Suscribirse a {creatorData.name}
              </h2>
              <p className="font-sans text-[15px] text-[#666] leading-relaxed">
                Accede a publicaciones completas, análisis exclusivos y perspectivas del especialista.
              </p>
              <Link
                href={`/${creator}`}
                className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
              >
                Ver sala de {creatorData.name.split(' ')[0]} →
              </Link>
            </section>
          </article>
        </main>
      </div>
    </>
  )
}
