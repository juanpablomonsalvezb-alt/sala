'use client'

import { useState, useEffect, useCallback } from 'react'

interface ShareBarProps {
  url: string
  title: string
  authorName: string
  excerpt?: string | null
}

export function ShareBar({ url, title, authorName, excerpt }: ShareBarProps) {
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Web Share API: solo activar en móvil real para evitar bugs de Chrome desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setCanShare(isMobile && !!navigator.share)
  }, [])

  const shareText = excerpt
    ? `"${excerpt.slice(0, 120)}…"\n\nPor ${authorName} — léelo completo:`
    : `${title} — por ${authorName}`

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, text: shareText, url })
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share failed', err)
      }
    }
  }, [title, shareText, url])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [url])

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${title}" — ${authorName}`)}&url=${encodeURIComponent(url)}`

  return (
    <div className="border-t border-[#E0E0E0] pt-8 mt-10">
      <p className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-[#999] mb-5">
        Compártelo con quien debería leerlo
      </p>

      <div className="flex flex-wrap items-center gap-2">

        {/* Web Share API — solo móvil */}
        {canShare && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] text-white font-sans text-[12px] font-semibold hover:bg-[#B31C1C] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Compartir
          </button>
        )}

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] font-sans text-[12px] font-medium text-[#555] hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] font-sans text-[12px] font-medium text-[#555] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.534 5.847L.057 23.943l6.304-1.653A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.497-5.193-1.364l-.372-.22-3.863 1.013 1.033-3.77-.242-.387A9.943 9.943 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          WhatsApp
        </a>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] font-sans text-[12px] font-medium text-[#555] hover:border-[#111] hover:text-[#111] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X
        </a>

        {/* Copiar link */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] font-sans text-[12px] font-medium text-[#555] hover:border-[#111] hover:text-[#111] transition-colors"
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copiar link
            </>
          )}
        </button>

      </div>
    </div>
  )
}
