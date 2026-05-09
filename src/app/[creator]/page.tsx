import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'
import { CreatorStickyBar } from '@/components/creator-sticky-bar'

// ─── Fallback mock (cuando Supabase no está configurado) ──────────────────────

const MOCK_CREATOR: Creator = {
  id: 'mock-1',
  user_id: 'mock-user-1',
  name: 'Rodrigo Fuentes',
  slug: 'rodrigo-fuentes',
  specialty: 'ANÁLISIS FINANCIERO',
  bio: 'Economista con 12 años en banca de inversión. Explico lo que los medios simplifican de más y los analistas complican demasiado.',
  bio_long:
    'Llevo más de una década analizando mercados financieros en entornos donde las decisiones valen millones. He visto de cerca cómo los grandes actores interpretan —y en muchos casos tergiversan— los datos macroeconómicos.',
  linkedin_url: null,
  price_clp: 9990,
  plan: 'pro',
  publish_frequency: 'Publica cada jueves',
  created_at: '2024-03-01T00:00:00Z',
  subscriber_count: 847,
  stripe_account_id: null,
  verified: true,
  publication_name: 'Análisis Económico',
  pull_quote: 'El tipo de cambio no sube ni baja por las razones que los medios te dicen.',
  cover_image_url: null,
}

const MOCK_POSTS: Post[] = [
  {
    id: 'mock-post-1',
    creator_id: 'mock-1',
    title: 'Por qué el tipo de cambio te está mintiendo',
    excerpt: 'El dólar no sube ni baja por las razones que los medios te dicen.',
    content: '',
    is_free: true,
    published_at: '2025-05-12T00:00:00Z',
    created_at: '2025-05-12T00:00:00Z',
    read_time_minutes: 6,
    slug: 'tipo-de-cambio-te-miente',
  },
  {
    id: 'mock-post-2',
    creator_id: 'mock-1',
    title: 'El efecto silencioso de la TPM en tu cartera',
    excerpt: 'Cuando el Banco Central mueve la tasa, el impacto no es inmediato ni uniforme.',
    content: '',
    is_free: true,
    published_at: '2025-05-05T00:00:00Z',
    created_at: '2025-05-05T00:00:00Z',
    read_time_minutes: 8,
    slug: 'tpm-efecto-cartera',
  },
  {
    id: 'mock-post-3',
    creator_id: 'mock-1',
    title: 'Inflación importada: el canal que nadie ve venir',
    excerpt: 'Más allá del IPC doméstico, existe un vector de presión inflacionaria que cruza fronteras.',
    content: '',
    is_free: false,
    published_at: '2025-04-28T00:00:00Z',
    created_at: '2025-04-28T00:00:00Z',
    read_time_minutes: 7,
    slug: 'inflacion-importada',
  },
]

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPriceCLP(n: number): string {
  return `$${n.toLocaleString('es-CL')}`
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    month: 'long',
    year: 'numeric',
  })
}

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creator: string }>
}): Promise<Metadata> {
  const { creator: slug } = await params

  let creator: Creator | null = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('sala_creators')
        .select('*')
        .eq('slug', slug)
        .single()
      creator = data
    } catch {
      // fallback silencioso
    }
  }

  if (!creator && slug === 'rodrigo-fuentes') creator = MOCK_CREATOR

  if (!creator) {
    return { title: 'Perfil no encontrado — Nebbuler' }
  }

  const publicationTitle = creator.publication_name ?? creator.name

  return {
    title: `${publicationTitle} — ${creator.name} | Nebbuler`,
    description: creator.bio,
    alternates: {
      canonical: `https://nebbuler.com/${creator.slug}`,
    },
    openGraph: {
      title: `${publicationTitle} — por ${creator.name}`,
      description: creator.bio ?? `Suscríbete a ${publicationTitle} en Nebbuler`,
      url: `https://nebbuler.com/${creator.slug}`,
      type: 'profile',
      siteName: 'Nebbuler',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${publicationTitle} — por ${creator.name}`,
      description: creator.bio,
    },
  }
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function SiteNav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[22px] font-bold text-[#121212] leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            NEBBULER
          </Link>
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

function HeroSection({
  creator,
  isSubscribed,
}: {
  creator: Creator
  isSubscribed: boolean
}) {
  return (
    <section>
      {creator.cover_image_url ? (
        <div className="relative h-[280px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={creator.cover_image_url}
            alt={creator.publication_name ?? creator.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        <div className="h-[8px] bg-[#C41C1C] w-full" />
      )}

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 border-b border-[#DEDEDE]">
        {/* Specialty */}
        <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
          {creator.specialty}
        </p>

        {/* H1 = nombre de la publicación */}
        <h1
          className="font-serif font-bold text-[#121212] leading-tight tracking-[-0.02em] mb-2"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          {creator.publication_name ?? creator.name}
        </h1>

        {/* Byline */}
        <p className="font-sans text-sm text-[#666] mb-6">
          por <span className="font-bold text-[#121212]">{creator.name}</span>
          {creator.verified && (
            <span className="ml-2 text-[9px] font-bold tracking-[0.1em] uppercase text-[#065F46] border-l border-[#065F46] pl-2">
              EXPERTO RECONOCIDO
            </span>
          )}
        </p>

        {/* Bio */}
        <p className="font-sans text-[16px] text-[#444] leading-relaxed max-w-2xl mb-6">
          {creator.bio}
        </p>

        {/* Pull quote */}
        {creator.pull_quote && (
          <blockquote className="border-l-[3px] border-[#C41C1C] pl-5 my-6 max-w-2xl">
            <p className="font-serif text-[20px] italic text-[#121212] leading-snug">
              &ldquo;{creator.pull_quote}&rdquo;
            </p>
          </blockquote>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-[#DEDEDE]">
          <div>
            <span className="font-serif text-xl font-bold text-[#121212]">
              {creator.subscriber_count.toLocaleString('es-CL')}
            </span>
            <span className="text-xs font-sans text-[#999] ml-1">suscriptores</span>
          </div>
          <div className="w-px h-4 bg-[#DEDEDE]" />
          <span className="text-xs font-sans text-[#666]">{creator.publish_frequency}</span>
          <div className="w-px h-4 bg-[#DEDEDE]" />
          <span className="text-xs font-sans text-[#666]">
            Desde {formatDateLong(creator.created_at)}
          </span>
          {!isSubscribed && (
            <div className="ml-auto">
              <Link
                href={`/suscribirse/${creator.slug}`}
                className="bg-[#121212] text-white font-sans text-xs font-bold tracking-[0.1em] uppercase px-6 py-2.5 hover:bg-[#C41C1C] transition-colors"
              >
                Suscribirse · {formatPriceCLP(creator.price_clp)}/mes
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ArticlesSection({
  posts,
  creator,
  isSubscribed,
}: {
  posts: Post[]
  creator: Creator
  isSubscribed: boolean
}) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-[#121212]">Publicaciones</h2>
        <span className="text-xs font-sans text-[#999]">{posts.length} artículos</span>
      </div>

      <div className="divide-y divide-[#DEDEDE]">
        {posts.map((post) => (
          <article key={post.id} className="py-6 group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Fecha */}
                {post.published_at && (
                  <time className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#999] mb-2 block">
                    {formatDate(post.published_at)}
                  </time>
                )}

                {/* Título */}
                {post.is_free || isSubscribed ? (
                  <Link href={`/${creator.slug}/${post.slug}`}>
                    <h3 className="font-serif text-[20px] font-bold text-[#121212] leading-tight mb-2 group-hover:text-[#C41C1C] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="font-serif text-[20px] font-bold text-[#121212] leading-tight mb-2">
                    {post.title}
                  </h3>
                )}

                {/* Extracto (solo artículos accesibles) */}
                {post.excerpt && (post.is_free || isSubscribed) && (
                  <p className="font-sans text-sm text-[#666] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Badge solo suscriptores */}
                {!post.is_free && !isSubscribed && (
                  <span className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase text-[#C41C1C] border border-[#C41C1C] px-2 py-0.5 mt-2 inline-block">
                    Solo suscriptores
                  </span>
                )}
              </div>

              <span className="text-xs font-sans text-[#999] whitespace-nowrap shrink-0">
                {post.read_time_minutes} min
              </span>
            </div>
          </article>
        ))}
      </div>

      {!isSubscribed && posts.length > 0 && (
        <div className="py-10 border-t border-[#DEDEDE] text-center">
          <p className="font-sans text-[13px] text-[#666666] mb-5">
            {creator.subscriber_count.toLocaleString('es-CL')} profesionales ya leen esta sala.
          </p>
          <Link
            href={`/suscribirse/${creator.slug}`}
            className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors inline-block"
          >
            Suscribirse · {formatPriceCLP(creator.price_clp)}/mes
          </Link>
        </div>
      )}
    </section>
  )
}

function AboutSection({ creator }: { creator: Creator }) {
  return (
    <section className="py-12 px-6 border-t border-[#DEDEDE] bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
          SOBRE EL AUTOR
        </p>
        <div className="w-6 h-[2px] bg-[#C41C1C] mb-8" />
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2
              className="font-serif text-[22px] font-bold text-[#121212] mb-4"
              style={{ letterSpacing: '-0.01em' }}
            >
              {creator.name}
            </h2>
            <p className="font-sans text-[14px] text-[#666666] leading-relaxed mb-6">
              {creator.bio_long ?? creator.bio}
            </p>
          </div>
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-[#666666] mb-4">
              Detalles
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="font-serif text-[#C41C1C] mt-0.5 leading-none">—</span>
                <span className="font-sans text-[14px] text-[#121212]">{creator.specialty}</span>
              </li>
              {creator.publish_frequency && (
                <li className="flex items-start gap-3">
                  <span className="font-serif text-[#C41C1C] mt-0.5 leading-none">—</span>
                  <span className="font-sans text-[14px] text-[#121212]">
                    {creator.publish_frequency}
                  </span>
                </li>
              )}
              {creator.linkedin_url && (
                <li className="flex items-start gap-3">
                  <span className="font-serif text-[#C41C1C] mt-0.5 leading-none">—</span>
                  <a
                    href={creator.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[14px] text-[#C41C1C] hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
            <div className="w-full h-px bg-[#DEDEDE] my-6" />
            <ul className="space-y-2">
              {['Acceso inmediato', 'Archivo completo', 'Cancela cuando quieras'].map((item) => (
                <li key={item} className="font-sans text-[13px] text-[#666666]">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function CreatorFooter() {
  return (
    <footer className="border-t border-[#DEDEDE] py-6 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
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
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ creator: string }>
}) {
  const { creator: slug } = await params

  let creator: Creator | null = null
  let posts: Post[] = []
  let isSubscribed = false

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()

      const { data: creatorData, error: creatorError } = await supabase
        .from('sala_creators')
        .select('*')
        .eq('slug', slug)
        .single()

      if (creatorError || !creatorData) {
        notFound()
      }

      creator = creatorData

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: sub } = await supabase
          .from('sala_subscriptions')
          .select('id')
          .eq('subscriber_id', user.id)
          .eq('creator_id', creator!.id)
          .eq('status', 'active')
          .maybeSingle()

        isSubscribed = !!sub
      }

      const { data: postsData } = await supabase
        .from('sala_posts')
        .select('*')
        .eq('creator_id', creator!.id)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })

      posts = postsData ?? []
    } catch {
      if (slug === 'rodrigo-fuentes') {
        creator = MOCK_CREATOR
        posts = MOCK_POSTS
      } else {
        notFound()
      }
    }
  } else {
    if (slug === 'rodrigo-fuentes') {
      creator = MOCK_CREATOR
      posts = MOCK_POSTS
    } else {
      notFound()
    }
  }

  if (!creator) notFound()

  return (
    <main className="min-h-screen bg-white pb-16">
      <SiteNav />
      <HeroSection creator={creator} isSubscribed={isSubscribed} />
      <ArticlesSection posts={posts} creator={creator} isSubscribed={isSubscribed} />
      <AboutSection creator={creator} />
      <CreatorFooter />
      {!isSubscribed && (
        <CreatorStickyBar
          slug={creator.slug}
          price_clp={creator.price_clp}
          name={creator.publication_name ?? creator.name}
        />
      )}
    </main>
  )
}
