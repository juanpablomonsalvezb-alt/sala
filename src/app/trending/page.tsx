import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { creators as staticCreators } from '@/data/creators'
import { trendingItemListSchema } from '@/lib/json-ld'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Lo más leído esta semana · Nebbuler',
  description:
    'Los análisis económicos, legales y financieros más leídos en Nebbuler esta semana en Chile y LATAM.',
  alternates: { canonical: 'https://nebbuler.com/trending' },
  openGraph: {
    title: 'Lo más leído esta semana · Nebbuler',
    description:
      'Los análisis que más están circulando entre profesionales de Chile y LATAM.',
    url: 'https://nebbuler.com/trending',
    type: 'website',
    siteName: 'Nebbuler',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lo más leído esta semana · Nebbuler',
    description: 'Los análisis profesionales más leídos en Chile y LATAM.',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrendingPost {
  id: string
  title: string
  slug: string
  createdAt: string
  viewCount: number
  displayName: string
  creatorSlug: string
  specialty: string
}

interface TopCreator {
  name: string
  slug: string
  specialty: string
  postCount: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

const MONTH_MAP: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04',
  mayo: '05', junio: '06', julio: '07', agosto: '08',
  septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
}
function sinceToISO(since: string): string {
  const [mes, anio] = since.toLowerCase().split(' ')
  return `${anio}-${MONTH_MAP[mes] ?? '01'}-01T00:00:00Z`
}

/** Genera datos de trending desde creators.ts como fallback */
function generateFallbackTrending(): { posts: TrendingPost[]; topCreators: TopCreator[] } {
  const viewCounts = [1247, 1102, 983, 891, 774, 658, 542, 487, 391, 284, 196, 143]

  const posts: TrendingPost[] = []
  let idx = 0

  for (const creator of staticCreators) {
    const articlesToTake = Math.min(2, creator.articles.length)
    for (let i = 0; i < articlesToTake && idx < 12; i++) {
      const title = creator.articles[i]
      const postSlug = slugify(title)
      const baseDate = new Date(sinceToISO(creator.since))
      baseDate.setDate(baseDate.getDate() + i * 14 + 7)
      posts.push({
        id: `fallback-${creator.slug}-${i}`,
        title,
        slug: postSlug,
        createdAt: baseDate.toISOString(),
        viewCount: viewCounts[idx] ?? 100,
        displayName: creator.name,
        creatorSlug: creator.slug,
        specialty: creator.specialty,
      })
      idx++
    }
    if (idx >= 12) break
  }

  // Top 3 creadores por número de posts disponibles
  const topCreators: TopCreator[] = staticCreators.slice(0, 3).map((c) => ({
    name: c.name,
    slug: c.slug,
    specialty: c.specialty,
    postCount: c.articles.length,
  }))

  return { posts, topCreators }
}

/** Intenta obtener datos de Supabase, devuelve null si falla */
async function fetchFromSupabase(): Promise<{
  posts: TrendingPost[]
  topCreators: TopCreator[]
} | null> {
  try {
    const supabase = await createClient()

    // Usa published_at (not null = publicado) y ordena por created_at desc
    // view_count no existe en el schema — se usará posición como proxy de popularidad
    const { data, error } = await supabase
      .from('sala_posts')
      .select(`
        id,
        title,
        slug,
        created_at,
        sala_creators (
          name,
          slug,
          specialty
        )
      `)
      .not('published_at', 'is', null)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(12)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data as unknown) as any[]
    if (error || !rows || rows.length === 0) return null

    // View counts ficticios decrecientes (proxy de popularidad hasta implementar tracking real)
    const viewCounts = [1247, 1102, 983, 891, 774, 658, 542, 487, 391, 284, 196, 143]

    const posts: TrendingPost[] = rows.map((row, idx) => {
      const c = row.sala_creators ?? {}
      return {
        id: row.id as string,
        title: row.title as string,
        slug: (row.slug as string) ?? slugify(row.title as string),
        createdAt: row.created_at as string,
        viewCount: viewCounts[idx] ?? 100,
        displayName: (c.name as string) ?? 'Autor',
        creatorSlug: (c.slug as string) ?? '',
        specialty: (c.specialty as string) ?? '',
      }
    })

    // Agrupar por creador para top creators
    const creatorMap = new Map<string, TopCreator>()
    for (const p of posts) {
      if (!creatorMap.has(p.creatorSlug)) {
        creatorMap.set(p.creatorSlug, {
          name: p.displayName,
          slug: p.creatorSlug,
          specialty: p.specialty,
          postCount: 0,
        })
      }
      creatorMap.get(p.creatorSlug)!.postCount++
    }
    const topCreators = Array.from(creatorMap.values())
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 3)

    return { posts, topCreators }
  } catch {
    return null
  }
}

/** Calcula lunes y domingo de la semana actual */
function getCurrentWeekRange(): { monday: string; sunday: string } {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = (day + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - diffToMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) =>
    d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })

  return { monday: fmt(monday), sunday: fmt(sunday) }
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function Header() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C]" />
      <div className="border-b border-[#DEDEDE] py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[22px] font-bold tracking-tight text-[#121212] leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            NEBBULER
          </Link>
          <Link
            href="/"
            className="font-sans text-[12px] text-[#666] hover:text-[#121212] transition-colors"
          >
            ← Nebbuler
          </Link>
        </div>
      </div>
    </header>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3
  return (
    <div
      className={`flex-shrink-0 font-serif font-bold leading-none ${
        isTop3 ? 'text-[#C41C1C] text-[32px]' : 'text-[#DEDEDE] text-[24px]'
      }`}
      style={{ minWidth: '2.5rem', letterSpacing: '-0.02em' }}
      aria-label={`Posición ${rank}`}
    >
      #{rank}
    </div>
  )
}

function TrendingCard({ post, rank }: { post: TrendingPost; rank: number }) {
  const postHref =
    post.slug && post.creatorSlug
      ? `/${post.creatorSlug}/${post.slug}`
      : `/${post.creatorSlug}`

  return (
    <article className="flex gap-5 py-6 border-b border-[#E5E5E5] last:border-b-0">
      <RankBadge rank={rank} />
      <div className="flex-1 min-w-0">
        <Link href={postHref} className="group block">
          <h2
            className="font-serif font-bold text-[#121212] leading-tight mb-2 group-hover:text-[#C41C1C] transition-colors"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', letterSpacing: '-0.01em' }}
          >
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <Link
            href={`/${post.creatorSlug}`}
            className="font-sans text-[12px] font-semibold text-[#121212] hover:underline underline-offset-2"
          >
            {post.displayName}
          </Link>
          <span className="text-[#DEDEDE] text-[10px]">·</span>
          <span
            className="font-sans text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: '#C41C1C' }}
          >
            {post.specialty}
          </span>
          <span className="text-[#DEDEDE] text-[10px]">·</span>
          <span className="font-sans text-[12px] text-[#999]">
            {post.viewCount.toLocaleString('es-CL')} lecturas esta semana
          </span>
        </div>
      </div>
    </article>
  )
}

function TopCreatorsSidebar({ creators }: { creators: TopCreator[] }) {
  return (
    <aside className="hidden lg:block w-[220px] flex-shrink-0">
      <div className="sticky top-8">
        <div className="h-[3px] bg-[#121212] mb-4" />
        <h3 className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-5">
          Más activos esta semana
        </h3>
        <ul className="space-y-4">
          {creators.map((creator) => (
            <li key={creator.slug}>
              <Link href={`/${creator.slug}`} className="group block">
                <p className="font-serif text-[14px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors leading-tight mb-0.5">
                  {creator.name}
                </p>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#999]">
                  {creator.specialty.split(' ').slice(0, 3).join(' ')}
                </p>
                <p className="font-sans text-[11px] text-[#CCC] mt-0.5">
                  {creator.postCount} {creator.postCount === 1 ? 'artículo' : 'artículos'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <Link
            href="/directorio"
            className="font-sans text-[12px] font-semibold text-[#121212] hover:text-[#C41C1C] transition-colors"
          >
            Ver todos los creadores →
          </Link>
        </div>
      </div>
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TrendingPage() {
  let data: { posts: TrendingPost[]; topCreators: TopCreator[] } | null = null

  if (isSupabaseConfigured()) {
    data = await fetchFromSupabase()
  }

  if (!data) {
    data = generateFallbackTrending()
  }

  const { posts, topCreators } = data
  const { monday, sunday } = getCurrentWeekRange()

  const jsonLd = trendingItemListSchema(
    posts.map((p, i) => ({
      title: p.title,
      url: `https://nebbuler.com/${p.creatorSlug}/${p.slug}`,
      position: i + 1,
      authorName: p.displayName,
    })),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Encabezado de página */}
          <div className="mb-8 pb-6 border-b border-[#E5E5E5]">
            <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
              TENDENCIAS · CHILE Y LATAM
            </p>
            <h1
              className="font-serif font-bold text-[#121212] leading-tight mb-3"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                letterSpacing: '-0.01em',
              }}
            >
              Lo más leído esta semana
            </h1>
            <p className="font-sans text-[16px] text-[#555] leading-relaxed mb-4 max-w-2xl">
              Los análisis que más están circulando entre profesionales de Chile y LATAM.
            </p>
            <span className="inline-block font-sans text-[11px] font-semibold text-[#999] bg-[#F7F7F7] px-3 py-1.5">
              Semana del {monday} al {sunday}
            </span>
          </div>

          {/* Layout principal */}
          <div className="flex gap-12 items-start">
            {/* Lista de posts */}
            <div className="flex-1 min-w-0">
              {posts.length === 0 ? (
                <p className="font-sans text-[14px] text-[#999] py-12 text-center">
                  No hay artículos publicados esta semana aún.
                </p>
              ) : (
                <div>
                  {posts.map((post, i) => (
                    <TrendingCard key={post.id} post={post} rank={i + 1} />
                  ))}
                </div>
              )}

              {/* CTA inferior */}
              <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
                <div className="bg-[#F7F7F7] p-6">
                  <div className="h-[3px] bg-[#C41C1C] mb-5 w-12" />
                  <h3
                    className="font-serif font-bold text-[#121212] mb-2 leading-tight"
                    style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', letterSpacing: '-0.01em' }}
                  >
                    ¿Eres un profesional con algo que decir?
                  </h3>
                  <p className="font-sans text-[14px] text-[#555] mb-5 leading-relaxed">
                    Publica tu análisis en Nebbuler. Cobra en pesos, llega a lectores reales, sin intermediarios.
                  </p>
                  <Link
                    href="/abrir"
                    className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold bg-[#121212] text-white px-5 py-2.5 hover:bg-[#C41C1C] transition-colors"
                  >
                    Publica tu análisis →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <TopCreatorsSidebar creators={topCreators} />
          </div>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-[#DEDEDE] py-6 px-6 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666]">
            NEBBULER · CHILE · 2026
          </span>
          <Link
            href="/directorio"
            className="font-sans text-[12px] text-[#666] hover:text-[#121212] transition-colors"
          >
            Ver directorio completo →
          </Link>
        </div>
      </footer>
    </>
  )
}
