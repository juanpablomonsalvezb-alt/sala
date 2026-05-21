// ─────────────────────────────────────────────────────────────────────────────
// /dashboard/retencion — Panel anti-churn predictivo
//
// Server component. Solo accesible para creators (no superadmin-only).
// Muestra KPIs de retención y la lista de suscriptores en riesgo detectados
// heurísticamente. Diseño NYT editorial (Playfair + Inter, paleta cream).
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MarkReviewedButton from './MarkReviewedButton'

export const dynamic = 'force-dynamic'

interface SignalDetail {
  no_recent_opens?: boolean
  no_recent_reads?: boolean
  no_premium_reads?: boolean
  low_click_rate?: boolean
  long_tenure?: boolean
  risk_score?: number
  breakdown?: Record<string, number>
}

interface SignalRow {
  id: string
  subscriber_id: string
  creator_id: string
  risk_score: number
  signals: SignalDetail
  action_taken: string
  outcome: string
  email_sent_at: string | null
  outcome_at: string | null
  created_at: string
}

interface ProfileRow {
  id: string
  email: string | null
  full_name: string | null
}

interface SubscriptionRow {
  subscriber_id: string
  creator_id: string
  price_clp: number
  status: string
  created_at: string
}

function anonymizeEmail(email: string | null): string {
  if (!email) return '—'
  const [local, domain] = email.split('@')
  if (!domain) return '—'
  const head = local.slice(0, 1)
  return `${head}${'*'.repeat(Math.max(3, local.length - 1))}@${domain}`
}

function formatCLP(n: number): string {
  return '$' + n.toLocaleString('es-CL')
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function riskColor(score: number): { bg: string; fg: string; label: string } {
  if (score >= 0.75) return { bg: '#FBE9E9', fg: '#C41C1C', label: 'Crítico' }
  if (score >= 0.5) return { bg: '#FFF4E0', fg: '#A66800', label: 'Medio' }
  return { bg: '#E8F2EA', fg: '#1F6B3A', label: 'Bajo' }
}

const SIGNAL_LABELS: Record<string, string> = {
  no_recent_opens: 'No abrió 3 emails',
  no_recent_reads: 'Sin lecturas 28d',
  no_premium_reads: 'Nunca leyó premium',
  low_click_rate: 'CTR < 5%',
  long_tenure: 'Tenure > 90d',
}

function signalBreakdown(detail: SignalDetail): string[] {
  const tags: string[] = []
  if (detail.no_recent_opens) tags.push(SIGNAL_LABELS.no_recent_opens)
  if (detail.no_recent_reads) tags.push(SIGNAL_LABELS.no_recent_reads)
  if (detail.no_premium_reads) tags.push(SIGNAL_LABELS.no_premium_reads)
  if (detail.low_click_rate) tags.push(SIGNAL_LABELS.low_click_rate)
  if (detail.long_tenure) tags.push(SIGNAL_LABELS.long_tenure)
  return tags
}

const STATUS_BADGES: Record<string, { label: string; bg: string; fg: string }> = {
  pending: { label: 'Pendiente', bg: '#F7F7F7', fg: '#666666' },
  retained: { label: 'Retenido', bg: '#E8F2EA', fg: '#1F6B3A' },
  churned: { label: 'Cancelado', bg: '#FBE9E9', fg: '#C41C1C' },
  responded: { label: 'Respondió', bg: '#E6EFFB', fg: '#0E4A8F' },
  snoozed: { label: 'Revisado', bg: '#F0EAF8', fg: '#5A2E91' },
}

const ACTION_LABELS: Record<string, string> = {
  none: 'Detectado',
  email_save: 'Save enviado',
  email_pause_offer: 'Oferta de pausa',
  email_discount: 'Descuento',
  manual_review: 'Revisión manual',
}

export default async function RetencionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar?next=/dashboard/retencion')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: creator } = await db
    .from('sala_creators')
    .select('id, name, slug')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-1">
            Dashboard · Retención
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#121212] mb-6">
            Retención
          </h1>
          <div className="bg-white border border-[#DEDEDE] p-10 text-center">
            <p className="font-serif text-lg text-[#121212] mb-2">
              No tienes una publicación activa
            </p>
            <p className="text-sm font-sans text-[#999]">
              Esta vista está reservada para creadores con publicación.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { data: signalsRaw } = await db
    .from('sala_churn_signals')
    .select(
      'id, subscriber_id, creator_id, risk_score, signals, action_taken, outcome, email_sent_at, outcome_at, created_at',
    )
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const signals = (signalsRaw ?? []) as SignalRow[]

  let profileMap = new Map<string, ProfileRow>()
  let subMap = new Map<string, SubscriptionRow>()

  if (signals.length > 0) {
    const subIds = Array.from(new Set(signals.map((s) => s.subscriber_id)))
    const { data: profs } = await db
      .from('sala_profiles')
      .select('id, email, full_name')
      .in('id', subIds)
    profileMap = new Map(((profs ?? []) as ProfileRow[]).map((p) => [p.id, p]))

    const { data: subs } = await db
      .from('sala_subscriptions')
      .select('subscriber_id, creator_id, price_clp, status, created_at')
      .in('subscriber_id', subIds)
      .eq('creator_id', creator.id)
    subMap = new Map(
      ((subs ?? []) as SubscriptionRow[]).map((s) => [s.subscriber_id, s]),
    )
  }

  // KPIs
  const pending = signals.filter((s) => s.outcome === 'pending')
  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sentLast30 = signals.filter(
    (s) => s.email_sent_at && new Date(s.email_sent_at) >= last30,
  ).length
  const acted = signals.filter((s) => s.action_taken !== 'none')
  const retained = signals.filter((s) => s.outcome === 'retained').length
  const churned = signals.filter((s) => s.outcome === 'churned').length
  const totalOutcomed = retained + churned
  const retentionRate =
    totalOutcomed > 0 ? Math.round((retained / totalOutcomed) * 100) : null

  const mrrAtRisk = pending.reduce((acc, s) => {
    const sub = subMap.get(s.subscriber_id)
    return acc + (sub?.price_clp ?? 0)
  }, 0)

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p
            className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-1"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Dashboard · Anti-Churn
          </p>
          <h1
            className="font-serif text-3xl font-bold text-[#121212] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Retención predictiva
          </h1>
          <p
            className="mt-2 text-sm text-[#666] max-w-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Detectamos suscriptores en riesgo antes de que cancelen y enviamos
            una oferta de pausa de 30 días sin cargo. Reduce churn 30-40%.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <KpiCard
            label="En riesgo"
            value={String(pending.length)}
            sub="suscriptores pendientes"
          />
          <KpiCard
            label="Save offers 30d"
            value={String(sentLast30)}
            sub="emails enviados"
          />
          <KpiCard
            label="Tasa retención"
            value={retentionRate !== null ? `${retentionRate}%` : '—'}
            sub={`${retained} retenidos / ${totalOutcomed} actuados`}
          />
          <KpiCard
            label="MRR en riesgo"
            value={formatCLP(mrrAtRisk)}
            sub="CLP/mes"
          />
        </div>

        {/* Lista */}
        {signals.length === 0 ? (
          <div className="bg-white border border-[#DEDEDE] p-10 text-center">
            <p className="font-serif text-lg text-[#121212] mb-2">
              Sin suscriptores en riesgo
            </p>
            <p className="text-sm font-sans text-[#999]">
              El sistema evalúa diariamente. Cuando detecte señales, aparecerán
              aquí antes de enviar el save offer.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 mb-10">
            {signals.map((sig) => {
              const prof = profileMap.get(sig.subscriber_id)
              const sub = subMap.get(sig.subscriber_id)
              const risk = riskColor(Number(sig.risk_score))
              const status = STATUS_BADGES[sig.outcome] ?? STATUS_BADGES.pending
              const tags = signalBreakdown(sig.signals ?? {})
              const actionLabel = ACTION_LABELS[sig.action_taken] ?? sig.action_taken

              return (
                <article
                  key={sig.id}
                  className="bg-white border border-[#DEDEDE] p-5 grid grid-cols-[1fr_auto] gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-[10px] font-sans font-bold tracking-[0.14em] uppercase"
                        style={{ background: risk.bg, color: risk.fg }}
                      >
                        Riesgo {risk.label} · {Math.round(Number(sig.risk_score) * 100)}%
                      </span>
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-[10px] font-sans font-bold tracking-[0.14em] uppercase"
                        style={{ background: status.bg, color: status.fg }}
                      >
                        {status.label}
                      </span>
                      <span className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#999]">
                        {actionLabel}
                      </span>
                    </div>

                    <p
                      className="font-serif text-lg text-[#121212] mb-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {anonymizeEmail(prof?.email ?? null)}
                    </p>

                    <p className="text-[12px] font-sans text-[#666] mb-3">
                      Suscrito desde {formatDate(sub?.created_at ?? null)} ·{' '}
                      {sub ? `${formatCLP(sub.price_clp)} CLP/mes` : 'sin sub activa'}
                      {sig.email_sent_at && (
                        <> · Email enviado {formatDate(sig.email_sent_at)}</>
                      )}
                    </p>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-2 py-1 bg-[#F7F7F7] text-[10px] font-sans text-[#666] border border-[#DEDEDE]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2">
                    <span className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#999]">
                      {formatDate(sig.created_at)}
                    </span>
                    {sig.outcome === 'pending' && (
                      <MarkReviewedButton signalId={sig.id} />
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Cómo funciona */}
        <section className="bg-white border border-[#DEDEDE] p-6">
          <p
            className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-2"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Cómo funciona
          </p>
          <h2
            className="font-serif text-xl font-bold text-[#121212] mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Detección heurística diaria, acción 24h después
          </h2>
          <ol
            className="text-sm text-[#333] leading-relaxed list-decimal pl-5 space-y-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <li>
              <strong>Detección (11:00 AM Santiago):</strong> evaluamos cada
              suscripción activa con más de 14 días. Asignamos un score 0-1
              según señales: lecturas recientes, aperturas de email, CTR,
              acceso a contenido premium y tenure.
            </li>
            <li>
              <strong>Cooldown 24h:</strong> entre la detección y el envío del
              save offer dejamos un día para que el suscriptor lea
              orgánicamente si va a hacerlo.
            </li>
            <li>
              <strong>Acción (14:00 PM Santiago, +1 día):</strong> a los que
              siguen con score &ge; 0.6 les enviamos un email editorial
              ofreciendo pausar 30 días gratis. Máximo 1 oferta cada 30 días
              por suscriptor.
            </li>
            <li>
              <strong>Outcome (30 días):</strong> trackeamos si cancelan,
              continúan, o responden. La tasa de retención muestra cuántos save
              offers efectivamente salvaron la suscripción.
            </li>
          </ol>
        </section>

      </div>
    </div>
  )
}

function KpiCard({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="bg-white border border-[#DEDEDE] p-5 flex flex-col gap-1">
      <span
        className="text-[10px] font-sans font-bold tracking-[0.14em] uppercase text-[#999]"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {label}
      </span>
      <span
        className="text-[2rem] leading-none font-bold text-[#121212] tracking-tight mt-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {value}
      </span>
      <span
        className="text-[11px] font-sans text-[#666] mt-1"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {sub}
      </span>
    </div>
  )
}
