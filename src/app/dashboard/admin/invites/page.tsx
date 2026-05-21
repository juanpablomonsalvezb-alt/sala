import { redirect } from 'next/navigation'
import { isSuperadmin } from '@/lib/supabase/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { InvitesAdminClient } from './_client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Invitaciones VIP · Admin Nebbuler',
}

interface InviteRow {
  id: string
  code: string
  assigned_email: string | null
  assigned_name: string | null
  notes: string | null
  max_uses: number
  times_used: number
  expires_at: string | null
  revoked_at: string | null
  grants_plan: string
  created_at: string
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export default async function AdminInvitesPage() {
  if (!(await isSuperadmin())) {
    redirect('/dashboard')
  }

  const admin = adminSupabase()
  let invites: InviteRow[] = []
  if (admin) {
    const { data } = await admin
      .from('sala_invite_codes')
      .select(
        'id, code, assigned_email, assigned_name, notes, max_uses, times_used, expires_at, revoked_at, grants_plan, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(500)
    invites = (data as InviteRow[] | null) ?? []
  }

  return <InvitesAdminClient initialInvites={invites} />
}
