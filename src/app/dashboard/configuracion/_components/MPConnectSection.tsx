'use client'

import { useState } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      day:   'numeric',
      month: 'long',
      year:  'numeric',
    })
  } catch {
    return iso
  }
}

function resolveErrorMessage(error: string): string {
  const map: Record<string, string> = {
    access_denied:  'Cancelaste la autorización en MercadoPago.',
    invalid_state:  'La sesión expiró. Intenta conectar de nuevo.',
    token_exchange: 'Error al intercambiar el código de autorización.',
    db_error:       'Error al guardar los datos. Intenta nuevamente.',
    server_config:  'La integración MP no está configurada en el servidor.',
    unknown:        'Ocurrió un error inesperado.',
  }
  return map[error] ?? `Error: ${error}`
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  connected:     boolean
  mpUserId:      string | null
  mpConnectedAt: string | null
  /** 'connected' | 'disconnected' | 'error:<code>' | null */
  flash:         string | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MPConnectSection({
  connected,
  mpUserId,
  mpConnectedAt,
  flash,
}: Props) {
  const [disconnecting, setDisconnecting] = useState(false)

  const isError      = flash?.startsWith('error:') ?? false
  const errorCode    = isError ? flash!.replace('error:', '') : null
  const showSuccess  = flash === 'connected'
  const showDiscoMsg = flash === 'disconnected'

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      await fetch('/api/mp/disconnect', { method: 'POST', redirect: 'follow' })
      // La respuesta es un redirect — forzamos recarga para reflejar estado
      window.location.href = '/dashboard/configuracion?mp_disconnected=1'
    } catch {
      setDisconnecting(false)
    }
  }

  return (
    <section
      className="bg-white border border-[#DEDEDE] px-6 py-6 mb-6"
      aria-label="Cuenta de pagos"
    >
      {/* Título */}
      <h2
        className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] mb-5 pb-3 border-b border-[#DEDEDE]"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        Cuenta de pagos
      </h2>

      {/* Flash messages */}
      {showSuccess && (
        <div className="mb-4 border border-[#C6EFC8] bg-[#F0FAF0] px-4 py-3">
          <p
            className="text-[13px] text-[#1A7F2A] font-medium"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Cuenta de MercadoPago conectada correctamente.
          </p>
        </div>
      )}

      {showDiscoMsg && (
        <div className="mb-4 border border-[#DEDEDE] bg-[#F7F7F7] px-4 py-3">
          <p
            className="text-[13px] text-[#666666]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Cuenta de MercadoPago desconectada.
          </p>
        </div>
      )}

      {isError && errorCode && (
        <div className="mb-4 border border-[#F5C6C6] bg-[#FDF0F0] px-4 py-3">
          <p
            className="text-[13px] text-[#C41C1C]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {resolveErrorMessage(errorCode)}
          </p>
        </div>
      )}

      {/* Estado: no conectado */}
      {!connected && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E5A000] flex-shrink-0" />
              <p
                className="text-[13px] font-semibold text-[#121212]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Tus suscriptores no pueden pagarte todavía
              </p>
            </div>
            <p
              className="text-[13px] text-[#666666] ml-4"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Conecta tu cuenta de MercadoPago para recibir pagos directamente.
            </p>
          </div>
          <a
            href="/api/mp/connect"
            className="inline-flex items-center gap-1.5 flex-shrink-0 bg-[#009EE3] text-white text-[13px] font-semibold px-5 py-2.5 hover:bg-[#007BB5] transition-colors whitespace-nowrap"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Conectar MercadoPago
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}

      {/* Estado: conectado */}
      {connected && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#1A7F2A] flex-shrink-0" />
              <p
                className="text-[13px] font-semibold text-[#121212]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Cuenta MercadoPago conectada
              </p>
            </div>
            <p
              className="text-[13px] text-[#666666] ml-4"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Los pagos de tus lectores van directo a tu cuenta.
            </p>
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-4"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {mpUserId && (
                <span className="text-[12px] text-[#888888]">
                  ID #{mpUserId}
                </span>
              )}
              {mpConnectedAt && (
                <span className="text-[12px] text-[#888888]">
                  Conectado el {formatDate(mpConnectedAt)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="inline-flex items-center gap-1.5 flex-shrink-0 border border-[#DEDEDE] text-[#666666] text-[12px] font-medium px-4 py-2 hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {disconnecting ? 'Desconectando...' : 'Desconectar'}
          </button>
        </div>
      )}
    </section>
  )
}
