import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/data/seo-guides'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

export async function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
    url: `https://nebbuler.com/guia/${slug}`,
  }

  const relatedGuides = GUIDES.filter(g => g.slug !== slug).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
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
          <article
            className="prose prose-lg max-w-none font-sans text-[#333] [&_h2]:font-serif [&_h2]:text-[1.5rem] [&_h2]:font-bold [&_h2]:text-[#121212] [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-[#121212]"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* CTA */}
          <div className="mt-12 bg-[#F7F7F7] border border-[#DEDEDE] p-8">
            <h2 className="font-serif text-[1.5rem] font-bold text-[#121212] mb-3">
              Empieza a publicar en Nebbuler
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed">
              Tarifa fija mensual. 0% de comisión sobre tus suscripciones. Tu conocimiento, tu ingreso.
            </p>
            <Link
              href="/abrir"
              className="inline-flex items-center font-sans text-[13px] font-semibold bg-[#121212] text-white px-6 py-3 hover:bg-[#C41C1C] transition-colors"
            >
              Abrir mi sala en Nebbuler →
            </Link>
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#DEDEDE]">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
                Más guías para creadores
              </h3>
              <div className="space-y-4">
                {relatedGuides.map(g => (
                  <Link key={g.slug} href={`/guia/${g.slug}`} className="flex items-start gap-4 group">
                    <span className="font-serif text-[#C41C1C] text-[20px] leading-none mt-0.5">—</span>
                    <div>
                      <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                        {g.title}
                      </p>
                      <p className="font-sans text-[13px] text-[#666] mt-0.5">{g.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
