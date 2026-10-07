'use client'

import { useState } from 'react'

export function ToolShare({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const url = () => window.location.href

  async function copy() {
    try {
      await navigator.clipboard.writeText(url())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // sin permiso de portapapeles: no hacemos nada
    }
  }

  const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')
  const btn =
    'px-3 py-2 border border-[#DEDEDE] font-sans text-[12px] font-semibold text-[#121212] hover:border-[#121212] transition-colors'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] mr-1">Compartir</span>
      <button type="button" onClick={copy} className={btn}>
        {copied ? 'Enlace copiado' : 'Copiar enlace'}
      </button>
      <button
        type="button"
        onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`)}
        className={btn}
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() =>
          open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)
        }
        className={btn}
      >
        LinkedIn
      </button>
      <button
        type="button"
        onClick={() =>
          open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url())}`)
        }
        className={btn}
      >
        X
      </button>
    </div>
  )
}
