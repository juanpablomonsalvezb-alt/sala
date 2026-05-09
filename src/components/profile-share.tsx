'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProfileShareProps {
  slug: string
  publicationName: string
  creatorName: string
  specialty: string
  bio: string
}

export function ProfileShare({ slug, publicationName, creatorName, specialty, bio }: ProfileShareProps) {
  const [open, setOpen] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = `https://nebbuler.com/${slug}`
  const shortBio = bio.length > 100 ? bio.slice(0, 97) + '…' : bio

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setCanNativeShare(isMobile && !!navigator.share)
  }, [])

  // Textos prellenados por red — optimizados para convertir
  const texts = {
    linkedin: `Acabo de lanzar mi publicación en Nebbuler: "${publicationName}".\n\nPublico análisis sobre ${specialty.toLowerCase()} para quienes toman decisiones que dependen de entender bien este campo.\n\nEl primer artículo es gratuito → ${url}`,
    whatsapp: `*${publicationName}* — por ${creatorName}\n\n${shortBio}\n\nPrimer artículo gratis: ${url}`,
    twitter: `Lancé "${publicationName}" en @nebbuler — análisis sobre ${specialty.toLowerCase()} sin ruido.\n\nPrimer artículo gratis:`,
  }

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(texts.whatsapp)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(texts.twitter)}&url=${encodeURIComponent(url)}`,
  }

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: publicationName,
        text: `${publicationName} — por ${creatorName}. ${shortBio}`,
        url,
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') console.error(err)
    }
  }, [publicationName, creatorName, shortBio, url])

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(url) } catch {
      const el = document.createElement('input')
      el.value = url; document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [url])

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [open])

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Botón principal — dispara sheet nativo en móvil, dropdown en desktop */}
      {canNativeShare ? (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#DEDEDE] font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-[#555] hover:border-[#121212] hover:text-[#121212] transition-colors"
        >
          <ShareIcon />
          Compartir mi página
        </button>
      ) : (
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#DEDEDE] font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-[#555] hover:border-[#121212] hover:text-[#121212] transition-colors"
        >
          <ShareIcon />
          Compartir mi página
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Dropdown — solo desktop */}
      {open && !canNativeShare && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-[#E0E0E0] shadow-lg z-50">

          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E0E0E0]">
            <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999]">
              Comparte tu página en
            </p>
          </div>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors border-b border-[#F0F0F0] group"
          >
            <div className="mt-0.5 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[12px] font-semibold text-[#111] mb-0.5">LinkedIn</p>
              <p className="font-sans text-[10px] text-[#999] leading-relaxed line-clamp-2">{texts.linkedin.slice(0, 80)}…</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors border-b border-[#F0F0F0]"
          >
            <div className="mt-0.5 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.534 5.847L.057 23.943l6.304-1.653A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.497-5.193-1.364l-.372-.22-3.863 1.013 1.033-3.77-.242-.387A9.943 9.943 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[12px] font-semibold text-[#111] mb-0.5">WhatsApp</p>
              <p className="font-sans text-[10px] text-[#999] leading-relaxed line-clamp-2">{texts.whatsapp.slice(0, 80)}…</p>
            </div>
          </a>

          {/* X / Twitter */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors border-b border-[#F0F0F0]"
          >
            <div className="mt-0.5 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[12px] font-semibold text-[#111] mb-0.5">X / Twitter</p>
              <p className="font-sans text-[10px] text-[#999] leading-relaxed line-clamp-2">{texts.twitter.slice(0, 80)}…</p>
            </div>
          </a>

          {/* Copiar link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F8F7F5] transition-colors text-left"
          >
            <div className="flex-shrink-0">
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              )}
            </div>
            <div>
              <p className="font-sans text-[12px] font-semibold text-[#111]">{copied ? 'Link copiado' : 'Copiar link'}</p>
              <p className="font-sans text-[10px] text-[#999]">nebbuler.com/{slug}</p>
            </div>
          </button>

        </div>
      )}
    </div>
  )
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )
}
