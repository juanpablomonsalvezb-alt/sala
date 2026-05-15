import { redirect } from 'next/navigation'
import { isSuperadmin, createServiceClient } from '@/lib/supabase/server'
import SaludClient from './_components/SaludClient'

export const dynamic = 'force-dynamic'

interface HistoryEntry {
  id: string
  checked_at: string
  all_ok: boolean
  failed_checks: string[]
  alerted: boolean
}

export default async function SaludPage() {
  const superadmin = await isSuperadmin()
  if (!superadmin) redirect('/dashboard')

  // Cargar historial de los últimos 7 días
  const supabase = createServiceClient()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: historyRaw } = await (supabase as any)
    .from('health_check_log')
    .select('id, checked_at, all_ok, failed_checks, alerted')
    .gte('checked_at', since)
    .order('checked_at', { ascending: false })
    .limit(50)

  const history: HistoryEntry[] = historyRaw ?? []

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1
              className="text-[22px] font-bold text-[#121212]"
              style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
            >
              Estado del sistema
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-2 py-0.5">
              SUPERADMIN
            </span>
          </div>
          <p
            className="text-[13px] text-[#666]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Monitoreo en tiempo real · Auto-refresco cada 30 segundos · Cron diario 06:00 UTC
          </p>
        </div>
      </div>

      <SaludClient initialHistory={history} />
    </>
  )
}
