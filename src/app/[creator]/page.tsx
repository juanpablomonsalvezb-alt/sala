import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'

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
  return !url.includes('placeholder') && url.startsWith('https://')
    && !key.includes('placeholder') && key.length > 20
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
    return { title: 'Sala no encontrada — Sala' }
  }

  return {
    title: `${creator.name} — Sala`,
    description: creator.bio,
    alternates: {
      canonical: `https://sala.lat/${creator.slug}`,
    },
    openGraph: {
      title: `${creator.name} — Sala`,
      description: creator.bio,
      url: `https://sala.lat/${creator.slug}`,
      type: 'profile',
      siteName: 'Sala',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${creator.name} — Sala`,
      description: creator.bio,
    },
  }
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function SiteNav({ creatorSlug }: { creatorSlug: string }) {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[22px] font-bold text-[#121212] leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            SALA
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

function CreatorHeader({
  creator,
  isSubscribed,
}: {
  creator: Creator
  isSubscribed: boolean
}) {
  const priceLabel = `${formatPriceCLP(creator.price_clp)}/mes`

  return (
    <section className="border-b border-[#DEDEDE] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="section-label mb-4 inline-block">{creator.specialty}</span>
        <hr className="nyt-rule mb-5" />
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1
              className="font-serif text-[#121212] mb-4 leading-none"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              {creator.name}
            </h1>
            <p className="font-sans text-[15px] text-[#666666] leading-relaxed mb-5 max-w-lg">
              {creator.bio}
            </p>
            <p className="font-sans text-[12px] text-[#666666]">
              <span className="font-semibold text-[#121212]">
                {creator.subscriber_count.toLocaleString('es-CL')} suscriptores
              </span>
              {creator.publish_frequency && ` · ${creator.publish_frequency}`}
              {' · '}
              Desde{' '}
              {new Date(creator.created_at).toLocaleDateString('es-CL', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          {!isSubscribed && (
            <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
              <Link
                href={`/suscribirse/${creator.slug}`}
                className="font-sans text-[13px] font-medium px-6 py-2.5 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors duration-150 whitespace-nowrap"
              >
                Suscribirse · {priceLabel}
              </Link>
              <span className="font-sans text-[11px] text-[#666666]">Cancela cuando quieras</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ArticlesList({
  posts,
  creator,
  isSubscribed,
}: {
  posts: Post[]
  creator: Creator
  isSubscribed: boolean
}) {
  const freePosts = posts.filter((p) => p.is_free)
  const lockedPosts = posts.filter((p) => !p.is_free)
  const priceLabel = `${formatPriceCLP(creator.price_clp)}/mes`

  return (
    <section className="py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="section-label mb-3 inline-block">PUBLICACIONES</span>
        <hr className="nyt-rule mb-0" />

        {freePosts.map((post) => (
          <article key={post.id} className="border-b border-[#DEDEDE] py-5 group">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
              {post.published_at && (
                <time className="font-sans text-[11px] font-semibold tracking-wide text-[#C41C1C] shrink-0 mb-1 md:mb-0 uppercase">
                  {formatDate(post.published_at)}
                </time>
              )}
              <div className="flex-1">
                <Link href={`/${creator.slug}/${post.slug}`}>
                  <h4
                    className="font-serif text-[20px] font-bold text-[#121212] leading-snug mb-2 group-hover:underline underline-offset-2"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="font-sans text-[13px] text-[#666666] leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </div>
            </div>
          </article>
        ))}

        {lockedPosts.map((post) => (
          <article key={post.id} className="border-b border-[#DEDEDE] py-5">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
              {post.published_at && (
                <time className="font-sans text-[11px] font-semibold tracking-wide text-[#DEDEDE] shrink-0 mb-1 md:mb-0 uppercase">
                  {formatDate(post.published_at)}
                </time>
              )}
              <div className="flex-1 flex items-center justify-between gap-4">
                {isSubscribed ? (
                  <Link href={`/${creator.slug}/${post.slug}`} className="flex-1">
                    <h4
                      className="font-serif text-[20px] font-bold text-[#121212] leading-snug hover:underline underline-offset-2"
                      style={{ letterSpacing: '-0.01em' }}
                    >
                      {post.title}
                    </h4>
                  </Link>
                ) : (
                  <h4
                    className="font-serif text-[20px] font-bold text-[#DEDEDE] leading-snug"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {post.title}
                  </h4>
                )}
                {!isSubscribed && (
                  <span className="font-sans text-[11px] font-semibold tracking-wide text-[#999] shrink-0 uppercase">
                    Solo suscriptores
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}

        {!isSubscribed && (
          <div className="py-10 border-b border-[#DEDEDE] text-center">
            <p className="font-sans text-[13px] text-[#666666] mb-5">
              {creator.subscriber_count.toLocaleString('es-CL')} profesionales ya leen esta sala.
            </p>
            <Link
              href={`/suscribirse/${creator.slug}`}
              className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 inline-block"
            >
              Suscribirse · {priceLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function AboutCreator({ creator }: { creator: Creator }) {
  return (
    <section className="py-12 px-6 border-t border-[#DEDEDE] bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto">
        <span className="section-label-dark mb-3 inline-block">SOBRE EL AUTOR</span>
        <hr className="nyt-rule mb-8" />
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
                  <span className="font-sans text-[14px] text-[#121212]">{creator.publish_frequency}</span>
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
            <hr className="nyt-rule my-6" />
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
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          SALA · CHILE · 2025
        </span>
        <a
          href="mailto:hello@sala.lat"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          hello@sala.lat
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

      // Obtener el creador por slug
      const { data: creatorData, error: creatorError } = await supabase
        .from('sala_creators')
        .select('*')
        .eq('slug', slug)
        .single()

      if (creatorError || !creatorData) {
        notFound()
      }

      creator = creatorData

      // Verificar sesión del usuario
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

      // Obtener posts publicados
      const postsQuery = supabase
        .from('sala_posts')
        .select('*')
        .eq('creator_id', creator!.id)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })

      const { data: postsData } = await postsQuery
      posts = postsData ?? []
    } catch {
      // Error de conexión → usar mock si coincide el slug
      if (slug === 'rodrigo-fuentes') {
        creator = MOCK_CREATOR
        posts = MOCK_POSTS
      } else {
        notFound()
      }
    }
  } else {
    // Supabase no configurado → usar mock solo para slug conocido
    if (slug === 'rodrigo-fuentes') {
      creator = MOCK_CREATOR
      posts = MOCK_POSTS
    } else {
      notFound()
    }
  }

  if (!creator) notFound()

  return (
    <main className="min-h-screen bg-white">
      <SiteNav creatorSlug={slug} />
      <CreatorHeader creator={creator} isSubscribed={isSubscribed} />
      <ArticlesList posts={posts} creator={creator} isSubscribed={isSubscribed} />
      <AboutCreator creator={creator} />
      <CreatorFooter />
    </main>
  )
}
