'use client'

import { useState } from 'react'
import { trackShare, buildShareUrl, type ShareTool, type ShareChannel } from '@/lib/analytics/track-share'

interface ShareButtonsProps {
  tool: ShareTool
  url: string
  text: string
  variant?: 'inline' | 'block'
}

const CHANNELS: { id: Exclude<ShareChannel, 'instagram' | 'copy_link'>; label: string }[] = [
  { id: 'twitter',   label: 'Twitter / X' },
  { id: 'linkedin',  label: 'LinkedIn' },
  { id: 'whatsapp',  label: 'WhatsApp' },
  { id: 'telegram',  label: 'Telegram' },
]

export function ShareButtons({ tool, url, text, variant = 'inline' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = (channel: typeof CHANNELS[number]['id']) => {
    trackShare(tool, channel)
    const target = buildShareUrl(channel, url, text)
    if (typeof window !== 'undefined') {
      window.open(target, '_blank', 'noopener,noreferrer,width=600,height=600')
    }
  }

  const handleCopy = async () => {
    trackShare(tool, 'copy_link')
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const container =
    variant === 'block'
      ? 'flex flex-col gap-2 w-full'
      : 'flex flex-wrap gap-2 items-center'

  const btn =
    'px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-medium border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors duration-150'

  return (
    <div className={container}>
      {CHANNELS.map(c => (
        <button
          key={c.id}
          type="button"
          onClick={() => handleShare(c.id)}
          className={btn}
          aria-label={`Compartir en ${c.label}`}
        >
          {c.label}
        </button>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className={btn}
        aria-label="Copiar enlace"
      >
        {copied ? 'Copiado' : 'Copiar enlace'}
      </button>
    </div>
  )
}
