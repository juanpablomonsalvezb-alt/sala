'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  Search,
  Download,
  Mail,
  ExternalLink,
  CheckCircle2,
  FileText,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ScrapedPost {
  title: string
  excerpt: string
  slug: string
  published_at: string | null
  original_url: string
}

interface AnalyzeOk {
  found: true
  creator_name: string
  posts: ScrapedPost[]
  total_posts: number
  sample_html_first_post: string | null
  source_url: string
}

interface AnalyzeFail {
  found: false
  reason: string
  message: string
}

type AnalyzeResponse = AnalyzeOk | AnalyzeFail

type Step = 'idle' | 'analyzing' | 'preview' | 'importing' | 'success' | 'subscribers' | 'error'

/* ─── Component ──────────────────────────────────────────────────────────── */

const COLORS = {
  bg: '#FAFAF7',
  ink: '#121212',
  accent: '#C41C1C',
  muted: '#6B7280',
  line: '#E5E7EB',
  surface: '#FFFFFF',
}

export function SubstackWizard() {
  const [step, setStep] = useState<Step>('idle')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [analyzed, setAnalyzed] = useState<AnalyzeOk | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [importResult, setImportResult] = useState<{
    imported: number
    skipped: number
    creator_slug?: string
  } | null>(null)

  // Subscribers state
  const [csvText, setCsvText] = useState('')
  const [csvResult, setCsvResult] = useState<{
    invited: number
    duplicates: number
    invalid: number
    invite_url: string | null
  } | null>(null)
  const [csvLoading, setCsvLoading] = useState(false)

  const selectedPosts = useMemo(
    () => (analyzed ? analyzed.posts.filter((p) => selected.has(p.original_url)) : []),
    [analyzed, selected]
  )

  async function handleAnalyze() {
    setError(null)
    if (!url.trim()) {
      setError('Ingresa la URL de tu Substack (por ejemplo: tunombre.substack.com).')
      return
    }
    setStep('analyzing')
    try {
      const res = await fetch('/api/migrate/substack/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ substackUrl: url.trim() }),
      })
      const data: AnalyzeResponse = await res.json()

      if (!data.found) {
        setError(data.message ?? 'No pudimos analizar este Substack.')
        setStep('error')
        return
      }

      if (data.posts.length === 0) {
        setError('Encontramos el sitio pero no posts públicos para importar.')
        setStep('error')
        return
      }

      setAnalyzed(data)
      // Seleccionar todos por defecto
      setSelected(new Set(data.posts.map((p) => p.original_url)))
      setStep('preview')
    } catch {
      setError('Error de red. Inténtalo nuevamente.')
      setStep('error')
    }
  }

  async function handleImport() {
    if (!analyzed || selectedPosts.length === 0) return
    setStep('importing')
    setError(null)
    try {
      const res = await fetch('/api/migrate/substack/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posts: selectedPosts.map((p) => ({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            published_at: p.published_at,
            original_url: p.original_url,
          })),
        }),
      })

      if (res.status === 401) {
        window.location.href = `/registro?next=${encodeURIComponent('/migrar-substack')}`
        return
      }
      if (res.status === 403) {
        const data = await res.json().catch(() => ({}))
        setError(
          (data && data.error) ||
            'Necesitas un perfil de creator. Crea tu sala primero en /abrir.'
        )
        setStep('error')
        return
      }

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al importar.')
        setStep('error')
        return
      }

      setImportResult({
        imported: data.imported,
        skipped: data.skipped,
        creator_slug: data.creator_slug,
      })
      setStep('success')
    } catch {
      setError('Error de red al importar.')
      setStep('error')
    }
  }

  async function handleCsvUpload() {
    if (!csvText.trim()) {
      setError('Pega el contenido de tu CSV de Substack.')
      return
    }
    setCsvLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/migrate/substack/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv_data: csvText }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error procesando el CSV.')
        return
      }
      setCsvResult({
        invited: data.invited,
        duplicates: data.duplicates,
        invalid: data.invalid,
        invite_url: data.invite_url ?? null,
      })
    } catch {
      setError('Error de red al subir CSV.')
    } finally {
      setCsvLoading(false)
    }
  }

  function toggle(url: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }

  function reset() {
    setStep('idle')
    setUrl('')
    setAnalyzed(null)
    setSelected(new Set())
    setError(null)
    setImportResult(null)
  }

  return (
    <main
      className="min-h-screen pb-24"
      style={{ background: COLORS.bg, color: COLORS.ink }}
    >
      {/* ─── Hero ─── */}
      <header className="px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider"
            style={{ borderColor: COLORS.accent, color: COLORS.accent }}
          >
            <Download size={12} />
            Migrar desde Substack
          </div>
          <h1
            className="font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Trae tu sala de Substack a Nebbuler{' '}
            <span style={{ color: COLORS.accent }}>en 5 minutos</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-base md:text-lg"
            style={{ color: COLORS.muted }}
          >
            Importa todos tus posts públicos. Sube tu CSV de suscriptores. Sin
            código, sin migraciones manuales, sin perder tu audiencia.
          </p>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 text-sm md:flex-row md:justify-center md:gap-8">
            {[
              '0% comisión sobre lo que ganas',
              'Pagos en tu moneda local',
              'Soporte humano en español',
            ].map((b) => (
              <li key={b} className="flex items-center justify-center gap-2">
                <Check size={16} style={{ color: COLORS.accent }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ─── Wizard card ─── */}
      <section className="px-6">
        <div className="mx-auto max-w-2xl">
          <div
            className="rounded-2xl border bg-white p-6 shadow-sm md:p-10"
            style={{ borderColor: COLORS.line, background: COLORS.surface }}
          >
            <AnimatePresence mode="wait">
              {step === 'idle' && (
                <StepIdle
                  key="idle"
                  url={url}
                  setUrl={setUrl}
                  onAnalyze={handleAnalyze}
                  error={error}
                />
              )}

              {step === 'analyzing' && <StepAnalyzing key="analyzing" />}

              {step === 'preview' && analyzed && (
                <StepPreview
                  key="preview"
                  data={analyzed}
                  selected={selected}
                  onToggle={toggle}
                  onSelectAll={() =>
                    setSelected(new Set(analyzed.posts.map((p) => p.original_url)))
                  }
                  onSelectNone={() => setSelected(new Set())}
                  onConfirm={handleImport}
                  onBack={reset}
                />
              )}

              {step === 'importing' && (
                <StepImporting key="importing" count={selectedPosts.length} />
              )}

              {step === 'success' && importResult && (
                <StepSuccess
                  key="success"
                  imported={importResult.imported}
                  skipped={importResult.skipped}
                  creatorSlug={importResult.creator_slug}
                  onContinue={() => setStep('subscribers')}
                />
              )}

              {step === 'subscribers' && (
                <StepSubscribers
                  key="subs"
                  csvText={csvText}
                  setCsvText={setCsvText}
                  loading={csvLoading}
                  result={csvResult}
                  error={error}
                  onUpload={handleCsvUpload}
                  onSkip={() =>
                    (window.location.href = importResult?.creator_slug
                      ? `/dashboard`
                      : '/dashboard')
                  }
                />
              )}

              {step === 'error' && (
                <StepError key="err" message={error ?? 'Ocurrió un error.'} onRetry={reset} />
              )}
            </AnimatePresence>
          </div>

          {/* Trust strip */}
          <p
            className="mt-6 text-center text-xs"
            style={{ color: COLORS.muted }}
          >
            Solo leemos tu sitio público. No te pedimos contraseñas ni acceso a tu cuenta Substack.
          </p>
        </div>
      </section>

      {/* ─── FAQ corta ─── */}
      <section className="mx-auto mt-20 max-w-3xl px-6">
        <h2
          className="font-serif text-3xl font-bold tracking-tight md:text-4xl"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Preguntas frecuentes
        </h2>
        <dl className="mt-8 divide-y" style={{ borderColor: COLORS.line }}>
          {[
            {
              q: '¿Cómo importan mis posts si no me piden contraseña?',
              a: 'Substack expone públicamente un sitemap.xml con todos tus posts. Leemos esos posts públicos exactamente como lo haría Google al indexarlos. Sin acceso a tu cuenta, sin riesgo de seguridad.',
            },
            {
              q: '¿Y los posts de pago / solo suscriptores?',
              a: 'Esos posts no son públicos, por lo que no podemos importarlos automáticamente. Podrás copiarlos manualmente desde tu dashboard de Nebbuler después de la migración.',
            },
            {
              q: '¿Qué pasa con mis suscriptores?',
              a: 'Exporta tu CSV de Substack (Settings → Subscribers → Export). Súbelo aquí y generaremos invitaciones para que se unan a tu nueva sala en Nebbuler con un solo link.',
            },
            {
              q: '¿Cuánto cuesta Nebbuler comparado con Substack?',
              a: 'Nebbuler cobra 0% de comisión sobre tus ventas. Solo pagas USD 19/mes de plataforma. Substack cobra 10%. Si facturas más de USD 190/mes, Nebbuler ya te conviene.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary
                className="flex cursor-pointer items-center justify-between text-base font-medium md:text-lg"
                style={{ color: COLORS.ink }}
              >
                {q}
                <span
                  className="ml-4 text-2xl leading-none transition-transform group-open:rotate-45"
                  style={{ color: COLORS.accent }}
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: COLORS.muted }}>
                {a}
              </p>
            </details>
          ))}
        </dl>
      </section>
    </main>
  )
}

/* ─── Sub-componentes ────────────────────────────────────────────────────── */

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const, delay },
  }
}

function StepIdle({
  url,
  setUrl,
  onAnalyze,
  error,
}: {
  url: string
  setUrl: (s: string) => void
  onAnalyze: () => void
  error: string | null
}) {
  return (
    <motion.div {...fade()}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: '#FFF0F0', color: COLORS.accent }}
        >
          <Search size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Paso 1 — Analiza tu Substack</h2>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Solo pegamos la URL pública. No pedimos credenciales.
          </p>
        </div>
      </div>

      <label
        className="mb-2 block text-xs font-semibold uppercase tracking-wider"
        style={{ color: COLORS.muted }}
      >
        URL de tu Substack
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="tunombre.substack.com"
          onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
          className="flex-1 rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C41C1C]"
          style={{ borderColor: COLORS.line }}
        />
        <button
          type="button"
          onClick={onAnalyze}
          className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: COLORS.accent }}
        >
          Analizar mi Substack
          <ArrowRight size={16} />
        </button>
      </div>

      {error && (
        <div
          className="mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: '#FECACA', background: '#FEF2F2', color: '#991B1B' }}
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-6 text-xs" style={{ color: COLORS.muted }}>
        ¿También usas un dominio custom (ej: <code>tunewsletter.com</code>)? Funciona igual,
        siempre que apunte a Substack.
      </p>
    </motion.div>
  )
}

function StepAnalyzing() {
  return (
    <motion.div {...fade()} className="flex flex-col items-center justify-center py-12">
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: '#FFF0F0' }}
      >
        <Loader2 size={24} className="animate-spin" style={{ color: COLORS.accent }} />
      </div>
      <h2 className="text-lg font-semibold">Analizando tu Substack…</h2>
      <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
        Leyendo sitemap.xml, descubriendo posts y extrayendo metadatos.
      </p>
      <p className="mt-1 text-xs" style={{ color: COLORS.muted }}>
        Esto toma entre 10 y 30 segundos.
      </p>
    </motion.div>
  )
}

function StepPreview({
  data,
  selected,
  onToggle,
  onSelectAll,
  onSelectNone,
  onConfirm,
  onBack,
}: {
  data: AnalyzeOk
  selected: Set<string>
  onToggle: (url: string) => void
  onSelectAll: () => void
  onSelectNone: () => void
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <motion.div {...fade()}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Paso 2 — Elige qué importar</h2>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Encontramos <strong>{data.posts.length}</strong> posts en{' '}
            <span style={{ color: COLORS.accent }}>{data.creator_name}</span>.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={onSelectAll}
            className="rounded-md border px-2 py-1 transition-colors hover:bg-gray-50"
            style={{ borderColor: COLORS.line, color: COLORS.muted }}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={onSelectNone}
            className="rounded-md border px-2 py-1 transition-colors hover:bg-gray-50"
            style={{ borderColor: COLORS.line, color: COLORS.muted }}
          >
            Ninguno
          </button>
        </div>
      </div>

      <ul
        className="mb-6 max-h-[420px] divide-y overflow-y-auto rounded-lg border"
        style={{ borderColor: COLORS.line }}
      >
        {data.posts.map((p) => {
          const checked = selected.has(p.original_url)
          return (
            <li key={p.original_url}>
              <label
                className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-[#FAFAF7]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(p.original_url)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#C41C1C]"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-serif text-base leading-snug"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    {p.title}
                  </p>
                  {p.excerpt && (
                    <p
                      className="mt-1 line-clamp-2 text-xs leading-relaxed"
                      style={{ color: COLORS.muted }}
                    >
                      {p.excerpt}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]" style={{ color: COLORS.muted }}>
                    {p.published_at && (
                      <span>
                        {new Date(p.published_at).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    <a
                      href={p.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      Ver original <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </label>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: COLORS.line, color: COLORS.muted }}
        >
          ← Cambiar URL
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={selected.size === 0}
          className="flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: COLORS.accent }}
        >
          Importar {selected.size} posts
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}

function StepImporting({ count }: { count: number }) {
  return (
    <motion.div {...fade()} className="flex flex-col items-center justify-center py-12">
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: '#FFF0F0' }}
      >
        <Loader2 size={24} className="animate-spin" style={{ color: COLORS.accent }} />
      </div>
      <h2 className="text-lg font-semibold">Importando {count} posts a tu sala…</h2>
      <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
        Guardando títulos, fechas y resúmenes. Podrás editar el contenido completo después.
      </p>
    </motion.div>
  )
}

function StepSuccess({
  imported,
  skipped,
  creatorSlug,
  onContinue,
}: {
  imported: number
  skipped: number
  creatorSlug?: string
  onContinue: () => void
}) {
  return (
    <motion.div {...fade()} className="text-center">
      <div
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: COLORS.accent }}
      >
        <CheckCircle2 size={26} className="text-white" />
      </div>
      <h2 className="font-serif text-2xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
        ¡{imported} posts importados!
      </h2>
      <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
        {skipped > 0
          ? `${skipped} se omitieron por estar duplicados.`
          : 'Tu archivo de Substack ya vive en Nebbuler.'}
      </p>

      <div
        className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 rounded-lg border p-4"
        style={{ borderColor: COLORS.line, background: '#FAFAF7' }}
      >
        <div>
          <div className="font-serif text-2xl font-bold" style={{ color: COLORS.accent }}>
            {imported}
          </div>
          <div className="text-xs" style={{ color: COLORS.muted }}>
            Posts importados
          </div>
        </div>
        <div>
          <div className="font-serif text-2xl font-bold">{skipped}</div>
          <div className="text-xs" style={{ color: COLORS.muted }}>
            Omitidos (duplicados)
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: COLORS.accent }}
        >
          <Mail size={16} />
          Importar suscriptores
        </button>
        {creatorSlug && (
          <a
            href={`/${creatorSlug}`}
            className="flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ borderColor: COLORS.line }}
          >
            Ver mi sala
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function StepSubscribers({
  csvText,
  setCsvText,
  loading,
  result,
  error,
  onUpload,
  onSkip,
}: {
  csvText: string
  setCsvText: (s: string) => void
  loading: boolean
  result: { invited: number; duplicates: number; invalid: number; invite_url: string | null } | null
  error: string | null
  onUpload: () => void
  onSkip: () => void
}) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setCsvText(String(reader.result ?? ''))
    reader.readAsText(f)
  }

  if (result) {
    return (
      <motion.div {...fade()} className="text-center">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: COLORS.accent }}
        >
          <CheckCircle2 size={26} className="text-white" />
        </div>
        <h2
          className="font-serif text-2xl font-bold"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {result.invited} suscriptores listos para invitar
        </h2>
        <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
          {result.duplicates} ya estaban registrados, {result.invalid} eran inválidos.
        </p>

        {result.invite_url && (
          <div
            className="mx-auto mt-6 max-w-md rounded-lg border p-4 text-left"
            style={{ borderColor: COLORS.line, background: '#FAFAF7' }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
              Tu link de invitación masiva
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-white px-2 py-1.5 text-xs" style={{ border: `1px solid ${COLORS.line}` }}>
                {result.invite_url}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(result.invite_url!)}
                className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white"
                style={{ borderColor: COLORS.line }}
              >
                Copiar
              </button>
            </div>
            <p className="mt-2 text-xs" style={{ color: COLORS.muted }}>
              Compártelo en tu próximo email de Substack para que migren contigo.
            </p>
          </div>
        )}

        <a
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: COLORS.accent }}
        >
          Ir al dashboard
          <ArrowRight size={16} />
        </a>
      </motion.div>
    )
  }

  return (
    <motion.div {...fade()}>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: '#FFF0F0', color: COLORS.accent }}
        >
          <Mail size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Paso 4 — Trae a tus suscriptores</h2>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Sube el CSV que exportaste desde Substack.
          </p>
        </div>
      </div>

      <div
        className="mb-4 rounded-lg border p-4 text-sm"
        style={{ borderColor: COLORS.line, background: '#FAFAF7' }}
      >
        <p className="font-medium">Cómo exportar desde Substack:</p>
        <ol className="ml-4 mt-2 list-decimal space-y-1 text-xs" style={{ color: COLORS.muted }}>
          <li>En Substack ve a <strong>Settings → Subscribers → Export</strong></li>
          <li>Descarga el CSV con los emails de tus suscriptores</li>
          <li>Súbelo aquí o pega el contenido</li>
        </ol>
      </div>

      <label
        className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-6 text-sm transition-colors hover:bg-[#FAFAF7]"
        style={{ borderColor: COLORS.line, color: COLORS.muted }}
      >
        <FileText size={16} />
        <span>Elegir archivo CSV…</span>
        <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
      </label>

      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        rows={6}
        placeholder="O pega aquí el contenido del CSV: email,name..."
        className="w-full rounded-lg border bg-white px-3 py-2 font-mono text-xs outline-none transition-colors focus:border-[#C41C1C]"
        style={{ borderColor: COLORS.line }}
      />

      {error && (
        <div
          className="mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: '#FECACA', background: '#FEF2F2', color: '#991B1B' }}
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onSkip}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: COLORS.line, color: COLORS.muted }}
        >
          Saltar este paso
        </button>
        <button
          type="button"
          onClick={onUpload}
          disabled={loading || !csvText.trim()}
          className="flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: COLORS.accent }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Procesando…
            </>
          ) : (
            <>
              Importar suscriptores <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

function StepError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div {...fade()} className="text-center">
      <div
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: '#FEF2F2', color: '#991B1B' }}
      >
        <AlertCircle size={26} />
      </div>
      <h2 className="text-lg font-semibold">No pudimos completar la migración</h2>
      <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: COLORS.muted }}>
        {message}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: COLORS.accent }}
        >
          Intentar de nuevo
        </button>
        <a
          href="/registro?next=/migrar-substack"
          className="rounded-lg border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50"
          style={{ borderColor: COLORS.line }}
        >
          Crear cuenta primero
        </a>
      </div>
    </motion.div>
  )
}
