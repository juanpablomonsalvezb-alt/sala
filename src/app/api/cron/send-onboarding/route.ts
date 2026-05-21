// Cron diario — envía la secuencia de onboarding (5 emails / 30 días) a
// cada suscriptor nuevo. Idempotente: UNIQUE(subscription_id, stage) en DB
// garantiza que dos corridas en el mismo día no duplican.
//
// Anti-spam:
//   - Rate-limit interno: máx 80 emails por ejecución (Resend free 100/día).
//   - Filtra solo suscripciones status=active y excluye plan free (trials).
//   - Skip silencioso si RESEND_API_KEY no está configurada.
//
// Stub-safe: si falla cualquier dependencia opcional (Resend, tracking),
// la ejecución continúa y solo deja warning en logs.

import { NextResponse } from 'next/server'
import { isAuthorizedCron } from '@/lib/cron-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { getResend } from '@/lib/email'
import { randomBytes } from 'crypto'

import { buildWelcomeEmail, WelcomePost } from '@/lib/email-templates/onboarding/welcome'
import { buildTipsDay3Email } from '@/lib/email-templates/onboarding/tips-day-3'
import { buildSurveyDay7Email } from '@/lib/email-templates/onboarding/survey-day-7'
import { buildViralDay14Email, ViralQuote } from '@/lib/email-templates/onboarding/viral-day-14'
import { buildNpsDay30Email } from '@/lib/email-templates/onboarding/nps-day-30'
import { OnboardingContext, OnboardingStage, BASE_URL } from '@/lib/email-templates/onboarding/_shared'

export const runtime = 'nodejs'
export const maxDuration = 300

const STAGE_AGE_DAYS: Record<OnboardingStage, { min: number; max: number }> = {
  welcome:      { min: 0,  max: 1  },
  tips_day_3:   { min: 3,  max: 4  },
  survey_day_7: { min: 7,  max: 8  },
  viral_day_14: { min: 14, max: 15 },
  nps_day_30:   { min: 30, max: 31 },
}

const STAGE_ORDER: OnboardingStage[] = [
  'welcome',
  'tips_day_3',
  'survey_day_7',
  'viral_day_14',
  'nps_day_30',
]

const MAX_EMAILS_PER_RUN = 80

interface CandidateRow {
  subscription_id: string
  subscriber_id: string
  creator_id: string
  created_at: string
  email: string
  full_name: string | null
  creator_name: string
  creator_slug: string
  creator_bio: string | null
  publication_name: string
}

function firstNameFrom(fullName: string | null | undefined): string {
  if (!fullName) return ''
  return fullName.trim().split(/\s+/)[0] ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchCandidates(db: any, stage: OnboardingStage): Promise<CandidateRow[]> {
  const { min, max } = STAGE_AGE_DAYS[stage]
  const now = Date.now()
  const maxCreatedAt = new Date(now - min * 86_400_000).toISOString()
  const minCreatedAt = new Date(now - (max + 1) * 86_400_000).toISOString()

  // 1. Suscripciones en la ventana de edad y activas, plan distinto de 'free'.
  const { data: subs, error } = await db
    .from('sala_subscriptions')
    .select('id, subscriber_id, creator_id, created_at, plan, status')
    .eq('status', 'active')
    .gte('created_at', minCreatedAt)
    .lte('created_at', maxCreatedAt)
    .limit(MAX_EMAILS_PER_RUN * 3)

  if (error) {
    console.error('[onboarding] fetch subs error:', error.message)
    return []
  }
  if (!subs?.length) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredSubs = (subs as any[]).filter((s) => {
    const plan = (s.plan ?? '').toString().toLowerCase()
    return plan !== 'free'
  })
  if (filteredSubs.length === 0) return []

  const subIds = filteredSubs.map((s) => s.id)

  // 2. Ya enviados (anti-duplicado redundante con UNIQUE de DB, pero filtra antes).
  const { data: sent } = await db
    .from('sala_onboarding_log')
    .select('subscription_id')
    .eq('stage', stage)
    .in('subscription_id', subIds)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sentSet = new Set((sent as any[] | null ?? []).map((r) => r.subscription_id))
  const pending = filteredSubs.filter((s) => !sentSet.has(s.id))
  if (pending.length === 0) return []

  // 3. Resolver perfiles y creadores en bulk.
  const subscriberIds = Array.from(new Set(pending.map((s) => s.subscriber_id)))
  const creatorIds = Array.from(new Set(pending.map((s) => s.creator_id)))

  const [profilesRes, creatorsRes] = await Promise.all([
    db.from('sala_profiles').select('id, email, full_name').in('id', subscriberIds),
    db.from('sala_creators').select('id, name, display_name, slug, username, publication_name, bio').in('id', creatorIds),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profilesMap = new Map<string, any>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((profilesRes.data as any[] | null) ?? []).map((p) => [p.id, p]),
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const creatorsMap = new Map<string, any>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((creatorsRes.data as any[] | null) ?? []).map((c) => [c.id, c]),
  )

  const out: CandidateRow[] = []
  for (const s of pending) {
    const p = profilesMap.get(s.subscriber_id)
    const c = creatorsMap.get(s.creator_id)
    if (!p?.email || !c) continue
    const creatorName = c.display_name ?? c.name ?? 'Tu creador'
    const creatorSlug = c.slug ?? c.username ?? ''
    if (!creatorSlug) continue
    out.push({
      subscription_id: s.id,
      subscriber_id: s.subscriber_id,
      creator_id: s.creator_id,
      created_at: s.created_at,
      email: p.email,
      full_name: p.full_name ?? null,
      creator_name: creatorName,
      creator_slug: creatorSlug,
      creator_bio: c.bio ?? null,
      publication_name: c.publication_name ?? creatorName,
    })
  }
  return out
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function persistUnsubscribeToken(db: any, subscriber_id: string, creator_id: string): Promise<string> {
  const token = randomBytes(24).toString('hex')
  try {
    await db
      .from('sala_unsubscribe_tokens')
      .upsert(
        {
          token,
          subscriber_id,
          creator_id,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: 'subscriber_id,creator_id' },
      )
  } catch (err) {
    console.warn('[onboarding] unsubscribe token persist failed (non-fatal):', (err as Error).message)
  }
  return token
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchTopPosts(db: any, creator_id: string): Promise<WelcomePost[]> {
  const { data } = await db
    .from('sala_posts')
    .select('title, slug, excerpt, published_at')
    .eq('creator_id', creator_id)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(3)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data as any[] | null) ?? []).map((p) => ({
    title: p.title ?? '',
    slug: p.slug ?? '',
    excerpt: p.excerpt ?? null,
    publishedAt: p.published_at ?? null,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchQuotes(db: any, creator_id: string): Promise<ViralQuote[]> {
  // Estrategia: tomar pull_quote si existe (column opcional); si no, derivar
  // del excerpt de los 3 posts más recientes.
  const { data } = await db
    .from('sala_posts')
    .select('title, slug, excerpt, published_at')
    .eq('creator_id', creator_id)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(3)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data as any[] | null) ?? [])
    .filter((p) => (p.excerpt ?? '').trim().length >= 20)
    .map((p) => ({
      text: (p.excerpt as string).trim().slice(0, 240),
      postTitle: p.title ?? '',
      postSlug: p.slug ?? '',
    }))
}

async function buildEmailForStage(
  stage: OnboardingStage,
  ctx: OnboardingContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
): Promise<{ subject: string; html: string } | null> {
  switch (stage) {
    case 'welcome': {
      const top = await fetchTopPosts(db, ctx.creator.id)
      return buildWelcomeEmail(ctx, top)
    }
    case 'tips_day_3':
      return buildTipsDay3Email(ctx)
    case 'survey_day_7':
      return buildSurveyDay7Email(ctx)
    case 'viral_day_14': {
      const quotes = await fetchQuotes(db, ctx.creator.id)
      return buildViralDay14Email(ctx, quotes)
    }
    case 'nps_day_30':
      return buildNpsDay30Email(ctx)
    default:
      return null
  }
}

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const hasResend = Boolean(process.env.RESEND_API_KEY)
  if (!hasResend) {
    console.warn('[onboarding] RESEND_API_KEY missing — modo stub (no se envían emails)')
  }

  const sentByStage: Record<OnboardingStage, number> = {
    welcome: 0,
    tips_day_3: 0,
    survey_day_7: 0,
    viral_day_14: 0,
    nps_day_30: 0,
  }
  const failedByStage: Record<OnboardingStage, number> = {
    welcome: 0,
    tips_day_3: 0,
    survey_day_7: 0,
    viral_day_14: 0,
    nps_day_30: 0,
  }
  const errors: string[] = []
  let totalSent = 0

  for (const stage of STAGE_ORDER) {
    if (totalSent >= MAX_EMAILS_PER_RUN) {
      console.warn('[onboarding] rate-limit interno alcanzado: %d emails', totalSent)
      break
    }

    const candidates = await fetchCandidates(db, stage)
    if (candidates.length === 0) continue

    const room = MAX_EMAILS_PER_RUN - totalSent
    const batch = candidates.slice(0, room)

    for (const cand of batch) {
      const token = await persistUnsubscribeToken(db, cand.subscriber_id, cand.creator_id)
      const ctx: OnboardingContext = {
        subscriptionId: cand.subscription_id,
        subscriber: {
          id: cand.subscriber_id,
          email: cand.email,
          firstName: firstNameFrom(cand.full_name),
        },
        creator: {
          id: cand.creator_id,
          name: cand.creator_name,
          slug: cand.creator_slug,
          bio: cand.creator_bio,
          publicationName: cand.publication_name,
        },
        unsubscribeToken: token,
      }

      let built: { subject: string; html: string } | null = null
      try {
        built = await buildEmailForStage(stage, ctx, db)
      } catch (err) {
        const msg = (err as Error).message
        console.error('[onboarding] build template error stage=%s sub=%s: %s', stage, cand.subscription_id, msg)
        errors.push(`build ${stage}:${cand.subscription_id}: ${msg}`)
        failedByStage[stage]++
        continue
      }
      if (!built) {
        failedByStage[stage]++
        continue
      }

      // Idempotencia atómica: intentamos INSERT primero. Si UNIQUE truena → skip.
      const insertRes = await db.from('sala_onboarding_log').insert({
        subscription_id: cand.subscription_id,
        subscriber_id: cand.subscriber_id,
        creator_id: cand.creator_id,
        stage,
      })
      if (insertRes.error) {
        // Conflict (ya enviado) o error real → skip silencioso, no spam.
        if (!/duplicate key|unique/i.test(insertRes.error.message)) {
          console.warn('[onboarding] log insert non-unique error:', insertRes.error.message)
        }
        continue
      }

      if (!hasResend) {
        console.log('[onboarding][stub] would send stage=%s sub=%s to=%s', stage, cand.subscription_id, cand.email)
        sentByStage[stage]++
        totalSent++
        continue
      }

      try {
        await getResend().emails.send({
          from: `${cand.publication_name} via Nebbuler <onboarding@nebbuler.com>`,
          to: cand.email,
          subject: built.subject,
          html: built.html,
          headers: {
            'List-Unsubscribe': `<${BASE_URL}/api/unsubscribe?token=${token}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })
        sentByStage[stage]++
        totalSent++
      } catch (err) {
        failedByStage[stage]++
        const msg = (err as Error).message
        console.error('[onboarding] resend error stage=%s sub=%s: %s', stage, cand.subscription_id, msg)
        errors.push(`send ${stage}:${cand.subscription_id}: ${msg.slice(0, 200)}`)
        // Rollback del log para que el próximo cron reintente.
        try {
          await db
            .from('sala_onboarding_log')
            .delete()
            .eq('subscription_id', cand.subscription_id)
            .eq('stage', stage)
        } catch {
          /* best-effort */
        }
      }

      // Rate-limit de Resend free (2 req/seg): ~600ms entre envíos.
      await new Promise<void>((r) => setTimeout(r, 600))
    }
  }

  return NextResponse.json({
    ok: true,
    stub_mode: !hasResend,
    total_sent: totalSent,
    sent_by_stage: sentByStage,
    failed_by_stage: failedByStage,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
  })
}
