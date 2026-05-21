'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Channel = 'email' | 'whatsapp' | 'both'

export default function ApplyToAllForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [channel, setChannel] = useState<Channel>('email')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const apply = () => {
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/subscriptions/channel/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel_preference: channel }),
        })
        const json = (await res.json().catch(() => ({}))) as {
          ok?: boolean
          updated?: number
          error?: string
        }
        if (!res.ok || !json.ok) {
          setMsg({ kind: 'err', text: json.error ?? 'No se pudo aplicar.' })
          return
        }
        setMsg({
          kind: 'ok',
          text: `Preferencia aplicada a ${json.updated ?? 0} suscripciones.`,
        })
        router.refresh()
      } catch {
        setMsg({ kind: 'err', text: 'Error de red.' })
      }
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as Channel)}
          className="bg-white border border-[#DEDEDE] px-3 py-2 text-[14px] text-[#121212]"
          disabled={pending}
        >
          <option value="email">Solo email</option>
          <option value="whatsapp">Solo WhatsApp</option>
          <option value="both">Email y WhatsApp</option>
        </select>
        <button
          type="button"
          onClick={apply}
          disabled={pending}
          className="bg-[#121212] text-white text-[12px] font-medium tracking-wider uppercase px-5 py-2.5 disabled:opacity-50 hover:bg-black"
        >
          {pending ? 'Aplicando…' : 'Aplicar a todas'}
        </button>
      </div>
      {msg && (
        <p
          className={`mt-3 text-[13px] ${
            msg.kind === 'err' ? 'text-[#C41C1C]' : 'text-[#1A7A3A]'
          }`}
          role="status"
        >
          {msg.text}
        </p>
      )}
    </div>
  )
}
