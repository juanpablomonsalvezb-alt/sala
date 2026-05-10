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
    if (params.get('activado') === '1') setActivado(true)
  }, [])

  if (plan !== 'free') return null

  async function handleActivar() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/mp/platform-checkout', { method: 'POST' })
      const json = await res.json()
      if (!res.ok || !json.url) {
        setError(json.error ?? 'Error al iniciar el pago')
        return
      }
      window.location.href = json.url
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FFF8F0] border-b border-[#F5DEB3] px-8 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.12em] bg-[#F5DEB3] text-[#8B4513] px-2 py-0.5"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Plan gratuito
        </span>
        <p className="text-[13px] text-[#8B4513]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          {activado
            ? 'Tu pago fue recibido — el plan se activará en minutos.'
            : 'Activa tu sala para publicar y recibir suscriptores.'}
        </p>
      </div>
      {!activado && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {error && (
            <span className="text-[12px] text-[#C41C1C]" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              {error}
            </span>
          )}
          <button
            onClick={handleActivar}
            disabled={loading}
            className="bg-[#009EE3] hover:bg-[#007AB8] text-white text-[12px] font-semibold px-4 py-2 transition-colors disabled:opacity-60"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {loading ? 'Cargando...' : 'Activar por $29.990/mes →'}
          </button>
        </div>
      )}
    </div>
  )
}
