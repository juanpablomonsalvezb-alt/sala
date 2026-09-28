'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { displayName } from '@/components/auth-nav-actions'

/**
 * Aviso tras volver de OAuth/confirmación de email. /auth/callback agrega
 * ?bienvenida=nuevo|sesion; aquí se muestra y se limpia de la URL.
 */
export function AuthWelcomeToast() {
  const [message, setMessage] = useState<{ title: string; body: string } | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const kind = url.searchParams.get('bienvenida')
    if (kind !== 'nuevo' && kind !== 'sesion') return

    url.searchParams.delete('bienvenida')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)

    createClient().auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const name = displayName(user)
      setMessage(
        kind === 'nuevo'
          ? { title: `¡Cuenta creada, ${name}!`, body: `Ya eres parte de Nebbuler con ${user.email}.` }
          : { title: `Hola de nuevo, ${name}`, body: `Sesión iniciada con ${user.email}.` }
      )
    })
  }, [])

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 7000)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] z-[100] bg-[#121212] text-white border-l-4 border-[#B31C1C] shadow-lg px-5 py-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-[16px] font-bold leading-tight">{message.title}</p>
          <p className="mt-1 font-sans text-[13px] text-[#CCCCCC] break-all">{message.body}</p>
        </div>
        <button
          type="button"
          onClick={() => setMessage(null)}
          aria-label="Cerrar"
          className="font-sans text-[18px] leading-none text-[#999] hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  )
}
