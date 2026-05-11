'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

type FormState = 'idle' | 'sending' | 'success' | 'error'

const INQUIRY_OPTIONS = [
  { value: 'creador',  label: 'Quiero abrir mi sala como creador' },
  { value: 'lector',  label: 'Soy lector con una consulta' },
  { value: 'prensa',  label: 'Consulta de prensa / medios' },
  { value: 'empresa', label: 'Propuesta comercial' },
  { value: 'soporte', label: 'Soporte técnico' },
  { value: 'otro',    label: 'Otro' },
]

export default function ContactoPage() {
  const [state, setState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  function validate(data: Record<string, string>) {
    const e: Record<string, string> = {}
    if (!data.nombre || data.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre.'
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido.'
    if (!data.mensaje || data.mensaje.trim().length < 10) e.mensaje = 'El mensaje es demasiado corto.'
    return e
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>

    const validation = validate(data)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setState('sending')

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setState('success')
        formRef.current?.reset()
      } else {
        const body = await res.json().catch(() => ({})) as { error?: string }
        setErrors({ form: body.error ?? 'Error al enviar. Inténtalo de nuevo.' })
        setState('error')
      }
    } catch {
      setErrors({ form: 'Error de conexión. Inténtalo de nuevo.' })
      setState('error')
    }
  }

  if (state === 'success') {
    return <SuccessState />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-[22px] font-bold text-[#121212] tracking-tight">
            NEBBULER
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-20">
        {/* Eyebrow */}
        <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#999] mb-5">
          Contacto
        </p>

        {/* Título */}
        <h1 className="font-serif text-[42px] font-bold text-[#121212] leading-[1.1] mb-4">
          Estamos para escucharte.
        </h1>
        <p className="font-sans text-[16px] text-[#666] leading-relaxed mb-16 max-w-lg">
          Cuéntanos en qué podemos ayudarte. Respondemos personalmente a cada mensaje.
        </p>

        {/* Separador */}
        <div className="w-8 h-[2px] bg-[#C41C1C] mb-16" />

        {/* Formulario */}
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-12">

          {/* Nombre */}
          <Field label="Nombre" error={errors.nombre}>
            <input
              type="text"
              name="nombre"
              autoComplete="name"
              placeholder="Tu nombre completo"
              className={fieldClass(!!errors.nombre)}
              onChange={() => errors.nombre && setErrors(p => ({ ...p, nombre: '' }))}
            />
          </Field>

          {/* Email */}
          <Field label="Correo electrónico" error={errors.email}>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              className={fieldClass(!!errors.email)}
              onChange={() => errors.email && setErrors(p => ({ ...p, email: '' }))}
            />
          </Field>

          {/* Tipo de consulta */}
          <Field label="¿Sobre qué nos escribes?">
            <div className="relative">
              <select
                name="tipo"
                defaultValue="creador"
                className="w-full bg-transparent border-0 border-b border-[#DEDEDE] pb-3 pt-1 font-sans text-[15px] text-[#121212] focus:outline-none focus:border-[#121212] transition-colors appearance-none cursor-pointer pr-6"
              >
                {INQUIRY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#999]">
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                  <path d="M1 1l5 5 5-5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Field>

          {/* Mensaje */}
          <Field label="Mensaje" error={errors.mensaje}>
            <textarea
              name="mensaje"
              rows={6}
              placeholder="Cuéntanos en detalle..."
              className={`${fieldClass(!!errors.mensaje)} resize-none leading-relaxed`}
              onChange={() => errors.mensaje && setErrors(p => ({ ...p, mensaje: '' }))}
            />
          </Field>

          {/* Error global */}
          {errors.form && (
            <p className="font-sans text-[13px] text-[#C41C1C]">{errors.form}</p>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={state === 'sending'}
              className="group relative bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase px-10 py-4 hover:bg-[#C41C1C] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === 'sending' ? (
                <span className="flex items-center gap-3">
                  <span className="inline-flex gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                  Enviando
                </span>
              ) : (
                'Enviar mensaje →'
              )}
            </button>
          </div>
        </form>

        {/* Info de contacto directo */}
        <div className="mt-24 pt-12 border-t border-[#EEEEEE] grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
              Email directo
            </p>
            <a
              href="mailto:hello@nebbuler.com"
              className="font-serif text-[16px] text-[#121212] hover:text-[#C41C1C] transition-colors"
            >
              hello@nebbuler.com
            </a>
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
              Tiempo de respuesta
            </p>
            <p className="font-sans text-[14px] text-[#444]">
              Dentro de 24 horas hábiles
            </p>
          </div>
        </div>

        {/* Volver */}
        <div className="mt-12">
          <Link
            href="/"
            className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          {/* Ícono decorativo */}
          <div className="w-16 h-[2px] bg-[#C41C1C] mx-auto mb-10" />

          <h2 className="font-serif text-[36px] font-bold text-[#121212] leading-tight mb-5">
            Mensaje recibido.
          </h2>
          <p className="font-sans text-[15px] text-[#666] leading-relaxed mb-10">
            Te responderemos personalmente dentro de las próximas 24 horas. Revisa tu bandeja de entrada — también te enviamos una confirmación.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-3 hover:bg-[#C41C1C] transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              href="/directorio"
              className="inline-block border border-[#DEDEDE] text-[#121212] font-sans text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-3 hover:border-[#121212] transition-colors"
            >
              Ver directorio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fieldClass(hasError: boolean) {
  return `w-full bg-transparent border-0 border-b ${hasError ? 'border-[#C41C1C]' : 'border-[#DEDEDE]'} pb-3 pt-1 font-sans text-[15px] text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#121212] transition-colors`
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-2 font-sans text-[12px] text-[#C41C1C]">{error}</p>
      )}
    </div>
  )
}
