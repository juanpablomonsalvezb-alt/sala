// /dashboard/admin/media-contacts — CRUD base de medios

import { redirect } from 'next/navigation'
import { isSuperadmin } from '@/lib/supabase/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { MediaContactsAdminClient, type MediaContactRow } from './_client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Medios · Admin Nebbuler',
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export default async function AdminMediaContactsPage() {
  if (!(await isSuperadmin())) redirect('/dashboard')

  const admin = adminSupabase()
  let initial: MediaContactRow[] = []

  if (admin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (admin as any)
      .from('sala_media_contacts')
      .select(
        'id, outlet_name, country, tier, sector, email, contact_name, language, status, last_contacted_at, response_rate, notes, created_at'
      )
      .order('outlet_name', { ascending: true })
      .limit(500)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: logRows } = await (admin as any)
      .from('sala_press_outreach_log')
      .select('media_contact_id, response_status')

    type LogRow = { media_contact_id: string; response_status: string | null }
    const logs = (logRows ?? []) as LogRow[]
    const statsMap = new Map<string, { contacted: number; published: number; replied: number }>()
    for (const l of logs) {
      const s = statsMap.get(l.media_contact_id) ?? { contacted: 0, published: 0, replied: 0 }
      s.contacted++
      if (l.response_status === 'published') s.published++
      if (l.response_status === 'replied') s.replied++
      statsMap.set(l.media_contact_id, s)
    }

    type DBRow = MediaContactRow & { id: string }
    initial = ((data ?? []) as DBRow[]).map((r) => ({
      ...r,
      times_contacted: statsMap.get(r.id)?.contacted ?? 0,
      times_published: statsMap.get(r.id)?.published ?? 0,
      times_replied: statsMap.get(r.id)?.replied ?? 0,
    }))
  }

  return <MediaContactsAdminClient initial={initial} />
}
