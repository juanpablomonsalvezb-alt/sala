'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/entrar'), 2000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header>
        <div className="h-[3px] bg-[#B31C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="border-b border-[#DEDEDE] pb-6 mb-8">
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-2">
              CUENTA
            </p>
            <h1 className="font-serif text-[28px] font-bold text-[#121212]">
              Nueva contraseña
            </h1>
          </div>

          {success ? (
            <div className="bg-[#F0FAF4] border border-[#0D7A3A] p-6 text-center">
              <p className="font-sans text-[14px] text-[#0D7A3A] font-medium">
                Contraseña actualizada. Redirigiendo al inicio de sesión…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.12em] text-[#666] mb-2">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full border border-[#DEDEDE] px-4 py-3 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.12em] text-[#666] mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full border border-[#DEDEDE] px-4 py-3 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
                  placeholder="Repite la contraseña"
                />
              </div>

              {error && (
                <p className="font-sans text-[13px] text-[#B31C1C]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#121212] text-white font-sans text-[14px] font-semibold py-3.5 hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                {loading ? 'Actualizando…' : 'Actualizar contraseña'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
