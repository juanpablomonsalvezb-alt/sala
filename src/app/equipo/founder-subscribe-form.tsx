'use client'

import { useState } from 'react'

export function FounderSubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data: { ok: boolean; error?: string } = await res.json()
      if (data.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error ?? 'Algo salió mal. Intenta de nuevo.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-[#BBEECC] bg-[#F0FFF4] rounded p-4">
        <p className="font-sans text-[13px] text-[#2A7A47] font-medium">
          ¡Listo! Te avisamos con cada nueva publicación.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" noValidate>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        required
        disabled={status === 'loading'}
        className="flex-1 px-4 py-2.5 border border-[#DEDEDE] rounded font-sans text-[13px] text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#C41C1C] transition-colors duration-150 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'loading' || !email}
        className="px-5 py-2.5 bg-[#C41C1C] text-white rounded font-sans text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#a01717] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === 'loading' ? 'Enviando...' : 'Recibir Boletín Profesional'}
      </button>
      {status === 'error' && (
        <p className="w-full font-sans text-[12px] text-[#C41C1C] mt-1">{errorMsg}</p>
      )}
    </form>
  )
}
