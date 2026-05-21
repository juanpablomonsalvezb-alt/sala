'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { QuoteShareModal } from './QuoteShareModal'

interface QuoteSelectorProps {
  /** Nombre del creador (autor del post) */
  authorName: string
  /** @username del creador (slug) — usado en footer de la imagen */
  authorUsername: string
  /** UUID del creador, para tracking en /api/track/quote */
  creatorId: string
  /** UUID del post, para tracking */
  postId: string
  /** URL del post (mostrada en footer de la imagen) */
  postUrl: string
  /** Avatar opcional del creador (URL https) */
  authorAvatar?: string | null
  /** Selector CSS del contenedor donde se permite selección. Default: 'article' */
  rootSelector?: string
}

interface FloatingButtonState {
  visible: boolean
  x: number
  y: number
  text: string
}

const MIN_TEXT = 20
const MAX_TEXT = 280
const TOUCH_DELAY_MS = 500

/**
 * Detecta selección de texto en el body del post y muestra un botón flotante
 * "Convertir en imagen". Al hacer click, abre <QuoteShareModal /> con preview
 * de la imagen y 5 botones de share.
 *
 * No interfiere con el comportamiento normal de selección — solo aparece tras
 * mouseup/selectionchange con un texto válido (20-280 chars) dentro del root.
 */
export function QuoteSelector({
  authorName,
  authorUsername,
  creatorId,
  postId,
  postUrl,
  authorAvatar,
  rootSelector = 'article',
}: QuoteSelectorProps) {
  const [btn, setBtn] = useState<FloatingButtonState>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [modalText, setModalText] = useState('')
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const evaluateSelection = useCallback(() => {
    try {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
        return
      }
      const raw = selection.toString()
      const text = raw.replace(/\s+/g, ' ').trim()
      if (text.length < MIN_TEXT || text.length > MAX_TEXT) {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
        return
      }

      // Verificar que la selección esté dentro del root permitido
      const range = selection.getRangeAt(0)
      const ancestor = range.commonAncestorContainer
      const ancestorEl =
        ancestor.nodeType === Node.ELEMENT_NODE
          ? (ancestor as Element)
          : ancestor.parentElement
      if (!ancestorEl) {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
        return
      }
      const root = ancestorEl.closest(rootSelector)
      if (!root) {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
        return
      }

      const rect = range.getBoundingClientRect()
      if (!rect || rect.width === 0) {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
        return
      }

      setBtn({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        text,
      })
    } catch {
      setBtn((s) => (s.visible ? { ...s, visible: false } : s))
    }
  }, [rootSelector])

  // Mouse (desktop): on mouseup
  useEffect(() => {
    const onMouseUp = () => evaluateSelection()
    const onMouseDown = (e: MouseEvent) => {
      // No cerrar si el click cae dentro del botón flotante
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-quote-floating-btn]')) return
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
      }
    }
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [evaluateSelection])

  // Touch (mobile): debounce selectionchange — esperar a que el usuario suelte
  useEffect(() => {
    const onSelectionChange = () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
      touchTimerRef.current = setTimeout(() => {
        evaluateSelection()
      }, TOUCH_DELAY_MS)
    }
    document.addEventListener('selectionchange', onSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    }
  }, [evaluateSelection])

  // ESC cierra modal y botón
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBtn((s) => (s.visible ? { ...s, visible: false } : s))
        setModalOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleOpen = useCallback(() => {
    if (!btn.text) return
    setModalText(btn.text)
    setModalOpen(true)
    setBtn((s) => ({ ...s, visible: false }))
    // Limpiar selección visual para que no quede el highlight bajo el modal
    try {
      window.getSelection()?.removeAllRanges()
    } catch {
      /* noop */
    }
  }, [btn.text])

  const handleClose = useCallback(() => setModalOpen(false), [])

  return (
    <>
      {btn.visible && (
        <div
          data-quote-floating-btn
          style={{
            position: 'fixed',
            left: btn.x,
            top: btn.y - 12,
            transform: 'translate(-50%, -100%)',
            zIndex: 9998,
            pointerEvents: 'auto',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleOpen}
            className="bg-[#121212] text-white px-4 py-2.5 shadow-2xl hover:bg-[#C41C1C] transition-colors font-sans text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap flex items-center gap-2"
            aria-label="Convertir selección en imagen compartible"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            Convertir en imagen
          </button>
          {/* Arrow */}
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
      )}

      {modalOpen && (
        <QuoteShareModal
          text={modalText}
          authorName={authorName}
          authorUsername={authorUsername}
          authorAvatar={authorAvatar}
          creatorId={creatorId}
          postId={postId}
          postUrl={postUrl}
          onClose={handleClose}
        />
      )}
    </>
  )
}
