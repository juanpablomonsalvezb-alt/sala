'use client'

import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

type Kpis = {
  clicks: number
  signups: number
  conversions: number
  rewards: number
  nextRewardIn: number
  pendingReward: boolean
}

export default function ShareCard({
  username,
  creatorName,
  kpis,
}: {
  username: string
  creatorName: string
  kpis: Kpis
}) {
  const [copied, setCopied] = useState(false)

  const url = `https://nebbuler.com/r/${username}`
  const shareText = `${creatorName} te invita a Nebbuler. Crea tu sala desde este link y obtén 1 mes gratis: ${url}`

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  function nativeShare() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator
        .share({
          title: 'Nebbuler',
          text: shareText,
          url,
        })
        .catch(() => {})
    } else {
      copy()
    }
  }

  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const twHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const mailHref = `mailto:?subject=${encodeURIComponent(
    'Te invito a Nebbuler'
  )}&body=${encodeURIComponent(shareText)}`

  return (
    <div className="border border-[#E5E5E5] bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#666]">
            Tu link de referido
          </p>
          <p
            className="mt-1 text-[20px] sm:text-[24px] font-bold text-[#121212]"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            nebbuler.com/r/{username}
          </p>
        </div>
        <button
          type="button"
          onClick={nativeShare}
          className="hidden sm:flex items-center gap-2 text-[12px] font-medium text-[#666] hover:text-[#C41C1C] transition-colors"
        >
          <Share2 size={14} />
          Compartir
        </button>
      </div>

      {/* Acción primaria: copiar */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1 border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3 font-mono text-[13px] text-[#444] truncate">
          {url}
        </div>
        <button
          type="button"
          onClick={copy}
          className={`flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-bold uppercase tracking-[0.08em] transition-all ${
            copied
              ? 'bg-[#0A7A3B] text-white'
              : 'bg-[#121212] text-white hover:bg-[#C41C1C] active:scale-[0.98]'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copiado
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar
            </>
          )}
        </button>
      </div>

      {/* Botones de share por canal */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px] font-medium text-[#121212] transition-all hover:border-[#25D366] hover:text-[#25D366]"
        >
          WhatsApp
        </a>
        <a
          href={twHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px] font-medium text-[#121212] transition-all hover:border-[#121212] hover:bg-[#121212] hover:text-white"
        >
          Twitter / X
        </a>
        <a
          href={liHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px] font-medium text-[#121212] transition-all hover:border-[#0A66C2] hover:text-[#0A66C2]"
        >
          LinkedIn
        </a>
        <a
          href={mailHref}
          className="flex items-center justify-center gap-2 border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px] font-medium text-[#121212] transition-all hover:border-[#C41C1C] hover:text-[#C41C1C]"
        >
          Email
        </a>
      </div>

      {/* Hint progreso */}
      {kpis.pendingReward ? (
        <div className="mt-5 border border-[#0A7A3B]/30 bg-[#F0FAF5] px-4 py-3">
          <p className="text-[13px] text-[#0A7A3B]">
            <strong>¡Tienes un mes gratis pendiente!</strong> Se acreditará en tu próximo ciclo.
          </p>
        </div>
      ) : kpis.nextRewardIn > 0 ? (
        <div className="mt-5 border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3">
          <p className="text-[12px] text-[#666]">
            Te faltan{' '}
            <strong className="text-[#121212]">
              {kpis.nextRewardIn} conversion{kpis.nextRewardIn === 1 ? '' : 'es'}
            </strong>{' '}
            para tu próximo mes gratis.
          </p>
        </div>
      ) : null}
    </div>
  )
}
