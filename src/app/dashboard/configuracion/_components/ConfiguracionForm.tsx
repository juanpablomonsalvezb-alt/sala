'use client'

import { useState, useTransition } from 'react'
import type { Creator } from '@/types/database'
import { updateCreatorProfile } from '../_actions'

// ─── Constants ────────────────────────────────────────────────────────────────

const ESPECIALIDADES = [
  'Economista',
  'Abogado',
  'Médico',
  'Psicólogo',
  'Ingeniero',
  'Periodista',
  'Financiero',
  'Consultor',
  'Otro',
]

const FRECUENCIAS = [
  { value: 'diario', label: 'Diario' },
  { value: '2-3-semana', label: '2-3 veces por semana' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual', label: 'Mensual' },
]

const PRECIOS = [4990, 7990, 9990, 14990, 19990, 29990]

function formatCLP(n: number): string {
  return n.toLocaleString('es-CL')
}

// ─── Form primitives ──────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium mb-1.5"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      {children}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-[#DEDEDE] px-4 py-2.5 text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white outline-none focus:border-[#121212] transition-colors"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    />
  )
}

function TextareaInput({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full border border-[#DEDEDE] px-4 py-2.5 text-[14px] text-[#121212] placeholder:text-[#AAAAAA] bg-white outline-none focus:border-[#121212] transition-colors resize-none"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      />
      {maxLength && (
        <p
          className="text-[11px] text-[#AAAAAA] text-right mt-1"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

function SelectInput({
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
      className="w-full border border-[#DEDEDE] px-4 py-2.5 text-[14px] text-[#121212] bg-white outline-none focus:border-[#121212] transition-colors appearance-none cursor-pointer"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] mb-5 pb-3 border-b border-[#DEDEDE]"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      {children}
    </h2>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export default function ConfiguracionForm({ creator }: { creator: Creator }) {
  const [name, setName] = useState(creator.name)
  const [specialty, setSpecialty] = useState(creator.specialty)
  const [bio, setBio] = useState(creator.bio)
  const [bioLong, setBioLong] = useState(creator.bio_long ?? '')
  const [linkedin, setLinkedin] = useState(creator.linkedin_url ?? '')
  const [frequency, setFrequency] = useState(creator.publish_frequency)
  const [price, setPrice] = useState(creator.price_clp)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !specialty || !bio.trim()) {
      setErrorMsg('Nombre, especialidad y bio son obligatorios.')
      return
    }
    setErrorMsg('')
    startTransition(async () => {
      const result = await updateCreatorProfile({
        name: name.trim(),
        specialty,
        bio: bio.trim(),
        bio_long: bioLong.trim(),
        linkedin_url: linkedin.trim(),
        publish_frequency: frequency,
        price_clp: price,
      })
      if (result.error) {
        setErrorMsg(result.error)
      } else {
        setSuccessMsg('Cambios guardados correctamente.')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Perfil público ── */}
      <section className="bg-white border border-[#DEDEDE] px-6 py-6">
        <SectionTitle>Perfil público</SectionTitle>

        <div className="space-y-5">
          <div>
            <FieldLabel>Nombre completo *</FieldLabel>
            <TextInput
              value={name}
              onChange={setName}
              placeholder="Ej. Ana García"
            />
          </div>

          <div>
            <FieldLabel>Especialidad *</FieldLabel>
            <SelectInput
              value={specialty}
              onChange={setSpecialty}
              options={ESPECIALIDADES.map((e) => ({ value: e.toLowerCase(), label: e }))}
              placeholder="Selecciona tu especialidad"
            />
          </div>

          <div>
            <FieldLabel>Bio corta * (máx. 150 caracteres)</FieldLabel>
            <TextareaInput
              value={bio}
              onChange={setBio}
              placeholder="Cuéntale a tus suscriptores quién eres en una frase..."
              rows={3}
              maxLength={150}
            />
          </div>

          <div>
            <FieldLabel>Bio extendida</FieldLabel>
            <TextareaInput
              value={bioLong}
              onChange={setBioLong}
              placeholder="Expande tu historia: trayectoria, logros, por qué escribes..."
              rows={6}
            />
          </div>

          <div>
            <FieldLabel>LinkedIn (opcional)</FieldLabel>
            <TextInput
              value={linkedin}
              onChange={setLinkedin}
              placeholder="https://linkedin.com/in/tu-perfil"
              type="url"
            />
          </div>
        </div>
      </section>

      {/* ── Publicación ── */}
      <section className="bg-white border border-[#DEDEDE] px-6 py-6">
        <SectionTitle>Publicación</SectionTitle>

        <div>
          <FieldLabel>Frecuencia de publicación *</FieldLabel>
          <SelectInput
            value={frequency}
            onChange={setFrequency}
            options={FRECUENCIAS}
            placeholder="¿Con qué frecuencia publicas?"
          />
        </div>
      </section>

      {/* ── Precio de suscripción ── */}
      <section className="bg-white border border-[#DEDEDE] px-6 py-6">
        <SectionTitle>Precio de suscripción</SectionTitle>

        <p
          className="text-[13px] text-[#666666] mb-5"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Precio mensual en CLP que cobrarás a tus suscriptores.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {PRECIOS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrice(p)}
              className={`flex flex-col items-center justify-center border px-4 py-4 transition-colors ${
                price === p
                  ? 'border-[#121212] bg-[#121212]'
                  : 'border-[#DEDEDE] bg-white hover:border-[#666666]'
              }`}
            >
              <span
                className={`text-[18px] font-bold ${price === p ? 'text-white' : 'text-[#121212]'}`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                ${formatCLP(p)}
              </span>
              <span
                className={`text-[11px] mt-0.5 ${price === p ? 'text-[#CCCCCC]' : 'text-[#666666]'}`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                CLP/mes
              </span>
            </button>
          ))}
        </div>

        {/* Proyección */}
        <div className="mt-5 border border-[#DEDEDE] bg-[#F7F7F7] px-5 py-4">
          <p
            className="text-[11px] uppercase tracking-[0.12em] text-[#666666] font-medium mb-3"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Ingreso proyectado
          </p>
          <div className="space-y-2">
            {[50, 100, 200, 500].map((subs) => (
              <div key={subs} className="flex items-center justify-between">
                <span
                  className="text-[13px] text-[#666666]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  Con {subs} suscriptores
                </span>
                <span
                  className="text-[13px] font-semibold text-[#121212]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  ${formatCLP(price * subs)} CLP/mes
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pb-8">
        <div>
          {errorMsg && (
            <p
              className="text-[13px] text-[#C41C1C]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p
              className="text-[13px] text-[#666666]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              ✓ {successMsg}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-[#121212] text-white text-[13px] font-semibold px-6 py-3 hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {isPending ? 'Guardando...' : 'Guardar cambios →'}
        </button>
      </div>
    </form>
  )
}
