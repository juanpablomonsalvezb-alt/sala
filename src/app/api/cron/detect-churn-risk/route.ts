// ─────────────────────────────────────────────────────────────────────────────
// Cron diario: detect-churn-risk
//
// Evalúa hasta 100 suscripciones activas con > 14 días de antigüedad y calcula
// un risk_score 0-1 basado en señales heurísticas (sin ML, solo reglas). Si el
// score supera 0.6 inserta una fila en sala_churn_signals con action_taken='none'
// para que el cron `send-churn-saves` actúe 24-48h después (separación entre
// detección y acción permite humano-in-the-loop si quisiéramos un día).
//
// Schedule: 0 11 * * *  (11:00 UTC = 08:00 AM Santiago)
//
// Reglas de scoring:
//   +0.30  si no abrió ninguno de los últimos 3 emails enviados
//   +0.30  si no leyó posts en los últimos 28 días
//   +0.20  si nunca leyó un post premium (solo gratis)
//   +0.10  si click rate < 5 % en últimos 30 días (clicks / emails enviados)
//   +0.10  si subscribed hace > 90 días
//
// Garantías:
//   - Lazy init de Supabase admin client
//   - Idempotente: el unique (subscriber, creator, action_taken='none')
//     hace que reinsertar el mismo signal pendiente sea no-op
//   - Skip newcomers (<14 días) y trials (price_clp=0)
//   - Hard cap de 100 evaluaciones por ejecución
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { isAuthorizedCron } from '@/lib/cron-auth'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_EVALUATIONS_PER_RUN = 100
const RISK_THRESHOLD = 0.6
const MIN_SUBSCRIPTION_AGE_DAYS = 14
const STALE_READ_DAYS = 28
const LONG_TENURE_DAYS = 90
const LOW_CLICK_RATE = 0.05

interface SubscriptionRow {
  id: string
  subscriber_id: string
  creator_id: string
  price_clp: number
  status: string
  created_at: string
}

interface EngagementRow {
  subscriber_id: string
  creator_id: string
  emails_sent: number | null
  emails_opened: number | null
  emails_clicked: number | null
  posts_read: number | null
  premium_reads: number | null
  last_read_at: string | null
  last_email_at: string | null
}

interface NotifLogRow {
  subscriber_id: string
  creator_id: string | null
  status: string
  created_at: string
}

interface SignalDetail {
  no_recent_opens: boolean
  no_recent_reads: boolean
  no_premium_reads: boolean
  low_click_rate: boolean
  long_tenure: boolean
  risk_score: number
  breakdown: Record<string, number>
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

function daysSince(iso: string | null): number {
  if (!iso) return Number.POSITIVE_INFINITY
  return (Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000)
}

function computeRiskScore(
  sub: SubscriptionRow,
  engagement: EngagementRow | null,
  recentEmailStatuses: string[],
): SignalDetail {
  const breakdown: Record<string, number> = {}

  // Señal 1: últimos 3 emails sin abrir (statuses != 'read'/'delivered_open')
  const last3 = recentEmailStatuses.slice(0, 3)
  const noOpens =
    last3.length >= 3 && last3.every((s) => s !== 'read' && s !== 'delivered_open')
  if (noOpens) breakdown.no_recent_opens = 0.3

  // Señal 2: sin lecturas en 28 días
  const noRecentReads = daysSince(engagement?.last_read_at ?? null) > STALE_READ_DAYS
  if (noRecentReads) breakdown.no_recent_reads = 0.3

  // Señal 3: nunca leyó premium
  const noPremium = (engagement?.premium_reads ?? 0) === 0
  if (noPremium) breakdown.no_premium_reads = 0.2

  // Señal 4: click rate bajo
  const sent = engagement?.emails_sent ?? 0
  const clicked = engagement?.emails_clicked ?? 0
  const ctr = sent > 0 ? clicked / sent : 0
  const lowCtr = sent >= 5 && ctr < LOW_CLICK_RATE
  if (lowCtr) breakdown.low_click_rate = 0.1

  // Señal 5: tenure largo (>90 días)
  const longTenure = daysSince(sub.created_at) > LONG_TENURE_DAYS
  if (longTenure) breakdown.long_tenure = 0.1

  const risk_score = Object.values(breakdown).reduce((a, b) => a + b, 0)

  return {
    no_recent_opens: noOpens,
    no_recent_reads: noRecentReads,
    no_premium_reads: noPremium,
    low_click_rate: lowCtr,
    long_tenure: longTenure,
    risk_score: Math.min(1, Number(risk_score.toFixed(2))),
    breakdown,
  }
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = adminSupabase()

  const cutoffIso = new Date(
    Date.now() - MIN_SUBSCRIPTION_AGE_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString()

  // 1. Subs activas, no trials, con tenure >= 14 días
  const { data: subsRaw, error: subsErr } = await supabase
    .from('sala_subscriptions')
    .select('id, subscriber_id, creator_id, price_clp, status, created_at')
    .eq('status', 'active')
    .gt('price_clp', 0)
    .lte('created_at', cutoffIso)
    .order('created_at', { ascending: true })
    .limit(MAX_EVALUATIONS_PER_RUN)

  if (subsErr) {
    return NextResponse.json({ error: 'subs_query_failed', detail: subsErr.message }, { status: 500 })
  }
  const subs = (subsRaw ?? []) as SubscriptionRow[]
  if (subs.length === 0) {
    return NextResponse.json({ evaluated: 0, at_risk: 0, signals_created: 0 })
  }

  const subscriberIds = Array.from(new Set(subs.map((s) => s.subscriber_id)))
  const creatorIds = Array.from(new Set(subs.map((s) => s.creator_id)))

  // 2. Engagement de todos en un solo query
  const { data: engagementRaw } = await supabase
    .from('sala_subscriber_engagement')
    .select(
      'subscriber_id, creator_id, emails_sent, emails_opened, emails_clicked, posts_read, premium_reads, last_read_at, last_email_at',
    )
    .in('subscriber_id', subscriberIds)
    .in('creator_id', creatorIds)

  const engagementMap = new Map<string, EngagementRow>()
  for (const e of (engagementRaw ?? []) as EngagementRow[]) {
    engagementMap.set(`${e.subscriber_id}:${e.creator_id}`, e)
  }

  // 3. Últimos statuses de email (para señal 1)
  const { data: notifRaw } = await supabase
    .from('sala_notification_log')
    .select('subscriber_id, creator_id, status, created_at')
    .in('subscriber_id', subscriberIds)
    .eq('channel', 'email')
    .order('created_at', { ascending: false })
    .limit(subscriberIds.length * 10)

  const notifMap = new Map<string, string[]>()
  for (const n of (notifRaw ?? []) as NotifLogRow[]) {
    const key = `${n.subscriber_id}:${n.creator_id ?? ''}`
    const arr = notifMap.get(key) ?? []
    if (arr.length < 5) arr.push(n.status)
    notifMap.set(key, arr)
  }

  // 4. Signals existentes pendientes (anti-spam: no reinsertar el mismo)
  const { data: existingRaw } = await supabase
    .from('sala_churn_signals')
    .select('subscriber_id, creator_id, action_taken, created_at')
    .in('subscriber_id', subscriberIds)
    .eq('action_taken', 'none')

  const existingSet = new Set(
    (existingRaw ?? []).map((r) => `${r.subscriber_id}:${r.creator_id}`),
  )

  // 5. Evaluar y construir inserts
  let atRisk = 0
  const toInsert: Array<{
    subscriber_id: string
    creator_id: string
    risk_score: number
    signals: SignalDetail
    action_taken: 'none'
    outcome: 'pending'
  }> = []

  for (const sub of subs) {
    const key = `${sub.subscriber_id}:${sub.creator_id}`
    if (existingSet.has(key)) continue

    const engagement = engagementMap.get(key) ?? null
    const recentStatuses = notifMap.get(key) ?? []
    const detail = computeRiskScore(sub, engagement, recentStatuses)

    if (detail.risk_score >= RISK_THRESHOLD) {
      atRisk++
      toInsert.push({
        subscriber_id: sub.subscriber_id,
        creator_id: sub.creator_id,
        risk_score: detail.risk_score,
        signals: detail,
        action_taken: 'none',
        outcome: 'pending',
      })
    }
  }

  let signalsCreated = 0
  if (toInsert.length > 0) {
    const { error: insErr, count } = await supabase
      .from('sala_churn_signals')
      .insert(toInsert, { count: 'exact' })
    if (insErr) {
      return NextResponse.json(
        { error: 'insert_failed', detail: insErr.message, evaluated: subs.length, at_risk: atRisk },
        { status: 500 },
      )
    }
    signalsCreated = count ?? toInsert.length
  }

  return NextResponse.json({
    evaluated: subs.length,
    at_risk: atRisk,
    signals_created: signalsCreated,
    threshold: RISK_THRESHOLD,
  })
}
