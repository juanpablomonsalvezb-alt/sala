'use client'

import { useState, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ArrowRight, User, BookOpen, Tag } from 'lucide-react'
import { createCreatorProfile } from './actions'

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface FormData {
  nombre: string
  especialidad: string
  bio: string
  linkedin: string
  nombreSala: string
  pitch: string
  frecuencia: string
  precio: number
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const ESPECIALIDADES_SUGERIDAS = [
  'Economista', 'Abogado', 'Médico', 'Arquitecto', 'Psicólogo',
  'Ingeniero', 'Financiero', 'Periodista', 'Sociólogo', 'Historiador',
  'Filósofo', 'Nutricionista', 'Veterinario', 'Contador', 'Científico político',
  'Sommelier', 'Coleccionista', 'Maestro FIDE', 'Fotógrafo', 'Diseñador',
]

const FRECUENCIAS = [
  { value: 'diario', label: 'Diario' },
  { value: '2-3-semana', label: '2-3 veces/semana' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual', label: 'Mensual' },
]

const PRECIOS = [4990, 7990, 9990, 14990, 19990]

function formatCLP(n: number) {
  return n.toLocaleString('es-CL')
}

const STEPS = [
  { id: 1, label: 'Tu perfil', icon: User },
  { id: 2, label: 'Tu sala', icon: BookOpen },
  { id: 3, label: 'Tu precio', icon: Tag },
]

/* ─── StepperHeader ─────────────────────────────────────────────────────── */

function StepperHeader({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? 'border-[#0066FF] bg-[#0066FF]'
                    : active
                    ? 'border-[#0066FF] bg-white'
                    : 'border-[#E5E7EB] bg-white'
                }`}
              >
                {done ? (
                  <Check size={13} className="text-white" />
                ) : (
                  <Icon
                    size={13}
                    className={active ? 'text-[#0066FF]' : 'text-[#6B7280]'}
                  />
                )}
              </div>
              <span
                className={`font-sans text-xs font-medium whitespace-nowrap ${
                  active ? 'text-[#0066FF]' : done ? 'text-[#0A0A0A]' : 'text-[#6B7280]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`mb-5 mx-3 h-px w-16 sm:w-20 transition-all duration-500 ${
                  done ? 'bg-[#0066FF]' : 'bg-[#E5E7EB]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Input primitives ──────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border bg-white px-4 py-3 font-sans text-sm text-[#0A0A0A] outline-none placeholder:text-[#6B7280]/50 transition-all duration-150 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10 ${
        error ? 'border-red-400' : 'border-[#E5E7EB]'
      }`}
    />
  )
}

function Textarea({
  value,
  onChange,
  placeholder,
  maxLength,
  error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  error?: boolean
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className={`w-full resize-none rounded-lg border bg-white px-4 py-3 font-sans text-sm text-[#0A0A0A] outline-none placeholder:text-[#6B7280]/50 transition-all duration-150 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10 ${
          error ? 'border-red-400' : 'border-[#E5E7EB]'
        }`}
      />
      {maxLength && (
        <div className="mt-1 text-right font-sans text-xs text-[#6B7280]/50">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 font-sans text-sm text-[#0A0A0A] outline-none transition-all duration-150 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10 appearance-none cursor-pointer"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/* ─── Steps ──────────────────────────────────────────────────────────────── */

function Step1({
  data,
  setData,
  errors,
}: {
  data: FormData
  setData: (d: Partial<FormData>) => void
  errors: Partial<Record<keyof FormData, boolean>>
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>Nombre completo *</Label>
        <Input
          value={data.nombre}
          onChange={(v) => setData({ nombre: v })}
          placeholder="Ej. Ana García"
          error={errors.nombre}
        />
        {errors.nombre && (
          <p className="mt-1 font-sans text-xs text-red-500">Campo obligatorio</p>
        )}
      </div>

      <div>
        <Label>Tu especialidad *</Label>
        <datalist id="especialidades-list">
          {ESPECIALIDADES_SUGERIDAS.map((e) => (
            <option key={e} value={e} />
          ))}
        </datalist>
        <input
          type="text"
          list="especialidades-list"
          value={data.especialidad}
          onChange={(e) => setData({ especialidad: e.target.value })}
          placeholder="Ej: Economista, Sommelier, Coleccionista de vinilos…"
          className="w-full border border-[#E5E7EB] bg-white px-4 py-3 font-sans text-sm text-[#0A0A0A] outline-none transition-all duration-150 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
        />
        {errors.especialidad && (
          <p className="mt-1 font-sans text-xs text-red-500">Escribe tu especialidad</p>
        )}
      </div>

      <div>
        <Label>Bio corta *</Label>
        <Textarea
          value={data.bio}
          onChange={(v) => setData({ bio: v })}
          placeholder="Cuéntale a tus futuros suscriptores quién eres en una frase..."
          maxLength={150}
          error={errors.bio}
        />
        {errors.bio && (
          <p className="mt-1 font-sans text-xs text-red-500">Escribe una bio corta</p>
        )}
      </div>

      <div>
        <Label>LinkedIn (opcional)</Label>
        <Input
          value={data.linkedin}
          onChange={(v) => setData({ linkedin: v })}
          placeholder="https://linkedin.com/in/tu-perfil"
          type="url"
        />
      </div>
    </div>
  )
}

function Step2({
  data,
  setData,
  errors,
}: {
  data: FormData
  setData: (d: Partial<FormData>) => void
  errors: Partial<Record<keyof FormData, boolean>>
}) {
  const slug = data.nombreSala
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>Nombre de tu espacio *</Label>
        <Input
          value={data.nombreSala}
          onChange={(v) => setData({ nombreSala: v })}
          placeholder="Ej. Economía sin filtro"
          error={errors.nombreSala}
        />
        {slug && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8F8F8] px-3 py-2">
            <span className="font-sans text-xs text-[#6B7280]">Tu URL:</span>
            <span className="font-sans text-xs font-semibold text-[#0066FF]">
              nebbuler.com/{slug}
            </span>
          </div>
        )}
        {errors.nombreSala && (
          <p className="mt-1 font-sans text-xs text-red-500">Dale un nombre a tu espacio</p>
        )}
      </div>

      <div>
        <Label>¿Qué vas a publicar? *</Label>
        <Textarea
          value={data.pitch}
          onChange={(v) => setData({ pitch: v })}
          placeholder="Describe qué van a recibir tus suscriptores. Sé específico."
          error={errors.pitch}
        />
        {errors.pitch && (
          <p className="mt-1 font-sans text-xs text-red-500">Describe qué publicarás</p>
        )}
      </div>

      <div>
        <Label>Frecuencia de publicación *</Label>
        <Select
          value={data.frecuencia}
          onChange={(v) => setData({ frecuencia: v })}
          options={FRECUENCIAS}
          placeholder="¿Con qué frecuencia publicarás?"
        />
        {errors.frecuencia && (
          <p className="mt-1 font-sans text-xs text-red-500">Elige una frecuencia</p>
        )}
      </div>
    </div>
  )
}

function Step3({
  data,
  setData,
}: {
  data: FormData
  setData: (d: Partial<FormData>) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-sans text-sm text-[#6B7280]">
        Elige el precio mensual que cobrarás a tus suscriptores. Siempre puedes cambiarlo
        después.
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {PRECIOS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setData({ precio: p })}
            className={`flex flex-col items-center justify-center rounded-lg border px-4 py-4 transition-all duration-150 ${
              data.precio === p
                ? 'border-[#0066FF] bg-[#EEF4FF]'
                : 'border-[#E5E7EB] bg-white hover:border-[#0066FF]/40'
            }`}
          >
            <span
              className={`font-sans text-xl font-bold ${
                data.precio === p ? 'text-[#0066FF]' : 'text-[#0A0A0A]'
              }`}
            >
              ${formatCLP(p)}
            </span>
            <span className="mt-0.5 font-sans text-xs text-[#6B7280]">CLP/mes</span>
          </button>
        ))}
      </div>

      {data.precio > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-lg border border-[#E5E7EB] bg-[#F8F8F8] p-5"
        >
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            Tu ingreso proyectado
          </p>
          <div className="flex flex-col gap-2">
            {[50, 100, 200, 500].map((subs) => (
              <div key={subs} className="flex items-center justify-between">
                <span className="font-sans text-sm text-[#6B7280]">
                  Con {subs} suscriptores
                </span>
                <span className="font-sans text-sm font-semibold text-[#0A0A0A]">
                  ${formatCLP(data.precio * subs)} CLP/mes
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-[#E5E7EB] pt-3">
            <p className="font-sans text-xs text-[#6B7280]/60">
              * Estimado con Plan Pro (0% comisión).
            </p>
          </div>
        </motion.div>
      )}

      <div className="rounded-lg border border-[#0066FF]/20 bg-[#EEF4FF] p-4">
        <p className="font-sans text-sm text-[#0066FF]">
          Con 100 suscriptores a ${formatCLP(data.precio)}/mes →{' '}
          <strong>${formatCLP(data.precio * 100)} CLP</strong> para ti.
        </p>
      </div>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

const INITIAL: FormData = {
  nombre: '',
  especialidad: '',
  bio: '',
  linkedin: '',
  nombreSala: '',
  pitch: '',
  frecuencia: '',
  precio: 9990,
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -32 : 32, opacity: 0 }),
}

export default function AbrirPage() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function patch(data: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...data }))
    const keys = Object.keys(data) as (keyof FormData)[]
    setErrors((prev) => {
      const next = { ...prev }
      keys.forEach((k) => delete next[k])
      return next
    })
  }

  function validateStep1(): boolean {
    const e: Partial<Record<keyof FormData, boolean>> = {}
    if (!form.nombre.trim()) e.nombre = true
    if (!form.especialidad) e.especialidad = true
    if (!form.bio.trim()) e.bio = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2(): boolean {
    const e: Partial<Record<keyof FormData, boolean>> = {}
    if (!form.nombreSala.trim()) e.nombreSala = true
    if (!form.pitch.trim()) e.pitch = true
    if (!form.frecuencia) e.frecuencia = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step < 3) {
      setDir(1)
      setStep((s) => s + 1)
    }
  }

  function goBack() {
    if (step > 1) {
      setDir(-1)
      setStep((s) => s - 1)
    }
  }

  function handleSubmit() {
    setServerError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('nombre', form.nombre)
      formData.append('especialidad', form.especialidad)
      formData.append('bio', form.bio)
      formData.append('linkedin', form.linkedin)
      formData.append('nombreSala', form.nombreSala)
      formData.append('pitch', form.pitch)
      formData.append('frecuencia', form.frecuencia)
      formData.append('precio', String(form.precio))

      const result = await createCreatorProfile(formData)

      if (result?.error) {
        setServerError(result.error)
      } else {
        setSubmitted(true)
      }
    })
  }

  /* ─── Success state ─────────────────────────────────────────────────── */

  if (submitted) {
    const slug = form.nombreSala
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#0066FF]">
            <Check size={24} className="text-white" />
          </div>
          <h1 className="mb-2 font-sans text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
            ¡Tu espacio está listo!
          </h1>
          <p className="mb-1 font-sans text-sm text-[#6B7280]">
            Hemos creado{' '}
            <span className="font-semibold text-[#0066FF]">nebbuler.com/{slug}</span>
          </p>
          <p className="font-sans text-sm text-[#6B7280]">
            Ya puedes empezar a publicar desde tu dashboard.
          </p>
          <a
            href="/dashboard"
            className="mt-8 inline-block rounded-lg bg-[#0066FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all hover:bg-[#0052CC]"
          >
            Ir al dashboard →
          </a>
        </motion.div>
      </main>
    )
  }

  /* ─── Main ──────────────────────────────────────────────────────────── */

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-6 py-16">
      <div className="mx-auto max-w-xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-10 text-center"
        >
          <a
            href="/"
            className="font-sans text-lg font-bold tracking-tight text-[#0A0A0A] hover:text-[#0066FF] transition-colors"
          >
            Nebbuler
          </a>
          <p className="mt-1 font-sans text-xs text-[#6B7280]">Configura tu espacio en 3 pasos</p>
        </motion.div>

        {/* Stepper */}
        <StepperHeader current={step} />

        {/* Card con step */}
        <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-8">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`step-${step}`}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mb-6 font-sans text-xl font-bold tracking-tight text-[#0A0A0A]">
                {step === 1 && 'Cuéntanos sobre ti'}
                {step === 2 && 'Configura tu espacio'}
                {step === 3 && 'Define tu precio'}
              </h2>

              {step === 1 && <Step1 data={form} setData={patch} errors={errors} />}
              {step === 2 && <Step2 data={form} setData={patch} errors={errors} />}
              {step === 3 && <Step3 data={form} setData={patch} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error del servidor */}
        {serverError && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="font-sans text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className={`rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 font-sans text-sm font-medium text-[#6B7280] transition-all hover:border-[#0A0A0A] hover:text-[#0A0A0A] ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            ← Atrás
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-[#0052CC] active:scale-[0.98]"
            >
              Continuar
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-6 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-[#0052CC] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creando perfil…' : 'Abrir mi espacio'}
              {!isPending && <ArrowRight size={14} />}
            </button>
          )}
        </div>

        <p className="mt-4 text-center font-sans text-xs text-[#6B7280]/50">
          Paso {step} de {STEPS.length}
        </p>
      </div>
    </main>
  )
}
