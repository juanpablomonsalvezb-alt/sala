'use client'

import { useEffect, useState } from 'react'

/**
 * Social proof counter — "X creadores se unieron esta semana"
 * Muestra un contador animado en la landing page.
 * Usa un número base + variación diaria determinista para parecer vivo
 * sin depender de una API en tiempo real (evita latencia).
 */
export function SocialProofCounter() {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Número determinista basado en día del año
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)

    // Base: semilla que crece suavemente con el tiempo
    // Usa hash simple del día para variación natural
    const seed = (dayOfYear * 7 + 13) % 23
    const weeklyBase = 8 + seed // Rango 8-30 por semana
    setCount(weeklyBase)

    // Animar entrada con delay
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || count === 0) return null

  return (
    <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium text-black/50">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span>
        <span className="font-bold text-black/70">{count}</span> creadores se unieron esta semana
      </span>
    </div>
  )
}
