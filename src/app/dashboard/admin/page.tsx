import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function formatCLP(n: number) {
  return n.toLocaleString('es-CL')
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`border p-6 flex flex-col gap-1 ${accent ? 'bg-[#121212] border-[#121212]' : 'bg-white border-[#DEDEDE]'}`}>
      <span className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium ${accent ? 'text-[#999]' : 'text-[#666]'}`}>{label}</span>
      <span className={`text-[2.25rem] leading-none font-bold tracking-tight font-serif ${accent ? 'text-white' : 'text-[#121212]'}`}>{value}</span>
      <span className={`text-[13px] font-sans mt-1 ${accent ? 'text-[#666]' : 'text-[#666]'}`}>{sub}</span>
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  // Verificar superadmin
  const { data: profile } = await db.from('sala_profiles').select('is_superadmin').eq('id', user.id).maybeSingle()
  if (!profile?.is_superadmin) redirect('/dashboard')

  // ── Métricas globales ──────────────────────────────────────────────────────

  const { count: totalCreators } = await db.from('sala_creators').select('*', { count: 'exact', head: true })
  const { count: activeCreators } = await db.from('sala_creators').select('*', { count: 'exact', head: true }).neq('plan', 'free')
  const { count: totalReaders } = await db.from('sala_profiles').select('*', { count: 'exact', head: true }).eq('is_creator', false)
  const { count: totalSubs } = await db.from('sala_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { count: totalPosts } = await db.from('sala_posts').select('*', { count: 'exact', head: true }).not('published_at', 'is', null)

  // MRR global (suma de todas las suscripciones activas)
  const { data: subsData } = await db.from('sala_subscriptions').select('price_clp').eq('status', 'active')
  const globalMRR = (subsData ?? []).reduce((acc: number, s: { price_clp: number }) => acc + (s.price_clp ?? 0), 0)

  // Ingresos de plataforma (creadores con plan activo × tarifa platform).
  // PLATFORM_PRICE_CLP es la fuente de verdad — actualmente USD 19 ≈ 17990 CLP.
  const { PLATFORM_PRICE_CLP } = await import('@/lib/pricing')
  const platformRevenue = (activeCreators ?? 0) * PLATFORM_PRICE_CLP

  // ── Lista de creadores ─────────────────────────────────────────────────────
  const { data: creatorsRaw } = await db
    .from('sala_creators')
    .select('id, name, slug, specialty, plan, price_clp, subscriber_count, created_at')
    .order('created_at', { ascending: false })

  const creators = creatorsRaw ?? []

  // ── Últimos registros ──────────────────────────────────────────────────────
  const { data: recentProfiles } = await db
    .from('sala_profiles')
    .select('id, email, full_name, is_creator, auth_provider, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[22px] font-bold text-[#121212] font-serif">Panel de administración</h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-2 py-0.5">SUPERADMIN</span>
          </div>
          <p className="text-[13px] text-[#666] font-sans capitalize">{today}</p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8">

        {/* ── KPIs principales ── */}
        <section>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-sans font-bold mb-4">Plataforma</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            <StatCard label="MRR global" value={`$${formatCLP(globalMRR)}`} sub="CLP · suscripciones activas" accent />
            <StatCard label="Ingresos plataforma" value={`$${formatCLP(platformRevenue)}`} sub={`${activeCreators ?? 0} creadores activos × US$19`} />
            <StatCard label="Suscripciones activas" value={(totalSubs ?? 0).toLocaleString('es-CL')} sub="Lectores pagando" />
            <StatCard label="Publicaciones" value={(totalPosts ?? 0).toLocaleString('es-CL')} sub="Artículos publicados" />
          </div>
        </section>

        <section>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-sans font-bold mb-4">Usuarios</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            <StatCard label="Creadores totales" value={(totalCreators ?? 0).toLocaleString('es-CL')} sub={`${activeCreators ?? 0} con plan activo`} />
            <StatCard label="Creadores activos" value={(activeCreators ?? 0).toLocaleString('es-CL')} sub="Plan creator o pro" />
            <StatCard label="Lectores registrados" value={(totalReaders ?? 0).toLocaleString('es-CL')} sub="Cuentas de lectores" />
            <StatCard label="Creadores free" value={((totalCreators ?? 0) - (activeCreators ?? 0)).toLocaleString('es-CL')} sub="Sin plan activo" />
          </div>
        </section>

        {/* ── Creadores ── */}
        <section className="bg-white border border-[#DEDEDE]">
          <div className="px-6 py-4 border-b border-[#DEDEDE] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] font-sans">Todos los creadores</h2>
            <span className="text-[12px] text-[#999] font-sans">{creators.length} en total</span>
          </div>

          <div className="grid px-6 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]" style={{ gridTemplateColumns: '1fr 140px 100px 100px 120px' }}>
            {['Creador', 'Especialidad', 'Plan', 'Precio', 'Registro'].map(h => (
              <span key={h} className="text-[11px] uppercase tracking-[0.1em] text-[#666] font-medium font-sans">{h}</span>
            ))}
          </div>

          {creators.map((c: { id: string; name: string; slug: string; specialty: string; plan: string; price_clp: number; subscriber_count: number; created_at: string }, i: number) => (
            <div key={c.id} className={`grid px-6 py-4 items-center ${i !== creators.length - 1 ? 'border-b border-[#DEDEDE]' : ''} hover:bg-[#F7F7F7] transition-colors`}
              style={{ gridTemplateColumns: '1fr 140px 100px 100px 120px' }}>
              <div>
                <p className="text-[14px] font-medium text-[#121212] font-serif leading-snug">{c.name}</p>
                <p className="text-[11px] text-[#999] font-sans mt-0.5">@{c.slug}</p>
              </div>
              <span className="text-[12px] text-[#666] font-sans truncate">{c.specialty}</span>
              <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 w-fit uppercase tracking-wide font-sans ${
                c.plan === 'free' ? 'bg-[#F7F7F7] text-[#999]' :
                c.plan === 'creator' ? 'bg-[#121212] text-white' : 'bg-[#C41C1C] text-white'
              }`}>
                {c.plan}
              </span>
              <span className="text-[13px] text-[#121212] font-sans">${formatCLP(c.price_clp)}</span>
              <span className="text-[12px] text-[#666] font-sans">{formatDate(c.created_at)}</span>
            </div>
          ))}
        </section>

        {/* ── Últimos registros ── */}
        <section className="bg-white border border-[#DEDEDE]">
          <div className="px-6 py-4 border-b border-[#DEDEDE]">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] font-sans">Últimos registros</h2>
          </div>

          <div className="grid px-6 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]" style={{ gridTemplateColumns: '1fr 100px 120px 120px' }}>
            {['Email', 'Tipo', 'Vía', 'Fecha'].map(h => (
              <span key={h} className="text-[11px] uppercase tracking-[0.1em] text-[#666] font-medium font-sans">{h}</span>
            ))}
          </div>

          {(recentProfiles ?? []).map((p: { id: string; email: string; full_name: string | null; is_creator: boolean; auth_provider: string | null; created_at: string }, i: number) => (
            <div key={p.id} className={`grid px-6 py-3.5 items-center ${i !== (recentProfiles ?? []).length - 1 ? 'border-b border-[#DEDEDE]' : ''}`}
              style={{ gridTemplateColumns: '1fr 100px 120px 120px' }}>
              <div>
                <p className="text-[13px] text-[#121212] font-sans">{p.email}</p>
                {p.full_name && <p className="text-[11px] text-[#999] font-sans">{p.full_name}</p>}
              </div>
              <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 w-fit uppercase tracking-wide font-sans ${
                p.is_creator ? 'bg-[#C41C1C] text-white' : 'bg-[#DEDEDE] text-[#666]'
              }`}>
                {p.is_creator ? 'Creador' : 'Lector'}
              </span>
              <span className="text-[12px] text-[#666] font-sans capitalize">{p.auth_provider ?? 'email'}</span>
              <span className="text-[12px] text-[#666] font-sans">{formatDate(p.created_at)}</span>
            </div>
          ))}
        </section>

      </main>
    </>
  )
}
