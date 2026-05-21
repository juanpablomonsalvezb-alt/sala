import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import { ALTERNATIVES, PageFooter } from './_shared'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Alternativas a Substack, Patreon, Beehiiv y Gumroad para LATAM',
  description:
    'Comparativas honestas entre Nebbuler y las principales plataformas de creadores. Pricing real, monedas locales, soporte en español y calculadora de ahorro para Latinoamérica.',
  keywords: [
    'alternativas substack español',
    'alternativa patreon latam',
    'beehiiv en español',
    'gumroad creadores latam',
    'medium pago español',
    'plataforma membresías latam',
  ],
  alternates: { canonical: 'https://nebbuler.com/alternativas' },
  openGraph: {
    title: 'Alternativas a Substack, Patreon, Beehiiv y Gumroad para LATAM',
    description:
      '0% comisión variable, pagos en pesos, soles y reales. Comparativas reales con cifras 2026.',
    url: 'https://nebbuler.com/alternativas',
    type: 'website',
    images: [
      {
        url: `/api/og/page?title=${encodeURIComponent('Alternativas para creadores LATAM')}&kicker=${encodeURIComponent('Comparativas 2026')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alternativas a Substack, Patreon, Beehiiv y Gumroad',
    description: '0% comisión variable. Pagos en moneda local. Soporte en español.',
  },
}

export default function AlternativasIndex() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Alternativas de Nebbuler para creadores LATAM',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: ALTERNATIVES.length,
    itemListElement: ALTERNATIVES.map((alt, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://nebbuler.com/alternativas/${alt.slug}`,
      name: alt.h1,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Alternativas',
        item: 'https://nebbuler.com/alternativas',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#EAEAEA] py-3 px-6 bg-[#FAFAF7]"
      >
        <div className="max-w-3xl mx-auto font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]">
          <Link href="/" className="hover:text-[#121212]">
            Inicio
          </Link>{' '}
          <span className="px-2 text-[#CCC]">›</span>
          <span className="text-[#121212]">Alternativas</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-[#DEDEDE] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-label mb-3">COMPARATIVAS</p>
          <hr className="nyt-rule mb-8" />
          <h1 className="font-serif text-[48px] md:text-[68px] font-bold text-[#121212] leading-[1.02] tracking-[-0.025em] mb-6">
            Comparativas honestas con
            <br />
            <em className="text-[#C41C1C] not-italic font-bold">otras plataformas</em>.
          </h1>
          <p className="font-serif text-[20px] md:text-[22px] italic text-[#444] leading-[1.55] mb-4 max-w-2xl">
            Substack, Patreon, Beehiiv, Gumroad, Medium. Cinco plataformas dominantes — todas
            diseñadas para el mercado anglo. Aquí mostramos cuándo conviene migrar a Nebbuler y
            cuándo no.
          </p>
          <p className="font-sans text-[14px] text-[#666] max-w-2xl leading-[1.7]">
            Cifras reales actualizadas a 2026. Sin asteriscos, sin trampas, sin "consultar
            condiciones".
          </p>
        </div>
      </section>

      {/* Grid de cards */}
      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {ALTERNATIVES.map((alt) => (
              <Link
                key={alt.slug}
                href={`/alternativas/${alt.slug}`}
                className="group block border border-[#DEDEDE] bg-white p-8 hover:border-[#121212] transition-colors duration-150"
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#C41C1C] mb-3">
                  Nebbuler vs {alt.competitor}
                </p>
                <h2 className="font-serif text-[26px] md:text-[28px] font-bold text-[#121212] leading-[1.15] mb-4 tracking-[-0.01em] group-hover:text-[#C41C1C] transition-colors duration-150">
                  {alt.h1}
                </h2>
                <p className="font-sans text-[14px] text-[#555] leading-[1.7] mb-5">
                  {alt.summary}
                </p>
                <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#121212] border-b border-[#121212] pb-[2px]">
                  Leer comparativa →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bloque de credibilidad */}
      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <span className="section-label mb-3 inline-block">EN POCAS PALABRAS</span>
          <hr className="nyt-rule mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="font-serif text-[40px] font-bold text-[#121212] leading-none mb-2">
                US$19
              </p>
              <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#666] leading-[1.6]">
                Tarifa fija mensual. Sin importar cuántos suscriptores cobres.
              </p>
            </div>
            <div>
              <p className="font-serif text-[40px] font-bold text-[#121212] leading-none mb-2">
                0<span className="text-[#C41C1C]">%</span>
              </p>
              <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#666] leading-[1.6]">
                Comisión variable sobre tus ingresos. Te quedas con el 100%.
              </p>
            </div>
            <div>
              <p className="font-serif text-[40px] font-bold text-[#121212] leading-none mb-2">
                17
              </p>
              <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#666] leading-[1.6]">
                Monedas locales aceptadas. CLP, MXN, ARS, COP, PEN, BRL y más.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Links cruzados */}
      <section className="border-b border-[#DEDEDE] py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="section-label mb-3 inline-block">SEGUIR EXPLORANDO</span>
          <hr className="nyt-rule mb-6" />
          <ul className="font-serif text-[18px] text-[#333] leading-[2] list-none">
            <li>
              ·{' '}
              <Link href="/comparar" className="underline hover:text-[#C41C1C]">
                Comparativa general Nebbuler vs Substack vs Patreon
              </Link>
            </li>
            <li>
              ·{' '}
              <Link href="/migrar-desde" className="underline hover:text-[#C41C1C]">
                Guías paso a paso para migrar de cualquier plataforma
              </Link>
            </li>
            <li>
              ·{' '}
              <Link href="/calculadora" className="underline hover:text-[#C41C1C]">
                Calculadora: cuánto pierdes en comisiones cada mes
              </Link>
            </li>
            <li>
              ·{' '}
              <Link href="/precios" className="underline hover:text-[#C41C1C]">
                Precios de Nebbuler — un plan, US$19 fijos
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
