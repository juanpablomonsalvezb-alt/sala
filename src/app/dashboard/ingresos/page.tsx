import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function formatCLP(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return !url.includes('placeholder') && url.startsWith('https://') && key.length > 20
}

export default async function IngresosPage() {
  let mrr = 0
  let totalSubscriptions = 0
  let pendingPayout = 0

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/entrar?next=/dashboard/ingresos')

    const { data: creator } = await supabase
      .from('sala_creators')
      .select('id, price_clp, subscriber_count')
      .eq('user_id', user.id)
      .maybeSingle()

    if (creator) {
      const { data: subs } = await supabase
        .from('sala_subscriptions')
        .select('price_clp')
        .eq('creator_id', creator.id)
        .eq('status', 'active')

      totalSubscriptions = subs?.length ?? 0
      mrr = subs?.reduce((acc, s) => acc + s.price_clp, 0) ?? 0
      pendingPayout = Math.round(mrr * 0.95)
    }
  }

  const months = [
    { mes: 'Ene', ingreso: 0 }, { mes: 'Feb', ingreso: 0 },
    { mes: 'Mar', ingreso: 0 }, { mes: 'Abr', ingreso: 0 },
    { mes: 'May', ingreso: mrr },
  ]
  const maxVal = Math.max(...months.map(m => m.ingreso), 1)

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-1">Dashboard · Ingresos</p>
          <h1 className="font-serif text-3xl font-bold text-[#121212]">Tus ingresos</h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-px bg-[#DEDEDE] mb-8">
          {[
            { label: 'MRR (este mes)', value: formatCLP(mrr), sub: 'Ingresos recurrentes mensuales' },
            { label: 'Suscriptores activos', value: String(totalSubscriptions), sub: 'Pagando hoy' },
            { label: 'Por cobrar', value: formatCLP(pendingPayout), sub: 'Después de comisión 5%' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white p-6">
              <p className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#999] mb-2">{label}</p>
              <p className="font-serif text-3xl font-bold text-[#121212]">{value}</p>
              <p className="text-xs font-sans text-[#999] mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Gráfico de barras simple */}
        <div className="bg-white border border-[#DEDEDE] p-6 mb-8">
          <p className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#999] mb-6">Ingresos por mes</p>
          <div className="flex items-end gap-3 h-32">
            {months.map(({ mes, ingreso }) => (
              <div key={mes} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#121212] transition-all"
                  style={{ height: `${(ingreso / maxVal) * 100}%`, minHeight: ingreso > 0 ? '4px' : '2px', opacity: ingreso > 0 ? 1 : 0.15 }}
                />
                <span className="text-[10px] font-sans text-[#999] uppercase tracking-wide">{mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estado vacío si no hay ingresos */}
        {mrr === 0 && (
          <div className="bg-white border border-[#DEDEDE] p-10 text-center">
            <p className="font-serif text-lg text-[#121212] mb-2">Aún no tienes suscriptores de pago</p>
            <p className="text-sm font-sans text-[#999]">Cuando alguien se suscriba a tu sala, tus ingresos aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  )
}
