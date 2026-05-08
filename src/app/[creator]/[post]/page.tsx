import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'

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
 * Extrae los primeros ~300 palabras del markdown para el preview del paywall.
 * Elimina marcas markdown simples para mostrar texto limpio.
 */
function extractPreview(content: string, wordCount = 300): string {
  const cleaned = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/>\s/g, '')
    .replace(/\n{2,}/g, '\n\n')
    .trim()

  const words = cleaned.split(/\s+/)
  if (words.length <= wordCount) return cleaned
  return words.slice(0, wordCount).join(' ') + '…'
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
  is_free: true,
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

  if (!post && postSlug === MOCK_POST.slug) {
    post = MOCK_POST
    creator = MOCK_CREATOR
  }

  if (!post || !creator) {
    return { title: 'Artículo no encontrado — Sala' }
  }

  return {
    title: `${post.title} — ${creator.name}`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: `${post.title} — ${creator.name}`,
      description: post.excerpt ?? undefined,
    },
  }
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function Nav({ creatorSlug, creatorName }: { creatorSlug: string; creatorName: string }) {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <Link
            href="/"
            className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            SALA
          </Link>
          <hr className="nyt-rule w-full" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: 'Explorar', href: '/explorar' },
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

function PaywallCard({ creator }: { creator: Creator }) {
  return (
    <div className="relative my-8">
      {/* Degradado que simula blur sobre el texto anterior */}
      <div
        className="pointer-events-none absolute -top-20 left-0 right-0 h-20"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.97))',
        }}
      />
      {/* Card paywall */}
      <div className="border border-[#DEDEDE] p-8 text-center bg-[#F7F7F7]">
        <span className="section-label mb-3 inline-block">ACCESO EXCLUSIVO</span>
        <h4
          className="font-serif text-[22px] font-bold text-[#121212] mb-3 leading-[1.1]"
          style={{ letterSpacing: '-0.01em' }}
        >
          Este artículo es exclusivo para suscriptores de {creator.name}
        </h4>
        <p className="font-sans text-[13px] text-[#666666] max-w-sm mx-auto mb-6 leading-relaxed">
          Únete para acceder a este análisis completo y a todos los artículos anteriores sin
          restricciones.
        </p>
        <Link
          href={`/suscribirse/${creator.slug}`}
          className="font-sans text-[13px] font-medium px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors duration-150 inline-block"
        >
          Suscribirse · {formatPriceCLP(creator.price_clp)}/mes
        </Link>
        <p className="font-sans text-[11px] text-[#666666] mt-4">
          Cancela cuando quieras. Sin permanencia.
        </p>
      </div>
    </div>
  )
}

function ArticleContent({
  post,
  creator,
  isSubscribed,
}: {
  post: Post
  creator: Creator
  isSubscribed: boolean
}) {
  const showPaywall = !post.is_free && !isSubscribed
  const content = showPaywall ? extractPreview(post.content) : post.content

  // Renderizado sencillo de markdown (párrafos y encabezados)
  const renderContent = (text: string) =>
    text.split('\n\n').map((block, i) => {
      const trimmed = block.trim()
      if (!trimmed) return null
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="font-serif text-[24px] font-bold text-[#121212] mt-10 mb-4 leading-[1.15]"
            style={{ letterSpacing: '-0.01em' }}
          >
            {trimmed.replace(/^##\s/, '')}
          </h2>
        )
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2
            key={i}
            className="font-serif text-[28px] font-bold text-[#121212] mt-10 mb-4 leading-[1.1]"
            style={{ letterSpacing: '-0.01em' }}
          >
            {trimmed.replace(/^#\s/, '')}
          </h2>
        )
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={i}
            className="my-8 pl-6 border-l-[3px] border-[#C41C1C]"
          >
            <p
              className="font-serif text-[20px] italic text-[#121212] leading-[1.5]"
              style={{ fontWeight: 400 }}
            >
              &ldquo;{trimmed.replace(/^>\s/, '')}&rdquo;
            </p>
          </blockquote>
        )
      }
      return (
        <p key={i} className="mb-6">
          {trimmed}
        </p>
      )
    })

  return (
    <div className="font-sans text-[18px] text-[#121212] leading-[1.8]">
      {renderContent(content)}
      {showPaywall && <PaywallCard creator={creator} />}
      {/* Contenido borroso tras paywall */}
      {showPaywall && (
        <div
          className="relative mt-4"
          style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <p className="mb-6">
            Para los que sí tienen acceso a este análisis, las implicaciones son concretas.
            Existe un patrón estadísticamente robusto en el comportamiento de los mercados en
            los 45 días posteriores a ciertos eventos que aquí se detallan con precisión.
          </p>
          <p className="mb-6">
            Las tres ventanas de oportunidad que se identifican aquí son: la primera en las
            48 horas posteriores al anuncio, la segunda durante el período de ajuste, y la
            tercera en la consolidación.
          </p>
        </div>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ creator: string; post: string }>
}) {
  const { creator: creatorSlug, post: postSlug } = await params

  let creator: Creator | null = null
  let post: Post | null = null
  let isSubscribed = false

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
      // Fallback a mock
      if (creatorSlug === 'rodrigo-fuentes' && postSlug === MOCK_POST.slug) {
        creator = MOCK_CREATOR
        post = MOCK_POST
      } else {
        notFound()
      }
    }
  } else {
    // Sin Supabase → mock
    if (creatorSlug === 'rodrigo-fuentes' && postSlug === MOCK_POST.slug) {
      creator = MOCK_CREATOR
      post = MOCK_POST
    } else {
      notFound()
    }
  }

  if (!creator || !post) notFound()

  const readTime = post.read_time_minutes > 0
    ? post.read_time_minutes
    : estimateReadTime(post.content)

  return (
    <>
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
              />
            </div>

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
