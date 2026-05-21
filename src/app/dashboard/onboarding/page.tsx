// Dashboard de la secuencia de onboarding (creator only).
// Server component: agrega stats por stage desde sala_onboarding_log.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingBarChart from './_chart'

export const dynamic = 'force-dynamic'

type Stage = 'welcome' | 'tips_day_3' | 'survey_day_7' | 'viral_day_14' | 'nps_day_30'

const STAGE_LABEL: Record<Stage, string> = {
  welcome: 'Bienvenida (día 0)',
  tips_day_3: 'Tips (día 3)',
  survey_day_7: 'Encuesta (día 7)',
  viral_day_14: 'Comparte cita (día 14)',
  nps_day_30: 'NPS (día 30)',
}

const STAGE_ORDER: Stage[] = [
  'welcome',
  'tips_day_3',
  'survey_day_7',
  'viral_day_14',
  'nps_day_30',
]

interface LogRow {
  stage: Stage
  email_sent_at: string
  opened_at: string | null
  clicked_at: string | null
  responded_at: string | null
  response_data: { latest?: string } | null
}

interface StageStats {
  stage: Stage
  sent: number
  opened: number
  clicked: number
  responded: number
  openRate: number
  clickRate: number
  responseRate: number
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return !url.includes('placeholder') && url.startsWith('https://') && key.length > 20
}

function pct(n: number, d: number): number {
  if (d === 0) return 0
  return Math.round((n / d) * 1000) / 10
}

function buildStageStats(rows: LogRow[]): StageStats[] {
  const map = new Map<Stage, StageStats>()
  for (const stage of STAGE_ORDER) {
    map.set(stage, {
      stage,
      sent: 0,
      opened: 0,
      clicked: 0,
      responded: 0,
      openRate: 0,
      clickRate: 0,
      responseRate: 0,
    })
  }
  for (const r of rows) {
    const s = map.get(r.stage)
    if (!s) continue
    s.sent++
    if (r.opened_at) s.opened++
    if (r.clicked_at) s.clicked++
    if (r.responded_at) s.responded++
  }
  for (const s of map.values()) {
    s.openRate = pct(s.opened, s.sent)
    s.clickRate = pct(s.clicked, s.sent)
    s.responseRate = pct(s.responded, s.sent)
  }
  return STAGE_ORDER.map((st) => map.get(st)!)
}

function buildDailySeries(rows: LogRow[]): { date: string; emails: number }[] {
  const map = new Map<string, number>()
  const now = Date.now()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000).toISOString().slice(0, 10)
    map.set(d, 0)
  }
  for (const r of rows) {
    const d = r.email_sent_at.slice(0, 10)
    if (map.has(d)) map.set(d, (map.get(d) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([date, emails]) => ({ date, emails }))
}

function buildNpsAverage(rows: LogRow[]): { score: number; count: number } | null {
  const npsRows = rows.filter((r) => r.stage === 'nps_day_30' && r.responded_at && r.response_data?.latest)
  const scores: number[] = []
  for (const r of npsRows) {
    const latest = r.response_data?.latest ?? ''
    const m = latest.match(/^nps:(\d+)/)
    if (!m) continue
    const v = parseInt(m[1], 10)
    if (!Number.isNaN(v) && v >= 0 && v <= 10) scores.push(v)
  }
  if (scores.length < 5) return null
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return { score: Math.round(avg * 10) / 10, count: scores.length }
}

export default async function OnboardingDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] px-6 py-10">
        <p className="font-serif text-lg text-[#121212]">Supabase no está configurado.</p>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/entrar?next=/dashboard/onboarding')

  const { data: creator } = await supabase
    .from('sala_creators')
    .select('id, name, display_name, publication_name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] px-6 py-10">
        <p className="font-serif text-lg text-[#121212]">No tienes un perfil de creador.</p>
      </div>
    )
  }

  const sinceIso = new Date(Date.now() - 30 * 86_400_000).toISOString()

  const { data: rowsRaw } = await supabase
    .from('sala_onboarding_log')
    .select('stage, email_sent_at, opened_at, clicked_at, responded_at, response_data')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .eq('creator_id', (creator as any).id)
    .gte('email_sent_at', sinceIso)
    .order('email_sent_at', { ascending: false })

  const rows = (rowsRaw ?? []) as LogRow[]
  const stageStats = buildStageStats(rows)
  const dailySeries = buildDailySeries(rows)
  const nps = buildNpsAverage(rows)

  const welcomeStats = stageStats.find((s) => s.stage === 'welcome')!
  const totalSent = stageStats.reduce((a, s) => a + s.sent, 0)
  const totalOpened = stageStats.reduce((a, s) => a + s.opened, 0)
  const globalOpenRate = pct(totalOpened, totalSent)

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-1">
            Dashboard · Onboarding 30 días
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#121212] leading-tight">
            Tu secuencia de bienvenida
          </h1>
          <p className="mt-2 font-sans text-sm text-[#666] max-w-2xl leading-relaxed">
            Cada nuevo suscriptor recibe automáticamente 5 emails editoriales en sus primeros 30 días. Datos de los últimos 30 días.
          </p>
        </div>

        {/* KPI top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#E8E4DA] p-6">
            <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-2">
              Open rate bienvenida
            </p>
            <p className="font-serif text-4xl font-bold text-[#121212]">{welcomeStats.openRate}%</p>
            <p className="mt-1 font-sans text-xs text-[#999]">
              {welcomeStats.opened} de {welcomeStats.sent} emails abiertos
            </p>
          </div>
          <div className="bg-white border border-[#E8E4DA] p-6">
            <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-2">
              Emails enviados (30d)
            </p>
            <p className="font-serif text-4xl font-bold text-[#121212]">{totalSent}</p>
            <p className="mt-1 font-sans text-xs text-[#999]">
              Open rate global: {globalOpenRate}%
            </p>
          </div>
          <div className="bg-white border border-[#E8E4DA] p-6">
            <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-2">
              NPS día 30
            </p>
            {nps ? (
              <>
                <p className="font-serif text-4xl font-bold text-[#121212]">{nps.score}</p>
                <p className="mt-1 font-sans text-xs text-[#999]">{nps.count} respuestas</p>
              </>
            ) : (
              <>
                <p className="font-serif text-4xl font-bold text-[#CCC]">—</p>
                <p className="mt-1 font-sans text-xs text-[#999]">
                  Necesitas 5+ respuestas para mostrar score
                </p>
              </>
            )}
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white border border-[#E8E4DA] p-6 mb-8">
          <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-4">
            Emails enviados — últimos 30 días
          </p>
          <OnboardingBarChart data={dailySeries} />
        </div>

        {/* Tabla por stage */}
        <div className="bg-white border border-[#E8E4DA]">
          <div className="grid grid-cols-5 border-b border-[#E8E4DA] px-6 py-3">
            {['Etapa', 'Enviados', 'Open rate', 'Click rate', 'Response rate'].map((h) => (
              <span
                key={h}
                className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#999]"
              >
                {h}
              </span>
            ))}
          </div>
          {stageStats.map((s) => (
            <div
              key={s.stage}
              className="grid grid-cols-5 px-6 py-4 border-b border-[#F0EDE3] last:border-b-0 items-center"
            >
              <span className="font-serif text-sm text-[#121212]">{STAGE_LABEL[s.stage]}</span>
              <span className="font-sans text-sm text-[#444]">{s.sent}</span>
              <span className="font-sans text-sm text-[#444]">{s.sent ? `${s.openRate}%` : '—'}</span>
              <span className="font-sans text-sm text-[#444]">{s.sent ? `${s.clickRate}%` : '—'}</span>
              <span className="font-sans text-sm text-[#444]">
                {s.stage === 'survey_day_7' || s.stage === 'nps_day_30'
                  ? s.sent
                    ? `${s.responseRate}%`
                    : '—'
                  : 'n/a'}
              </span>
            </div>
          ))}
        </div>

        {totalSent === 0 && (
          <div className="mt-8 bg-white border border-[#E8E4DA] p-10 text-center">
            <p className="font-serif text-lg text-[#121212] mb-2">
              Aún no se han enviado emails de onboarding
            </p>
            <p className="font-sans text-sm text-[#999]">
              El cron diario (13:00 UTC) detecta nuevas suscripciones y envía la secuencia automáticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
