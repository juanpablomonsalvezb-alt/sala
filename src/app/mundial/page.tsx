import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'
import { MundialClient } from './_client'
import { SELECCIONES_LATAM, MUNDIAL, PROGRAMA_LA_SOMBRA } from '@/data/mundial-bootstrap'

export const revalidate = 3600

const TITLE = 'La Sombra · Programa Mundial 2026 para periodistas y creadores deportivos LATAM'
const DESCRIPTION =
  'Mientras Substack te cobra 10% y paga en dólares, Nebbuler te ofrece 0% comisión variable durante todo el Mundial 2026. Cobra en pesos a tu hinchada. Programa La Sombra: setup en 24h, sin comisión hasta el 31 de julio.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'mundial 2026 periodistas',
    'monetizar contenido futbol latam',
    'membresia periodista deportivo',
    'substack vs nebbuler futbol',
    'cobrar suscriptores futbol',
    'podcast futbol membresia',
    'analista tactico monetizar',
    'la sombra nebbuler mundial',
  ],
  alternates: { canonical: 'https://nebbuler.com/mundial' },
  openGraph: {
    title: 'La Sombra · 0% comisión durante el Mundial 2026',
    description:
      'Programa especial Nebbuler para periodistas y creadores deportivos LATAM. Cobrá en pesos. Setup en 24h.',
    url: 'https://nebbuler.com/mundial',
    type: 'website',
    images: [
      {
        url: '/api/og/mundial',
        width: 1200,
        height: 630,
        alt: 'La Sombra — Programa Mundial 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Sombra · Programa Mundial 2026',
    description: '0% comisión hasta el 31 de julio para creadores deportivos LATAM.',
  },
}

const JSON_LD_PROGRAMA = {
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: 'Programa La Sombra · Mundial 2026',
  description: DESCRIPTION,
  url: 'https://nebbuler.com/mundial',
  validFrom: '2026-05-21',
  validThrough: '2026-07-31',
  priceCurrency: 'USD',
  price: '0',
  seller: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  eligibleCustomerType: 'https://schema.org/BusinessEntity',
  itemOffered: {
    '@type': 'Service',
    name: 'Plataforma de membresías para creadores deportivos LATAM',
    provider: { '@type': 'Organization', name: 'Nebbuler' },
  },
}

const JSON_LD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es el Programa La Sombra de Nebbuler?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La Sombra es un programa especial de Nebbuler para periodistas, analistas y creadores deportivos LATAM durante el Mundial 2026. Ofrece 0% de comisión variable hasta el 31 de julio de 2026, setup gratuito en 24 horas y onboarding personalizado uno a uno con el fundador vía WhatsApp.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Quién puede aplicar al Programa La Sombra?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aplican periodistas deportivos independientes, analistas tácticos, ex-jugadores con podcast, YouTubers deportivos, cuentas dedicadas a clubes de fútbol y creadores con audiencia consolidada en cualquier país hispanohablante de LATAM. No hay mínimo de seguidores: priorizamos calidad de contenido y compromiso con la audiencia.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto puede ganar un periodista deportivo con membresías durante el Mundial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un analista táctico con 10.000 seguidores activos que convierte el 2% en suscriptores pagos a US$5/mes genera US$1.000 mensuales brutos. En Substack pagaría US$220 en comisiones + conversión cambiaria. En Nebbuler durante La Sombra paga US$0 en comisión variable. La diferencia neta: US$220/mes que se quedan con vos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué moneda cobra el creador y en cuál paga su audiencia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cada audiencia paga en su moneda local: pesos argentinos (ARS), pesos colombianos (COP), pesos mexicanos (MXN), soles peruanos (PEN), pesos chilenos (CLP), pesos uruguayos (UYU) o reales brasileños (BRL). El creador recibe en su cuenta local sin pérdida cambiaria. Eliminamos la doble conversión que cobran Substack y Patreon.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa después del 31 de julio de 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Después del Mundial, el creador pasa al plan estándar de Nebbuler (US$19/mes con tu propia moneda local convertida). No hay obligación de continuar. El creador conserva todos sus suscriptores y datos. La Sombra es un programa diseñado para que pruebes la plataforma durante el evento más importante del año sin riesgo.',
      },
    },
  ],
}

const JSON_LD_SPORTS_EVENT = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: 'Mundial 2026',
  description: 'Copa del Mundo de Fútbol 2026 organizada en Estados Unidos, México y Canadá',
  startDate: MUNDIAL.fecha_inicio,
  endDate: MUNDIAL.fecha_fin,
  location: MUNDIAL.sedes.map((sede) => ({ '@type': 'Country', name: sede })),
  sport: 'Soccer',
}

export default function MundialPage() {
  const dias = MUNDIAL.dias_para_inicio()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_PROGRAMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_FAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_SPORTS_EVENT) }} />

      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-[#C41C1C] rounded-full blur-[180px]" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#1C3FC4] rounded-full blur-[180px]" />
        </div>

        <header className="relative border-b border-white/10 backdrop-blur-md bg-black/40 z-10">
          <div className="h-[3px] bg-gradient-to-r from-[#C41C1C] via-white to-[#1C3FC4]" />
          <div className="py-3 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-xs text-white/60 tracking-[0.2em] uppercase">
                  La Sombra · Mundial 2026
                </span>
                <Link
                  href="#aplicar"
                  className="font-sans text-[12px] font-medium px-4 py-1.5 bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Aplicar al programa →
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-6xl mx-auto px-6 py-12 md:py-20 z-10">
          {/* HERO */}
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-[#C41C1C] text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                Programa especial
              </span>
              <span className="text-white/50 text-xs tracking-[0.15em] uppercase">
                Faltan {dias} días para el Mundial
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8">
              La Sombra.
            </h1>

            <p className="text-2xl md:text-3xl text-white/80 leading-tight mb-8 font-light">
              Mientras todos juegan en la luz del Mundial, tú cobras{' '}
              <span className="italic text-white font-medium">en silencio</span>, en tu moneda, sin
              que Silicon Valley se quede con un peso.
            </p>

            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-3xl">
              Programa Nebbuler para periodistas, analistas tácticos, podcasters y creadores
              deportivos LATAM. <strong className="text-white">0% comisión variable hasta el 31 de julio</strong>.
              Setup en 24h. Onboarding 1-a-1 con el fundador. Cobra en pesos a tu hinchada
              durante los 60 días que el mundo entero mira fútbol.
            </p>
          </div>

          {/* CALCULADORA */}
          <section id="calculadora" className="mb-20">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
                ¿Cuánto pagaría tu hinchada por tu análisis?
              </h2>
              <span className="hidden md:inline text-xs text-white/40 tracking-[0.2em] uppercase">
                Calculadora · 60 segundos
              </span>
            </div>
            <MundialClient />
          </section>

          {/* QUÉ INCLUYE */}
          <section className="mb-20 pt-12 border-t border-white/10">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Qué incluye el programa
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-12 tracking-tight">
              Todo gratis hasta el último partido.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROGRAMA_LA_SOMBRA.beneficios.map((beneficio, i) => (
                <div key={i} className="border border-white/10 p-6 hover:border-white/30 transition-colors">
                  <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="text-white text-base leading-relaxed">{beneficio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SELECCIONES LATAM */}
          <section className="mb-20 pt-12 border-t border-white/10">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Selecciones LATAM
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-12 tracking-tight">
              Cada selección, su propia economía de creadores.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SELECCIONES_LATAM.map((s) => (
                <Link
                  key={s.slug}
                  href={`/mundial/${s.slug}`}
                  className="group border border-white/10 p-6 hover:border-white/40 hover:bg-white/[0.02] transition-all"
                >
                  <p className="text-4xl mb-3">{s.bandera}</p>
                  <p className="font-serif text-xl mb-1">{s.pais}</p>
                  <p className="text-white/50 text-sm italic mb-3">{s.apodo}</p>
                  <p className="text-white/40 text-xs leading-relaxed mb-3">
                    {s.audiencia_estimada}
                  </p>
                  <p className="text-white/60 text-xs">
                    ~{s.creadores_potenciales} creadores potenciales
                  </p>
                  <p className="text-[#C41C1C] text-xs mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver creadores destacados →
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* APLICAR */}
          <section
            id="aplicar"
            className="pt-12 border-t border-white/10"
          >
            <div className="bg-gradient-to-br from-[#C41C1C]/30 via-[#1C3FC4]/20 to-transparent border border-white/20 p-8 md:p-14">
              <p className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Aplicar al programa
              </p>
              <h2 className="font-serif text-4xl md:text-6xl mb-6 tracking-tight leading-[1]">
                60 días.<br />
                <span className="italic text-white/70">Cero comisión.</span>
              </h2>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl">
                Te abrimos tu sala personalmente en menos de 24 horas. Sin formularios eternos.
                Sin pitch. Solo WhatsApp directo con el fundador.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/56992551416?text=Quiero%20aplicar%20al%20Programa%20La%20Sombra%20de%20Nebbuler%20para%20el%20Mundial%202026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 font-medium hover:bg-[#1ebd5b] transition-colors text-base"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Hablar por WhatsApp con el fundador
                </a>
                <Link
                  href="/abrir"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 font-medium hover:bg-white/5 transition-colors text-base"
                >
                  Abrir mi sala ahora →
                </Link>
              </div>
              <p className="text-white/40 text-xs mt-6 max-w-2xl">
                Programa válido para creadores deportivos LATAM. Setup gratis. 0% comisión variable
                hasta el 31 de julio de 2026. Después: plan estándar Nebbuler (US$19/mes en moneda
                local). Sin obligación de continuar.
              </p>
            </div>
          </section>
        </main>

        <footer className="relative border-t border-white/10 mt-16 py-8 px-6 z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/40">
            <p>
              © 2026 Nebbuler · La Sombra es un programa de Nebbuler. No afiliado con FIFA ni con
              el Mundial 2026 oficial.
            </p>
            <div className="flex gap-6">
              <Link href="/cuanto-te-quitan" className="hover:text-white">
                Calculadora general
              </Link>
              <Link href="/datos" className="hover:text-white">
                Datasets abiertos
              </Link>
              <Link href="/sobre" className="hover:text-white">
                Sobre Nebbuler
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
