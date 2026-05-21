// /dashboard/admin/outreach
// Cola de outreach LinkedIn (solo superadmin).

import { redirect } from 'next/navigation'
import { isSuperadmin } from '@/lib/supabase/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { OutreachAdminClient, type OutreachRow, type OutreachKpis } from './_client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Outreach LinkedIn · Admin Nebbuler',
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export default async function AdminOutreachPage() {
  if (!(await isSuperadmin())) {
    redirect('/dashboard')
  }

  const admin = adminSupabase()
  let initial: OutreachRow[] = []
  let kpis: OutreachKpis = {
    pending: 0,
    approved: 0,
    sent_this_week: 0,
    sent_total: 0,
    converted: 0,
    conversion_rate: 0,
  }

  if (admin) {
    const { data } = await admin
      .from('sala_outreach_targets')
      .select(
        'id, platform, profile_url, full_name, headline, country, specialty, followers_count, signal_post_url, signal_post_excerpt, signal_engagement, signal_reason, ai_score, ai_pitch_draft, status, invite_code_id, notes, detected_at, reviewed_at, sent_at'
      )
      .order('detected_at', { ascending: false })
      .limit(300)
    initial = (data as OutreachRow[] | null) ?? []

    // Cargar el invite code linkeado si existe (para mostrarlo en la card)
    const inviteIds = initial
      .map((r) => r.invite_code_id)
      .filter((x): x is string => typeof x === 'string' && x.length > 0)

    if (inviteIds.length > 0) {
      const { data: invites } = await admin
        .from('sala_invite_codes')
        .select('id, code')
        .in('id', inviteIds)
      const byId = new Map<string, string>()
      for (const inv of (invites ?? []) as Array<{ id: string; code: string }>) {
        byId.set(inv.id, inv.code)
      }
      initial = initial.map((r) => ({
        ...r,
        invite_code: r.invite_code_id ? byId.get(r.invite_code_id) ?? null : null,
      }))
    }

    // KPIs
    const { data: kpiRows } = await admin
      .from('sala_outreach_targets')
      .select('status, sent_at')

    type StatusRow = { status: string; sent_at: string | null }
    const rows = (kpiRows ?? []) as StatusRow[]
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    kpis = {
      pending: rows.filter((r) => r.status === 'pending').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      sent_this_week: rows.filter(
        (r) => r.sent_at && new Date(r.sent_at).getTime() > weekAgo
      ).length,
      sent_total: rows.filter((r) => r.status === 'sent' || r.status === 'contacted').length,
      converted: rows.filter((r) => r.status === 'converted').length,
      conversion_rate:
        rows.length > 0
          ? Number((rows.filter((r) => r.status === 'converted').length / rows.length).toFixed(3))
          : 0,
    }
  }

  return <OutreachAdminClient initialTargets={initial} initialKpis={kpis} />
}
