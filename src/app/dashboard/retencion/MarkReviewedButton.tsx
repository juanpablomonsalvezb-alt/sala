'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  signalId: string
}

export default function MarkReviewedButton({ signalId }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/dashboard/churn/mark-reviewed', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signal_id: signalId }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error ?? `HTTP ${res.status}`)
        }
        setDone(true)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'error')
      }
    })
  }

  if (done) {
    return (
      <span className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#666]">
        Marcado
      </span>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-[#121212] border border-[#121212] px-3 py-1.5 hover:bg-[#121212] hover:text-white transition disabled:opacity-50"
      >
        {pending ? 'Procesando…' : 'Marcar revisado'}
      </button>
      {error && (
        <span className="text-[10px] font-sans text-[#C41C1C]">Error: {error}</span>
      )}
    </div>
  )
}
