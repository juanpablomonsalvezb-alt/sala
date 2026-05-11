import type { Metadata } from 'next'
import Link from 'next/link'
import { PROFESSIONS, MARKETS } from '@/data/seo-matrix'

export const metadata: Metadata = {
  title: 'Newsletters Profesionales de Pago — Directorio por Profesión y País | Nebbuler',
  description:
    'Directorio completo de newsletters profesionales en español. Encuentra análisis de economistas, abogados, médicos, arquitectos y más en Chile, Colombia, México, Argentina y toda Latinoamérica.',
  alternates: { canonical: 'https://nebbuler.com/newsletter' },
  openGraph: {
    title: 'Newsletters Profesionales de Pago — Directorio por Profesión y País | Nebbuler',
    description:
      'Directorio completo de newsletters profesionales en español. Suscripciones directas en pesos, sin intermediarios.',
    url: 'https://nebbuler.com/newsletter',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Newsletters Profesionales en Español — Directorio Nebbuler',
  description: 'Directorio de newsletters profesionales de pago en Chile, Colombia, México, Argentina y Latinoamérica.',
  url: 'https://nebbuler.com/newsletter',
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
}

export default function NewsletterIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Banda roja superior */}
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
            <Link href="/directorio" className="font-sans text-[12px] text-[#666] hover:text-[#121212]">
              Ver directorio →
            </Link>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="font-sans text-[11px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Nebbuler</Link>
            <span className="mx-2">›</span>
            <span>Newsletters</span>
          </nav>

          {/* Hero */}
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            DIRECTORIO · AMÉRICA LATINA · 2026
          </p>
          <h1 className="font-serif text-[38px] md:text-[52px] font-bold text-[#121212] leading-tight mb-5">
            Newsletters Profesionales en Español
          </h1>
          <p className="font-sans text-[16px] text-[#666] leading-relaxed mb-4 max-w-2xl">
            El directorio más completo de newsletters profesionales de pago en Latinoamérica. Economistas,
            abogados, médicos, arquitectos y más — publicando análisis que valen lo que cobran.
          </p>
          <p className="font-sans text-[14px] text-[#999] mb-16">
            {PROFESSIONS.length} profesiones · {MARKETS.length} mercados · {PROFESSIONS.length * MARKETS.length} categorías indexadas
          </p>

          {/* Cuadrícula: profesión × mercados */}
          <div className="space-y-0">
            {/* Header de columnas */}
            <div className="hidden md:grid md:grid-cols-[200px_1fr] border border-[#DEDEDE] bg-[#F7F7F7]">
              <div className="px-4 py-3 font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999] border-r border-[#DEDEDE]">
                Profesión
              </div>
              <div className="px-4 py-3">
                <div className="grid grid-cols-7 gap-0">
                  {MARKETS.map(m => (
                    <div key={m.slug} className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-[#999] text-center">
                      {m.flag}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filas por profesión */}
            {PROFESSIONS.map((prof, i) => (
              <div
                key={prof.slug}
                className={`border-l border-r border-b border-[#DEDEDE] ${i === 0 ? 'border-t' : ''} md:grid md:grid-cols-[200px_1fr] hover:bg-[#FAFAFA] transition-colors`}
              >
                {/* Nombre profesión */}
                <div className="px-4 py-4 md:border-r border-[#DEDEDE]">
                  <p className="font-serif text-[14px] font-bold text-[#121212] leading-tight">{prof.label}</p>
                  <p className="font-sans text-[11px] text-[#999] mt-1 leading-tight">{prof.specialty}</p>
                </div>

                {/* Chips de mercados */}
                <div className="px-4 py-4">
                  {/* Desktop: grid alineado */}
                  <div className="hidden md:grid grid-cols-7 gap-1 items-center">
                    {MARKETS.map(m => (
                      <Link
                        key={m.slug}
                        href={`/newsletter/${prof.slug}/${m.slug}`}
                        className="flex flex-col items-center gap-1 group"
                        title={`Newsletter de ${prof.label} en ${m.label}`}
                      >
                        <span className="font-sans text-[11px] text-[#666] group-hover:text-[#C41C1C] transition-colors text-center leading-tight">
                          {m.label === 'Latinoamérica' ? 'Latinoamérica' : m.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                  {/* Mobile: chips en línea */}
                  <div className="flex flex-wrap gap-2 md:hidden">
                    {MARKETS.map(m => (
                      <Link
                        key={m.slug}
                        href={`/newsletter/${prof.slug}/${m.slug}`}
                        className="inline-flex items-center gap-1 border border-[#DEDEDE] px-2 py-1 font-sans text-[11px] text-[#666] hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                      >
                        <span>{m.flag}</span>
                        <span>{m.label === 'Latinoamérica' ? 'Latinoamérica' : m.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Separador */}
          <div className="h-px bg-[#EEEEEE] my-16" />

          {/* Por disciplina — bloques temáticos */}
          <section className="mb-16">
            <h2 className="font-serif text-[26px] font-bold text-[#121212] mb-2">
              Explorar por disciplina
            </h2>
            <p className="font-sans text-[13px] text-[#666] mb-10">
              Todas las categorías con los países disponibles.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {PROFESSIONS.map(prof => (
                <div key={prof.slug} className="border border-[#DEDEDE] p-5">
                  <p className="font-serif text-[16px] font-bold text-[#121212] mb-1">{prof.label}</p>
                  <p className="font-sans text-[12px] text-[#999] mb-4">{prof.specialty}</p>
                  <div className="flex flex-wrap gap-2">
                    {MARKETS.map(m => (
                      <Link
                        key={m.slug}
                        href={`/newsletter/${prof.slug}/${m.slug}`}
                        className="inline-flex items-center gap-1 font-sans text-[11px] text-[#666] border border-[#DEDEDE] px-2 py-1 hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                      >
                        {m.flag} {m.label === 'Latinoamérica' ? 'Latinoamérica' : m.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#F7F7F7] border-l-2 border-[#C41C1C] p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-2">
                  ¿Eres profesional y quieres publicar?
                </h2>
                <p className="font-sans text-[14px] text-[#666] mb-5 leading-relaxed">
                  Abre tu newsletter en Nebbuler: pagos en tu moneda local, 0% de comisión, directorio incluido.
                  Sin algoritmos. Sin intermediarios.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/abrir"
                    className="inline-block bg-[#C41C1C] text-white font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#121212] transition-colors"
                  >
                    Abrir mi sala →
                  </Link>
                  <Link
                    href="/para-creadores"
                    className="inline-block border border-[#121212] text-[#121212] font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-6 py-3 hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                  >
                    Ver condiciones →
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-2">
                  ¿Buscas un newsletter profesional?
                </h2>
                <p className="font-sans text-[14px] text-[#666] mb-5 leading-relaxed">
                  Explora el directorio completo de creadores verificados por disciplina y especialidad.
                </p>
                <Link
                  href="/directorio"
                  className="inline-block bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#C41C1C] transition-colors"
                >
                  Ver directorio →
                </Link>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-[#DEDEDE]">
            <Link href="/" className="font-sans text-[13px] text-[#666] hover:text-[#121212]">
              ← Volver a Nebbuler
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
