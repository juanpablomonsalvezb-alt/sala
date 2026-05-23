import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NICHOS, PAISES_INF, generarPerfilesArquetipo } from '@/data/programmatic/influencers-latam'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ nicho: string; pais: string }>
}

interface CreatorRow {
  slug: string
  name: string
  display_name: string | null
  specialty: string | null
  bio: string | null
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function generateStaticParams() {
  // All niches × all countries for maximum SEO coverage
  const topNichos = [
    'economia', 'finanzas-personales', 'derecho-tributario', 'startups', 'marketing',
    'derecho-laboral', 'real-estate', 'salud-mental', 'nutricion', 'fitness',
    'parenting', 'educacion', 'tech', 'sostenibilidad', 'lifestyle',
    'tecnologia', 'marketing-digital', 'recursos-humanos', 'supply-chain',
    'psicologia', 'odontologia', 'arquitectura', 'ingenieria', 'ciencia-de-datos',
  ]
  const topPaises = [
    'chile', 'argentina', 'mexico', 'colombia', 'peru',
    'uruguay', 'ecuador', 'paraguay', 'bolivia',
    'panama', 'costa-rica', 'republica-dominicana',
  ]
  const params: Array<{ nicho: string; pais: string }> = []
  for (const n of topNichos) for (const p of topPaises) params.push({ nicho: n, pais: p })
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nicho, pais } = await params
  const n = NICHOS.find((x) => x.slug === nicho)
  const p = PAISES_INF.find((x) => x.slug === pais)
  if (!n || !p) return { title: 'Directorio — Nebbuler' }
  return {
    title: `Los mejores expertos de ${n.nombreMayus} en ${p.nombre} 2026 — Nebbuler`,
    description: `Directorio público de referentes en ${n.nombre} de ${p.nombre}: economistas, abogados, divulgadores y profesionales activos en LinkedIn, Twitter e Instagram.`,
    alternates: { canonical: `https://nebbuler.com/expertos/${nicho}/${pais}` },
    openGraph: {
      title: `Expertos de ${n.nombreMayus} en ${p.nombre} 2026`,
      description: n.descripcion,
      type: 'website',
    },
  }
}

export default async function ExpertosPage({ params }: PageProps) {
  const { nicho, pais } = await params
  const n = NICHOS.find((x) => x.slug === nicho)
  const p = PAISES_INF.find((x) => x.slug === pais)
  if (!n || !p) notFound()

  // Buscar creadores reales Nebbuler en el nicho/país
  let creadoresNebbuler: CreatorRow[] = []
  const admin = adminSupabase()
  if (admin) {
    const { data } = await admin
      .from('sala_creators')
      .select('slug, name, display_name, specialty, bio')
      .eq('plan', 'creator')
      .ilike('specialty', `%${n.nombre}%`)
      .limit(5)
    creadoresNebbuler = (data as CreatorRow[] | null) ?? []
  }

  const arquetipos = generarPerfilesArquetipo(nicho, pais)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Expertos de ${n.nombreMayus} en ${p.nombre}`,
    description: n.descripcion,
    itemListElement: arquetipos.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: a.nombre,
        description: a.bio,
        url: a.url,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-[#DEDEDE] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="text-[12px] text-[#666] mb-4 font-sans">
            <Link href="/" className="hover:underline">Inicio</Link> ·{' '}
            <Link href="/directorio" className="hover:underline">Directorio</Link> ·{' '}
            <span>Expertos {n.nombreMayus}</span>
          </nav>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-bold mb-3">
            Directorio público
          </p>
          <h1
            className="text-[40px] md:text-[52px] font-bold text-[#121212] tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Los mejores expertos de {n.nombreMayus} en{' '}
            <span aria-hidden className="mr-1">{p.emoji}</span>{p.nombre}
          </h1>
          <p className="mt-5 text-[16px] text-[#444] leading-relaxed max-w-2xl">
            {n.descripcion}
          </p>
        </div>
      </header>

      {creadoresNebbuler.length > 0 && (
        <section className="px-6 py-12 border-b border-[#DEDEDE] bg-[#FAFAF7]">
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-bold mb-5">
              En Nebbuler
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creadoresNebbuler.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="block bg-white border border-[#121212] p-5 hover:bg-[#FFFBEA]">
                  <p className="text-[11px] uppercase tracking-wider text-[#666]">
                    {c.specialty ?? n.nombreMayus}
                  </p>
                  <h3
                    className="text-[20px] font-bold text-[#121212] mt-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {c.display_name ?? c.name}
                  </h3>
                  {c.bio && (
                    <p className="text-[13px] text-[#444] mt-2 line-clamp-2">{c.bio}</p>
                  )}
                  <p className="text-[12px] text-[#C41C1C] mt-3">Suscribirse →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-12 border-b border-[#DEDEDE]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666] font-medium mb-5">
            Referentes públicos en {p.nombre}
          </p>
          {arquetipos.length === 0 ? (
            <p className="text-[14px] text-[#666]">
              Directorio en construcción. ¿Conoces a alguien? <Link href="/recomendar-creador" className="underline">Recomiéndalo →</Link>
            </p>
          ) : (
            <ul className="divide-y divide-[#DEDEDE] border-y border-[#DEDEDE] bg-white">
              {arquetipos.map((a, i) => (
                <li key={i} className="flex items-start gap-4 p-5">
                  <span className="text-[11px] uppercase tracking-wider text-[#888] w-8 flex-shrink-0 mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-medium text-[#121212]">{a.nombre}</h3>
                    <p className="text-[13px] text-[#666] mt-1">{a.bio}</p>
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#C41C1C] underline underline-offset-2 hover:no-underline mt-2 inline-block">
                      Ver perfiles en {a.red} →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-6 py-12 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-bold mb-3">
            ¿Tú también creas contenido de {n.nombre}?
          </p>
          <h2
            className="text-[28px] font-bold text-[#121212] tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Abre tu sala en Nebbuler
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-6">
            US$19/mes fijo · 0% comisión sobre suscripciones · pagos en moneda local en {p.nombre}.
          </p>
          <Link href="/abrir" className="inline-block bg-[#121212] text-white text-[13px] font-medium px-6 py-3 hover:bg-[#2a2a2a]">
            Abrir mi sala →
          </Link>
        </div>
      </section>

      <section className="px-6 py-12 border-t border-[#DEDEDE]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666] font-medium mb-5">
            Otros nichos en {p.nombre}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {NICHOS.filter((x) => x.slug !== nicho).slice(0, 9).map((x) => (
              <Link key={x.slug} href={`/expertos/${x.slug}/${pais}`} className="block bg-white border border-[#DEDEDE] p-3 hover:border-[#121212]">
                <p className="text-[13px] font-medium text-[#121212]">{x.nombreMayus}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
