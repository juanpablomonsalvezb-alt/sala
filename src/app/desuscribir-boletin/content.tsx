'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Status = 'loading' | 'success' | 'error' | 'invalid'

export function DesuscribirBoletinContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token || token.length < 40) {
      setStatus('invalid')
      return
    }

    async function processUnsubscribe() {
      try {
        const res = await fetch(`/api/boletin/desuscribir?token=${encodeURIComponent(token)}`)
        const data: { ok: boolean; error?: string } = await res.json()

        if (data.ok) {
          setStatus('success')
        } else {
          setStatus('error')
          setErrorMsg(data.error ?? 'No se pudo procesar tu solicitud.')
        }
      } catch {
        setStatus('error')
        setErrorMsg('Error de conexión. Intenta de nuevo más tarde.')
      }
    }

    processUnsubscribe()
  }, [token])

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-16">
      <div className="bg-white max-w-[480px] w-full">
        {/* Barra superior roja */}
        <div className="h-1 bg-[#C41C1C]" />

        <div className="px-10 py-12 text-center">
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 border-2 border-[#EBEBEB] border-t-[#121212] rounded-full mx-auto mb-6 animate-spin" />
              <p className="font-sans text-[13px] text-[#888888]">Procesando tu solicitud...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-[#121212] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-xl leading-none">&#10003;</span>
              </div>
              <p className="font-sans text-[9px] font-bold tracking-[3px] text-[#888888] uppercase mb-4">
                Nebbuler
              </p>
              <h1 className="font-serif text-[24px] text-[#121212] font-normal mb-4 leading-tight">
                Suscripción cancelada
              </h1>
              <p className="font-sans text-[14px] text-[#555555] leading-relaxed mb-8">
                Ya no recibirás el Boletín Profesional de Nebbuler. Si en algún momento deseas volver a recibirlo, puedes reactivarlo desde tu perfil.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#121212] text-white font-sans text-[10px] font-bold tracking-[2px] uppercase px-6 py-3 no-underline hover:bg-[#333333] transition-colors duration-150"
              >
                Ir a Nebbuler &rarr;
              </Link>
            </>
          )}

          {(status === 'error' || status === 'invalid') && (
            <>
              <div className="w-12 h-12 bg-[#C41C1C] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-xl leading-none font-bold">!</span>
              </div>
              <p className="font-sans text-[9px] font-bold tracking-[3px] text-[#888888] uppercase mb-4">
                Nebbuler
              </p>
              <h1 className="font-serif text-[24px] text-[#121212] font-normal mb-4 leading-tight">
                {status === 'invalid' ? 'Link inválido' : 'Algo salió mal'}
              </h1>
              <p className="font-sans text-[14px] text-[#555555] leading-relaxed mb-8">
                {status === 'invalid'
                  ? 'Este link de cancelación no es válido. Asegúrate de usar el link completo del correo.'
                  : errorMsg}
              </p>
              <Link
                href="/"
                className="inline-block bg-[#C41C1C] text-white font-sans text-[10px] font-bold tracking-[2px] uppercase px-6 py-3 no-underline hover:bg-[#a01717] transition-colors duration-150"
              >
                Ir a Nebbuler &rarr;
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
