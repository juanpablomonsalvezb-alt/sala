'use client'

import { useEffect, useState, useCallback } from 'react'

interface TooltipState {
  visible: boolean
  x: number
  y: number
  text: string
  id: string
}

export function QuoteHighlighter({ authorName }: { authorName: string }) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
    id: '',
  })

  const generateId = useCallback(
    (text: string): string => {
      try {
        return btoa(JSON.stringify({ q: text.slice(0, 280), a: authorName }))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')
      } catch {
        return ''
      }
    },
    [authorName],
  )

  const handleSelection = useCallback(() => {
    try {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }
      const text = selection.toString().trim()
      if (text.length < 20 || text.length > 280) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      if (!rect || rect.width === 0) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }
      const id = generateId(text)
      if (!id) {
        setTooltip((t) => ({ ...t, visible: false }))
        return
      }
      setTooltip({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        text,
        id,
      })
    } catch {
      setTooltip((t) => ({ ...t, visible: false }))
    }
  }, [generateId])

  const handleClickOutside = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setTooltip((t) => ({ ...t, visible: false }))
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleSelection, handleClickOutside])

  if (!tooltip.visible) return null

  const shareUrl = `https://nebbuler.com/c/${tooltip.id}`
  const truncatedText = tooltip.text.slice(0, 200)
  const tweetText = encodeURIComponent(
    `"${truncatedText}" — ${authorName} en @nebbuler\n${shareUrl}`,
  )
  const waText = encodeURIComponent(
    `"${truncatedText}"\n— ${authorName} en Nebbuler\n${shareUrl}`,
  )

  return (
    <div
      style={{
        position: 'fixed',
        left: tooltip.x,
        top: tooltip.y - 8,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="bg-[#121212] text-white flex items-center gap-0 shadow-xl">
        {/* Cita */}
        <a
          href={`/c/${tooltip.id}`}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-1.5 px-3 py-2 hover:bg-[#C41C1C] transition-colors font-sans text-[11px] font-bold tracking-wide uppercase whitespace-nowrap"
          onClick={() => setTooltip((t) => ({ ...t, visible: false }))}
        >
          <span className="text-[#C41C1C] text-[14px] leading-none">&ldquo;</span>
          Citar
        </a>
        <div className="w-px h-4 bg-[#333] flex-shrink-0" />
        {/* Twitter/X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 hover:bg-[#C41C1C] transition-colors font-sans text-[11px] font-bold tracking-wide uppercase whitespace-nowrap"
          title="Compartir en X"
          onClick={() => setTooltip((t) => ({ ...t, visible: false }))}
        >
          𝕏
        </a>
        <div className="w-px h-4 bg-[#333] flex-shrink-0" />
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 hover:bg-[#C41C1C] transition-colors font-sans text-[11px] font-bold tracking-wide uppercase whitespace-nowrap"
          title="WhatsApp"
          onClick={() => setTooltip((t) => ({ ...t, visible: false }))}
        >
          WA
        </a>
      </div>
      {/* Flecha CSS apuntando hacia abajo */}
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #121212',
        }}
      />
    </div>
  )
}
