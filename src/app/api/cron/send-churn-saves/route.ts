// ─────────────────────────────────────────────────────────────────────────────
// Cron diario: send-churn-saves
//
// Toma los signals con action_taken='none' que fueron creados entre 24h y 48h
// atrás (ventana de cooldown deliberada — da tiempo a que el subscriber lea
// orgánicamente sin recibir el save offer prematuro) y envía el email "save
// offer" via Resend.
//
// Schedule: 0 14 * * *  (14:00 UTC = 11:00 AM Santiago, 3h después de detect)
//
// Resend free tier: 100 emails/día. Cap por ejecución: 50.
//
// Garantías:
//   - Lazy init de Supabase + Resend
//   - Marca action_taken='email_pause_offer' + email_sent_at antes de enviar
//     para evitar duplicados si el run se reintenta
//   - Genera pauseToken y unsubscribeToken con randomBytes (firma server-side)
//   - Si Resend falla, registra error en sala_notification_log con status='failed'
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { isAuthorizedCron } from '@/lib/cron-auth'
import { getResend } from '@/lib/email'
import { buildChurnSaveEmail } from '@/lib/email-templates/churn-save'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_EMAILS_PER_RUN = 50
const COOLDOWN_HOURS_MIN = 24
const COOLDOWN_HOURS_MAX = 48
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'
const FROM = process.env.RESEND_FROM ?? 'Nebbuler <no-reply@nebbuler.com>'

interface SignalRow {
  id: string
  subscriber_id: string
  creator_id: string
  risk_score: number
  signals: unknown
  created_at: string
}

interface SubscriberRow {
  id: string
  email: string | null
  full_name: string | null
}

interface CreatorRow {
  id: string
  name: string
  slug: string
  publication_name: string | null
}

interface SubscriptionRow {
  subscriber_id: string
  creator_id: string
  price_clp: number
  status: string
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

function firstName(full: string | null): string | null {
  if (!full) return null
  const first = full.trim().split(/\s+/)[0]
  return first || null
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'resend_key_missing' }, { status: 500 })
  }

  const supabase = adminSupabase()

  const now = Date.now()
  const minIso = new Date(now - COOLDOWN_HOURS_MAX * 60 * 60 * 1000).toISOString()
  const maxIso = new Date(now - COOLDOWN_HOURS_MIN * 60 * 60 * 1000).toISOString()

  // 1. Signals listos para acción
  const { data: signalsRaw, error: sigErr } = await supabase
    .from('sala_churn_signals')
    .select('id, subscriber_id, creator_id, risk_score, signals, created_at')
    .eq('action_taken', 'none')
    .eq('outcome', 'pending')
    .gte('created_at', minIso)
    .lte('created_at', maxIso)
    .order('risk_score', { ascending: false })
    .limit(MAX_EMAILS_PER_RUN)

  if (sigErr) {
    return NextResponse.json({ error: 'signals_query_failed', detail: sigErr.message }, { status: 500 })
  }

  const signals = (signalsRaw ?? []) as SignalRow[]
  if (signals.length === 0) {
    return NextResponse.json({ candidates: 0, sent: 0, failed: 0 })
  }

  const subscriberIds = Array.from(new Set(signals.map((s) => s.subscriber_id)))
  const creatorIds = Array.from(new Set(signals.map((s) => s.creator_id)))

  const [{ data: profilesRaw }, { data: creatorsRaw }, { data: subsRaw }] = await Promise.all([
    supabase.from('sala_profiles').select('id, email, full_name').in('id', subscriberIds),
    supabase
      .from('sala_creators')
      .select('id, name, slug, publication_name')
      .in('id', creatorIds),
    supabase
      .from('sala_subscriptions')
      .select('subscriber_id, creator_id, price_clp, status')
      .in('subscriber_id', subscriberIds)
      .in('creator_id', creatorIds)
      .eq('status', 'active'),
  ])

  const profMap = new Map<string, SubscriberRow>(
    ((profilesRaw ?? []) as SubscriberRow[]).map((p) => [p.id, p]),
  )
  const creatorMap = new Map<string, CreatorRow>(
    ((creatorsRaw ?? []) as CreatorRow[]).map((c) => [c.id, c]),
  )
  const subMap = new Map<string, SubscriptionRow>(
    ((subsRaw ?? []) as SubscriptionRow[]).map((s) => [`${s.subscriber_id}:${s.creator_id}`, s]),
  )

  const resend = getResend()
  let sent = 0
  let failed = 0
  const errors: Array<{ signal_id: string; reason: string }> = []

  for (const sig of signals) {
    const prof = profMap.get(sig.subscriber_id)
    const creator = creatorMap.get(sig.creator_id)
    const sub = subMap.get(`${sig.subscriber_id}:${sig.creator_id}`)

    if (!prof?.email || !creator || !sub) {
      failed++
      errors.push({ signal_id: sig.id, reason: 'missing_data' })
      // marcar snoozed para que no se reintente eternamente
      await supabase
        .from('sala_churn_signals')
        .update({ outcome: 'snoozed', outcome_at: new Date().toISOString() })
        .eq('id', sig.id)
      continue
    }

    // Marcar action ANTES de enviar (idempotencia ante retries del cron)
    const { error: updErr } = await supabase
      .from('sala_churn_signals')
      .update({
        action_taken: 'email_pause_offer',
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', sig.id)
      .eq('action_taken', 'none') // optimistic lock

    if (updErr) {
      failed++
      errors.push({ signal_id: sig.id, reason: `lock_failed: ${updErr.message}` })
      continue
    }

    const pauseToken = randomBytes(24).toString('base64url')
    const unsubscribeToken = randomBytes(24).toString('base64url')

    const tpl = buildChurnSaveEmail({
      subscriberFirstName: firstName(prof.full_name),
      creatorName: creator.name,
      creatorSlug: creator.slug,
      publicationName: creator.publication_name ?? creator.name,
      priceClp: sub.price_clp,
      baseUrl: BASE_URL,
      pauseToken,
      unsubscribeToken,
    })

    try {
      const result = await resend.emails.send({
        from: FROM,
        to: prof.email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        headers: {
          'List-Unsubscribe': `<${BASE_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}>, <mailto:unsubscribe@nebbuler.com>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })

      sent++

      // Log entrega
      await supabase.from('sala_notification_log').insert({
        subscriber_id: sig.subscriber_id,
        creator_id: sig.creator_id,
        channel: 'email',
        status: 'sent',
        provider_id: (result as { data?: { id?: string } })?.data?.id ?? null,
      })
    } catch (e) {
      failed++
      const msg = e instanceof Error ? e.message : String(e)
      errors.push({ signal_id: sig.id, reason: `send_failed: ${msg}` })

      // Revertir el lock + loguear fallo
      await supabase
        .from('sala_churn_signals')
        .update({
          action_taken: 'none',
          email_sent_at: null,
        })
        .eq('id', sig.id)

      await supabase.from('sala_notification_log').insert({
        subscriber_id: sig.subscriber_id,
        creator_id: sig.creator_id,
        channel: 'email',
        status: 'failed',
        error: msg.slice(0, 500),
      })
    }
  }

  return NextResponse.json({
    candidates: signals.length,
    sent,
    failed,
    errors: errors.slice(0, 10),
  })
}
