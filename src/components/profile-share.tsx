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
  const [showMore, setShowMore] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = `https://nebbuler.com/${slug}`
  const shortBio = bio.length > 100 ? bio.slice(0, 97) + '…' : bio

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setCanNativeShare(isMobile && !!navigator.share)
  }, [])

  const texts = {
    linkedin: `Acabo de lanzar mi publicación en Nebbuler: "${publicationName}".\n\nPublico análisis sobre ${specialty.toLowerCase()} para quienes toman decisiones que dependen de entender bien este campo.\n\nEl primer artículo es gratuito → ${url}`,
    whatsapp: `*${publicationName}* — por ${creatorName}\n\n${shortBio}\n\nPrimer artículo gratis: ${url}`,
    twitter: `Lancé "${publicationName}" en @nebbuler — análisis sobre ${specialty.toLowerCase()} sin ruido.\n\nPrimer artículo gratis:`,
    email: `Te comparto mi perfil profesional en Nebbuler.\n\nPublico "${publicationName}" — análisis sobre ${specialty.toLowerCase()}.\n\n${shortBio}\n\nPuedes leer el primer artículo gratis aquí: ${url}`,
    facebook: `Acabo de lanzar mi publicación "${publicationName}" en Nebbuler — análisis sobre ${specialty.toLowerCase()}. Primer artículo gratis: ${url}`,
    telegram: `*${publicationName}* — por ${creatorName}\n\n${shortBio}\n\nPrimer artículo gratis: ${url}`,
    messenger: url,
  }

  const shareLinks = {
    linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp:  `https://wa.me/?text=${encodeURIComponent(texts.whatsapp)}`,
    twitter:   `https://twitter.com/intent/tweet?text=${encodeURIComponent(texts.twitter)}&url=${encodeURIComponent(url)}`,
    email:     `mailto:?subject=${encodeURIComponent(`${publicationName} — mi publicación en Nebbuler`)}&body=${encodeURIComponent(texts.email)}`,
    facebook:  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(texts.facebook)}`,
    messenger: `https://m.me/?link=${encodeURIComponent(url)}`,
    telegram:  `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texts.telegram)}`,
    reddit:    `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(publicationName + ' — ' + creatorName)}`,
    threads:   `https://www.threads.net/intent/post?text=${encodeURIComponent(texts.twitter + ' ' + url)}`,
  }

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title: publicationName, text: `${publicationName} — por ${creatorName}. ${shortBio}`, url })
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

  useEffect(() => {
    if (!open) return
    const handler = () => { setOpen(false); setShowMore(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [open])

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {canNativeShare ? (
        <button onClick={handleNativeShare} className="inline-flex items-center gap-2 px-4 py-2 border border-[#DEDEDE] font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-[#555] hover:border-[#121212] hover:text-[#121212] transition-colors">
          <ShareIcon />
          Compartir mi página
        </button>
      ) : (
        <button onClick={() => setOpen(v => !v)} className="inline-flex items-center gap-2 px-4 py-2 border border-[#DEDEDE] font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-[#555] hover:border-[#121212] hover:text-[#121212] transition-colors">
          <ShareIcon />
          Compartir mi página
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {open && !canNativeShare && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-[#E0E0E0] shadow-lg z-50">
          <div className="px-4 py-3 border-b border-[#E0E0E0]">
            <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999]">Comparte tu página en</p>
          </div>

          {/* ── PRINCIPALES ── */}
          <ShareItem href={shareLinks.linkedin} label="LinkedIn" preview={texts.linkedin.slice(0, 80)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </ShareItem>

          <ShareItem href={shareLinks.whatsapp} label="WhatsApp" preview={texts.whatsapp.replace('*', '').slice(0, 80)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.534 5.847L.057 23.943l6.304-1.653A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.497-5.193-1.364l-.372-.22-3.863 1.013 1.033-3.77-.242-.387A9.943 9.943 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          </ShareItem>

          <ShareItem href={shareLinks.twitter} label="X / Twitter" preview={texts.twitter.slice(0, 80)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </ShareItem>

          <ShareItem href={shareLinks.email} label="Correo electrónico" preview="Enviar por email con texto prellenado">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </ShareItem>

          {/* ── COPIAR LINK ── */}
          <button onClick={handleCopy} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F8F7F5] transition-colors text-left border-t border-[#F0F0F0]">
            <div className="flex-shrink-0 w-[15px] flex justify-center">
              {copied
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A5C38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>}
            </div>
            <div>
              <p className="font-sans text-[12px] font-semibold text-[#111]">{copied ? 'Link copiado' : 'Copiar link'}</p>
              <p className="font-sans text-[10px] text-[#999]">nebbuler.com/{slug}</p>
            </div>
          </button>

          {/* ── MÁS OPCIONES ── */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowMore(v => !v) }}
            className="flex items-center justify-between w-full px-4 py-2.5 bg-[#F8F7F5] hover:bg-[#F0F0EE] transition-colors border-t border-[#E0E0E0]"
          >
            <span className="font-sans text-[10px] font-bold tracking-[0.12em] uppercase text-[#999]">
              {showMore ? 'Menos opciones' : 'Más opciones'}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${showMore ? 'rotate-180' : ''}`}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showMore && (
            <>
              <ShareItem href={shareLinks.facebook} label="Facebook" preview="Compartir en tu perfil o página">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </ShareItem>

              <ShareItem href={shareLinks.messenger} label="Messenger" preview="Enviar por mensaje directo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#0078FF"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.561-6.96 3.129 3.26 5.889-3.26-6.561 6.96z"/></svg>
              </ShareItem>

              <ShareItem href={shareLinks.telegram} label="Telegram" preview="Compartir en chats o canales">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#26A5E4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </ShareItem>

              <ShareItem href={shareLinks.reddit} label="Reddit" preview="Publicar en subreddits relevantes">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#FF4500"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
              </ShareItem>

              <ShareItem href={shareLinks.threads} label="Threads" preview="Publicar en Threads de Meta">
                <svg width="15" height="15" viewBox="0 0 192 192" fill="#000"><path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.11 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.452-15.153 9.898-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.805 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553z"/><path d="M98.741 129.25c-10.886.6-19.585-3.424-20.076-12.604-.33-6.155 3.889-12.93 16.536-13.662 1.45-.083 2.87-.125 4.26-.125 5.36 0 10.377.534 14.96 1.556-1.703 21.25-5.368 24.362-15.68 24.836z"/></svg>
              </ShareItem>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Helper component ──────────────────────────────────────────────────────────

function ShareItem({ href, label, preview, children }: {
  href: string
  label: string
  preview: string
  children: React.ReactNode
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors border-b border-[#F0F0F0]">
      <div className="mt-0.5 flex-shrink-0 w-[15px] flex justify-center">{children}</div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[12px] font-semibold text-[#111] mb-0.5">{label}</p>
        <p className="font-sans text-[10px] text-[#999] leading-relaxed line-clamp-2">{preview}…</p>
      </div>
    </a>
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
