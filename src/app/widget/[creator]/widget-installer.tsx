'use client'

import { useState } from 'react'

interface Size {
  label: string
  width: number
  height: number
}

const SIZES: Size[] = [
  { label: 'Compacto', width: 280, height: 380 },
  { label: 'Estándar', width: 300, height: 420 },
  { label: 'Grande', width: 360, height: 500 },
]

interface Props {
  slug: string
  creatorName: string
}

export function WidgetInstaller({ slug, creatorName }: Props) {
  const [selectedSize, setSelectedSize] = useState<Size>(SIZES[1])
  const [copied, setCopied] = useState(false)

  const code = `<iframe
  src="https://nebbuler.com/embed/iframe/${slug}?size=standard"
  width="${selectedSize.width}"
  height="${selectedSize.height}"
  frameborder="0"
  scrolling="no"
  style="border-radius:4px;border:0"
  title="Sala de ${creatorName} · Nebbuler"
  loading="lazy"
></iframe>`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: seleccionar el textarea
      const el = document.getElementById('widget-code') as HTMLTextAreaElement | null
      el?.select()
    }
  }

  return (
    <div>
      {/* Selector de tamaño */}
      <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] mb-3">
        Tamaño del widget
      </p>
      <div className="flex gap-2 mb-5">
        {SIZES.map((size) => (
          <button
            key={size.label}
            onClick={() => setSelectedSize(size)}
            className={`px-3 py-1.5 rounded text-[12px] font-sans font-medium border transition-colors duration-150 ${
              selectedSize.label === size.label
                ? 'bg-[#121212] text-white border-[#121212]'
                : 'bg-white text-[#666] border-[#DEDEDE] hover:border-[#999]'
            }`}
          >
            {size.label}
            <span className="block text-[10px] font-normal opacity-70">
              {size.width}×{size.height}
            </span>
          </button>
        ))}
      </div>

      {/* Código a copiar */}
      <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999] mb-2">
        Código HTML
      </p>
      <div className="relative">
        <textarea
          id="widget-code"
          readOnly
          value={code}
          rows={7}
          className="w-full font-mono text-[12px] bg-[#121212] text-[#F0F0F0] p-4 rounded border border-[#333] resize-none focus:outline-none leading-relaxed"
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 px-3 py-1.5 rounded text-[11px] font-sans font-semibold uppercase tracking-[0.06em] transition-all duration-150 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-[#C41C1C] text-white hover:bg-[#a01717]'
          }`}
        >
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 space-y-2">
        <p className="font-sans text-[12px] text-[#666]">
          <span className="font-semibold text-[#121212]">Cómo instalarlo:</span>
        </p>
        <ol className="space-y-1 list-decimal list-inside">
          {[
            'Copia el código de arriba',
            'Pégalo en el HTML de tu sitio web, blog o plataforma',
            'El widget aparecerá automáticamente con tus últimas publicaciones',
          ].map((step, i) => (
            <li key={i} className="font-sans text-[12px] text-[#666] leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
