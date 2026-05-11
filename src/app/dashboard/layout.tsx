import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'
import SidebarWrapper from './_components/SidebarWrapper'
import { PlanBanner } from './_components/PlanBanner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/entrar')
  }

  const [{ data: creatorRaw }, { data: profileRaw }] = await Promise.all([
    db.from('sala_creators').select('*').eq('user_id', user.id).maybeSingle(),
    db.from('sala_profiles').select('is_superadmin').eq('id', user.id).maybeSingle(),
  ])

  const creator = creatorRaw as Creator | null
  const isSuperAdmin = profileRaw?.is_superadmin === true

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F7F7F7]"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      <SidebarWrapper creator={creator} isSuperAdmin={isSuperAdmin} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {creator && <PlanBanner plan={creator.plan} />}
        {children}
      </div>
    </div>
  )
}
