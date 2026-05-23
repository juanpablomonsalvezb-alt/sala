'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

/**
 * Exit-intent popup — se muestra cuando el usuario mueve el mouse fuera del viewport.
 * Solo desktop (mouseleave). Se muestra 1 vez por sesión (sessionStorage).
 * CTA: calculadora /cuanto-te-quitan.
 */
export function ExitIntentPopup() {
  const [show, setShow] = useState(false)

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Solo si sale por arriba (intención de cerrar tab/ir a URL bar)
    if (e.clientY > 10) return
    if (sessionStorage.getItem('nbb-exit-shown')) return

    sessionStorage.setItem('nbb-exit-shown', '1')
    setShow(true)
  }, [])

  useEffect(() => {
    // No mostrar en móvil ni si ya se mostró
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return
    if (sessionStorage.getItem('nbb-exit-shown')) return

    // Delay 10s antes de activar — no molestar a quien acaba de llegar
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 10000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseLeave])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setShow(false)}
    >
      <div
        className="relative bg-[#0A0A0A] text-white max-w-lg w-full mx-4 p-8 md:p-10 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Red accent bar */}
        <div className="h-[3px] w-16 bg-[#C41C1C] mb-6" />

        <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
          Antes de irte
        </p>

        <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3">
          ¿Sabías que pierdes hasta{' '}
          <span className="text-[#C41C1C]">22% de cada pago</span> en plataformas gringas?
        </h3>

        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Comisión + Stripe + conversión cambiaria. Calcula tu pérdida real en 10 segundos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/cuanto-te-quitan"
            className="inline-flex items-center justify-center gap-2 bg-[#C41C1C] text-white px-6 py-3 text-sm font-semibold hover:bg-[#A51616] transition-colors"
            onClick={() => setShow(false)}
          >
            Calcular mi pérdida →
          </Link>
          <button
            onClick={() => setShow(false)}
            className="text-white/40 text-sm hover:text-white/60 transition-colors py-3"
          >
            No gracias
          </button>
        </div>
      </div>
    </div>
  )
}
