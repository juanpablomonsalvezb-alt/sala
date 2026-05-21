// Server Component — stats agregados de la plataforma para mostrar momentum.
// Lazy createClient. ISR 10 min. Si los números son bajos, render cualitativo
// (no exponemos cifras vergonzosas en early stage).

import { createServiceClient } from '@/lib/supabase/server'

export const revalidate = 600 // 10 min

type Stats = {
  creators: number
  subscriptions: number
  newThisWeek: number
}

async function fetchStats(): Promise<Stats | null> {
  try {
    const supabase = createServiceClient()
    const weekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [creatorsRes, subsRes, newSubsRes] = await Promise.all([
      supabase.from('sala_creators').select('id', { count: 'exact', head: true }),
      supabase
        .from('sala_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('sala_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', weekAgoIso),
    ])

    return {
      creators: creatorsRes.count ?? 0,
      subscriptions: subsRes.count ?? 0,
      newThisWeek: newSubsRes.count ?? 0,
    }
  } catch (err) {
    console.error('[momentum-stats] fetch error', err)
    return null
  }
}

const NUM = (n: number) => n.toLocaleString('es-CL')

export default async function MomentumStats() {
  const stats = await fetchStats()
  if (!stats) return null

  // Early stage — no mostrar cifras absolutas bajas.
  const totalSignal = stats.creators + stats.subscriptions
  if (totalSignal < 10) {
    return (
      <p className="mt-4 text-center font-serif italic text-[12px] text-[#888]">
        Una comunidad creciente de profesionales LATAM
      </p>
    )
  }

  const parts: string[] = []
  if (stats.creators > 0) parts.push(`${NUM(stats.creators)} creadores`)
  if (stats.subscriptions > 0) parts.push(`${NUM(stats.subscriptions)} suscriptores`)
  if (stats.newThisWeek > 0) parts.push(`+${NUM(stats.newThisWeek)} esta semana`)

  if (parts.length === 0) return null

  return (
    <p className="mt-4 text-center font-serif italic text-[12px] text-[#888] tracking-wide">
      {parts.join(' · ')}
    </p>
  )
}
