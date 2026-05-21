// /dashboard/admin/press-releases — cola de revisión superadmin

import { redirect } from 'next/navigation'
import { isSuperadmin } from '@/lib/supabase/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { PressReleasesAdminClient, type PressReleaseRow, type PressKpis } from './_client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Press Releases · Admin Nebbuler',
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export default async function AdminPressReleasesPage() {
  if (!(await isSuperadmin())) redirect('/dashboard')

  const admin = adminSupabase()
  let initial: PressReleaseRow[] = []
  let kpis: PressKpis = {
    draft: 0,
    approved: 0,
    sent: 0,
    published: 0,
    rejected: 0,
    publication_rate: 0,
  }

  if (admin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: prs } = await (admin as any)
      .from('sala_press_releases')
      .select(
        'id, creator_id, milestone_type, milestone_value, milestone_reached_at, pr_title, pr_body_es, pr_quote, ai_generated, status, reviewed_at, sent_at, sent_to_count, response_count, published_count, notes, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(300)

    type RawRow = {
      id: string
      creator_id: string
      [k: string]: unknown
    }
    const rows = (prs ?? []) as RawRow[]
    const creatorIds = Array.from(new Set(rows.map((r) => r.creator_id)))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creators } = await (admin as any)
      .from('sala_creators')
      .select('id, name, slug, specialty')
      .in('id', creatorIds.length > 0 ? creatorIds : ['00000000-0000-0000-0000-000000000000'])

    type CRow = { id: string; name: string; slug: string; specialty: string }
    const cMap = new Map<string, CRow>()
    for (const c of (creators ?? []) as CRow[]) cMap.set(c.id, c)

    initial = rows.map((r) => {
      const c = cMap.get(r.creator_id)
      return {
        ...(r as unknown as PressReleaseRow),
        creator_name: c?.name ?? null,
        creator_slug: c?.slug ?? null,
        creator_specialty: c?.specialty ?? null,
      }
    })

    // KPIs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: kpiRows } = await (admin as any)
      .from('sala_press_releases')
      .select('status, published_count')

    type KpiRow = { status: string; published_count: number | null }
    const kRows = (kpiRows ?? []) as KpiRow[]
    const sentTotal = kRows.filter((r) => r.status === 'sent' || r.status === 'published').length
    const publishedTotal = kRows.filter((r) => r.status === 'published').length
    kpis = {
      draft: kRows.filter((r) => r.status === 'draft').length,
      approved: kRows.filter((r) => r.status === 'approved').length,
      sent: sentTotal,
      published: publishedTotal,
      rejected: kRows.filter((r) => r.status === 'rejected').length,
      publication_rate: sentTotal > 0 ? Number((publishedTotal / sentTotal).toFixed(3)) : 0,
    }
  }

  return <PressReleasesAdminClient initial={initial} initialKpis={kpis} />
}
