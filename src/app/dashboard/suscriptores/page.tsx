import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCLP(n: number) {
  return '$' + n.toLocaleString('es-CL')
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return !url.includes('placeholder') && url.startsWith('https://') && key.length > 20
}

export default async function SuscriptoresPage() {
  let subscribers: { id: string; email: string; price_clp: number; created_at: string }[] = []

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/entrar?next=/dashboard/suscriptores')

    const { data: creator } = await supabase
      .from('sala_creators')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (creator) {
      const { data: subs } = await supabase
        .from('sala_subscriptions')
        .select('id, price_clp, created_at, subscriber_id')
        .eq('creator_id', creator.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (subs?.length) {
        const ids = subs.map(s => s.subscriber_id)
        const { data: profiles } = await supabase
          .from('sala_profiles')
          .select('id, email')
          .in('id', ids)

        subscribers = subs.map(s => ({
          id: s.id,
          email: profiles?.find(p => p.id === s.subscriber_id)?.email ?? '—',
          price_clp: s.price_clp,
          created_at: s.created_at,
        }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#999] mb-1">Dashboard · Suscriptores</p>
          <h1 className="font-serif text-3xl font-bold text-[#121212]">
            Tus suscriptores
            {subscribers.length > 0 && (
              <span className="ml-3 text-lg font-sans font-normal text-[#999]">{subscribers.length} activos</span>
            )}
          </h1>
        </div>

        {subscribers.length === 0 ? (
          <div className="bg-white border border-[#DEDEDE] p-10 text-center">
            <p className="font-serif text-lg text-[#121212] mb-2">Aún no tienes suscriptores</p>
            <p className="text-sm font-sans text-[#999]">Cuando alguien pague tu suscripción, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#DEDEDE]">
            <div className="grid grid-cols-3 border-b border-[#DEDEDE] px-6 py-3">
              {['Suscriptor', 'Desde', 'Valor'].map(h => (
                <span key={h} className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#999]">{h}</span>
              ))}
            </div>
            {subscribers.map((s, i) => (
              <div
                key={s.id}
                className={`grid grid-cols-3 px-6 py-4 ${i < subscribers.length - 1 ? 'border-b border-[#DEDEDE]' : ''}`}
              >
                <span className="text-sm font-sans text-[#121212]">{s.email}</span>
                <span className="text-sm font-sans text-[#666]">{formatDate(s.created_at)}</span>
                <span className="text-sm font-sans font-bold text-[#121212]">{formatCLP(s.price_clp)}/mes</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
