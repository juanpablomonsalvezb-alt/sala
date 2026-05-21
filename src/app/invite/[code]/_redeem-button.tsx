'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function InviteRedeemButton({ code }: { code: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleRedeem() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/invites/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No se pudo redimir el código.')
        setLoading(false)
        return
      }
      setSuccess(true)
      // Si el creator ya existe, redirigir al dashboard
      if (data.creator_activated) {
        setTimeout(() => router.push('/dashboard'), 1500)
      } else {
        // Si no existe creator aún, mandarlo a /abrir
        setTimeout(() => router.push('/abrir'), 1500)
      }
    } catch {
      setError('Error de red. Intenta nuevamente.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#F0FDF4] border border-[#86EFAC] px-5 py-4 text-center">
        <p className="text-[14px] font-medium text-[#15803D]">
          ✓ Código redimido. Redirigiendo…
        </p>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={handleRedeem}
        disabled={loading}
        className="w-full bg-[#C41C1C] hover:bg-[#A01515] text-white font-medium text-[14px] py-4 transition-colors disabled:opacity-60"
      >
        {loading ? 'Activando…' : 'Activar mi sala gratis →'}
      </button>
      {error && (
        <p className="text-[13px] text-[#B30000] mt-3 bg-[#FFE6E6] p-3">{error}</p>
      )}
    </>
  )
}
