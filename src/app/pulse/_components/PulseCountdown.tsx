'use client'

import { useEffect, useState } from 'react'

/**
 * Cuenta regresiva al próximo refresh del Pulse (cada 6 horas: 00:00, 06:00, 12:00, 18:00 UTC).
 */
function nextRefresh(): Date {
  const now = new Date()
  const utcHours = now.getUTCHours()
  const nextSlot = Math.ceil((utcHours + 1) / 6) * 6
  const target = new Date(now)
  target.setUTCMinutes(0, 0, 0)
  if (nextSlot >= 24) {
    target.setUTCDate(target.getUTCDate() + 1)
    target.setUTCHours(0)
  } else {
    target.setUTCHours(nextSlot)
  }
  return target
}

function format(ms: number): string {
  if (ms <= 0) return '00h 00m'
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`
}

export function PulseCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setRemaining(nextRefresh().getTime() - Date.now())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#BBB] font-sans">
      <span className="w-2 h-2 rounded-full bg-[#C41C1C] animate-pulse" />
      <span>
        Próxima actualización en{' '}
        <span className="text-[#FAFAF7] font-bold tabular-nums">
          {remaining === null ? '—' : format(remaining)}
        </span>
      </span>
    </div>
  )
}
