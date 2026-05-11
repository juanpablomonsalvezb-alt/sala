'use client'

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

interface Post {
  id: string
  title: string
  slug: string
  published_at: string
  view_count: number | null
  is_free: boolean
}

interface MonthlyPoint {
  mes: string
  nuevos: number
  cancelados: number
  acumulado: number
}

interface Props {
  posts: Post[]
  monthlyData: MonthlyPoint[]
  activeSubs: number
  mrr: number
  creatorPrice: number
}

function formatCLP(n: number) {
  return n.toLocaleString('es-CL')
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`border p-6 flex flex-col gap-1 ${accent ? 'bg-[#121212] border-[#121212]' : 'bg-white border-[#DEDEDE]'}`}>
      <span className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium ${accent ? 'text-[#999]' : 'text-[#666]'}`}>{label}</span>
      <span className={`text-[2rem] leading-none font-bold tracking-tight font-serif mt-1 ${accent ? 'text-white' : 'text-[#121212]'}`}>{value}</span>
      <span className={`text-[13px] font-sans mt-1 ${accent ? 'text-[#666]' : 'text-[#666]'}`}>{sub}</span>
    </div>
  )
}

const TOOLTIP_STYLE = {
  backgroundColor: '#121212',
  border: 'none',
  borderRadius: 0,
  color: '#fff',
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
}

export default function AnalyticsDashboard({ posts, monthlyData, activeSubs, mrr, creatorPrice }: Props) {
  const totalViews = posts.reduce((acc, p) => acc + (p.view_count ?? 0), 0)
  const avgViews = posts.length > 0 ? Math.round(totalViews / posts.length) : 0
  const topPost = [...posts].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))[0]

  // Proyección anual
  const arr = mrr * 12

  return (
    <div className="px-8 py-7 space-y-8">

      {/* ── KPIs ── */}
      <section>
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] font-sans font-bold mb-4">Resumen</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
          <StatCard accent label="MRR" value={`$${formatCLP(mrr)}`} sub="CLP este mes" />
          <StatCard label="ARR proyectado" value={`$${formatCLP(arr)}`} sub="Si mantiene suscriptores" />
          <StatCard label="Vistas totales" value={totalViews.toLocaleString('es-CL')} sub={`Promedio ${avgViews} por post`} />
          <StatCard label="Suscriptores activos" value={activeSubs.toLocaleString('es-CL')} sub={`$${formatCLP(creatorPrice)} CLP/mes c/u`} />
        </div>
      </section>

      {/* ── Crecimiento de suscriptores ── */}
      <section className="bg-white border border-[#DEDEDE]">
        <div className="px-6 py-4 border-b border-[#DEDEDE]">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] font-sans">Crecimiento de suscriptores</h2>
          <p className="text-[12px] text-[#999] font-sans mt-0.5">Últimos 6 meses</p>
        </div>
        <div className="p-6">
          {monthlyData.every(d => d.acumulado === 0) ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-[13px] text-[#999] font-sans">Los datos aparecerán cuando tengas suscriptores activos.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C41C1C" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#C41C1C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif', fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif', fill: '#999' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#DEDEDE' }} />
                <Area type="monotone" dataKey="acumulado" name="Suscriptores" stroke="#C41C1C" strokeWidth={2} fill="url(#colorSubs)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── Nuevos vs cancelados ── */}
      <section className="bg-white border border-[#DEDEDE]">
        <div className="px-6 py-4 border-b border-[#DEDEDE]">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] font-sans">Nuevos vs. cancelaciones</h2>
          <p className="text-[12px] text-[#999] font-sans mt-0.5">Últimos 6 meses</p>
        </div>
        <div className="p-6">
          {monthlyData.every(d => d.nuevos === 0) ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-[13px] text-[#999] font-sans">Los datos aparecerán cuando tengas suscriptores activos.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif', fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Inter, sans-serif', fill: '#999' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="nuevos" name="Nuevos" fill="#121212" radius={[2,2,0,0]} />
                <Bar dataKey="cancelados" name="Cancelados" fill="#C41C1C" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── Rendimiento por post ── */}
      <section className="bg-white border border-[#DEDEDE]">
        <div className="px-6 py-4 border-b border-[#DEDEDE] flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] font-sans">Rendimiento por publicación</h2>
            <p className="text-[12px] text-[#999] font-sans mt-0.5">Ordenado por vistas</p>
          </div>
          {topPost && (
            <div className="text-right">
              <p className="text-[11px] text-[#999] font-sans uppercase tracking-wide">Más leída</p>
              <p className="text-[13px] font-semibold text-[#121212] font-sans mt-0.5 max-w-[200px] truncate">{topPost.title}</p>
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px] text-[#666] font-sans">Publica tu primer artículo para ver su rendimiento.</p>
          </div>
        ) : (
          <>
            <div className="grid px-6 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]" style={{ gridTemplateColumns: '1fr 80px 100px 120px' }}>
              {['Título', 'Tipo', 'Vistas', 'Fecha'].map(h => (
                <span key={h} className="text-[11px] uppercase tracking-[0.1em] text-[#666] font-medium font-sans">{h}</span>
              ))}
            </div>

            {posts.map((post, i) => {
              const views = post.view_count ?? 0
              const maxViews = Math.max(...posts.map(p => p.view_count ?? 0), 1)
              const barWidth = Math.max(4, Math.round((views / maxViews) * 100))

              return (
                <div key={post.id} className={`grid px-6 py-4 items-center ${i !== posts.length - 1 ? 'border-b border-[#DEDEDE]' : ''} hover:bg-[#F7F7F7] transition-colors`}
                  style={{ gridTemplateColumns: '1fr 80px 100px 120px' }}>
                  <p className="text-[14px] font-medium text-[#121212] font-serif leading-snug pr-4 line-clamp-1">{post.title}</p>
                  <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 w-fit uppercase tracking-wide font-sans ${post.is_free ? 'bg-[#DEDEDE] text-[#666]' : 'bg-[#121212] text-white'}`}>
                    {post.is_free ? 'Libre' : 'Pago'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F0F0F0] max-w-[60px]">
                      <div className="h-full bg-[#C41C1C]" style={{ width: `${barWidth}%` }} />
                    </div>
                    <span className="text-[13px] font-semibold text-[#121212] font-sans w-8 text-right">{views}</span>
                  </div>
                  <span className="text-[12px] text-[#666] font-sans">
                    {new Date(post.published_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )
            })}
          </>
        )}
      </section>

      {/* ── Retención ── */}
      <section className="bg-white border border-[#DEDEDE] px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212] font-sans mb-1">Tasa de retención</h2>
            <p className="text-[13px] text-[#666] font-sans">
              {activeSubs === 0
                ? 'Disponible cuando tengas suscriptores activos.'
                : (() => {
                    const total = monthlyData.reduce((acc, d) => acc + d.nuevos, 0)
                    const cancelled = monthlyData.reduce((acc, d) => acc + d.cancelados, 0)
                    if (total === 0) return 'Sin datos suficientes aún.'
                    const retention = Math.round(((total - cancelled) / total) * 100)
                    return `${retention}% de los suscriptores que entraron siguen activos en los últimos 6 meses.`
                  })()
              }
            </p>
          </div>
          {activeSubs > 0 && (() => {
            const total = monthlyData.reduce((acc, d) => acc + d.nuevos, 0)
            const cancelled = monthlyData.reduce((acc, d) => acc + d.cancelados, 0)
            if (total === 0) return null
            const retention = Math.round(((total - cancelled) / total) * 100)
            return (
              <div className="text-right">
                <span className={`text-[2.5rem] font-bold font-serif ${retention >= 80 ? 'text-[#065F46]' : retention >= 60 ? 'text-[#121212]' : 'text-[#C41C1C]'}`}>
                  {retention}%
                </span>
              </div>
            )
          })()}
        </div>
      </section>

    </div>
  )
}
