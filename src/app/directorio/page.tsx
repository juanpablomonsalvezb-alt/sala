import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Directorio de Profesionales — Sala',
  description: 'Explora análisis de economistas, abogados, médicos y arquitectos verificados en Chile y LATAM.',
  openGraph: {
    title: 'Directorio de Profesionales — Sala',
    description: 'El directorio más completo de profesionales verificados publicando conocimiento en español.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sala.com/directorio',
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

const MOCK_CREATORS = [
  {
    id: '1', slug: 'rodrigo-fuentes', name: 'Rodrigo Fuentes',
    specialty: 'MACROECONOMÍA', discipline: 'economia',
    bio: 'Análisis semanal del mercado chileno para entender qué está pasando realmente, sin el filtro del titular.',
    price_clp: 9990, subscriber_count: 847, verified: true,
    publish_frequency: 'Semanal', plan: 'pro',
  },
  {
    id: '2', slug: 'isabel-contreras', name: 'Isabel Contreras',
    specialty: 'DERECHO TRIBUTARIO', discipline: 'derecho',
    bio: 'Lo que el SII no te explica, pero necesitas saber para no pagar de más.',
    price_clp: 12990, subscriber_count: 523, verified: true,
    publish_frequency: 'Semanal', plan: 'creator',
  },
  {
    id: '3', slug: 'marco-salinas', name: 'Marco Salinas',
    specialty: 'ARQUITECTURA URBANA', discipline: 'arquitectura',
    bio: 'Ciudad, territorio y política pública. Lo que no aparece en el Plano Regulador.',
    price_clp: 7990, subscriber_count: 312, verified: true,
    publish_frequency: 'Quincenal', plan: 'creator',
  },
  {
    id: '4', slug: 'felipe-mora', name: 'Felipe Mora',
    specialty: 'FINANZAS LATAM', discipline: 'finanzas',
    bio: 'Mercados emergentes LATAM: lo que los analistas de Wall Street no entienden.',
    price_clp: 14990, subscriber_count: 421, verified: true,
    publish_frequency: 'Quincenal', plan: 'pro',
  },
  {
    id: '5', slug: 'carolina-vega', name: 'Carolina Vega',
    specialty: 'MEDICINA INTERNA', discipline: 'medicina',
    bio: 'Evidencia científica sin jerga. Lo que necesitas saber para tomar mejores decisiones de salud.',
    price_clp: 8990, subscriber_count: 289, verified: true,
    publish_frequency: 'Semanal', plan: 'creator',
  },
  {
    id: '6', slug: 'andres-pizarro', name: 'Andrés Pizarro',
    specialty: 'DERECHO LABORAL', discipline: 'derecho',
    bio: 'Tus derechos laborales en lenguaje claro. Contratos, despidos, negociación colectiva.',
    price_clp: 9990, subscriber_count: 198, verified: false,
    publish_frequency: 'Semanal', plan: 'creator',
  },
]

function formatPrice(clp: number) {
  return `$${clp.toLocaleString('es-CL')}`
}

export default function DirectorioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Directorio de Profesionales — Sala',
            description: 'Directorio de profesionales verificados publicando conocimiento en español',
            url: 'https://sala.com/directorio',
            publisher: { '@type': 'Organization', name: 'Sala', url: 'https://sala.com' },
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Header editorial */}
        <div className="border-b border-[#DEDEDE]">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
              Sala · Directorio público
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-4">
              Profesionales verificados
            </h1>
            <p className="font-sans text-base text-[#666] max-w-xl leading-relaxed">
              Economistas, abogados, médicos y arquitectos que publican análisis y cobran directamente por su conocimiento.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="border-b border-[#DEDEDE] bg-white sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-0 overflow-x-auto">
              {DISCIPLINES.map((d) => (
                <a
                  key={d.id}
                  href={d.id === 'todos' ? '/directorio' : `/directorio?disciplina=${d.id}`}
                  className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-sans font-bold tracking-[0.08em] uppercase whitespace-nowrap border-b-2 border-transparent text-[#666] hover:text-[#121212] hover:border-[#121212] transition-colors"
                >
                  <span className="text-sm">{d.icon}</span>
                  {d.name}
                </a>
              ))}
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

        {/* Creator grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DEDEDE]">
            {MOCK_CREATORS.map((creator) => (
              <Link
                key={creator.id}
                href={`/${creator.slug}`}
                className="bg-white p-6 hover:bg-[#F7F7F7] transition-colors group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-[#121212] flex items-center justify-center text-white font-serif font-bold text-sm">
                    {creator.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex items-center gap-2">
                    {creator.verified && (
                      <span className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase bg-[#ECFDF5] text-[#065F46] px-2 py-0.5">
                        Verificado
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase text-[#C41C1C]">
                    {creator.specialty}
                  </span>
                </div>

                <h2 className="font-serif text-lg font-bold text-[#121212] mb-2 group-hover:text-[#C41C1C] transition-colors leading-tight">
                  {creator.name}
                </h2>

                <p className="text-sm font-sans text-[#666] leading-relaxed mb-4 line-clamp-2">
                  {creator.bio}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#DEDEDE]">
                  <div>
                    <div className="text-xs font-sans font-bold text-[#121212]">
                      {formatPrice(creator.price_clp)}<span className="text-[#999] font-normal">/mes</span>
                    </div>
                    <div className="text-[10px] font-sans text-[#999] mt-0.5">
                      {creator.publish_frequency}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-sans font-bold text-[#121212]">
                      {creator.subscriber_count.toLocaleString('es-CL')}
                    </div>
                    <div className="text-[10px] font-sans text-[#999] mt-0.5">
                      suscriptores
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
