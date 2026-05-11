import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'
import PaywallGate from '@/components/paywall-gate'
import { PostViewTracker } from '@/components/post-view-tracker'
import { ShareBar } from '@/components/share-bar'
import { creators as staticCreators } from '@/data/creators'
import { sanitizeHtml, stripHtml } from '@/lib/sanitize'

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
    month: 'long',
    year: 'numeric',
  })
}

function formatPriceCLP(n: number): string {
  return `$${n.toLocaleString('es-CL')}`
}

/** Estima minutos de lectura basado en el contenido */
function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Extrae las primeras ~300 palabras del HTML para el preview del paywall.
 * Strippea tags HTML completamente para garantizar que no se filtra contenido oculto
 * ni se renderiza HTML potencialmente malicioso.
 */
function extractPreview(content: string, wordCount = 300): string {
  const cleaned = stripHtml(content)
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length <= wordCount) return cleaned
  return words.slice(0, wordCount).join(' ') + '…'
}

// ─── Fallback estático desde creators.ts ─────────────────────────────────────

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
  'catalina-rojas-henriquez': 'Historia Económica',
  'alejandro-vasquez-mora':   'IA & Estrategia Tech',
}

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

function findStaticPost(
  creatorSlug: string,
  postSlug: string
): { creator: Creator; post: Post } | null {
  const found = staticCreators.find((c) => c.slug === creatorSlug)
  if (!found) return null

  const creator: Creator = {
    id: `mock-${creatorSlug}`,
    user_id: `mock-user-${creatorSlug}`,
    name: found.name,
    slug: found.slug,
    specialty: found.specialty,
    bio: found.bio,
    bio_long: found.bio,
    linkedin_url: null,
    price_clp: found.price_clp,
    plan: found.plan,
    publish_frequency: found.plan === 'pro' ? 'Publica dos veces por semana' : 'Publica semanalmente',
    created_at: sinceToISO(found.since),
    subscriber_count: found.subscriber_count,
    stripe_account_id: null,
    verified: found.verified,
    publication_name: PUBLICATION_NAMES[found.slug] ?? found.name,
    pull_quote: null,
    cover_image_url: null,
  }

  const baseDate = new Date(sinceToISO(found.since))
  for (let i = 0; i < found.articles.length; i++) {
    const title = found.articles[i]
    const generatedSlug = slugify(title)
    // Match exacto — sin truncado (cerraba bypass del paywall)
    if (generatedSlug === postSlug) {
      const pub = new Date(baseDate)
      pub.setDate(pub.getDate() + i * 14 + 7)
      const post: Post = {
        id: `mock-${creatorSlug}-${i}`,
        creator_id: `mock-${creatorSlug}`,
        title,
        excerpt: `Análisis en profundidad por ${found.name}.`,
        content: `## ${title}\n\nEste artículo es parte de la publicación **${PUBLICATION_NAMES[found.slug] ?? found.name}** por ${found.name}.\n\n${found.bio}\n\n---\n\n*Suscríbete para leer el análisis completo y todos los artículos exclusivos.*`,
        is_free: false,
        published_at: pub.toISOString(),
        created_at: pub.toISOString(),
        read_time_minutes: 6 + i * 2,
        slug: generatedSlug,
      }
      return { creator, post }
    }
  }
  return null
}

// ─── Mock data (Supabase no configurado) ─────────────────────────────────────

const MOCK_CREATOR: Creator = {
  id: 'mock-1',
  user_id: 'mock-user-1',
  name: 'Rodrigo Fuentes',
  slug: 'rodrigo-fuentes',
  specialty: 'ECONOMÍA',
  bio: 'Economista. Ex Banco Central. Analiza el mercado chileno desde adentro.',
  bio_long: null,
  linkedin_url: null,
  price_clp: 9990,
  plan: 'pro',
  publish_frequency: 'Publica cada jueves',
  created_at: '2024-03-01T00:00:00Z',
  subscriber_count: 847,
  stripe_account_id: null,
  publication_name: 'Análisis Económico',
  pull_quote: null,
  cover_image_url: null,
}

const MOCK_POST: Post = {
  id: 'mock-post-1',
  creator_id: 'mock-1',
  title: 'Por qué el peso cae cuando el cobre sube: la paradoja que nadie explica bien',
  excerpt:
    'Existe una correlación que todos los analistas conocen pero muy pocos se atreven a cuestionar. Este análisis va al fondo.',
  content: `El tipo de cambio es, en esencia, el precio relativo de dos economías. Cuando el cobre sube, Codelco y las mineras privadas reciben más dólares por cada tonelada exportada. Esos dólares eventualmente ingresan al sistema financiero chileno y se convierten en pesos, lo que debería apreciar la moneda. Hasta aquí, la teoría.

El problema está en el tiempo. Entre la venta del mineral en los mercados de futuros y la liquidación efectiva de divisas en el mercado chileno pueden pasar entre 30 y 90 días. Durante ese período, el mercado cambiario opera sobre expectativas, no sobre flujos reales.

El Banco Central tiene un mandato implícito de suavizar la volatilidad cambiaria. Cuando el cobre sube de manera brusca, la institución suele intervenir comprando dólares para evitar una apreciación excesiva del peso que dañe la competitividad de exportadores no mineros: forestales, salmones, vino.`,
  is_free: false,
  published_at: '2025-05-12T00:00:00Z',
  created_at: '2025-05-12T00:00:00Z',
  read_time_minutes: 8,
  slug: 'por-que-el-peso-cae-cuando-el-cobre-sube',
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creator: string; post: string }>
}): Promise<Metadata> {
  const { creator: creatorSlug, post: postSlug } = await params

  let post: Post | null = null
  let creator: Creator | null = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data: creatorData } = await supabase
        .from('sala_creators')
        .select('*')
        .eq('slug', creatorSlug)
        .single()
      creator = creatorData

      if (creator != null) {
        const creatorId = (creator as Creator).id
        const { data: postData } = await supabase
          .from('sala_posts')
          .select('*')
          .eq('creator_id', creatorId)
          .eq('slug', postSlug)
          .single()
        post = postData
      }
    } catch {
      // silencioso
    }
  }

  // Fallback estático — usa creators.ts para generar metadata cuando Supabase no encuentra el post
  if (!post) {
    const staticResult = findStaticPost(creatorSlug, postSlug)
    if (staticResult) {
      post = staticResult.post
      creator = staticResult.creator
    } else if (creatorSlug === MOCK_CREATOR.slug) {
      post = { ...MOCK_POST, slug: postSlug }
      creator = MOCK_CREATOR
    }
  }

  if (!post || !creator) {
    return { title: 'Artículo no encontrado' }
  }

  return {
    title: `${post.title} — ${creator.name}`,
    description: post.excerpt ?? undefined,
    alternates: {
      canonical: `https://nebbuler.com/${creator.slug}/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} — ${creator.name}`,
      description: post.excerpt ?? undefined,
      url: `https://nebbuler.com/${creator.slug}/${post.slug}`,
      type: 'article',
      siteName: 'Nebbuler',
      publishedTime: post.published_at ?? undefined,
      authors: [`https://nebbuler.com/${creator.slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — ${creator.name}`,
      description: post.excerpt ?? undefined,
    },
  }
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function Nav({ creatorSlug, creatorName }: { creatorSlug: string; creatorName: string }) {
  return (
    <header>
      <div className="border-b border-[#DEDEDE] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <Link
            href="/"
            className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            NEBBULER
          </Link>
          <hr className="nyt-rule w-full" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: 'Explorar', href: '/directorio' },
              { label: creatorName, href: `/${creatorSlug}` },
              { label: 'Precios', href: '/precios' },
              { label: 'Entrar', href: '/entrar' },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE]">·</span>}
                <Link
                  href={item.href}
                  className="hover:text-[#121212] transition-colors duration-150"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function CreatorSidebar({ creator }: { creator: Creator }) {
  return (
    <aside className="hidden lg:block w-[240px] flex-shrink-0">
      <div className="sticky top-8 border border-[#DEDEDE] p-5">
        <div
          className="w-14 h-14 bg-[#F7F7F7] border border-[#DEDEDE] flex items-center justify-center mb-4"
          aria-hidden="true"
        >
          <span className="font-serif text-[20px] font-bold text-[#121212]">
            {creator.name.charAt(0)}
          </span>
        </div>
        <h3
          className="font-serif text-[16px] font-bold text-[#121212] mb-1 leading-tight"
          style={{ letterSpacing: '-0.01em' }}
        >
          {creator.name}
        </h3>
        <span
          className="font-sans text-[10px] font-semibold uppercase tracking-widest mb-3 block"
          style={{ color: '#C41C1C' }}
        >
          {creator.specialty}
        </span>
        <p className="font-sans text-[12px] text-[#666666] leading-relaxed mb-4">
          {creator.bio}
        </p>
        <hr className="nyt-rule mb-4" />
        <p className="font-sans text-[11px] text-[#666666] mb-4">
          {creator.subscriber_count.toLocaleString('es-CL')} suscriptores
        </p>
        <Link
          href={`/suscribirse/${creator.slug}`}
          className="font-sans text-[12px] font-medium px-4 py-2.5 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 block text-center"
        >
          Suscribirse · {formatPriceCLP(creator.price_clp)}/mes
        </Link>
      </div>
    </aside>
  )
}

function ArticleContent({
  post,
  creator,
  isSubscribed,
  isAuthenticated,
}: {
  post: Post
  creator: Creator
  isSubscribed: boolean
  isAuthenticated: boolean
}) {
  const showPaywall = !post.is_free && !isSubscribed
  // Preview de paywall: solo texto plano (stripHtml).
  // Post completo: HTML sanitizado server-side.
  const safeHtml = showPaywall
    ? `<p>${extractPreview(post.content).replace(/</g, '&lt;')}</p>`
    : sanitizeHtml(post.content)

  return (
    <div>
      <div
        className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:text-[#121212] prose-headings:tracking-tight
          prose-h2:text-[24px] prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-[#121212] prose-p:mb-6
          prose-strong:font-bold prose-strong:text-[#121212]
          prose-em:italic
          prose-a:text-[#C41C1C] prose-a:underline hover:prose-a:text-[#a01515]
          prose-blockquote:border-l-[3px] prose-blockquote:border-[#C41C1C] prose-blockquote:pl-6
          prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#121212]
          prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
          prose-li:text-[18px] prose-li:leading-[1.8] prose-li:text-[#121212]
          prose-img:w-full prose-img:my-8
          prose-hr:border-[#DEDEDE]"
        style={{ fontFamily: 'var(--font-sans), sans-serif' }}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
      {showPaywall && (
        <PaywallGate
          creatorName={creator.name}
          creatorSlug={creator.slug}
          price_clp={creator.price_clp}
          isAuthenticated={isAuthenticated}
          isSubscribed={isSubscribed}
          postCount={undefined}
          postSlug={post.slug}
        />
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ creator: string; post: string }>
}) {
  const { creator: creatorSlug, post: postSlug } = await params

  let creator: Creator | null = null
  let post: Post | null = null
  let isSubscribed = false
  let isAuthenticated = false

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()

      // Obtener creator
      const { data: creatorData, error: creatorError } = await supabase
        .from('sala_creators')
        .select('*')
        .eq('slug', creatorSlug)
        .single()

      if (creatorError || !creatorData) notFound()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      creator = creatorData as any

      // Obtener post
      const creatorId = (creator as any).id
      const { data: postData, error: postError } = await supabase
        .from('sala_posts')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('slug', postSlug)
        .not('published_at', 'is', null)
        .single()

      if (postError || !postData) notFound()
      post = postData

      // Verificar suscripción
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        isAuthenticated = true
        const { data: sub } = await supabase
          .from('sala_subscriptions')
          .select('id')
          .eq('subscriber_id', user.id)
          .eq('creator_id', creator!.id)
          .eq('status', 'active')
          .maybeSingle()

        isSubscribed = !!sub
      }
    } catch {
      // Fallback cuando Supabase falla — forzar paywall en todos los posts
      // para evitar que contenido de pago sea accesible por error de infraestructura
      const staticResult = findStaticPost(creatorSlug, postSlug)
      if (staticResult) {
        creator = staticResult.creator
        post = { ...staticResult.post, is_free: false }
      } else if (creatorSlug === MOCK_CREATOR.slug) {
        post = { ...MOCK_POST, slug: postSlug, is_free: false }
        creator = MOCK_CREATOR
      } else {
        notFound()
      }
      // isSubscribed queda en false → paywall siempre visible cuando hay error
    }
  } else {
    // Sin Supabase → fallback estático
    const staticResult = findStaticPost(creatorSlug, postSlug)
    if (staticResult) {
      creator = staticResult.creator
      post = staticResult.post
    } else if (creatorSlug === MOCK_CREATOR.slug) {
      post = { ...MOCK_POST, slug: postSlug }
      creator = MOCK_CREATOR
    } else {
      notFound()
    }
  }

  if (!creator || !post) notFound()

  const readTime = post.read_time_minutes > 0
    ? post.read_time_minutes
    : estimateReadTime(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.published_at ?? post.created_at,
    author: {
      '@type': 'Person',
      name: creator.name,
      url: `https://nebbuler.com/${creator.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nebbuler',
      url: 'https://nebbuler.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nebbuler.com/${creator.slug}/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostViewTracker postId={post.id} />
      <Nav creatorSlug={creator.slug} creatorName={creator.name} />

      <main className="px-6 py-10">
        <div className="max-w-5xl mx-auto flex gap-12 items-start">
          {/* Columna principal */}
          <div className="flex-1 min-w-0">
            <header className="mb-8">
              <span
                className="font-sans text-[11px] font-semibold uppercase tracking-widest mb-4 block"
                style={{ color: '#C41C1C' }}
              >
                {creator.specialty}
              </span>
              <hr className="nyt-rule mb-5" />
              <h1
                className="font-serif text-[#121212] mb-5 leading-[1.05]"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="font-sans text-[20px] text-[#666666] leading-[1.4] mb-5">
                  {post.excerpt}
                </p>
              )}
              <hr className="nyt-rule mb-4" />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[13px] text-[#121212]">
                    Por{' '}
                    <Link
                      href={`/${creator.slug}`}
                      className="font-semibold hover:underline underline-offset-2"
                    >
                      {creator.name}
                    </Link>
                  </span>
                  {post.published_at && (
                    <>
                      <span className="text-[#DEDEDE]">·</span>
                      <time className="font-sans text-[13px] text-[#666666]">
                        {formatDate(post.published_at)}
                      </time>
                    </>
                  )}
                </div>
                <span className="font-sans text-[12px] text-[#666666]">
                  {readTime} minutos de lectura
                </span>
              </div>
              <hr className="nyt-rule mt-4" />
            </header>

            {/* Cuerpo del artículo */}
            <div style={{ maxWidth: '680px' }}>
              <ArticleContent
                post={post}
                creator={creator}
                isSubscribed={isSubscribed}
                isAuthenticated={isAuthenticated}
              />
            </div>

            {/* Share bar — visible siempre en artículos libres, solo antes del paywall en los de pago */}
            {(post.is_free || isSubscribed) && (
              <div className="max-w-[680px]">
                <ShareBar
                  url={`https://nebbuler.com/${creator.slug}/${post.slug}`}
                  title={post.title}
                  authorName={creator.name}
                  excerpt={post.excerpt}
                />
              </div>
            )}

            {/* CTA inferior (solo si está bloqueado) */}
            {!post.is_free && !isSubscribed && (
              <div className="mt-10 max-w-[680px]">
                <hr className="nyt-rule mb-6" />
                <p className="font-sans text-[13px] text-[#666666] mb-4">
                  ¿Te resultó útil el análisis?{' '}
                  <Link
                    href={`/${creator.slug}`}
                    className="font-semibold text-[#121212] hover:underline"
                  >
                    Ver todas las publicaciones de {creator.name} →
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <CreatorSidebar creator={creator} />
        </div>
      </main>

      <Footer />
    </>
  )
}
