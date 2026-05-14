import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { safeJsonLd } from '@/lib/rateLimit'
import type { Creator, Post } from '@/types/database'
import { creators as staticCreators } from '@/data/creators'
import { CreatorStickyBar } from '@/components/creator-sticky-bar'
import { postArticleSchema } from '@/lib/json-ld'

// ISR: revalidate each article every 1 hour
export const revalidate = 3600

// Pre-build top articles at build time
export async function generateStaticParams(): Promise<
  Array<{ creator: string; slug: string }>
> {
  try {
    const supabase = await createClient()
    const { data: posts } = await supabase
      .from('sala_posts')
      .select('slug, sala_creators!inner(slug)')
      .not('published_at', 'is', null)
      .in('sala_creators.plan', ['pro', 'creator'])
      .order('published_at', { ascending: false })
      .limit(100)

    if (!posts) return []
    return posts.map(
      (p: { slug: string; sala_creators: { slug: string } }) => ({
        creator: p.sala_creators.slug,
        slug: p.slug,
      })
    )
  } catch {
    const params: Array<{ creator: string; slug: string }> = []
    for (const creator of staticCreators.slice(0, 10)) {
      for (const article of creator.articles.slice(0, 3)) {
        const slug = article
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 60)
        params.push({ creator: creator.slug, slug })
      }
    }
    return params
  }
}

const MONTH_MAP: Record<string, string> = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
}

function sinceToISO(since: string): string {
  const [mes, anio] = since.toLowerCase().split(' ')
  return `${anio}-${MONTH_MAP[mes] ?? '01'}-01T00:00:00Z`
}

function findStaticCreator(slug: string): Creator | null {
  const found = staticCreators.find((c) => c.slug === slug)
  if (!found) return null

  return {
    id: `mock-${slug}`,
    user_id: `mock-user-${slug}`,
    name: found.name,
    slug: found.slug,
    specialty: found.specialty,
    bio: found.bio,
    bio_long: found.bio,
    linkedin_url: null,
    price_clp: found.price_clp,
    plan: found.plan,
    publish_frequency:
      found.plan === 'pro'
        ? 'Publica dos veces por semana'
        : 'Publica semanalmente',
    created_at: sinceToISO(found.since),
    subscriber_count: found.subscriber_count,
    stripe_account_id: null,
    verified: found.verified,
    publication_name: found.name,
    pull_quote: null,
    cover_image_url: null,
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creator: string; slug: string }>
}): Promise<Metadata> {
  const { creator: creatorSlug, slug } = await params

  try {
    const supabase = await createClient()
    const { data: post } = await supabase
      .from('sala_posts')
      .select('*, sala_creators!inner(slug, name, specialty)')
      .eq('slug', slug)
      .eq('sala_creators.slug', creatorSlug)
      .single()

    const { data: creator } = await supabase
      .from('sala_creators')
      .select('*')
      .eq('slug', creatorSlug)
      .single()

    if (!post || !creator) {
      return { title: 'Artículo no encontrado' }
    }

    const title = `${post.title} · ${creator.name}`
    const description =
      post.excerpt ||
      `${post.title} por ${creator.name}. ${creator.specialty} en Nebbuler.`

    return {
      title,
      description,
      alternates: {
        canonical: `https://nebbuler.com/${creatorSlug}/${slug}`,
      },
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        url: `https://nebbuler.com/${creatorSlug}/${slug}`,
        siteName: 'Nebbuler',
        publishedTime: new Date(post.published_at || post.created_at).toISOString(),
        authors: [creator.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
      },
    }
  } catch {
    return {
      title: 'Artículo',
      description: 'Lee artículos profesionales en Nebbuler.',
    }
  }
}

function SiteNav({ creator }: { creator: Creator }) {
  return (
    <header>
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/nebbuler-logo.png"
                alt="Nebbuler"
                width={32}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span
                className="font-serif text-[20px] font-bold text-[#121212] leading-none"
                style={{ letterSpacing: '-0.01em' }}
              >
                NEBBULER
              </span>
            </Link>
            <span className="text-[12px] text-[#999]">·</span>
            <Link
              href={`/${creator.slug}`}
              className="text-[12px] font-semibold text-[#666666] hover:text-[#121212] transition-colors"
            >
              {creator.publication_name || creator.name}
            </Link>
          </div>
          <Link
            href="/entrar"
            className="font-sans text-[12px] font-medium px-4 py-1.5 border border-[#DEDEDE] text-[#666666] hover:border-[#121212] hover:text-[#121212] transition-colors duration-150"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  )
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    month: 'long',
    year: 'numeric',
  })
}

function formatPriceCLP(n: number): string {
  return `$${n.toLocaleString('es-CL')}`
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ creator: string; slug: string }>
}) {
  const { creator: creatorSlug, slug } = await params

  let post: Post | null = null
  let creator: Creator | null = null

  try {
    const supabase = await createClient()

    const { data: postData } = await supabase
      .from('sala_posts')
      .select('*, sala_creators!inner(slug)')
      .eq('slug', slug)
      .eq('sala_creators.slug', creatorSlug)
      .not('published_at', 'is', null)
      .single()

    if (postData) {
      post = postData as Post
    }

    const { data: creatorData } = await supabase
      .from('sala_creators')
      .select('*')
      .eq('slug', creatorSlug)
      .single()

    if (creatorData) {
      creator = creatorData as Creator
    }
  } catch {
    // Fallback to static data
    const staticCreator = findStaticCreator(creatorSlug)
    if (staticCreator) {
      creator = staticCreator
      const staticCreatorData = staticCreators.find((c) => c.slug === creatorSlug)
      if (staticCreatorData) {
        const foundArticle = staticCreatorData.articles.find((a) => {
          const articleSlug = a
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60)
          return articleSlug === slug
        })
        if (foundArticle) {
          post = {
            id: `mock-${creatorSlug}-${slug}`,
            creator_id: `mock-${creatorSlug}`,
            title: foundArticle,
            excerpt: null,
            content: '<p>Este es un artículo de demostración.</p>',
            is_free: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            read_time_minutes: 6,
            slug,
          }
        }
      }
    }
  }

  if (!post || !creator) {
    notFound()
  }

  // Perfil de creador solo visible si está activo
  if (creator.plan === 'free') {
    notFound()
  }

  // Solo artículos publicados
  if (!post.published_at) {
    notFound()
  }

  const readTime = post.read_time_minutes || 5
  const publishDate = new Date(post.published_at)

  const jsonLd = postArticleSchema({
    title: post.title,
    slug,
    creatorSlug: creator.slug,
    creatorName: creator.name,
    createdAt: post.published_at || post.created_at,
    description: post.excerpt || post.title,
  })

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <SiteNav creator={creator} />

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            {creator.specialty}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#666]">
            <span className="font-sans">{creator.name}</span>
            <span>·</span>
            <time dateTime={post.published_at}>
              {publishDate.toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{readTime} min de lectura</span>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#121212] [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#121212] [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:font-sans [&_p]:text-base [&_p]:text-[#333] [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
            [&_li]:font-sans [&_li]:text-base [&_li]:text-[#333] [&_li]:mb-2
            [&_strong]:font-semibold [&_strong]:text-[#121212]
            [&_em]:italic [&_em]:text-[#666]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Creator CTA */}
        <div className="mt-12 pt-8 border-t border-[#DEDEDE]">
          <div className="bg-[#F5F5F5] p-8 rounded">
            <p className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
              Sobre el autor
            </p>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-[#121212] mb-1">
                  {creator.name}
                </h3>
                <p className="font-sans text-sm text-[#666] mb-4">
                  {creator.specialty}
                </p>
                {creator.bio && (
                  <p className="font-sans text-sm text-[#666] mb-4">
                    {creator.bio}
                  </p>
                )}
              </div>
              <Link
                href={`/${creator.slug}`}
                className="whitespace-nowrap font-sans text-xs font-bold px-6 py-3 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors"
              >
                Ver publicación →
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="border-t border-[#DEDEDE] py-6 px-6 mt-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
            NEBBULER · CHILE · 2026
          </span>
          <a
            href="mailto:hello@nebbuler.com"
            className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
          >
            hello@nebbuler.com
          </a>
        </div>
      </footer>

      <CreatorStickyBar
        slug={creator.slug}
        price_clp={creator.price_clp}
        name={creator.publication_name ?? creator.name}
      />
    </main>
  )
}
