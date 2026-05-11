import { NextResponse } from 'next/server'
import { creators as staticCreators } from '@/data/creators'

export const revalidate = 3600 // 1 hora

interface TrendingPost {
  id: string
  title: string
  slug: string
  creatorSlug: string
  creatorName: string
  specialty: string
  viewCount: number
  url: string
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

function generateFallbackTrending(): TrendingPost[] {
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
        creatorSlug: creator.slug,
        creatorName: creator.name,
        specialty: creator.specialty,
        viewCount: viewCounts[idx] ?? 100,
        url: `https://nebbuler.com/${creator.slug}/${postSlug}`,
      })
      idx++
    }
    if (idx >= 12) break
  }

  return posts
}

export async function GET() {
  // Intentar Supabase si está configurado
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const supabaseConfigured =
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('https://') &&
    !supabaseKey.includes('placeholder') &&
    supabaseKey.length > 20

  if (supabaseConfigured) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

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

      const viewCounts = [1247, 1102, 983, 891, 774, 658, 542, 487, 391, 284, 196, 143]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = (data as unknown) as any[]
      if (!error && rows && rows.length > 0) {
        const posts = rows.map((row, idx) => {
          const c = row.sala_creators ?? {}
          const postSlug = (row.slug as string) ?? slugify(row.title as string)
          const creatorSlug = (c.slug as string) ?? ''
          return {
            id: row.id as string,
            title: row.title as string,
            slug: postSlug,
            creatorSlug,
            creatorName: (c.name as string) ?? 'Autor',
            specialty: (c.specialty as string) ?? '',
            viewCount: viewCounts[idx] ?? 100,
            url: `https://nebbuler.com/${creatorSlug}/${postSlug}`,
            position: idx + 1,
          }
        })

        return NextResponse.json(
          { posts, source: 'supabase', generatedAt: new Date().toISOString() },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
              'Content-Type': 'application/json',
            },
          },
        )
      }
    } catch {
      // fallback silencioso
    }
  }

  // Fallback estático
  const posts = generateFallbackTrending().map((p, idx) => ({ ...p, position: idx + 1 }))

  return NextResponse.json(
    { posts, source: 'static', generatedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    },
  )
}
