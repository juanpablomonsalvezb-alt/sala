'use client'

// Newsletter subscribe widget — NEWSLETTER_ENABLED=true/false
// Standalone element — add to any public page without touching existing components
// POSTs to /api/listmonk/subscribe

import { useState } from 'react'

interface SubscribeWidgetProps {
  title?: string
  description?: string
  placeholder?: string
  ctaLabel?: string
  compact?: boolean
}

export default function SubscribeWidget({
  title = 'Recibe lo mejor de Nebbuler',
  description = 'Análisis profesional, guías y casos de éxito cada semana. Sin spam.',
  placeholder = 'tu@email.com',
  ctaLabel = 'Suscribirme',
  compact = false,
}: SubscribeWidgetProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      })
      const data = await res.json() as { ok: boolean; message?: string; error?: string }

      if (data.ok) {
        setStatus('success')
        setMessage(data.message ?? '¡Listo! Te llega el próximo boletín.')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Algo salió mal. Intenta de nuevo.')
      }
    } catch {
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#C41C1C] focus:outline-none focus:ring-1 focus:ring-[#C41C1C]"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="shrink-0 rounded-lg bg-[#C41C1C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a81717] disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? '...' : ctaLabel}
        </button>
        {status === 'success' && (
          <span className="ml-2 self-center text-xs text-green-600">{message}</span>
        )}
        {status === 'error' && (
          <span className="ml-2 self-center text-xs text-red-600">{message}</span>
        )}
      </form>
    )
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 p-6 text-center">
        <div className="text-2xl mb-2">✓</div>
        <p className="font-semibold text-green-800">¡Suscrito!</p>
        <p className="mt-1 text-sm text-green-700">{message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre (opcional)"
          disabled={status === 'loading'}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#C41C1C] focus:outline-none focus:ring-1 focus:ring-[#C41C1C]"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === 'loading'}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#C41C1C] focus:outline-none focus:ring-1 focus:ring-[#C41C1C]"
        />

        {status === 'error' && (
          <p className="text-xs text-red-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-[#C41C1C] py-2.5 text-sm font-bold text-white hover:bg-[#a81717] disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? 'Suscribiendo...' : ctaLabel}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-gray-400">Sin spam. Baja cuando quieras.</p>
    </div>
  )
}
