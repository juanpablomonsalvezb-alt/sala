'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, Scale, Stethoscope, Building2, Calculator,
  Briefcase, Microscope, GraduationCap, BookOpen, Ellipsis,
  type LucideIcon,
} from 'lucide-react'
import {
  getRecommendedCreators,
  completeOnboarding,
  type RecommendedCreator,
} from '../actions'

/* ─── Constants ──────────────────────────────────────────────────────────── */

const PROFESSIONS: { label: string; icon: LucideIcon }[] = [
  { label: 'Economista', icon: TrendingUp },
  { label: 'Abogado', icon: Scale },
  { label: 'Médico', icon: Stethoscope },
  { label: 'Arquitecto', icon: Building2 },
  { label: 'Contador', icon: Calculator },
  { label: 'Empresario', icon: Briefcase },
  { label: 'Investigador', icon: Microscope },
  { label: 'Docente', icon: GraduationCap },
  { label: 'Estudiante', icon: BookOpen },
  { label: 'Otro', icon: Ellipsis },
]

const INTERESTS = [
  'Macroeconomía', 'Derecho tributario', 'Finanzas personales', 'Salud pública',
  'Urbanismo', 'Tecnología', 'Mercados', 'Política económica',
  'Negocios', 'Educación', 'Derecho laboral', 'Medio ambiente',
]
const MAX_INTERESTS = 3

const FREQUENCIES = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'importante', label: 'Solo cuando haya algo importante' },
]

const TOTAL_STEPS = 6

/* ─── Shared bits ────────────────────────────────────────────────────────── */

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            n === step ? 'w-6 bg-[#121212]' : n < step ? 'w-1.5 bg-[#121212]' : 'w-1.5 bg-[#DEDEDE]'
          }`}
        />
      ))}
    </div>
  )
}

function SkipLink({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="font-sans text-[12px] text-[#AAAAAA] hover:text-[#666] transition-colors"
    >
      Saltar por ahora
    </button>
  )
}

function Shell({
  step,
  onSkip,
  children,
}: {
  step: number | null
  onSkip?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 pt-8">
        <span className="font-serif text-[20px] font-bold tracking-tight text-[#121212]">NEBBULER</span>
        {onSkip ? <SkipLink onSkip={onSkip} /> : <span />}
      </div>
      {step !== null && (
        <div className="pt-6">
          <ProgressDots step={step} />
        </div>
      )}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[480px]">{children}</div>
      </main>
    </div>
  )
}

/* ─── Pantalla 1 — Bienvenida ────────────────────────────────────────────── */

function ScreenWelcome({ firstName, onNext }: { firstName: string; onNext: () => void }) {
  return (
    <Shell step={null}>
      <div className="text-center">
        <h1
          className="font-serif text-[#121212] leading-tight mb-4"
          style={{ fontSize: '2.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Bienvenido a Nebbuler, {firstName}.
        </h1>
        <p className="font-sans text-[15px] text-[#666666] leading-relaxed mb-10 max-w-[380px] mx-auto">
          Antes de explorar, cuéntanos un poco sobre ti — así te mostramos lo que realmente te interesa.
        </p>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#121212] text-white font-sans text-[13px] font-semibold px-7 py-3.5 hover:bg-[#2a2a2a] transition-colors"
        >
          Empecemos →
        </button>
      </div>
    </Shell>
  )
}

/* ─── Pantalla 2 — Profesión ─────────────────────────────────────────────── */

function ScreenProfession({
  value,
  onChange,
  onNext,
  onSkip,
}: {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onSkip: () => void
}) {
  return (
    <Shell step={2} onSkip={onSkip}>
      <h2 className="font-serif text-[#121212] text-center mb-8" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
        ¿Cuál es tu área profesional?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {PROFESSIONS.map(({ label, icon: Icon }) => {
          const active = value === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(label)}
              className={`flex flex-col items-start gap-2.5 border px-4 py-4 text-left transition-colors ${
                active ? 'border-[#121212] bg-[#F7F7F7]' : 'border-[#DEDEDE] hover:border-[#121212]'
              }`}
            >
              <Icon size={18} className={active ? 'text-[#C41C1C]' : 'text-[#666666]'} />
              <span className="font-sans text-[13px] font-medium text-[#121212]">{label}</span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!value}
        className="w-full mt-8 bg-[#121212] text-white font-sans text-[13px] font-semibold py-3.5 hover:bg-[#2a2a2a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuar →
      </button>
    </Shell>
  )
}

/* ─── Pantalla 3 — Intereses ─────────────────────────────────────────────── */

function ScreenInterests({
  value,
  onChange,
  onNext,
  onSkip,
}: {
  value: string[]
  onChange: (v: string[]) => void
  onNext: () => void
  onSkip: () => void
}) {
  function toggle(interest: string) {
    if (value.includes(interest)) {
      onChange(value.filter((i) => i !== interest))
    } else if (value.length < MAX_INTERESTS) {
      onChange([...value, interest])
    }
  }

  return (
    <Shell step={3} onSkip={onSkip}>
      <h2 className="font-serif text-[#121212] text-center mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
        ¿Qué temas te interesan?
      </h2>
      <p className="font-sans text-[13px] text-[#666666] text-center mb-8">Elige hasta 3.</p>
      <div className="flex flex-wrap gap-2.5 justify-center">
        {INTERESTS.map((interest) => {
          const active = value.includes(interest)
          const disabled = !active && value.length >= MAX_INTERESTS
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              disabled={disabled}
              className={`font-sans text-[13px] px-4 py-2.5 border transition-colors ${
                active
                  ? 'border-[#121212] bg-[#121212] text-white'
                  : disabled
                  ? 'border-[#DEDEDE] text-[#CCCCCC] cursor-not-allowed'
                  : 'border-[#DEDEDE] text-[#121212] hover:border-[#121212]'
              }`}
            >
              {interest}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={value.length === 0}
        className="w-full mt-9 bg-[#121212] text-white font-sans text-[13px] font-semibold py-3.5 hover:bg-[#2a2a2a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuar →
      </button>
    </Shell>
  )
}

/* ─── Pantalla 4 — Frecuencia ────────────────────────────────────────────── */

function ScreenFrequency({
  value,
  onChange,
  onNext,
  onSkip,
}: {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onSkip: () => void
}) {
  return (
    <Shell step={4} onSkip={onSkip}>
      <h2 className="font-serif text-[#121212] text-center mb-8" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
        ¿Con qué frecuencia quieres recibir contenido?
      </h2>
      <div className="flex flex-col gap-3">
        {FREQUENCIES.map((f) => {
          const active = value === f.value
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange(f.value)}
              className={`font-sans text-[14px] font-medium text-left px-5 py-4 border transition-colors ${
                active ? 'border-[#121212] bg-[#F7F7F7] text-[#121212]' : 'border-[#DEDEDE] text-[#121212] hover:border-[#121212]'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!value}
        className="w-full mt-9 bg-[#121212] text-white font-sans text-[13px] font-semibold py-3.5 hover:bg-[#2a2a2a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuar →
      </button>
    </Shell>
  )
}

/* ─── Pantalla 5 — Creadores recomendados ────────────────────────────────── */

function CreatorAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div className="w-11 h-11 rounded-full bg-[#121212] text-white flex items-center justify-center font-sans text-[15px] font-semibold flex-shrink-0">
      {initial}
    </div>
  )
}

function ScreenRecommended({
  interests,
  onNext,
  onSkip,
}: {
  interests: string[]
  onNext: () => void
  onSkip: () => void
}) {
  const [creators, setCreators] = useState<RecommendedCreator[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getRecommendedCreators(interests).then((result) => {
      if (!cancelled) setCreators(result)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Shell step={5} onSkip={onSkip}>
      <h2 className="font-serif text-[#121212] text-center mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
        Basado en tus intereses
      </h2>
      <p className="font-sans text-[13px] text-[#666666] text-center mb-8">
        Estos espacios te van a interesar.
      </p>

      {creators === null ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[72px] border border-[#DEDEDE] bg-[#F7F7F7] animate-pulse" />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <p className="font-sans text-[13px] text-[#666666] text-center py-6">
          Todavía no hay espacios públicos para mostrar — pero ya vienen en camino.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {creators.map((c) => (
            <div key={c.id} className="flex items-center gap-3.5 border border-[#DEDEDE] px-4 py-3.5">
              <CreatorAvatar name={c.name} />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[15px] font-bold text-[#121212] truncate">{c.name}</p>
                <p className="font-sans text-[12px] text-[#666666] truncate">
                  {c.specialty} · {c.postCount} publicaci{c.postCount === 1 ? 'ón' : 'ones'}
                </p>
              </div>
              <Link
                href={`/${c.slug}`}
                className="font-sans text-[12px] font-medium text-[#C41C1C] hover:underline flex-shrink-0"
              >
                Explorar →
              </Link>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="w-full mt-9 bg-[#121212] text-white font-sans text-[13px] font-semibold py-3.5 hover:bg-[#2a2a2a] transition-colors"
      >
        Continuar →
      </button>
    </Shell>
  )
}

/* ─── Pantalla 6 — Perfil listo ──────────────────────────────────────────── */

function ScreenDone({
  firstName,
  profession,
  interests,
  onFinish,
  isPending,
}: {
  firstName: string
  profession: string
  interests: string[]
  onFinish: () => void
  isPending: boolean
}) {
  return (
    <Shell step={6}>
      <div className="text-center">
        <h1
          className="font-serif text-[#121212] leading-tight mb-6"
          style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Tu espacio está listo, {firstName}.
        </h1>

        <div className="border border-[#DEDEDE] bg-[#F7F7F7] px-6 py-5 mb-8 text-left">
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#666666] font-medium mb-1">
            Profesión
          </p>
          <p className="font-sans text-[14px] text-[#121212] mb-4">{profession}</p>
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#666666] font-medium mb-1">
            Intereses
          </p>
          <p className="font-sans text-[14px] text-[#121212]">{interests.join(' · ')}</p>
        </div>

        <button
          type="button"
          onClick={onFinish}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-[#C41C1C] text-white font-sans text-[13px] font-semibold px-7 py-3.5 hover:bg-[#a01515] transition-colors disabled:opacity-60"
        >
          {isPending ? 'Guardando…' : 'Explorar Nebbuler →'}
        </button>

        <p className="font-sans text-[11px] text-[#AAAAAA] mt-10">
          ¿Eres un profesional con algo que enseñar?{' '}
          <Link href="/registro" className="text-[#999999] hover:text-[#666] underline underline-offset-2">
            Abre tu espacio →
          </Link>
        </p>
      </div>
    </Shell>
  )
}

/* ─── Wizard ─────────────────────────────────────────────────────────────── */

export function OnboardingWizard({ firstName }: { firstName: string }) {
  const [step, setStep] = useState(1)
  const [profession, setProfession] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [frequency, setFrequency] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function handleSkip() {
    setIsPending(true)
    await completeOnboarding(null)
    window.location.href = '/'
  }

  async function handleFinish() {
    setIsPending(true)
    await completeOnboarding({ profession, interests, content_frequency: frequency })
    window.location.href = '/'
  }

  if (step === 1) return <ScreenWelcome firstName={firstName} onNext={() => setStep(2)} />
  if (step === 2) {
    return (
      <ScreenProfession
        value={profession}
        onChange={setProfession}
        onNext={() => setStep(3)}
        onSkip={handleSkip}
      />
    )
  }
  if (step === 3) {
    return (
      <ScreenInterests
        value={interests}
        onChange={setInterests}
        onNext={() => setStep(4)}
        onSkip={handleSkip}
      />
    )
  }
  if (step === 4) {
    return (
      <ScreenFrequency
        value={frequency}
        onChange={setFrequency}
        onNext={() => setStep(5)}
        onSkip={handleSkip}
      />
    )
  }
  if (step === 5) {
    return <ScreenRecommended interests={interests} onNext={() => setStep(6)} onSkip={handleSkip} />
  }
  return (
    <ScreenDone
      firstName={firstName}
      profession={profession}
      interests={interests}
      onFinish={handleFinish}
      isPending={isPending}
    />
  )
}
