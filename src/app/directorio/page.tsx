import type { Metadata } from 'next'
import Link from 'next/link'
import DirectorioClient from './directorio-client'
import { allCreators } from '@/data/creators'
import SubscribeWidget from '@/components/newsletter/SubscribeWidget'
import SearchWidget from '@/components/search/SearchWidget'
import { itemListSchema, breadcrumbListSchema } from '@/lib/json-ld'
import { safeJsonLd } from '@/lib/rateLimit'

export const metadata: Metadata = {
  title: 'Directorio de Profesionales — Nebbuler',
  description: 'Explora análisis de profesionales verificados en América Latina.',
  openGraph: {
    title: 'Directorio de Profesionales — Nebbuler',
    description: 'El directorio más completo de profesionales verificados publicando conocimiento en español.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nebbuler.com/directorio',
  },
}

const DISCIPLINES = [
  { id: 'todos',      name: 'Todos',       icon: '◉' },
  { id: 'economia',   name: 'Economía',    icon: '📈' },
  { id: 'derecho',    name: 'Derecho',     icon: '⚖️' },
  { id: 'medicina',   name: 'Medicina',    icon: '🩺' },
  { id: 'finanzas',   name: 'Finanzas',    icon: '💼' },
  { id: 'arquitectura', name: 'Arquitectura', icon: '🏛️' },
  { id: 'ingenieria', name: 'Ingeniería',  icon: '⚙️' },
  { id: 'tecnologia', name: 'Tecnología',  icon: '💻' },
  { id: 'negocios',   name: 'Negocios',    icon: '📊' },
]

const MOCK_CREATORS = allCreators.map((c, i) => ({
  id: String(i + 1),
  slug: c.slug,
  name: c.name,
  specialty: c.specialty,
  discipline: c.discipline,
  bio: c.bio,
  price_clp: c.price_clp,
  subscriber_count: c.subscriber_count,
  verified: c.verified,
  publish_frequency: 'Semanal',
  plan: c.plan,
}))

export default function DirectorioPage() {
  const directoryItemList = itemListSchema({
    name: 'Directorio de profesionales verificados en LATAM — Nebbuler',
    description:
      'Listado público de profesionales latinoamericanos publicando análisis editoriales en Nebbuler. Economistas, abogados, médicos, arquitectos, ingenieros y más.',
    url: 'https://nebbuler.com/directorio',
    items: allCreators.slice(0, 50).map((c) => ({
      name: c.name,
      url: `https://nebbuler.com/${c.slug}`,
      description: `${c.specialty} — ${c.bio.slice(0, 160)}`,
    })),
  })

  const directoryBreadcrumbs = breadcrumbListSchema([
    { name: 'Nebbuler', url: 'https://nebbuler.com' },
    { name: 'Directorio', url: 'https://nebbuler.com/directorio' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Directorio de Profesionales — Nebbuler',
            description: 'Directorio de profesionales verificados publicando conocimiento en español',
            url: 'https://nebbuler.com/directorio',
            publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(directoryItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(directoryBreadcrumbs) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header editorial */}
        <div className="border-b border-[#DEDEDE]">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
              Nebbuler · Directorio público
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-4">
              Profesionales verificados
            </h1>
            <p className="font-sans text-base text-[#666] max-w-xl leading-relaxed">
              Profesionales verificados que publican análisis y cobran directamente por su conocimiento.
            </p>
            <div className="mt-6 max-w-lg">
              <SearchWidget placeholder="Buscar economistas, abogados, temas..." />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-[#F7F7F7] border-b border-[#DEDEDE]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex gap-8">
            <span className="text-xs font-sans text-[#666]">
              <span className="font-bold text-[#121212]">{MOCK_CREATORS.length}</span> profesionales
            </span>
            <span className="text-xs font-sans text-[#666]">
              <span className="font-bold text-[#121212]">{MOCK_CREATORS.filter(c => c.verified).length}</span> verificados
            </span>
            <span className="text-xs font-sans text-[#666]">
              <span className="font-bold text-[#121212]">{DISCIPLINES.length - 1}</span> disciplinas
            </span>
          </div>
        </div>

        <DirectorioClient
          creators={MOCK_CREATORS as Parameters<typeof DirectorioClient>[0]['creators']}
          disciplines={DISCIPLINES.filter((d) => d.id !== 'todos').map((d) => ({
            id: d.id,
            name_es: d.name,
            icon: d.icon,
          }))}
        />

        {/* Newsletter */}
        <div className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-xl mx-auto px-6">
            <SubscribeWidget
              title="Recibe lo mejor del directorio cada semana"
              description="Los análisis más leídos de nuestros creadores. Gratis, todos los lunes."
              ctaLabel="Suscribirme"
            />
          </div>
        </div>

        {/* CTA creador */}
        <div className="border-t-4 border-[#121212] bg-[#121212] py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#666] mb-3">
              ¿Eres profesional?
            </p>
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              Publica tu conocimiento. Cobra por él.
            </h2>
            <p className="font-sans text-base text-[#999] mb-8 max-w-lg mx-auto">
              Únete a los profesionales que ya monetizan su expertise directamente con sus lectores.
            </p>
            <Link
              href="/para-creadores"
              className="inline-block bg-[#C41C1C] text-white font-sans font-bold text-sm tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#A01515] transition-colors"
            >
              Empieza hoy
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
