'use client'

/**
 * PreferencesPanel — gestiona canal de notificación (email / whatsapp / both)
 * y verificación de teléfono por WhatsApp.
 *
 * Diseño NYT editorial: serif Playfair Display + paleta #121212 / #C41C1C / #FAFAF7.
 * Stub-safe: si el endpoint devuelve dev_code, lo muestra en development.
 */

import { useState, useTransition, useEffect, useCallback } from 'react'

type Channel = 'email' | 'whatsapp' | 'both'

const E164_REGEX = /^\+[1-9]\d{6,14}$/

export interface PreferencesPanelProps {
  subscriptionId: string
  initialPrefs?: {
    phone?: string | null
    channel_preference?: Channel | null
    phone_verified?: boolean | null
  }
  /**
   * Endpoint para guardar la preferencia de canal por suscripción.
   * Por defecto: POST /api/subscriptions/[id]/channel
   * Si tu app aún no lo tiene, el guardado degrada con warning.
   */
  savePrefEndpoint?: string
  /** Mostrar título grande. Default true. */
  showTitle?: boolean
}

function maskPhone(p: string | null | undefined): string {
  if (!p) return ''
  if (p.length <= 5) return p
  return `${p.slice(0, p.length - 4).replace(/\d/g, (d, i) => (i < 4 ? d : '*'))}${'*'.repeat(4)}`
}

export default function PreferencesPanel({
  subscriptionId,
  initialPrefs,
  savePrefEndpoint,
  showTitle = true,
}: PreferencesPanelProps) {
  const [channel, setChannel] = useState<Channel>(
    initialPrefs?.channel_preference ?? 'email'
  )
  const [phone, setPhone] = useState<string>(initialPrefs?.phone ?? '')
  const [verified, setVerified] = useState<boolean>(
    Boolean(initialPrefs?.phone_verified)
  )

  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [statusKind, setStatusKind] = useState<'ok' | 'err' | null>(null)

  const [showCodeModal, setShowCodeModal] = useState(false)
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [verifyingCode, setVerifyingCode] = useState(false)

  const [sendingCode, setSendingCode] = useState(false)
  const [savePending, startSaving] = useTransition()

  // Validación phone E.164
  const phoneOk = phone === '' || E164_REGEX.test(phone)

  useEffect(() => {
    if (phone && !phoneOk) {
      setPhoneError('Formato inválido. Usa el formato internacional, ej. +56912345678')
    } else {
      setPhoneError(null)
    }
  }, [phone, phoneOk])

  // ── Enviar código ──────────────────────────────────────────────────────
  const sendCode = useCallback(async () => {
    setStatusMsg(null)
    setStatusKind(null)
    setDevCode(null)
    if (!phone || !E164_REGEX.test(phone)) {
      setPhoneError('Formato inválido. Usa el formato internacional, ej. +56912345678')
      return
    }
    setSendingCode(true)
    try {
      const res = await fetch('/api/notifications/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const json = (await res.json()) as {
        ok?: boolean
        error?: string
        delivered?: boolean
        reason?: string
        dev_code?: string
        retry_in?: number
        message?: string
      }
      if (!res.ok || !json.ok) {
        if (json.error === 'cooldown') {
          setStatusKind('err')
          setStatusMsg(
            `Espera ${json.retry_in ?? 60} segundos antes de pedir otro código.`
          )
        } else {
          setStatusKind('err')
          setStatusMsg(json.message ?? json.error ?? 'No se pudo enviar el código.')
        }
        return
      }
      if (json.dev_code) setDevCode(json.dev_code)
      setShowCodeModal(true)
      setStatusKind('ok')
      setStatusMsg(
        json.delivered
          ? 'Código enviado por WhatsApp. Revisa tu app.'
          : 'Código generado en modo desarrollo (WhatsApp aún no está configurado).'
      )
    } catch (err) {
      setStatusKind('err')
      setStatusMsg('Error de red. Intenta nuevamente.')
      console.warn('[prefs] send code error:', (err as Error).message)
    } finally {
      setSendingCode(false)
    }
  }, [phone])

  // ── Verificar código ───────────────────────────────────────────────────
  const verifyCode = useCallback(async () => {
    if (!/^\d{6}$/.test(code)) {
      setStatusKind('err')
      setStatusMsg('El código debe ser de 6 dígitos.')
      return
    }
    setVerifyingCode(true)
    try {
      const res = await fetch(
        `/api/notifications/verify-phone?code=${encodeURIComponent(code)}`
      )
      const json = (await res.json()) as { ok?: boolean; error?: string; phone?: string }
      if (!res.ok || !json.ok) {
        setStatusKind('err')
        if (json.error === 'code_expired') setStatusMsg('El código expiró. Pide uno nuevo.')
        else if (json.error === 'code_mismatch') setStatusMsg('Código incorrecto.')
        else setStatusMsg(json.error ?? 'No se pudo verificar el código.')
        return
      }
      setVerified(true)
      setShowCodeModal(false)
      setCode('')
      setStatusKind('ok')
      setStatusMsg('Teléfono verificado correctamente.')
    } catch (err) {
      setStatusKind('err')
      setStatusMsg('Error de red al verificar el código.')
      console.warn('[prefs] verify code error:', (err as Error).message)
    } finally {
      setVerifyingCode(false)
    }
  }, [code])

  // ── Guardar preferencia de canal ───────────────────────────────────────
  const savePreference = useCallback(
    (next: Channel) => {
      setChannel(next)
      const endpoint =
        savePrefEndpoint ?? `/api/subscriptions/${subscriptionId}/channel`
      startSaving(async () => {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channel_preference: next }),
          })
          if (!res.ok) {
            const json = (await res.json().catch(() => ({}))) as { error?: string }
            setStatusKind('err')
            setStatusMsg(
              json.error ?? 'No se pudo guardar la preferencia (se reintenta al recargar).'
            )
          } else {
            setStatusKind('ok')
            setStatusMsg('Preferencia guardada.')
          }
        } catch (err) {
          setStatusKind('err')
          setStatusMsg('Error de red al guardar.')
          console.warn('[prefs] save error:', (err as Error).message)
        }
      })
    },
    [subscriptionId, savePrefEndpoint]
  )

  const needsPhone = channel === 'whatsapp' || channel === 'both'

  return (
    <div className="bg-white border border-[#DEDEDE] p-6 sm:p-8">
      {showTitle && (
        <h3
          className="text-[20px] font-bold text-[#121212] mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Notificaciones
        </h3>
      )}
      <p className="text-[13px] text-[#666666] mb-6">
        Elige cómo quieres recibir los nuevos posts. Puedes cambiar esto en cualquier momento.
      </p>

      {/* Radios */}
      <fieldset className="space-y-3" disabled={savePending}>
        <legend className="sr-only">Canal de notificación</legend>

        {(
          [
            {
              value: 'email',
              title: 'Solo email',
              desc: 'Recibe cada nuevo análisis en tu bandeja.',
            },
            {
              value: 'whatsapp',
              title: 'Solo WhatsApp',
              desc: 'Notificación inmediata al chat. Requiere teléfono verificado.',
            },
            {
              value: 'both',
              title: 'Email y WhatsApp',
              desc: 'Recibe ambos. El más usado por suscriptores premium.',
            },
          ] as { value: Channel; title: string; desc: string }[]
        ).map((opt) => {
          const active = channel === opt.value
          return (
            <label
              key={opt.value}
              className={`block border cursor-pointer p-4 transition-colors ${
                active
                  ? 'border-[#121212] bg-[#FAFAF7]'
                  : 'border-[#DEDEDE] hover:border-[#999999] bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="channel"
                  value={opt.value}
                  checked={active}
                  onChange={() => savePreference(opt.value)}
                  className="mt-1 accent-[#C41C1C]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[15px] font-semibold text-[#121212]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {opt.title}
                    </span>
                    {opt.value === 'both' && (
                      <span className="text-[9px] uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-1.5 py-0.5">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#666666] mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </label>
          )
        })}
      </fieldset>

      {/* Phone input */}
      {needsPhone && (
        <div className="mt-6 pt-6 border-t border-[#EEE]">
          <label
            htmlFor={`phone-${subscriptionId}`}
            className="block text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium mb-2"
          >
            Tu número de WhatsApp
          </label>
          {verified ? (
            <div className="flex items-center justify-between bg-[#FAFAF7] border border-[#DEDEDE] p-3">
              <div>
                <p className="text-[15px] text-[#121212] font-mono">
                  {maskPhone(phone)}
                </p>
                <p className="text-[11px] text-[#1A7A3A] mt-0.5 inline-flex items-center gap-1">
                  <span aria-hidden>●</span> Verificado
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVerified(false)
                  setPhone('')
                }}
                className="text-[12px] text-[#666666] underline underline-offset-2 hover:text-[#121212]"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <>
              <input
                id={`phone-${subscriptionId}`}
                type="tel"
                inputMode="tel"
                placeholder="+56 9 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\s/g, ''))}
                className={`w-full bg-white border px-3 py-2.5 text-[15px] font-mono outline-none focus:ring-2 focus:ring-[#C41C1C]/30 ${
                  phoneError ? 'border-[#C41C1C]' : 'border-[#DEDEDE]'
                }`}
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? `phone-err-${subscriptionId}` : undefined}
              />
              {phoneError && (
                <p
                  id={`phone-err-${subscriptionId}`}
                  className="text-[12px] text-[#C41C1C] mt-1.5"
                >
                  {phoneError}
                </p>
              )}
              <button
                type="button"
                onClick={sendCode}
                disabled={sendingCode || !phoneOk || !phone}
                className="mt-3 bg-[#121212] text-white text-[12px] font-medium tracking-wider uppercase px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#000]"
              >
                {sendingCode ? 'Enviando…' : 'Enviar código de verificación'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Status banner */}
      {statusMsg && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-5 px-4 py-3 text-[13px] border ${
            statusKind === 'err'
              ? 'border-[#C41C1C] bg-[#FFF5F5] text-[#7A1414]'
              : 'border-[#1A7A3A] bg-[#F2FAF4] text-[#0F4D24]'
          }`}
        >
          {statusMsg}
        </div>
      )}

      {/* Verify code modal */}
      {showCodeModal && !verified && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`verify-title-${subscriptionId}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCodeModal(false)
          }}
        >
          <div className="bg-white w-full max-w-md border border-[#DEDEDE] p-7">
            <h4
              id={`verify-title-${subscriptionId}`}
              className="text-[22px] font-bold text-[#121212] mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Verifica tu teléfono
            </h4>
            <p className="text-[13px] text-[#666666] mb-5">
              Te enviamos un código de 6 dígitos al WhatsApp de{' '}
              <strong className="font-mono">{maskPhone(phone)}</strong>.
            </p>

            {devCode && (
              <div className="mb-4 bg-[#FFF8DC] border border-[#E0C97A] px-3 py-2 text-[12px] text-[#5A4A00]">
                <strong>Modo desarrollo:</strong> tu código es{' '}
                <code className="font-mono">{devCode}</code>
              </div>
            )}

            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-white border border-[#DEDEDE] px-4 py-3 text-[22px] font-mono tracking-[0.3em] text-center outline-none focus:ring-2 focus:ring-[#C41C1C]/30"
              autoFocus
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCodeModal(false)
                  setCode('')
                }}
                className="text-[13px] text-[#666666] underline underline-offset-2 hover:text-[#121212]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={verifyCode}
                disabled={verifyingCode || code.length !== 6}
                className="bg-[#C41C1C] text-white text-[12px] font-medium tracking-wider uppercase px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A11616]"
              >
                {verifyingCode ? 'Verificando…' : 'Verificar'}
              </button>
            </div>

            <button
              type="button"
              onClick={sendCode}
              disabled={sendingCode}
              className="mt-4 w-full text-[12px] text-[#666666] hover:text-[#121212] disabled:opacity-50"
            >
              {sendingCode ? 'Reenviando…' : 'Reenviar código'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
