'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Creator } from '@/types/database'
import CreatorCardComponent from '@/components/creator-card'
import { allCreators } from '@/data/creators'

// ─── Mock fallback — construido desde los 10 creadores reales ─────────────────

const MOCK_CREATORS: (Creator & { category: string; featured: boolean })[] = allCreators.map((c, i) => ({
  id: `mock-${i + 1}`,
  user_id: `u${i + 1}`,
  name: c.name,
  slug: c.slug,
  specialty: c.specialty,
  bio: c.bio,
  bio_long: null,
  linkedin_url: null,
  price_clp: c.price_clp,
  plan: c.plan as 'free' | 'creator' | 'pro',
  publish_frequency: 'Semanal',
  created_at: '2025-11-01T00:00:00Z',
  subscriber_count: c.subscriber_count,
  stripe_account_id: null,
  verified: c.verified,
  category: inferCategoryFromDiscipline(c.discipline),
  featured: c.featured,
}))

function inferCategoryFromDiscipline(discipline: string): string {
  const map: Record<string, string> = {
    economia: 'Economía',
    finanzas: 'Finanzas',
    derecho: 'Derecho',
    medicina: 'Medicina',
    'ciencia-politica': 'Tecnología',
    arquitectura: 'Arquitectura',
    nutricion: 'Salud',
    ingenieria: 'Ingeniería',
    historia: 'Economía',
  }
  return map[discipline] ?? 'Tecnología'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPriceCLP(n: number): string {
  return `$${n.toLocaleString('es-CL')}/mes`
}

/** Infiere categoría desde specialty si no viene del backend */
function inferCategory(specialty: string): string {
  const s = specialty.toLowerCase()
  if (s.includes('econom') || s.includes('financ') || s.includes('mercado')) return 'Economía'
  if (s.includes('derecho') || s.includes('legal') || s.includes('tributar')) return 'Derecho'
  if (s.includes('salud') || s.includes('médic') || s.includes('medicina') || s.includes('psicolog')) return 'Salud'
  if (s.includes('arquitect')) return 'Arquitectura'
  return 'Tecnología'
}

const CATEGORIES = ['Todos', 'Economía', 'Derecho', 'Medicina', 'Finanzas', 'Arquitectura', 'Ingeniería', 'Tecnología', 'Negocios'] as const
type Category = (typeof CATEGORIES)[number]

type CreatorWithMeta = Creator & { category: string; featured: boolean }

// ─── Componentes ──────────────────────────────────────────────────────────────

function Nav() {
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
            NEBBULER
          </Link>
          <hr className="nyt-rule w-full" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: 'Explorar', href: '/explorar', active: true },
              { label: 'Para creadores', href: '/abrir', active: false },
              { label: 'Precios', href: '/precios', active: false },
              { label: 'Entrar', href: '/entrar', active: false },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE]">·</span>}
                <Link
                  href={item.href}
                  className={`transition-colors duration-150 ${
                    item.active ? 'text-[#121212] font-semibold' : 'hover:text-[#121212]'
                  }`}
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
      <hr className="nyt-rule" />
    </header>
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

function CreatorCardFeatured({ creator }: { creator: CreatorWithMeta }) {
  return (
    <article className="py-8 pr-8 border-r border-[#DEDEDE]">
      <span
        className="font-sans text-[11px] font-semibold uppercase tracking-widest mb-3 block"
        style={{ color: '#C41C1C' }}
      >
        {creator.specialty}
      </span>
      <h2
        className="font-serif text-[28px] font-bold text-[#121212] mb-3 leading-[1.1]"
        style={{ letterSpacing: '-0.01em' }}
      >
        {creator.name}
      </h2>
      <p className="font-sans text-[14px] text-[#666666] leading-relaxed mb-5 line-clamp-3">
        {creator.bio}
      </p>
      <div className="flex items-center justify-between border-t border-[#DEDEDE] pt-4">
        <div>
          <span className="font-sans text-[13px] font-semibold text-[#121212] block">
            {formatPriceCLP(creator.price_clp)}
          </span>
          <span className="font-sans text-[11px] text-[#666666]">
            {creator.subscriber_count.toLocaleString('es-CL')} suscriptores
          </span>
        </div>
        <Link
          href={`/${creator.slug}`}
          className="font-sans text-[12px] font-medium text-[#121212] hover:text-[#C41C1C] transition-colors duration-150"
        >
          Ver sala →
        </Link>
      </div>
    </article>
  )
}

function CreatorCard({
  creator,
  showBorder = true,
}: {
  creator: CreatorWithMeta
  showBorder?: boolean
}) {
  return (
    <article className={`py-5 ${showBorder ? 'border-b border-[#DEDEDE]' : ''}`}>
      <span
        className="font-sans text-[10px] font-semibold uppercase tracking-widest mb-1.5 block"
        style={{ color: '#C41C1C' }}
      >
        {creator.specialty}
      </span>
      <h3
        className="font-serif text-[20px] font-bold text-[#121212] mb-1.5 leading-tight"
        style={{ letterSpacing: '-0.01em' }}
      >
        {creator.name}
      </h3>
      <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-3 line-clamp-1">
        {creator.bio}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[12px] text-[#666666]">
          {formatPriceCLP(creator.price_clp)} · {creator.subscriber_count.toLocaleString('es-CL')} subs
        </span>
        <Link
          href={`/${creator.slug}`}
          className="font-sans text-[11px] font-medium text-[#121212] hover:text-[#C41C1C] transition-colors duration-150"
        >
          Ver sala →
        </Link>
      </div>
    </article>
  )
}

// ─── Page (Client Component para filtros interactivos) ───────────────────────

export default function ExplorarPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos')
  const [creators, setCreators] = useState<CreatorWithMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCreators() {
      try {
        const res = await fetch('/api/creators')
        if (res.ok) {
          const data: Creator[] = await res.json()
          if (data.length > 0) {
            const mapped: CreatorWithMeta[] = data.map((c, i) => ({
              ...c,
              category: inferCategory(c.specialty),
              featured: i < 2, // los 2 primeros (más suscriptores) son destacados
            }))
            setCreators(mapped)
            setLoading(false)
            return
          }
        }
      } catch {
        // Supabase no configurado → usar mock
      }
      setCreators(MOCK_CREATORS)
      setLoading(false)
    }
    fetchCreators()
  }, [])

  const filtered =
    activeCategory === 'Todos'
      ? creators
      : creators.filter((c) => c.category === activeCategory)

  const featured = filtered.filter((c) => c.featured)
  const rest = filtered.filter((c) => !c.featured)

  return (
    <>
      <Nav />
      <main className="px-6 pb-8">
        {/* Filtros */}
        <div className="max-w-5xl mx-auto pt-8 pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[12px] text-[#666666] mr-1">Mostrar:</span>
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-sans text-[11px] uppercase tracking-widest px-3 py-1 border transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-white text-[#666666] border-[#DEDEDE] hover:border-[#121212] hover:text-[#121212]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
          <hr className="nyt-rule mt-5" />
        </div>

        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="py-20 text-center">
              <p className="font-sans text-[13px] text-[#666666]">Cargando salas…</p>
            </div>
          ) : (
            <>
              {/* Destacados */}
              {featured.length > 0 && (
                <>
                  <div className="mb-4">
                    <span className="section-label mb-3 inline-block">PERFILES DESTACADOS</span>
                  </div>
                  <div
                    className={`grid gap-0 mb-0 ${
                      featured.length === 1
                        ? 'grid-cols-1 max-w-xl'
                        : featured.length === 2
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-3'
                    }`}
                  >
                    {featured.map((c, i) => (
                      <div key={c.id} className={i > 0 ? 'pl-8' : ''}>
                        <CreatorCardFeatured creator={c} />
                      </div>
                    ))}
                  </div>
                  <hr className="nyt-rule mb-0 mt-0" />
                </>
              )}

              {/* Resto */}
              {rest.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4">
                    <span className="section-label mb-3 inline-block">
                      {activeCategory === 'Todos' ? 'TODOS LOS CREADORES' : activeCategory.toUpperCase()}
                    </span>
                    <hr className="nyt-rule" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-0 md:divide-x md:divide-[#DEDEDE]">
                    <div className="pr-0 md:pr-8">
                      {rest
                        .filter((_, i) => i % 2 === 0)
                        .map((c) => (
                          <CreatorCardComponent
                            key={c.id}
                            name={c.name}
                            slug={c.slug}
                            specialty={c.specialty}
                            bio={c.bio}
                            price_clp={c.price_clp}
                            subscriber_count={c.subscriber_count}
                            publish_frequency={c.publish_frequency}
                            plan={c.plan as 'free' | 'creator' | 'pro'}
                          />
                        ))}
                    </div>
                    <div className="pl-0 md:pl-8 border-t md:border-t-0 border-[#DEDEDE]">
                      {rest
                        .filter((_, i) => i % 2 === 1)
                        .map((c) => (
                          <CreatorCardComponent
                            key={c.id}
                            name={c.name}
                            slug={c.slug}
                            specialty={c.specialty}
                            bio={c.bio}
                            price_clp={c.price_clp}
                            subscriber_count={c.subscriber_count}
                            publish_frequency={c.publish_frequency}
                            plan={c.plan as 'free' | 'creator' | 'pro'}
                          />
                        ))}
                    </div>
                  </div>
                  <hr className="nyt-rule mt-4" />
                </div>
              )}

              {/* Estado vacío */}
              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <p className="font-serif text-[22px] text-[#666666] italic">
                    No hay salas en esta categoría todavía.
                  </p>
                </div>
              )}
            </>
          )}

          {/* CTA inferior */}
          <div className="py-14 text-center bg-[#F7F7F7] border border-[#DEDEDE] mt-10 px-8">
            <span className="section-label mb-4 inline-block">PARA CREADORES</span>
            <p
              className="font-serif text-[#121212] mb-6 leading-[1.1]"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700 }}
            >
              ¿Tienes algo que enseñar?
              <br />
              Abre tu sala.
            </p>
            <p className="font-sans text-[14px] text-[#666666] max-w-sm mx-auto mb-8 leading-relaxed">
              En 15 minutos configuras tu perfil, defines tu precio y empiezas a publicar. Sin
              código. Sin diseñador.
            </p>
            <Link
              href="/abrir"
              className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 inline-block"
            >
              Abrir la mía →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
