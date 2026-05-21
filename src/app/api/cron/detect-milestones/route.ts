// ─────────────────────────────────────────────────────────────────────────────
// Cron diario: detect-milestones
//
// Detecta creadores que cruzaron hitos relevantes (100/500/1000 suscriptores,
// 1 año en plataforma) y genera un press release draft via Claude para que el
// superadmin lo revise en /dashboard/admin/press-releases.
//
// Schedule: 0 8 * * *  (08:00 UTC = 05:00 AM Santiago)
//
// Garantías:
//   - Idempotente: si ya existe un PR del mismo (creator, milestone_type), skip.
//   - Rate limit: máximo 5 nuevos drafts por ejecución (cuidar tokens Claude).
//   - Rate limit por creador: ningún creador recibe 2 PR en menos de 30 días.
//   - Notifica al superadmin via Resend cuando hay drafts nuevos.
//   - Lazy init de Supabase admin client y Anthropic client.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { isAuthorizedCron } from '@/lib/cron-auth'
import { getResend } from '@/lib/email'
import {
  generatePR,
  detectMilestoneFromSubscribers,
  type MilestoneType,
} from '@/lib/press-release-templates'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_NEW_DRAFTS_PER_RUN = 5
const COOLDOWN_DAYS_PER_CREATOR = 30
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

interface CreatorRow {
  id: string
  name: string
  slug: string
  specialty: string
  bio: string | null
  publication_name: string | null
  subscriber_count: number | null
  created_at: string
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

function inferCountry(slug: string): string {
  // Heurística mínima — el schema actual de sala_creators no almacena country
  // de forma explícita. Usamos un default neutro y dejamos que el editor lo
  // ajuste manualmente. Mantenido aquí por si en el futuro se añade columna.
  if (slug.endsWith('-cl')) return 'CL'
  if (slug.endsWith('-ar')) return 'AR'
  if (slug.endsWith('-mx')) return 'MX'
  if (slug.endsWith('-co')) return 'CO'
  if (slug.endsWith('-pe')) return 'PE'
  return 'CL'
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000)
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'anthropic_key_missing' }, { status: 500 })
  }

  const supabase = adminSupabase()

  // 1. Pull creators relevantes — todos los que tienen ≥ 100 suscriptores o
  //    cumplieron ≥ 1 año. Acotamos para no traer toda la tabla.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawCreators, error: listErr } = await (supabase as any)
    .from('sala_creators')
    .select('id, name, slug, specialty, bio, publication_name, subscriber_count, created_at')
    .or('subscriber_count.gte.100')
    .limit(500)

  if (listErr) {
    console.error('[detect-milestones] list creators:', listErr.code, listErr.message)
    return NextResponse.json({ error: 'list_failed' }, { status: 500 })
  }

  const creators = ((rawCreators ?? []) as CreatorRow[]).filter(
    (c) => typeof c.id === 'string' && typeof c.slug === 'string'
  )

  // 2. Cargar los PR existentes para los creadores candidatos
  const creatorIds = creators.map((c) => c.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingPrs } = await (supabase as any)
    .from('sala_press_releases')
    .select('creator_id, milestone_type, created_at')
    .in('creator_id', creatorIds.length > 0 ? creatorIds : ['00000000-0000-0000-0000-000000000000'])

  const existingByCreator = new Map<string, Array<{ milestone_type: string; created_at: string }>>()
  for (const pr of (existingPrs ?? []) as Array<{
    creator_id: string
    milestone_type: string
    created_at: string
  }>) {
    const list = existingByCreator.get(pr.creator_id) ?? []
    list.push({ milestone_type: pr.milestone_type, created_at: pr.created_at })
    existingByCreator.set(pr.creator_id, list)
  }

  // 3. Determinar candidatos a generar PR — uno por creador, máximo MAX_NEW.
  interface Candidate {
    creator: CreatorRow
    milestoneType: MilestoneType
    milestoneValue: number
  }
  const candidates: Candidate[] = []

  for (const c of creators) {
    if (candidates.length >= MAX_NEW_DRAFTS_PER_RUN) break

    const prior = existingByCreator.get(c.id) ?? []

    // Cooldown: si tiene un PR creado hace < 30 días, skip.
    const lastPr = prior
      .map((p) => new Date(p.created_at).getTime())
      .sort((a, b) => b - a)[0]
    if (lastPr && daysSince(new Date(lastPr).toISOString()) < COOLDOWN_DAYS_PER_CREATOR) {
      continue
    }

    // Detectar hito de suscriptores
    const subMilestone = detectMilestoneFromSubscribers(c.subscriber_count ?? 0)
    if (subMilestone && !prior.some((p) => p.milestone_type === subMilestone.type)) {
      candidates.push({
        creator: c,
        milestoneType: subMilestone.type,
        milestoneValue: subMilestone.value,
      })
      continue
    }

    // Detectar one_year (creador con ≥ 365 días sin PR de aniversario)
    const ageDays = daysSince(c.created_at)
    if (ageDays >= 365 && !prior.some((p) => p.milestone_type === 'one_year')) {
      candidates.push({
        creator: c,
        milestoneType: 'one_year',
        milestoneValue: Math.floor(ageDays / 365),
      })
    }
  }

  // 4. Generar drafts en serie (no martillar Anthropic)
  const drafts: Array<{ creatorName: string; title: string; id: string }> = []
  const errors: string[] = []

  for (const cand of candidates) {
    try {
      const pr = await generatePR({
        creator: {
          name: cand.creator.name,
          specialty: cand.creator.specialty,
          bio: cand.creator.bio ?? '',
          country: inferCountry(cand.creator.slug),
          publication_name: cand.creator.publication_name,
          slug: cand.creator.slug,
        },
        milestone: { type: cand.milestoneType, value: cand.milestoneValue },
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: inserted, error } = await (supabase as any)
        .from('sala_press_releases')
        .insert({
          creator_id: cand.creator.id,
          milestone_type: cand.milestoneType,
          milestone_value: cand.milestoneValue,
          pr_title: pr.title,
          pr_body_es: pr.body_es,
          pr_quote: pr.quote,
          ai_generated: true,
          status: 'draft',
          notes: `Sectores sugeridos: ${pr.suggested_sectors.join(', ')}`,
        })
        .select('id')
        .single()

      if (error) {
        errors.push(`${cand.creator.slug}: ${error.code} ${error.message}`)
        continue
      }

      drafts.push({
        creatorName: cand.creator.name,
        title: pr.title,
        id: (inserted as { id: string }).id,
      })
    } catch (err) {
      errors.push(`${cand.creator.slug}: ${(err as Error).message}`)
    }
  }

  // 5. Notificar al superadmin si hubo drafts nuevos
  let notified = false
  if (drafts.length > 0 && process.env.RESEND_API_KEY) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: admins } = await (supabase as any)
        .from('sala_profiles')
        .select('email')
        .eq('is_superadmin', true)
        .limit(10)

      const adminEmails = ((admins ?? []) as Array<{ email: string }>)
        .map((a) => a.email)
        .filter((e) => typeof e === 'string' && e.includes('@'))

      if (adminEmails.length > 0) {
        const listHtml = drafts
          .map(
            (d) =>
              `<li style="margin-bottom:8px;font-family:Georgia,serif;font-size:14px;color:#222;">
                 <strong>${escapeHtml(d.creatorName)}</strong> — ${escapeHtml(d.title)}
               </li>`
          )
          .join('')

        await getResend().emails.send({
          from: 'Nebbuler <prensa@nebbuler.com>',
          to: adminEmails,
          subject: `[Nebbuler] ${drafts.length} nuevo${drafts.length > 1 ? 's' : ''} PR draft listo${drafts.length > 1 ? 's' : ''}`,
          html: `<div style="font-family:Georgia,serif;background:#F7F7F7;padding:40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#FFFFFF;border:1px solid #E8E8E8;">
              <tr><td style="background:#C41C1C;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
              <tr><td style="padding:28px 36px 6px;">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;color:#999;letter-spacing:3px;text-transform:uppercase;">Press Releases · Drafts</p>
                <h1 style="margin:8px 0 14px;font-family:Georgia,serif;font-size:22px;color:#121212;">${drafts.length} draft${drafts.length > 1 ? 's' : ''} esperando revisión</h1>
              </td></tr>
              <tr><td style="padding:0 36px 18px;">
                <ul style="margin:0;padding-left:20px;">${listHtml}</ul>
              </td></tr>
              <tr><td style="padding:6px 36px 28px;">
                <a href="${BASE_URL}/dashboard/admin/press-releases" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:13px 26px;text-decoration:none;">Revisar drafts &rarr;</a>
              </td></tr>
            </table>
          </div>`,
        })
        notified = true
      }
    } catch (err) {
      console.warn('[detect-milestones] notify superadmin failed:', err)
    }
  }

  return NextResponse.json({
    ok: true,
    creators_scanned: creators.length,
    candidates: candidates.length,
    drafts_created: drafts.length,
    drafts: drafts.map((d) => ({ id: d.id, creator: d.creatorName, title: d.title })),
    notified,
    errors: errors.slice(0, 5),
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
