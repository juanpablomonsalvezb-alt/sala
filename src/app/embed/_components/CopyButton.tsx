'use client'

import { useState } from 'react'

export default function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback antiguo
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // sin clipboard disponible
      }
      document.body.removeChild(ta)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-2 text-[12px] font-medium transition-colors ${
        copied ? 'bg-[#121212] text-white' : 'bg-white border border-[#DEDEDE] text-[#121212] hover:border-[#121212]'
      }`}
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      aria-label={copied ? 'Copiado al portapapeles' : 'Copiar al portapapeles'}
    >
      {copied ? 'Copiado' : label}
    </button>
  )
}
