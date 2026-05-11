import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'
import { CreatorStickyBar } from '@/components/creator-sticky-bar'
import { creators as staticCreators } from '@/data/creators'
import { ProfileShare } from '@/components/profile-share'

// ─── Mapeo de mes español a número ───────────────────────────────────────────

const MONTH_MAP: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04',
  mayo: '05', junio: '06', julio: '07', agosto: '08',
  septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
}

function sinceToISO(since: string): string {
  const [mes, anio] = since.toLowerCase().split(' ')
  return `${anio}-${MONTH_MAP[mes] ?? '01'}-01T00:00:00Z`
}

const PUBLICATION_NAMES: Record<string, string> = {
  'rodrigo-fuentes-marin':    'Política Monetaria',
  'carolina-vega-toro':       'Mercado & Capital',
  'matias-cornejo-silva':     'Tributario Chile',
  'andrea-poblete-rios':      'Salud Pública',
  'ignacio-leal-espinoza':    'Sistema Político',
  'francisca-araya-medina':   'Ciudad & Territorio',
  'pablo-herrera-zuniga':     'Laboral al Día',
  'valentina-soto-burgos':    'Metabolismo & Nutrición',
  'sebastian-miranda-lagos':  'Infraestructura',
  'catalina-rojas-henriquez':  'Historia Económica',
  'alejandro-vasquez-mora':   'IA & Estrategia Tech',
}

const PUBLISH_FREQ: Record<string, string> = {
  pro: 'Publica dos veces por semana',
  creator: 'Publica semanalmente',
  free: 'Publica mensualmente',
}

function findStaticCreator(slug: string): { creator: Creator; posts: Post[] } | null {
  const found = staticCreators.find((c) => c.slug === slug)
  if (!found) return null

  const creator: Creator = {
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
    publish_frequency: PUBLISH_FREQ[found.plan] ?? 'Publica semanalmente',
    created_at: sinceToISO(found.since),
    subscriber_count: found.subscriber_count,
    stripe_account_id: null,
    verified: found.verified,
    publication_name: PUBLICATION_NAMES[found.slug] ?? found.name,
    pull_quote: null,
    cover_image_url: null,
  }

  const baseDate = new Date(sinceToISO(found.since))
  const posts: Post[] = found.articles.map((title, i) => {
    const pub = new Date(baseDate)
    pub.setDate(pub.getDate() + i * 14 + 7)
    const slug2 = title.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
    return {
      id: `mock-${found.slug}-${i}`,
      creator_id: `mock-${found.slug}`,
      title,
      excerpt: null,
      content: '',
      is_free: i === 0,
      published_at: pub.toISOString(),
      created_at: pub.toISOString(),
      read_time_minutes: 6 + i * 2,
      slug: slug2,
    }
  })

  return { creator, posts }
}

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
    excerpt: 'El dólar no sube ni baja por las razones que los medios te dicen. Hay fuerzas estructurales que los titulares nunca mencionan y que definen el movimiento real.',
    content: '',
    is_free: false,
    published_at: '2025-05-12T00:00:00Z',
    created_at: '2025-05-12T00:00:00Z',
    read_time_minutes: 6,
    slug: 'tipo-de-cambio-te-miente',
  },
  {
    id: 'mock-post-2',
    creator_id: 'mock-1',
    title: 'El efecto silencioso de la TPM en tu cartera',
    excerpt: 'Cuando el Banco Central mueve la tasa, el impacto no es inmediato ni uniforme. Cada clase de activo absorbe el shock de manera distinta y en tiempos distintos.',
    content: '',
    is_free: false,
    published_at: '2025-05-05T00:00:00Z',
    created_at: '2025-05-05T00:00:00Z',
    read_time_minutes: 8,
    slug: 'tpm-efecto-cartera',
  },
  {
    id: 'mock-post-3',
    creator_id: 'mock-1',
    title: 'Inflación importada: el canal que nadie ve venir',
    excerpt: 'Más allá del IPC doméstico, existe un vector de presión inflacionaria que cruza fronteras. Entender este mecanismo es clave para anticipar movimientos de política monetaria.',
    content: '',
    is_free: false,
    published_at: '2025-04-28T00:00:00Z',
    created_at: '2025-04-28T00:00:00Z',
    read_time_minutes: 7,
    slug: 'inflacion-importada',
  },
  {
    id: 'mock-post-4',
    creator_id: 'mock-1',
    title: 'Cómo leer un balance bancario sin ser contador',
    excerpt: 'Los estados financieros de un banco son crípticos por diseño. En este análisis desgloso los tres indicadores que realmente importan para evaluar solvencia y riesgo de crédito.',
    content: '',
    is_free: false,
    published_at: '2025-04-14T00:00:00Z',
    created_at: '2025-04-14T00:00:00Z',
    read_time_minutes: 10,
    slug: 'leer-balance-bancario',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDisciplineColor(specialty: string): string {
  const s = specialty.toUpperCase()
  if (s.includes('ECONOM') || s.includes('FINANC') || s.includes('MACRO')) return '#1A2744'
  if (s.includes('DERECHO') || s.includes('JURÍDIC') || s.includes('LEGAL')) return '#1A3A2A'
  if (s.includes('MEDIC') || s.includes('SALUD') || s.includes('CLÍNIC')) return '#3A1A1A'
  if (s.includes('TECNOL') || s.includes('INGENIE') || s.includes('SOFTW')) return '#1A1A2E'
  if (s.includes('ARQUIT') || s.includes('URBAN')) return '#2A1A1A'
  return '#1A1A1A'
}

function getFirstWords(text: string, count = 6): string {
  return text.split(/\s+/).slice(0, count).join(' ')
}

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

  if (!creator) {
    const staticMatch = findStaticCreator(slug)
    if (staticMatch) creator = staticMatch.creator
  }
  if (!creator && slug === 'rodrigo-fuentes') creator = MOCK_CREATOR

  if (!creator) {
    return { title: 'Perfil no encontrado' }
  }

  const publicationTitle = creator.publication_name ?? creator.name

  return {
    title: `${publicationTitle} — ${creator.name}`,
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
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nebbuler-logo.png" alt="Nebbuler" className="h-8 w-auto" />
            <span
              className="font-serif text-[20px] font-bold text-[#121212] leading-none"
              style={{ letterSpacing: '-0.01em' }}
            >
              EBBULER
            </span>
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
      ) : null}

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

        {/* Byline — solo si la publicación tiene nombre distinto al autor */}
        {creator.publication_name && creator.publication_name !== creator.name && (
          <p className="font-sans text-sm text-[#666] mb-1">
            por <span className="font-bold text-[#121212]">{creator.name}</span>
            {creator.verified && (
              <span className="ml-2 text-[9px] font-bold tracking-[0.1em] uppercase text-[#065F46] border-l border-[#065F46] pl-2">
                EXPERTO RECONOCIDO
              </span>
            )}
          </p>
        )}
        {(!creator.publication_name || creator.publication_name === creator.name) && creator.verified && (
          <p className="font-sans text-sm text-[#666] mb-1">
            <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#065F46]">
              EXPERTO RECONOCIDO POR NEBBULER
            </span>
          </p>
        )}
        <p className="text-xs font-sans text-[#999] mb-6">
          Publicado en Nebbuler · plataforma de conocimiento profesional
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
          <div className="ml-auto flex items-center gap-3">
            <ProfileShare
              slug={creator.slug}
              publicationName={creator.publication_name ?? creator.name}
              creatorName={creator.name}
              specialty={creator.specialty}
              bio={creator.bio}
            />
            {!isSubscribed && (
              <Link
                href={`/suscribirse/${creator.slug}`}
                className="bg-[#121212] text-white font-sans text-xs font-bold tracking-[0.1em] uppercase px-6 py-2.5 hover:bg-[#C41C1C] transition-colors"
              >
                Suscribirse · {formatPriceCLP(creator.price_clp)}/mes
              </Link>
            )}
          </div>
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

      {/* Grid de artículos — 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#DEDEDE]">
        {posts.map((post) => {
          const bgColor = getDisciplineColor(creator.specialty)
          const shortTitle = getFirstWords(post.title)
          const canRead = post.is_free || isSubscribed

          return (
            <article key={post.id} className="bg-white group">
              {/* Imagen: 16:9 auto-generada */}
              <div
                className="aspect-[16/9] relative overflow-hidden"
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <p
                    className="font-serif text-white text-center leading-tight"
                    style={{ fontSize: 'clamp(14px, 2vw, 22px)', fontWeight: 700 }}
                  >
                    {shortTitle}
                  </p>
                </div>
                {!post.is_free && !isSubscribed && (
                  <div className="absolute top-3 right-3 bg-[#C41C1C] text-white text-[9px] font-sans font-bold tracking-[0.1em] uppercase px-2 py-1">
                    Suscriptores
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase text-[#C41C1C]">
                    {creator.specialty}
                  </span>
                  <time className="text-[10px] font-sans text-[#999]">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : ''}
                  </time>
                </div>

                {canRead ? (
                  <Link href={`/${creator.slug}/${post.slug}`}>
                    <h3 className="font-serif text-[18px] font-bold text-[#121212] leading-tight mb-2 group-hover:text-[#C41C1C] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="font-serif text-[18px] font-bold text-[#121212] leading-tight mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                )}

                {post.excerpt && canRead && (
                  <p className="font-sans text-sm text-[#666] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#DEDEDE]">
                  <span className="text-[10px] font-sans text-[#999]">
                    {post.read_time_minutes} min de lectura
                  </span>
                  {canRead ? (
                    <Link
                      href={`/${creator.slug}/${post.slug}`}
                      className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-[#121212] hover:text-[#C41C1C] transition-colors"
                    >
                      Leer →
                    </Link>
                  ) : (
                    <Link
                      href={`/suscribirse/${creator.slug}`}
                      className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-[#C41C1C]"
                    >
                      Suscribirse →
                    </Link>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {!isSubscribed && posts.length > 0 && (
        <div className="py-10 border-t border-[#DEDEDE] text-center mt-px">
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
        const staticMatch = findStaticCreator(slug)
        if (staticMatch) {
          creator = staticMatch.creator
          posts = staticMatch.posts
        } else {
          notFound()
        }
      }
    }
  } else {
    if (slug === 'rodrigo-fuentes') {
      creator = MOCK_CREATOR
      posts = MOCK_POSTS
    } else {
      const staticMatch = findStaticCreator(slug)
      if (staticMatch) {
        creator = staticMatch.creator
        posts = staticMatch.posts
      } else {
        notFound()
      }
    }
  }

  if (!creator) notFound()

  // Perfiles sin plan activo no son públicos
  if (creator.plan === 'free') notFound()

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
