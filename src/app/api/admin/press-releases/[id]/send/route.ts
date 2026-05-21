// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/press-releases/:id/send
//
// Dispara el envío real del PR a la base de medios. Reglas estrictas:
//
//   1. SOLO superadmin.
//   2. PR debe estar en status='approved' (no draft, no sent, no published).
//      Si ya fue enviado → 409.
//   3. Filtro de medios:
//        - status='active'
//        - sector matchea la especialidad del creador (con fallback a 'general')
//        - país opcional vía ?country=
//   4. Envío via Resend, batch de 25 con pausa de 1.1s entre batches.
//   5. Cada envío se registra en sala_press_outreach_log (idempotente por par
//      pr×outlet).
//   6. Actualiza sala_press_releases.status='sent', sent_at, sent_to_count.
//   7. Actualiza last_contacted_at en cada media_contact.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { isSuperadmin } from '@/lib/supabase/server'
import { getResend } from '@/lib/email'
import { buildPressEmailHtml, suggestSectorsFromSpecialty } from '@/lib/press-release-templates'

export const runtime = 'nodejs'
export const maxDuration = 60

const BATCH_SIZE = 25

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

interface PRRow {
  id: string
  creator_id: string
  status: string
  pr_title: string | null
  pr_body_es: string | null
  pr_quote: string | null
}

interface CreatorRow {
  id: string
  name: string
  slug: string
  specialty: string
  publication_name: string | null
}

interface MediaContactRow {
  id: string
  outlet_name: string
  email: string
  contact_name: string | null
  sector: string
  status: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isSuperadmin())) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { id: prId } = await params
  if (!prId || prId.length < 10) {
    return NextResponse.json({ error: 'id_required' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'resend_key_missing' }, { status: 500 })
  }

  // Filtros opcionales
  const url = new URL(request.url)
  const countryFilter = url.searchParams.get('country')
  const sectorOverride = url.searchParams.get('sector')
  const previewOnly = url.searchParams.get('preview') === '1'

  const admin = adminSupabase()

  // 1. Cargar PR
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: prRaw, error: prErr } = await (admin as any)
    .from('sala_press_releases')
    .select('id, creator_id, status, pr_title, pr_body_es, pr_quote')
    .eq('id', prId)
    .single()

  if (prErr || !prRaw) {
    return NextResponse.json({ error: 'press_release_not_found' }, { status: 404 })
  }
  const pr = prRaw as PRRow

  if (pr.status === 'sent' || pr.status === 'published') {
    return NextResponse.json(
      { error: 'already_sent', status: pr.status },
      { status: 409 }
    )
  }
  if (pr.status !== 'approved') {
    return NextResponse.json(
      { error: 'must_be_approved', current: pr.status },
      { status: 400 }
    )
  }
  if (!pr.pr_title || !pr.pr_body_es || !pr.pr_quote) {
    return NextResponse.json({ error: 'pr_content_missing' }, { status: 400 })
  }

  // 2. Cargar creator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creatorRaw } = await (admin as any)
    .from('sala_creators')
    .select('id, name, slug, specialty, publication_name')
    .eq('id', pr.creator_id)
    .single()

  if (!creatorRaw) {
    return NextResponse.json({ error: 'creator_not_found' }, { status: 404 })
  }
  const creator = creatorRaw as CreatorRow

  // 3. Determinar sectores objetivo
  const sectors = sectorOverride
    ? [sectorOverride]
    : suggestSectorsFromSpecialty(creator.specialty)

  // 4. Cargar media contacts elegibles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (admin as any)
    .from('sala_media_contacts')
    .select('id, outlet_name, email, contact_name, sector, status')
    .eq('status', 'active')

  if (sectors.length > 0) {
    // Incluir siempre 'general' como fallback
    const sectorList = Array.from(new Set([...sectors, 'general']))
    q = q.in('sector', sectorList)
  }
  if (countryFilter) q = q.eq('country', countryFilter)

  const { data: contactsRaw, error: contactsErr } = await q
  if (contactsErr) {
    console.error('[press-releases/send] contacts:', contactsErr.code, contactsErr.message)
    return NextResponse.json({ error: 'contacts_lookup_failed' }, { status: 500 })
  }

  const contacts = (contactsRaw ?? []) as MediaContactRow[]
  if (contacts.length === 0) {
    return NextResponse.json({ error: 'no_eligible_contacts' }, { status: 400 })
  }

  // 5. Excluir los ya contactados para este PR (idempotencia)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: alreadyLog } = await (admin as any)
    .from('sala_press_outreach_log')
    .select('media_contact_id')
    .eq('press_release_id', prId)

  const alreadySent = new Set(
    ((alreadyLog ?? []) as Array<{ media_contact_id: string }>).map((r) => r.media_contact_id)
  )
  const targetContacts = contacts.filter((c) => !alreadySent.has(c.id))

  if (previewOnly) {
    return NextResponse.json({
      ok: true,
      preview: true,
      would_send_to: targetContacts.length,
      sectors,
      already_sent_count: alreadySent.size,
      sample: targetContacts.slice(0, 8).map((c) => ({
        outlet: c.outlet_name,
        email: c.email,
        sector: c.sector,
      })),
    })
  }

  // 6. Stub-safe: si DEV_MODE=1, no enviar de verdad
  const devMode = process.env.DEV_MODE === '1'

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (let i = 0; i < targetContacts.length; i += BATCH_SIZE) {
    const batch = targetContacts.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map(async (mc) => {
        const html = buildPressEmailHtml({
          title: pr.pr_title!,
          body_es: pr.pr_body_es!,
          quote: pr.pr_quote!,
          creatorName: creator.name,
          creatorSlug: creator.slug,
          publicationName: creator.publication_name,
          contactName: mc.contact_name,
          outletName: mc.outlet_name,
        })

        try {
          if (!devMode) {
            await getResend().emails.send({
              from: 'Nebbuler Prensa <prensa@nebbuler.com>',
              to: mc.email,
              subject: pr.pr_title!,
              html,
              replyTo: 'prensa@nebbuler.com',
              headers: {
                'X-Entity-Ref-ID': `nebbuler-pr-${prId}-${mc.id}`,
              },
            })
          }
          sent++

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (admin as any).from('sala_press_outreach_log').insert({
            press_release_id: prId,
            media_contact_id: mc.id,
            response_status: 'sent',
          })

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (admin as any)
            .from('sala_media_contacts')
            .update({ last_contacted_at: new Date().toISOString() })
            .eq('id', mc.id)
        } catch (err) {
          failed++
          errors.push(`${mc.email}: ${(err as Error).message}`)
        }
      })
    )

    if (i + BATCH_SIZE < targetContacts.length) {
      await new Promise<void>((r) => setTimeout(r, 1100))
    }
  }

  // 7. Actualizar PR
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (admin as any)
    .from('sala_press_releases')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      sent_to_count: alreadySent.size + sent,
    })
    .eq('id', prId)

  return NextResponse.json({
    ok: true,
    mode: devMode ? 'dev' : 'live',
    sent,
    failed,
    total_recipients: targetContacts.length,
    already_sent_before: alreadySent.size,
    errors: errors.slice(0, 5),
  })
}
