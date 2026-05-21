'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  subscriptionId: string
  creatorName: string
}

export function CancelSubscriptionButton({ subscriptionId, creatorName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: subscriptionId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No se pudo cancelar.')
        setLoading(false)
        return
      }
      setOpen(false)
      router.refresh()
    } catch {
      setError('Error de red. Intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] text-[#B30000] border border-[#B30000] px-4 py-2 hover:bg-[#B30000] hover:text-white transition-colors"
      >
        Cancelar
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="bg-white border border-[#121212] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-[22px] font-bold text-[#121212] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              ¿Cancelar suscripción a {creatorName}?
            </h3>
            <p className="text-[14px] text-[#444444] mt-3">
              Dejarás de ser cobrado/a en la próxima renovación. Mantienes acceso al contenido
              hasta la fecha de tu próximo cobro.
            </p>
            {error && (
              <p className="text-[13px] text-[#B30000] mt-3 bg-[#FFE6E6] p-3">{error}</p>
            )}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="text-[13px] text-[#666666] px-4 py-2 hover:text-[#121212]"
              >
                Mantener suscripción
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="text-[13px] text-white bg-[#B30000] px-4 py-2 hover:bg-[#900000] disabled:opacity-60"
              >
                {loading ? 'Cancelando…' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
