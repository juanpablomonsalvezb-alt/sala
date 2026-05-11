import type { Metadata } from 'next'
import Link from 'next/link'
import { creators } from '@/data/creators'
import ShareButtons from './ShareButtons'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ creator?: string; post?: string }>
}

interface DecodedQuote {
  quoteText: string
  authorName: string
}

function decodeQuoteId(id: string): DecodedQuote {
  try {
    const base64 = id.replace(/-/g, '+').replace(/_/g, '/')
    const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
    // Buffer no está disponible en edge — usar atob en cliente o decode manual
    const binaryStr = atob(base64 + padding)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    const decoded = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(decoded)
    return {
      quoteText: parsed.q ?? decoded,
      authorName: parsed.a ?? '',
    }
  } catch {
    try {
      return { quoteText: decodeURIComponent(id), authorName: '' }
    } catch {
      return { quoteText: 'El conocimiento tiene precio.', authorName: '' }
    }
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { quoteText, authorName } = decodeQuoteId(id)

  const truncated = quoteText.length > 100 ? quoteText.slice(0, 97) + '…' : quoteText
  const title = authorName
    ? `"${truncated}" — ${authorName}`
    : `"${truncated}"`

  return {
    title: `${title} · Nebbuler`,
    description: `Cita de ${authorName || 'un profesional'} en Nebbuler, la plataforma de newsletters profesionales de pago para América Latina.`,
    alternates: { canonical: `https://nebbuler.com/c/${id}` },
    openGraph: {
      title,
      description: authorName
        ? `Análisis de ${authorName} en Nebbuler.`
        : 'Contenido profesional en Nebbuler.',
      images: [
        {
          url: `/api/og/quote/${id}`,
          width: 1200,
          height: 630,
          alt: truncated,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: authorName ? `— ${authorName} en Nebbuler` : 'Nebbuler',
      images: [`/api/og/quote/${id}`],
    },
  }
}

export default async function QuotePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { creator: creatorSlug } = await searchParams
  const { quoteText, authorName } = decodeQuoteId(id)

  const creator = creatorSlug
    ? creators.find((c) => c.slug === creatorSlug)
    : authorName
    ? creators.find((c) => c.name === authorName)
    : null

  const shareUrl = `https://nebbuler.com/c/${id}`
  const twitterText = authorName
    ? `«${quoteText.slice(0, 240)}» — ${authorName} en @nebbuler`
    : `«${quoteText.slice(0, 260)}» vía @nebbuler`

  return (
    <main className="min-h-screen bg-white text-[#121212]">
      {/* Barra roja top */}
      <div className="h-[3px] w-full bg-[#C41C1C]" />

      {/* Header */}
      <header className="border-b border-[#F0F0F0] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif font-bold text-lg tracking-widest text-[#121212] hover:text-[#C41C1C] transition-colors"
          >
            NEBBULER
          </Link>
          <Link
            href="/directorio"
            className="text-xs font-sans text-[#666] hover:text-[#121212] transition-colors uppercase tracking-wider"
          >
            Ver directorio
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <article className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        {/* Cita */}
        <div className="relative pl-8 mb-12">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C41C1C]" />
          <blockquote>
            <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-[#121212] italic">
              &ldquo;{quoteText}&rdquo;
            </p>
            {authorName && (
              <footer className="mt-6">
                <cite className="not-italic font-sans text-sm text-[#666] uppercase tracking-wider">
                  — {authorName}
                </cite>
              </footer>
            )}
          </blockquote>
        </div>

        {/* Separador */}
        <div className="w-12 h-px bg-[#C41C1C] mb-12" />

        {/* Origen del contenido */}
        {creator ? (
          <div className="bg-[#F7F7F7] border border-[#E8E8E8] p-6 mb-10 rounded-sm">
            <p className="font-sans text-xs uppercase tracking-widest text-[#999] mb-2">
              Esta cita viene de
            </p>
            <p className="font-serif text-lg text-[#121212] mb-1">{creator.name}</p>
            <p className="font-sans text-xs text-[#666] uppercase tracking-wider mb-4">
              {creator.specialty}
            </p>
            <Link
              href={`/${creator.slug}`}
              className="inline-block bg-[#121212] text-white font-sans text-sm px-5 py-2.5 hover:bg-[#C41C1C] transition-colors"
            >
              Leer el análisis completo
            </Link>
          </div>
        ) : (
          <div className="mb-10">
            <p className="font-sans text-sm text-[#666] mb-4">
              Esta cita pertenece a un análisis publicado en Nebbuler, la plataforma de newsletters profesionales de pago para América Latina.
            </p>
            <Link
              href="/directorio"
              className="inline-block bg-[#121212] text-white font-sans text-sm px-5 py-2.5 hover:bg-[#C41C1C] transition-colors"
            >
              Ver todos los profesionales
            </Link>
          </div>
        )}

        {/* CTA para creadores */}
        <div className="border border-[#E8E8E8] p-6 mb-12">
          <p className="font-sans text-xs uppercase tracking-widest text-[#999] mb-2">
            ¿Eres profesional?
          </p>
          <p className="font-serif text-base text-[#121212] mb-4">
            Abre tu sala y cobra directamente por tus análisis. 0% comisión.
          </p>
          <Link
            href="/para-creadores"
            className="inline-block border border-[#121212] text-[#121212] font-sans text-sm px-5 py-2.5 hover:bg-[#121212] hover:text-white transition-colors"
          >
            Abre tu sala
          </Link>
        </div>

        {/* Botones de compartir */}
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4">
            Compartir esta cita
          </p>
          <ShareButtons
            shareUrl={shareUrl}
            twitterText={twitterText}
            linkedinUrl={shareUrl}
          />
        </div>
      </article>

      {/* Footer mínimo */}
      <footer className="border-t border-[#F0F0F0] px-6 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-sans text-xs text-[#999] hover:text-[#121212] transition-colors"
          >
            ← Volver al inicio
          </Link>
          <span className="font-sans text-xs text-[#CCC]">nebbuler.com</span>
        </div>
      </footer>
    </main>
  )
}
