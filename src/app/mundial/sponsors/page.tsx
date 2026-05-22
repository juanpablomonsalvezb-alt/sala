import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'
import { SPONSORS, TOTALES, COMPARATIVA } from '@/data/mundial-sponsors-bootstrap'

export const revalidate = 3600

const TITLE = 'Los sponsors del Mundial 2026 pagaron US$1.000M. Vos pagás 10% a Substack.'
const DESCRIPTION =
  'Análisis honesto de cuánto pagaron los sponsors oficiales del Mundial 2026 vs lo que Substack y Patreon cobran a creadores LATAM. Datos públicos de Bloomberg, FT y SportBusiness.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'sponsors mundial 2026',
    'patrocinadores fifa 2026',
    'cuanto paga coca cola mundial',
    'cuanto paga adidas mundial',
    'sponsors oficiales fifa',
    'substack comision creadores',
  ],
  alternates: { canonical: 'https://nebbuler.com/mundial/sponsors' },
  openGraph: {
    title: 'Los sponsors del Mundial pagaron US$1.000M · vos pierdes 22%',
    description: 'Análisis del dinero corporativo del Mundial 2026 vs lo que pierdes en Substack.',
    url: 'https://nebbuler.com/mundial/sponsors',
    type: 'article',
    images: [{ url: '/api/og/mundial', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const fmtMillones = (n: number) => `US$${(n / 1_000_000).toFixed(0)}M`

const ARTICLE_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: '2026-05-22',
  dateModified: new Date().toISOString().split('T')[0],
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  inLanguage: 'es',
}

export default function SponsorsPage() {
  const partners = SPONSORS.filter((s) => s.categoria === 'FIFA Partner')
  const sponsors = SPONSORS.filter((s) => s.categoria === 'FIFA World Cup Sponsor')
  const regionales = SPONSORS.filter((s) => s.categoria === 'Regional Supporter Americas')
  const creadoresNecesarios = COMPARATIVA.un_partner_substack_creadores_necesarios()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(ARTICLE_LD) }} />
      <div className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link href="/mundial" className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase">
                ← La Sombra
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <nav className="text-xs text-white/40 mb-6">
            <Link href="/mundial" className="hover:text-white">Mundial 2026</Link> / <span>Sponsors</span>
          </nav>

          <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Análisis · Mayo 2026
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-8">
            Los sponsors del Mundial 2026 pagaron{' '}
            <span className="italic text-[#C41C1C]">{fmtMillones(TOTALES.monto_total_estimado_usd)}</span>.
            <br />
            Vos pagás 10% a Substack.
          </h1>

          <p className="text-xl text-white/70 leading-relaxed mb-10">
            Cuando termine el Mundial 2026, FIFA habrá recaudado{' '}
            <strong className="text-white">~{fmtMillones(TOTALES.monto_total_estimado_usd)}</strong> de los{' '}
            <strong className="text-white">{TOTALES.sponsors_total} sponsors corporativos</strong> que pelean por aparecer
            al lado del torneo. Mientras tanto, vos —que generás el contenido que la gente realmente quiere consumir—
            cedés <strong className="text-white">22% de tus ingresos</strong> a plataformas que ni siquiera operan en
            tu país.
          </p>

          {/* DATO GIGANTE */}
          <section className="bg-gradient-to-br from-[#C41C1C]/30 to-transparent border border-[#C41C1C]/30 p-8 md:p-12 mb-16">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">El cálculo absurdo</p>
            <p className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-tight mb-4">
              Substack necesita parasitar a{' '}
              <span className="italic">{creadoresNecesarios.toLocaleString('es-CL')} creadores</span>{' '}
              latinoamericanos durante un año para igualar lo que pagó UN solo sponsor FIFA Partner.
            </p>
            <p className="text-white/60 text-sm">
              Cálculo: un creador con 200 suscriptores a US$5/mes paga ~US$1.200/año en comisiones. Multiplicado por{' '}
              {creadoresNecesarios.toLocaleString('es-CL')} = US$100M. Lo que paga Coca-Cola o Adidas por estar al
              lado de la final.
            </p>
          </section>

          {/* PARTNERS */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-2">
              FIFA Partners ({partners.length})
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Tier máximo. Pagan ~US$80-150M por ciclo de 4 años. Logo en todo: estadios, transmisión, balón, app.
            </p>
            <div className="space-y-2">
              {partners.map((s) => (
                <SponsorRow key={s.nombre} sponsor={s} />
              ))}
            </div>
          </section>

          {/* SPONSORS */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-2">
              FIFA World Cup Sponsors ({sponsors.length})
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Tier de torneo. ~US$50-75M. Activaciones específicas para el Mundial 2026.
            </p>
            <div className="space-y-2">
              {sponsors.map((s) => (
                <SponsorRow key={s.nombre} sponsor={s} />
              ))}
            </div>
          </section>

          {/* REGIONALES */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-2">
              Regional Supporters Americas ({regionales.length})
            </h2>
            <p className="text-white/50 text-sm mb-6">
              ~US$20-40M para regiones específicas. Mercado Libre es el único top latinoamericano.
            </p>
            <div className="space-y-2">
              {regionales.map((s) => (
                <SponsorRow key={s.nombre} sponsor={s} />
              ))}
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="pt-12 border-t border-white/10">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
              No puedes competir con Coca-Cola. Pero puedes <span className="italic">no perder ante Substack</span>.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-3xl">
              Durante el Mundial 2026, Nebbuler ofrece el Programa La Sombra:{' '}
              <strong className="text-white">0% comisión variable hasta el 31 de julio</strong>, pagos en pesos a tu
              hinchada, setup en 24h. No puedes pagar US$100M para aparecer en la final, pero puedes conservar
              cada peso que tu audiencia te paga.
            </p>
            <Link
              href="/mundial#aplicar"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-medium hover:bg-white/90 transition-colors"
            >
              Aplicar a La Sombra →
            </Link>
          </section>

          <section className="mt-16 pt-8 border-t border-white/10">
            <p className="text-xs text-white/40 leading-relaxed">
              <strong className="text-white/70">Metodología:</strong> Los montos exactos pagados por sponsors FIFA no
              son públicos. Las cifras son estimaciones cruzadas de filtraciones publicadas en Bloomberg, Financial
              Times, SportBusiness, Forbes y entrevistas con ejecutivos de marketing deportivo. Nebbuler no está
              afiliado con FIFA ni con ninguno de los sponsors mencionados.
            </p>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-12 py-8 px-6">
          <div className="max-w-4xl mx-auto text-xs text-white/40">
            <p>© 2026 Nebbuler · No afiliado con FIFA, Mundial 2026 oficial ni ninguno de los sponsors mencionados.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

function SponsorRow({ sponsor: s }: { sponsor: (typeof SPONSORS)[number] }) {
  return (
    <div className="border border-white/10 p-4 hover:border-white/30 transition-colors flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="font-medium">{s.nombre}</p>
        <p className="text-xs text-white/50">
          {s.sector} · {s.pais_origen}
          {s.desde ? ` · desde ${s.desde}` : ''}
        </p>
        {s.notas && <p className="text-xs text-white/40 mt-1 italic">{s.notas}</p>}
      </div>
      <div className="text-right">
        <p className="font-mono text-sm text-[#C41C1C]">
          {s.monto_estimado_usd ? fmtMillones(s.monto_estimado_usd) : 'no público'}
        </p>
        <p className="text-[10px] text-white/40 tracking-wide uppercase">estimado</p>
      </div>
    </div>
  )
}
