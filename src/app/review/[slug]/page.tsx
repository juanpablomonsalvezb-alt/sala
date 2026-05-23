import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'

const REVIEWS: Record<string, {
  name: string
  year: string
  rating: number
  pros: string[]
  cons: string[]
  verdict: string
  bestFor: string
  latamScore: number
  commission: string
  price: string
}> = {
  'substack-2026': {
    name: 'Substack',
    year: '2026',
    rating: 3.5,
    pros: [
      'Marca reconocida globalmente',
      'Red de descubrimiento entre newsletters',
      'Interfaz simple de escritura',
      'Sin costo inicial para creadores',
    ],
    cons: [
      '10% de comisión sobre todos los ingresos',
      'Solo cobra en USD — conversión cambiaria cara para LATAM',
      'Stripe como único procesador (2.9% + $0.30 adicional)',
      'Sin soporte en español',
      'Audiencia LATAM paga recargo por conversión internacional',
      'Sin pagos en moneda local (CLP, COP, MXN, ARS)',
    ],
    verdict: 'Substack es excelente para creadores anglosajones con audiencia en USD. Para creadores latinoamericanos, la triple capa de comisiones (plataforma + Stripe + conversión cambiaria) resulta en pérdidas de 15-22% sobre ingresos brutos.',
    bestFor: 'Creadores en EE.UU./Europa con audiencia anglosajona',
    latamScore: 4,
    commission: '10% + Stripe 2.9% + conversión ~4-7%',
    price: 'Gratis (pero 10% de todo lo que ganes)',
  },
  'patreon-2026': {
    name: 'Patreon',
    year: '2026',
    rating: 3.0,
    pros: [
      'Pionero en membresías de creadores',
      'Sistema de tiers flexible',
      'Comunidad grande establecida',
      'Múltiples tipos de contenido (video, audio, texto)',
    ],
    cons: [
      '8-12% de comisión según plan',
      'Comisiones de procesamiento adicionales (2.9-5%)',
      'Solo USD — doble conversión para LATAM',
      'Interfaz anticuada comparada con alternativas modernas',
      'Sin soporte nativo en español',
      'Pérdida total para creadores LATAM: 13-20%',
    ],
    verdict: 'Patreon fue revolucionario en 2013. En 2026, sus comisiones acumuladas son prohibitivas para creadores fuera del mercado anglosajón. Un creador LATAM con $2,000 USD/mes pierde $260-400 USD mensuales solo en fees.',
    bestFor: 'Creadores de video/podcast en inglés con audiencia diversificada',
    latamScore: 3,
    commission: '8-12% + procesamiento 2.9-5% + conversión ~4-7%',
    price: 'Gratis (pero hasta 20% de tus ingresos)',
  },
  'beehiiv-2026': {
    name: 'Beehiiv',
    year: '2026',
    rating: 4.0,
    pros: [
      'Herramientas de crecimiento integradas (referrals, boosts)',
      'Sin comisión variable en planes pagos',
      'Analíticas avanzadas',
      'Red de monetización por publicidad',
      'Interfaz moderna y rápida',
    ],
    cons: [
      'Planes desde $49 USD/mes para funciones de monetización',
      'Solo Stripe (USD) — mismos problemas de conversión para LATAM',
      'Sin localización al español',
      'Enfocado en newsletters, no en membresías editoriales',
      'Funciones premium muy caras ($99-399 USD/mes)',
    ],
    verdict: 'Beehiiv es probablemente la mejor opción para newsletters en inglés en 2026. Para LATAM, el precio mínimo de $49 USD/mes más la falta de pagos locales lo hacen caro y friccional.',
    bestFor: 'Newsletters en inglés con monetización por publicidad',
    latamScore: 5,
    commission: '$0 variable pero $49-399/mes fijo + Stripe',
    price: '$49-399 USD/mes',
  },
  'gumroad-2026': {
    name: 'Gumroad',
    year: '2026',
    rating: 3.0,
    pros: [
      'Simple para vender productos digitales',
      'Sin costo mensual fijo',
      'Apto para ebooks, cursos, templates',
    ],
    cons: [
      '10% de comisión sobre cada venta',
      'Solo pagos en USD',
      'No diseñado para membresías recurrentes',
      'Sin herramientas de contenido editorial',
      'Conversión cambiaria afecta a compradores LATAM',
    ],
    verdict: 'Gumroad funciona para ventas puntuales de productos digitales. No está diseñado para ingresos recurrentes por membresías editoriales, y su 10% de comisión es difícil de justificar en 2026.',
    bestFor: 'Creadores vendiendo ebooks o templates ocasionalmente',
    latamScore: 3,
    commission: '10% + procesamiento',
    price: 'Gratis (pero 10% por venta)',
  },
  'kajabi-2026': {
    name: 'Kajabi',
    year: '2026',
    rating: 3.5,
    pros: [
      'Plataforma todo-en-uno (cursos, membresías, email)',
      'Sin comisión variable',
      'Herramientas de marketing incluidas',
      'Funnels de venta integrados',
    ],
    cons: [
      'Desde $149 USD/mes — prohibitivo para creadores LATAM en etapa inicial',
      'Solo Stripe/PayPal (USD)',
      'Curva de aprendizaje alta',
      'Sin localización al español',
      'Overkill para quienes solo necesitan membresías editoriales',
    ],
    verdict: 'Kajabi es potente pero excesivamente caro. A $149+ USD/mes, un creador LATAM necesita facturar al menos $1,500 USD/mes solo para que el costo de plataforma sea razonable.',
    bestFor: 'Coaches y educadores en inglés con facturación >$5K USD/mes',
    latamScore: 2,
    commission: '0% variable pero $149-399/mes fijo',
    price: '$149-399 USD/mes',
  },
  'hotmart-2026': {
    name: 'Hotmart',
    year: '2026',
    rating: 3.5,
    pros: [
      'Presencia fuerte en Brasil y LATAM',
      'Acepta pagos en monedas locales (BRL, MXN)',
      'Marketplace con tráfico orgánico',
      'Sistema de afiliados potente',
      'Soporte en español y portugués',
    ],
    cons: [
      '9.9% de comisión + procesamiento',
      'Enfocado en infoproductos/cursos, no en contenido editorial recurrente',
      'Interfaz compleja y sobrecargada',
      'Asociado con marketing agresivo de "gurús"',
      'No ideal para profesionales serios (abogados, economistas)',
    ],
    verdict: 'Hotmart entiende LATAM pero está diseñado para cursos y productos digitales con marketing agresivo. No es el mejor hogar para profesionales que publican análisis y opinión editorial recurrente.',
    bestFor: 'Infoproductores y creadores de cursos en Brasil/México',
    latamScore: 6,
    commission: '9.9% + procesamiento ~5%',
    price: 'Gratis (pero ~15% por venta)',
  },
}

export function generateStaticParams() {
  return Object.keys(REVIEWS).map(slug => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const review = REVIEWS[slug]
  if (!review) return {}

  return {
    title: `${review.name} Review ${review.year} — Opinión Honesta para Creadores LATAM`,
    description: `Review independiente de ${review.name} en ${review.year}. ${review.rating}/5 para creadores latinoamericanos. Pros, contras, comisiones reales y alternativas.`,
    alternates: { canonical: `https://nebbuler.com/review/${slug}` },
    openGraph: {
      title: `${review.name} Review ${review.year} — ¿Vale la pena para LATAM?`,
      description: review.verdict.slice(0, 160),
      url: `https://nebbuler.com/review/${slug}`,
    },
  }
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const review = REVIEWS[slug]
  if (!review) notFound()

  const stars = '★'.repeat(Math.floor(review.rating)) + (review.rating % 1 ? '½' : '') + '☆'.repeat(5 - Math.ceil(review.rating))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: review.name,
      applicationCategory: 'BusinessApplication',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
    },
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
    datePublished: '2026-05-23',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <header className="border-b border-[#E5E5E5]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-lg font-bold tracking-tight">NEBBULER</Link>
            <Link href="/abrir" className="text-xs font-medium px-4 py-1.5 bg-black text-white hover:bg-black/80">
              Abrir mi sala →
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Review independiente · {review.year}
          </p>

          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4">
            {review.name} Review {review.year}
          </h1>

          <p className="text-lg text-black/60 mb-6">
            Opinión honesta para creadores y profesionales en Latinoamérica.
          </p>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#E5E5E5]">
            <span className="text-4xl font-bold">{review.rating}</span>
            <div>
              <p className="text-[#C41C1C] text-lg tracking-wider">{stars}</p>
              <p className="text-xs text-black/40">de 5 · Para creadores LATAM: {review.latamScore}/10</p>
            </div>
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-[#F8F7F5] p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-1">Comisión real</p>
              <p className="text-sm font-semibold">{review.commission}</p>
            </div>
            <div className="bg-[#F8F7F5] p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-1">Precio</p>
              <p className="text-sm font-semibold">{review.price}</p>
            </div>
            <div className="bg-[#F8F7F5] p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-1">Mejor para</p>
              <p className="text-sm">{review.bestFor}</p>
            </div>
            <div className="bg-[#F8F7F5] p-4">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-black/40 mb-1">Score LATAM</p>
              <p className="text-sm font-semibold">{review.latamScore}/10</p>
            </div>
          </div>

          {/* Pros */}
          <h2 className="font-serif text-xl font-bold mb-4">Lo bueno de {review.name}</h2>
          <ul className="space-y-2 mb-8">
            {review.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                {pro}
              </li>
            ))}
          </ul>

          {/* Cons */}
          <h2 className="font-serif text-xl font-bold mb-4">Lo malo de {review.name} para LATAM</h2>
          <ul className="space-y-2 mb-8">
            {review.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                <span className="text-[#C41C1C] font-bold mt-0.5">✗</span>
                {con}
              </li>
            ))}
          </ul>

          {/* Verdict */}
          <div className="bg-[#0A0A0A] text-white p-6 md:p-8 mb-10">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Veredicto</p>
            <p className="text-base leading-relaxed">{review.verdict}</p>
          </div>

          {/* vs Nebbuler */}
          <h2 className="font-serif text-xl font-bold mb-4">{review.name} vs Nebbuler</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-3 text-left font-semibold">Criterio</th>
                  <th className="py-3 text-center font-semibold">{review.name}</th>
                  <th className="py-3 text-center font-semibold text-[#C41C1C]">Nebbuler</th>
                </tr>
              </thead>
              <tbody className="text-black/70">
                <tr className="border-b border-black/10">
                  <td className="py-3">Comisión variable</td>
                  <td className="py-3 text-center">{review.commission.split('+')[0].trim()}</td>
                  <td className="py-3 text-center font-semibold text-green-700">0%</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3">Moneda local LATAM</td>
                  <td className="py-3 text-center">❌ Solo USD</td>
                  <td className="py-3 text-center font-semibold text-green-700">✅ CLP, COP, MXN, ARS, PEN</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3">Costo mensual</td>
                  <td className="py-3 text-center">{review.price}</td>
                  <td className="py-3 text-center font-semibold">US$19/mes</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3">Soporte en español</td>
                  <td className="py-3 text-center">❌</td>
                  <td className="py-3 text-center font-semibold text-green-700">✅</td>
                </tr>
                <tr>
                  <td className="py-3">Score LATAM</td>
                  <td className="py-3 text-center">{review.latamScore}/10</td>
                  <td className="py-3 text-center font-bold text-green-700">9/10</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="text-center py-10 border-t border-[#E5E5E5]">
            <p className="text-black/50 text-sm mb-4">
              ¿Buscas una alternativa a {review.name} para LATAM?
            </p>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-2 bg-[#C41C1C] text-white px-8 py-3 font-semibold hover:bg-[#A51616] transition-colors"
            >
              Probar Nebbuler gratis →
            </Link>
            <p className="text-xs text-black/30 mt-3">
              US$19/mes · 0% comisión · Pagos en moneda local
            </p>
          </div>

          {/* Related */}
          <div className="pt-8 border-t border-[#E5E5E5]">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-black/40 mb-4">Otras reviews</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(REVIEWS).filter(([s]) => s !== slug).map(([s, r]) => (
                <Link key={s} href={`/review/${s}`} className="text-xs px-3 py-1.5 border border-[#E5E5E5] hover:border-black/30 transition-colors">
                  {r.name} Review {r.year}
                </Link>
              ))}
              <Link href="/cuanto-te-quitan" className="text-xs px-3 py-1.5 border border-[#C41C1C] text-[#C41C1C] hover:bg-[#C41C1C] hover:text-white transition-colors">
                Calculadora de pérdida →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
