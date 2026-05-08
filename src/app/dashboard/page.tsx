import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post, Subscription } from '@/types/database'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCLP(n: number): string {
  return n.toLocaleString('es-CL')
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  value,
  label,
  sub,
  prefix,
}: {
  value: string
  label: string
  sub: string
  prefix?: string
}) {
  return (
    <div className="bg-white border border-[#DEDEDE] p-6 flex flex-col gap-1">
      <span
        className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-sans font-medium"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-1">
        {prefix && (
          <span
            className="text-lg font-serif text-[#121212]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {prefix}
          </span>
        )}
        <span
          className="text-[2.25rem] leading-none font-bold text-[#121212] tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {value}
        </span>
      </div>
      <span
        className="text-[13px] text-[#666666] font-sans mt-1"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {sub}
      </span>
    </div>
  )
}

// ─── Activity mock ────────────────────────────────────────────────────────────

const ACTIVITY_MOCK = [
  { id: '1', text: 'Nueva suscripción activa', time: 'hace 2h', type: 'subscribe' as const },
  { id: '2', text: 'Publicación leída por 12 personas', time: 'hace 5h', type: 'read' as const },
  { id: '3', text: 'Suscripción cancelada', time: 'hace 1d', type: 'cancel' as const },
  { id: '4', text: 'Nueva suscripción activa', time: 'hace 2d', type: 'subscribe' as const },
  { id: '5', text: 'Publicación leída por 8 personas', time: 'hace 2d', type: 'read' as const },
  { id: '6', text: 'Nueva suscripción activa', time: 'hace 3d', type: 'subscribe' as const },
]

// ─── No creator CTA ───────────────────────────────────────────────────────────

function NoCreatorCTA() {
  return (
    <main className="flex-1 overflow-y-auto flex items-center justify-center">
      <div className="max-w-md text-center px-6 py-16">
        <h1
          className="text-[2rem] font-bold text-[#121212] leading-tight mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Configura tu sala
        </h1>
        <p
          className="text-[15px] text-[#666666] leading-relaxed mb-8"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Aún no tienes un perfil de creador. Toma 3 minutos crear tu sala y empezar a publicar para tus suscriptores.
        </p>
        <Link
          href="/abrir"
          className="inline-flex items-center gap-2 bg-[#C41C1C] text-white text-[13px] font-semibold px-6 py-3.5 hover:bg-[#a01515] transition-colors"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Configura tu sala →
        </Link>
      </div>
    </main>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  // Cargar creator profile
  const { data: creatorRaw } = await db
    .from('sala_creators')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Creator | null

  // Si no tiene creator profile, mostrar CTA
  if (!creator) {
    return (
      <>
        <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <h1
            className="text-[22px] font-bold text-[#121212] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Panel del creador
          </h1>
        </div>
        <NoCreatorCTA />
      </>
    )
  }

  // Cargar posts del creador (últimos 5)
  const { data: postsRaw } = await db
    .from('sala_posts')
    .select('*')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const posts: Post[] = (postsRaw as Post[] | null) ?? []

  // Cargar subscriptions activas
  const { data: subsRaw } = await db
    .from('sala_subscriptions')
    .select('*')
    .eq('creator_id', creator.id)
    .eq('status', 'active')

  const activeSubs: Subscription[] = (subsRaw as Subscription[] | null) ?? []

  // Total de posts
  const { count: totalPosts } = await db
    .from('sala_posts')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)

  const { count: draftCount } = await db
    .from('sala_posts')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)
    .is('published_at', null)

  // Calcular métricas
  const subscriberCount = activeSubs.length
  const ingresosMes = subscriberCount * creator.price_clp
  const totalPostsCount = (totalPosts as number | null) ?? 0
  const drafts = (draftCount as number | null) ?? 0

  // Fecha formateada
  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <h1
            className="text-[22px] font-bold text-[#121212] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Panel del creador
          </h1>
          <p
            className="text-[13px] text-[#666666] mt-0.5"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {todayCapitalized}
          </p>
        </div>
        <Link
          href="/dashboard/nueva-publicacion"
          className="inline-flex items-center gap-2 bg-[#121212] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Nueva publicación →
        </Link>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 space-y-8">
          {/* ── Metrics row ── */}
          <section>
            <div className="grid grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
              <MetricCard
                label="Suscriptores activos"
                value={subscriberCount.toLocaleString('es-CL')}
                sub={`Precio: $${formatCLP(creator.price_clp)}/mes`}
              />
              <MetricCard
                label="Ingresos estimados mes"
                value={formatCLP(ingresosMes)}
                prefix="$"
                sub="CLP · mes actual"
              />
              <MetricCard
                label="Publicaciones totales"
                value={totalPostsCount.toString()}
                sub={drafts > 0 ? `${drafts} borrador${drafts > 1 ? 'es' : ''}` : 'Sin borradores'}
              />
              <MetricCard
                label="Tasa de retención"
                value="—"
                sub="Próximamente"
              />
            </div>
          </section>

          {/* ── Two-column lower section ── */}
          <div className="grid grid-cols-3 gap-6">
            {/* Publicaciones recientes */}
            <section className="col-span-2 bg-white border border-[#DEDEDE]">
              <div className="px-6 py-4 border-b border-[#DEDEDE] flex items-center justify-between">
                <h2
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  Publicaciones recientes
                </h2>
                <Link
                  href="/dashboard/publicaciones"
                  className="text-[12px] text-[#C41C1C] hover:underline font-medium"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  Ver todas →
                </Link>
              </div>

              {posts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p
                    className="text-[14px] text-[#666666]"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    Aún no tienes publicaciones.
                  </p>
                  <Link
                    href="/dashboard/nueva-publicacion"
                    className="mt-3 inline-flex text-[13px] font-medium text-[#C41C1C] hover:underline"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    Crear tu primera publicación →
                  </Link>
                </div>
              ) : (
                <>
                  {/* Table header */}
                  <div
                    className="grid px-6 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]"
                    style={{ gridTemplateColumns: '1fr 120px 100px 90px' }}
                  >
                    {['Título', 'Fecha', 'Acceso', 'Estado'].map((h) => (
                      <span
                        key={h}
                        className="text-[11px] uppercase tracking-[0.1em] text-[#666666] font-medium"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  {posts.map((post, i) => (
                    <div
                      key={post.id}
                      className={`grid px-6 py-4 items-center ${
                        i !== posts.length - 1 ? 'border-b border-[#DEDEDE]' : ''
                      } hover:bg-[#F7F7F7] transition-colors`}
                      style={{ gridTemplateColumns: '1fr 120px 100px 90px' }}
                    >
                      <span
                        className="text-[14px] text-[#121212] font-medium leading-snug pr-4 line-clamp-2"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {post.title}
                      </span>
                      <span
                        className="text-[13px] text-[#666666]"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {formatDate(post.published_at ?? post.created_at)}
                      </span>
                      <span
                        className="text-[12px] text-[#666666]"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {post.is_free ? 'Gratuita' : 'Suscriptores'}
                      </span>
                      <span
                        className={`inline-flex text-[11px] font-medium px-2 py-0.5 w-fit tracking-wide uppercase ${
                          post.published_at
                            ? 'bg-[#121212] text-white'
                            : 'bg-[#DEDEDE] text-[#666666]'
                        }`}
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {post.published_at ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </section>

            {/* Actividad reciente */}
            <section className="col-span-1 bg-white border border-[#DEDEDE]">
              <div className="px-5 py-4 border-b border-[#DEDEDE]">
                <h2
                  className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  Actividad reciente
                </h2>
              </div>
              <ul className="divide-y divide-[#DEDEDE]">
                {ACTIVITY_MOCK.map((act) => (
                  <li key={act.id} className="px-5 py-3.5 flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        act.type === 'subscribe'
                          ? 'bg-[#121212]'
                          : act.type === 'cancel'
                          ? 'bg-[#C41C1C]'
                          : 'bg-[#DEDEDE]'
                      }`}
                    />
                    <div>
                      <p
                        className="text-[13px] text-[#121212] leading-snug"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {act.text}
                      </p>
                      <p
                        className="text-[11px] text-[#666666] mt-0.5"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {act.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── CTA ── */}
          <section className="bg-white border border-[#DEDEDE] px-8 py-7 flex items-center justify-between">
            <div>
              <h3
                className="text-[18px] font-bold text-[#121212]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Tus suscriptores esperan tu próximo análisis
              </h3>
              <p
                className="text-[13px] text-[#666666] mt-1"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Publica de forma consistente para mantener tu audiencia comprometida.
              </p>
            </div>
            <Link
              href="/dashboard/nueva-publicacion"
              className="inline-flex items-center gap-2 bg-[#C41C1C] text-white text-[13px] font-semibold px-5 py-3 hover:bg-[#a01515] transition-colors flex-shrink-0"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Nueva publicación →
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}
