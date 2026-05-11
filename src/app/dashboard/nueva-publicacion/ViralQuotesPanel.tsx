'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { extractViralQuotes } from './_actions'

interface ViralQuotesPanelProps {
  postId: string
  postSlug: string
  creatorSlug: string
  content: string
  creatorName: string
}

interface QuoteState {
  text: string
  copiedWhatsApp: boolean
  copiedTweet: boolean
}

export function ViralQuotesPanel({
  postId,
  postSlug,
  creatorSlug,
  content,
  creatorName,
}: ViralQuotesPanelProps) {
  const [quotes, setQuotes] = useState<QuoteState[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let cancelled = false
    extractViralQuotes(postId, content, creatorName).then(({ quotes: raw }) => {
      if (cancelled) return
      setQuotes(raw.map(text => ({ text, copiedWhatsApp: false, copiedTweet: false })))
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [postId, content, creatorName])

  function buildWhatsAppText(quote: string): string {
    return `"${quote}" — ${creatorName} en Nebbuler\nnebbuler.com/${creatorSlug}`
  }

  function buildTweetText(quote: string): string {
    return `"${quote}" — ${creatorName} en @nebbuler\nnebbuler.com/${creatorSlug}`
  }

  async function copyWhatsApp(index: number) {
    const quote = quotes[index]
    if (!quote) return
    await navigator.clipboard.writeText(buildWhatsAppText(quote.text))
    setQuotes(prev => prev.map((q, i) => i === index ? { ...q, copiedWhatsApp: true } : q))
    setTimeout(() => {
      setQuotes(prev => prev.map((q, i) => i === index ? { ...q, copiedWhatsApp: false } : q))
    }, 2000)
  }

  function openTweet(index: number) {
    const quote = quotes[index]
    if (!quote) return
    const text = encodeURIComponent(buildTweetText(quote.text))
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  if (!visible) return null

  return (
    <div className="mt-8 border-t-2 border-[#C41C1C] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-1">
            Publicado con éxito
          </p>
          <h3 className="font-serif text-[20px] font-bold text-[#121212] leading-tight">
            Tu kit viral está listo
          </h3>
          <p className="font-sans text-[13px] text-[#666] mt-1">
            3 citas optimizadas para compartir en WhatsApp y Twitter
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="font-sans text-[12px] text-[#999] hover:text-[#121212] transition-colors ml-4 mt-1"
          aria-label="Cerrar panel viral"
        >
          ✕
        </button>
      </div>

      {/* Quotes */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-16 bg-[#F7F7F7] border-l-[3px] border-[#DEDEDE] animate-pulse"
            />
          ))}
          <p className="font-sans text-[12px] text-[#999] text-center pt-2">
            Extrayendo las mejores citas…
          </p>
        </div>
      ) : quotes.length === 0 ? (
        <p className="font-sans text-[13px] text-[#666] py-4 text-center">
          No se pudieron extraer citas. El contenido es muy corto.
        </p>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="bg-[#F7F7F7] border-l-[3px] border-[#C41C1C] p-4"
            >
              <p className="font-serif text-[15px] text-[#121212] leading-snug mb-3">
                &ldquo;{quote.text}&rdquo;
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => copyWhatsApp(index)}
                  className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1.5 bg-[#25D366] text-white hover:opacity-90 transition-opacity"
                >
                  {quote.copiedWhatsApp ? '¡Copiado!' : 'Copiar para WhatsApp'}
                </button>
                <button
                  onClick={() => openTweet(index)}
                  className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1.5 bg-[#1D9BF0] text-white hover:opacity-90 transition-opacity"
                >
                  Tuitear
                </button>
                <a
                  href={`/c/${postId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1.5 border border-[#DEDEDE] text-[#666] hover:border-[#121212] hover:text-[#121212] transition-colors"
                >
                  Ver cita →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA final */}
      <div className="mt-6 pt-5 border-t border-[#DEDEDE] flex items-center justify-between">
        <p className="font-sans text-[12px] text-[#666]">
          Comparte estas citas para atraer nuevos suscriptores
        </p>
        <Link
          href={`/${creatorSlug}/${postSlug}`}
          className="font-sans text-[12px] font-bold tracking-[0.08em] uppercase px-5 py-2 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors"
        >
          Ver publicación →
        </Link>
      </div>
    </div>
  )
}
