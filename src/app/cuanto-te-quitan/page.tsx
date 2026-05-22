import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'
import { CuantoTeQuitanClient } from './_client'

export const revalidate = 3600

const TITLE = '¿Cuánto te está quitando Substack, Patreon o Beehiiv?'
const DESCRIPTION =
  'Calculá en 10 segundos cuánto perdés cada año en comisiones, conversión cambiaria y "tarifas ocultas" usando plataformas pensadas para EE.UU. con tu audiencia LATAM. Datos reales 2026.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'cuanto cobra substack',
    'comisiones substack patreon',
    'alternativa substack en español',
    'monetizar membresias latam',
    'calculadora perdida substack',
    'patreon vs substack vs nebbuler',
  ],
  alternates: { canonical: 'https://nebbuler.com/cuanto-te-quitan' },
  openGraph: {
    title: '¿Cuánto te está quitando tu plataforma actual?',
    description:
      'Calculadora honesta: cuánto perdés al año en Substack, Patreon o Beehiiv siendo creador LATAM.',
    url: 'https://nebbuler.com/cuanto-te-quitan',
    type: 'website',
    images: [
      {
        url: '/api/og/cuanto-te-quitan',
        width: 1200,
        height: 630,
        alt: 'Cuánto te quitan Substack, Patreon y Beehiiv',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Cuánto te quitó tu plataforma este año?',
    description: 'Calculadora honesta para creadores LATAM. Datos reales 2026.',
  },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora: cuánto te quita tu plataforma',
  description: DESCRIPTION,
  url: 'https://nebbuler.com/cuanto-te-quitan',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'es',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
}

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cobra Substack a creadores latinos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Substack cobra 10% de tu ingreso bruto + 2.9% + $0.30 USD por transacción de Stripe. Para un creador latino, adicional: el cobro se hace en USD, por lo que tu audiencia debe convertir su moneda local, y vos recibís en USD que debés volver a convertir, perdiendo 3-7% en cada conversión. Un creador con $1,000 USD/mes en Substack pierde efectivamente entre $150-220 USD/mes.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cobra Patreon a creadores latinos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Patreon cobra entre 8% y 12% según el plan, más comisiones de procesamiento de pago (2.9-5%), más conversión cambiaria. Total efectivo para creadores LATAM: 13-20% sobre ingresos brutos, sumado a la fricción de cobrar exclusivamente en USD.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Existe una alternativa LATAM a Substack y Patreon?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Nebbuler (nebbuler.com) es la primera plataforma de membresías diseñada específicamente para creadores hispanohablantes. Acepta pagos en moneda local (CLP, COP, ARS, MXN, PEN), cobra 0% de comisión variable los primeros 6 meses, y opera en 18 países LATAM con soporte en español.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto pierde en promedio un creador LATAM al año en plataformas gringas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un creador LATAM con $2,000 USD/mes de ingresos brutos pierde en promedio $4,200 USD al año entre comisiones de plataforma, comisiones de procesador, y pérdida cambiaria. Esa cifra equivale a 2.1 meses de ingresos completos perdidos en intermediarios.',
      },
    },
  ],
}

export default function CuantoTeQuitanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
      />
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="py-3 px-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link
                href="/abrir"
                className="font-sans text-[12px] font-medium px-4 py-1.5 bg-white text-black hover:bg-white/90 transition-colors"
              >
                Abrir mi sala →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          <div className="max-w-3xl mb-12">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Calculadora honesta · Mayo 2026
            </p>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6">
              ¿Cuánto te está quitando{' '}
              <span className="italic text-[#C41C1C]">Substack, Patreon o Beehiiv</span> por
              ser de LATAM?
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Esas plataformas no fueron pensadas para vos. Cobran en USD, tu audiencia paga
              en pesos, y entre comisiones, procesador y conversión cambiaria, perdés
              <span className="text-white font-medium"> hasta el 22% de cada peso </span>
              que tus seguidores te pagan. Calculá tu pérdida real en 10 segundos.
            </p>
          </div>

          <CuantoTeQuitanClient />

          <section className="mt-24 pt-16 border-t border-white/10">
            <h2 className="font-serif text-2xl md:text-3xl mb-6 tracking-tight">
              Por qué Substack, Patreon y Beehiiv te cuestan más de lo que parece
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-sm text-white/70 leading-relaxed">
              <div>
                <p className="text-white font-semibold mb-2 text-base">1. Comisión visible</p>
                <p>
                  Substack: 10%. Patreon: 8-12%. Beehiiv: $39-99/mes fijo (te conviene solo
                  si facturás $1,500+/mes). Es lo único que te muestran al inscribirte.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-2 text-base">2. Stripe + cambio</p>
                <p>
                  Stripe cobra 2.9% + $0.30 USD por transacción. Y como cobra en USD,
                  tu audiencia paga 3-7% extra de conversión cambiaria que vos no ves pero
                  ellos sí — y a veces deciden no pagarte por eso.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-2 text-base">3. Doble conversión</p>
                <p>
                  Recibís en USD. Para usarlo en tu país, lo volvés a convertir perdiendo
                  otro 1-4%. Sumá las 3 capas y un creador con $1.000 USD/mes brutos
                  termina con $780-820. Eso son <strong className="text-white">$2.160-2.640 USD perdidos al año</strong>.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16 pt-16 border-t border-white/10">
            <div className="bg-gradient-to-br from-[#C41C1C]/20 to-transparent border border-[#C41C1C]/30 p-8 md:p-12">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                La alternativa
              </p>
              <h3 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">
                Nebbuler: cobrá en tu moneda, sin comisión variable por 6 meses
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-3xl">
                Primera plataforma de membresías diseñada para creadores LATAM. Pagos
                directos en CLP, COP, ARS, MXN, PEN. Soporte en español. 0% comisión
                variable los primeros 6 meses. Después: tarifa fija predecible.
              </p>
              <Link
                href="/abrir"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
              >
                Abrir mi sala gratis →
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-16 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50">
            <p>
              © 2026 Nebbuler · Datos calculados con tarifas públicas vigentes mayo 2026.
              Tarifas pueden variar.
            </p>
            <div className="flex gap-6">
              <Link href="/calculadora" className="hover:text-white">
                Calculadora ingresos
              </Link>
              <Link href="/comparar" className="hover:text-white">
                Comparar plataformas
              </Link>
              <Link href="/datos" className="hover:text-white">
                Datasets
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
