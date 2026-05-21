'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface QuoteShareModalProps {
  text: string
  authorName: string
  authorUsername: string
  authorAvatar?: string | null
  creatorId: string
  postId: string
  postUrl: string
  onClose: () => void
}

type AspectRatio = '1:1' | '9:16'

type ShareChannel =
  | 'ig-story'
  | 'ig-square'
  | 'whatsapp'
  | 'twitter'
  | 'linkedin'
  | 'copy'
  | 'download'

const SITE_ORIGIN = 'https://nebbuler.com'

/**
 * Modal con preview de la imagen generada por /api/og/quote y 5 botones de share:
 * IG Stories (descarga + Web Share API), WhatsApp, X/Twitter, LinkedIn, Copy link.
 *
 * Diseño coherente con el sistema NYT-like del sitio: serif para títulos,
 * sans para acciones, paleta #121212/#C41C1C/#FAFAF7.
 */
export function QuoteShareModal({
  text,
  authorName,
  authorUsername,
  authorAvatar,
  creatorId,
  postId,
  postUrl,
  onClose,
}: QuoteShareModalProps) {
  const [aspect, setAspect] = useState<AspectRatio>('1:1')
  const [imgLoading, setImgLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const trackedRef = useRef<Set<ShareChannel>>(new Set())

  const imageUrl = useMemo(() => {
    const u = new URL('/api/og/quote', SITE_ORIGIN)
    u.searchParams.set('text', text)
    u.searchParams.set('author', authorName)
    u.searchParams.set('username', authorUsername)
    u.searchParams.set('postUrl', postUrl)
    u.searchParams.set('format', aspect)
    if (authorAvatar) u.searchParams.set('avatar', authorAvatar)
    return u.toString()
  }, [text, authorName, authorUsername, postUrl, aspect, authorAvatar])

  const truncated = text.length > 200 ? text.slice(0, 197) + '…' : text

  const track = useCallback(
    async (channel: ShareChannel) => {
      // Deduplicar por canal en la vida del modal
      if (trackedRef.current.has(channel)) return
      trackedRef.current.add(channel)
      try {
        await fetch('/api/track/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creatorId,
            postId,
            text,
            channel,
            aspectRatio: aspect,
          }),
          keepalive: true,
        })
      } catch {
        /* noop — tracking nunca debe romper UX */
      }
    },
    [creatorId, postId, text, aspect],
  )

  // ESC + click outside
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // Bloquear scroll body mientras está abierto
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose],
  )

  // Descargar imagen — intenta Web Share API con file primero (mobile-first),
  // fallback a <a download>
  const handleDownload = useCallback(
    async (channel: ShareChannel) => {
      try {
        const res = await fetch(imageUrl)
        if (!res.ok) throw new Error('fetch failed')
        const blob = await res.blob()
        const filename = `nebbuler-quote-${aspect === '9:16' ? 'story' : 'square'}.png`

        // Web Share API con archivos (iOS Safari, Android Chrome)
        const navAny = navigator as Navigator & {
          canShare?: (data: ShareData) => boolean
          share?: (data: ShareData) => Promise<void>
        }
        if (
          typeof navAny.canShare === 'function' &&
          typeof navAny.share === 'function'
        ) {
          const file = new File([blob], filename, { type: 'image/png' })
          const shareData: ShareData = {
            files: [file],
            title: 'Nebbuler',
            text: `"${truncated}" — ${authorName}`,
            url: postUrl,
          }
          if (navAny.canShare(shareData)) {
            try {
              await navAny.share(shareData)
              track(channel)
              return
            } catch {
              // Usuario canceló o falló → caer a download
            }
          }
        }

        // Fallback: descarga directa
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
        track(channel)
      } catch {
        setImgError(true)
      }
    },
    [imageUrl, aspect, truncated, authorName, postUrl, track],
  )

  const handleIGStory = useCallback(async () => {
    // Cambiar a 9:16 si no estaba, esperar render, descargar
    if (aspect !== '9:16') {
      setAspect('9:16')
      // Esperar al próximo tick para que se rebusque la URL
      setTimeout(() => handleDownload('ig-story'), 50)
      return
    }
    handleDownload('ig-story')
  }, [aspect, handleDownload])

  const handleIGSquare = useCallback(async () => {
    if (aspect !== '1:1') {
      setAspect('1:1')
      setTimeout(() => handleDownload('ig-square'), 50)
      return
    }
    handleDownload('ig-square')
  }, [aspect, handleDownload])

  const waUrl = useMemo(() => {
    const msg = `"${truncated}"\n— ${authorName} en Nebbuler\n${postUrl}`
    return `https://wa.me/?text=${encodeURIComponent(msg)}`
  }, [truncated, authorName, postUrl])

  const twitterUrl = useMemo(() => {
    const msg = `"${truncated}" — ${authorName} en @nebbuler\n${postUrl}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`
  }, [truncated, authorName, postUrl])

  const linkedinUrl = useMemo(
    () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    [postUrl],
  )

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopiedLink(true)
      track('copy')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      /* noop */
    }
  }, [postUrl, track])

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayMouseDown}
      role="dialog"
      aria-modal="true"
      aria-label="Compartir cita como imagen"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(18, 18, 18, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="bg-[#FAFAF7] w-full max-w-[520px] max-h-[92vh] overflow-y-auto shadow-2xl"
        style={{ border: '1px solid #121212' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#121212]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B6B68] font-sans font-bold">
              Quote viral engine
            </div>
            <div className="font-serif text-[22px] text-[#121212] leading-tight mt-1">
              Compartí esta cita
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-[#121212] hover:text-[#C41C1C] transition-colors p-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Aspect toggle */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#6B6B68] font-sans font-bold mr-1">
              Formato
            </span>
            <button
              type="button"
              onClick={() => setAspect('1:1')}
              className={`px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wide transition-colors border ${
                aspect === '1:1'
                  ? 'bg-[#121212] text-[#FAFAF7] border-[#121212]'
                  : 'bg-transparent text-[#121212] border-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7]'
              }`}
            >
              1:1 Post
            </button>
            <button
              type="button"
              onClick={() => setAspect('9:16')}
              className={`px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wide transition-colors border ${
                aspect === '9:16'
                  ? 'bg-[#121212] text-[#FAFAF7] border-[#121212]'
                  : 'bg-transparent text-[#121212] border-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7]'
              }`}
            >
              9:16 Story
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="px-6 pb-5">
          <div
            className="relative bg-[#EEEEE8] border border-[#121212] overflow-hidden mx-auto"
            style={{
              width: '100%',
              aspectRatio: aspect === '1:1' ? '1 / 1' : '9 / 16',
              maxWidth: aspect === '1:1' ? 420 : 260,
            }}
          >
            {imgLoading && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B6B68] font-sans font-bold">
                    Generando imagen
                  </div>
                </div>
              </div>
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                <div className="text-[12px] text-[#C41C1C] font-sans">
                  No pudimos generar la imagen. Intentá de nuevo en unos segundos.
                </div>
              </div>
            )}
            {/* key fuerza recarga al cambiar aspect */}
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Preview de cita compartible"
              style={{
                width: '100%',
                height: '100%',
                display: imgError ? 'none' : 'block',
                objectFit: 'cover',
                opacity: imgLoading ? 0 : 1,
                transition: 'opacity 200ms ease',
              }}
              onLoad={() => {
                setImgLoading(false)
                setImgError(false)
              }}
              onError={() => {
                setImgLoading(false)
                setImgError(true)
              }}
              onLoadStart={() => setImgLoading(true)}
            />
          </div>
        </div>

        {/* Share actions */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleIGStory}
            className="flex items-center justify-center gap-2 bg-[#121212] text-[#FAFAF7] hover:bg-[#C41C1C] transition-colors px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-[0.12em]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            IG Story
          </button>
          <button
            type="button"
            onClick={handleIGSquare}
            className="flex items-center justify-center gap-2 bg-[#FAFAF7] text-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7] border border-[#121212] transition-colors px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-[0.12em]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar PNG
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp')}
            className="flex items-center justify-center gap-2 bg-[#FAFAF7] text-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7] border border-[#121212] transition-colors px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-[0.12em]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('twitter')}
            className="flex items-center justify-center gap-2 bg-[#FAFAF7] text-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7] border border-[#121212] transition-colors px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-[0.12em]"
          >
            <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 700 }}>X</span>
            Compartir en X
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('linkedin')}
            className="flex items-center justify-center gap-2 bg-[#FAFAF7] text-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7] border border-[#121212] transition-colors px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-[0.12em]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3v9zm-1.5-10.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM19 19h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37V19h-3v-9h2.88v1.23h.04A3.16 3.16 0 0 1 15.5 9.74c3.04 0 3.6 2 3.6 4.6V19z" />
            </svg>
            LinkedIn
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 bg-[#FAFAF7] text-[#121212] hover:bg-[#121212] hover:text-[#FAFAF7] border border-[#121212] transition-colors px-4 py-3 text-[11px] font-sans font-bold uppercase tracking-[0.12em]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copiedLink ? 'Copiado' : 'Copiar link'}
          </button>
        </div>

        {/* Caption preview */}
        <div className="px-6 pb-6">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B6B68] font-sans font-bold mb-2">
            Texto seleccionado
          </div>
          <blockquote className="font-serif italic text-[15px] leading-snug text-[#121212] border-l-2 border-[#C41C1C] pl-3">
            “{truncated}”
          </blockquote>
        </div>
      </div>
    </div>
  )
}
