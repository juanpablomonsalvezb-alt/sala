import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'
import AnalyticsDashboard from './_components/AnalyticsDashboard'

export default async function AnaliticasPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  const { data: creatorRaw } = await db
    .from('sala_creators')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Creator | null
  if (!creator) redirect('/dashboard')

  // ── Posts con vistas ─────────────────────────────────────────────────────
  const { data: postsRaw } = await db
    .from('sala_posts')
    .select('id, title, slug, published_at, view_count, is_free')
    .eq('creator_id', creator.id)
    .not('published_at', 'is', null)
    .order('view_count', { ascending: false })

  // ── Suscriptores por mes (últimos 6 meses) ────────────────────────────────
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: subsRaw } = await db
    .from('sala_subscriptions')
    .select('created_at, status, cancelled_at')
    .eq('creator_id', creator.id)
    .gte('created_at', sixMonthsAgo.toISOString())
    .order('created_at', { ascending: true })

  // ── Suscriptores activos totales ──────────────────────────────────────────
  const { count: activeSubs } = await db
    .from('sala_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)
    .eq('status', 'active')

  // ── MRR ───────────────────────────────────────────────────────────────────
  const { data: subsForMRR } = await db
    .from('sala_subscriptions')
    .select('price_clp')
    .eq('creator_id', creator.id)
    .eq('status', 'active')

  const mrr = (subsForMRR ?? []).reduce((acc: number, s: { price_clp: number }) => acc + (s.price_clp ?? 0), 0)

  // ── Construir datos de crecimiento por mes ────────────────────────────────
  const monthlyData = buildMonthlyData(subsRaw ?? [])

  return (
    <>
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex-shrink-0">
        <h1 className="text-[22px] font-bold text-[#121212] font-serif">Analíticas</h1>
        <p className="text-[13px] text-[#666] font-sans mt-0.5">Rendimiento de tu sala</p>
      </div>
      <main className="flex-1 overflow-y-auto">
        <AnalyticsDashboard
          posts={postsRaw ?? []}
          monthlyData={monthlyData}
          activeSubs={activeSubs ?? 0}
          mrr={mrr}
          creatorPrice={creator.price_clp}
        />
      </main>
    </>
  )
}

function buildMonthlyData(subs: { created_at: string; status: string; cancelled_at: string | null }[]) {
  const months: Record<string, { nuevos: number; cancelados: number; acumulado: number }> = {}

  // Generar últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[key] = { nuevos: 0, cancelados: 0, acumulado: 0 }
  }

  subs.forEach((s) => {
    const key = s.created_at.slice(0, 7)
    if (months[key]) months[key].nuevos++
    if (s.cancelled_at) {
      const cKey = s.cancelled_at.slice(0, 7)
      if (months[cKey]) months[cKey].cancelados++
    }
  })

  // Calcular acumulado
  let acc = 0
  return Object.entries(months).map(([mes, data]) => {
    acc += data.nuevos - data.cancelados
    const [year, month] = mes.split('-')
    const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('es-CL', { month: 'short', year: '2-digit' })
    return { mes: label, nuevos: data.nuevos, cancelados: data.cancelados, acumulado: acc }
  })
}
