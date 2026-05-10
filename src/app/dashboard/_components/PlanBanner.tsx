'use client'

import { useState, useEffect } from 'react'

interface PlanBannerProps {
  plan: 'free' | 'creator' | 'pro'
}

export function PlanBanner({ plan }: PlanBannerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activado, setActivado] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('activado') === '1') {
      setActivado(true)
    }
  }, [])

  if (plan !== 'free') return null

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ls/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Error al iniciar el pago')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FFF8F0] border-b border-[#F5DEB3] px-8 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.12em] bg-[#F5DEB3] text-[#8B4513] px-2 py-0.5">
          Plan gratuito
        </span>
        <p className="text-[13px] text-[#8B4513]">
          {activado
            ? 'Tu pago fue recibido. El plan se activará en los próximos minutos.'
            : 'Activa tu sala para publicar y recibir suscriptores.'}
        </p>
      </div>
      {!activado && (
        <div className="flex items-center gap-3">
          {error && <span className="text-[12px] text-[#C41C1C]">{error}</span>}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-[#121212] text-white text-[12px] font-semibold px-4 py-2 hover:bg-[#2a2a2a] transition-colors disabled:opacity-60 flex-shrink-0"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {loading ? 'Cargando...' : 'Activar por $29.990/mes →'}
          </button>
        </div>
      )}
    </div>
  )
}
