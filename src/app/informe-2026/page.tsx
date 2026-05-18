import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Estado de la Creator Economy LATAM 2026 — Informe Nebbuler',
  description:
    'Primer informe sintético sobre el estado de la creator economy en América Latina hispanohablante. Tamaño de mercado, fricciones de pago, comparativa de plataformas y proyección 2030. Datos públicos consolidados + análisis de Nebbuler.',
  keywords: [
    'creator economy latam',
    'creator economy america latina',
    'informe creator economy 2026',
    'monetización contenido latam estudio',
    'mercado creator economy hispanohablante',
  ],
  alternates: { canonical: 'https://nebbuler.com/informe-2026' },
  openGraph: {
    title: 'Estado de la Creator Economy LATAM 2026',
    description: 'Tamaño de mercado, fricciones, plataformas y proyección. Datos para journalists, investigadores y operadores del ecosistema.',
    url: 'https://nebbuler.com/informe-2026',
    type: 'article',
    images: [
      {
        url: '/api/og/page?title=' + encodeURIComponent('Estado de la Creator Economy LATAM 2026') + '&kicker=' + encodeURIComponent('Informe Nebbuler') + '&accent=' + encodeURIComponent('US$38B → 112B · 18 países · datos abiertos'),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Estado de la Creator Economy LATAM 2026',
    description: 'Informe abierto · datos para citar · publicación libre',
  },
}

const REPORT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Report',
  name: 'Estado de la Creator Economy en América Latina 2026',
  abstract: 'Análisis del estado de la creator economy en los 18 países hispanohablantes de América Latina: tamaño de mercado, principales plataformas, fricciones de pago, modelos de monetización y proyección 2030.',
  datePublished: '2026-05-17',
  inLanguage: 'es',
  url: 'https://nebbuler.com/informe-2026',
  author: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  publisher: { '@type': 'Organization', name: 'Nebbuler' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
  isAccessibleForFree: true,
  keywords: 'creator economy, América Latina, monetización, Substack, Patreon, MercadoPago, fricción de pago, suscripciones',
}

const DATASET_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Tamaño y proyección de la creator economy en América Latina',
  description: 'Estimación del tamaño del mercado de creator economy en los 18 países hispanohablantes de América Latina entre 2022 y 2030.',
  url: 'https://nebbuler.com/informe-2026',
  creator: { '@type': 'Organization', name: 'Nebbuler' },
  spatialCoverage: { '@type': 'Place', name: 'América Latina hispanohablante' },
  temporalCoverage: '2022-01-01/2030-12-31',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  isAccessibleForFree: true,
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'Tamaño de mercado 2022', value: 38500000000, unitText: 'USD' },
    { '@type': 'PropertyValue', name: 'Tamaño de mercado proyectado 2030', value: 112700000000, unitText: 'USD' },
    { '@type': 'PropertyValue', name: 'Tasa de crecimiento anual compuesto (CAGR)', value: 19.7, unitText: '%' },
  ],
}

export default function Informe2026() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(REPORT_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(DATASET_JSONLD) }} />

      <div className="min-h-screen bg-white">
        <header>
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="border-b border-[#DEDEDE] py-3 px-6">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
              <Link href="/abrir" className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">
                Abrir mi sala →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <p className="font-sans text-[11px] font-bold tracking-[0.25em] uppercase text-[#C41C1C] mb-3">
            Informe Nebbuler · Mayo 2026
          </p>
          <h1 className="font-serif text-[3rem] font-bold text-[#121212] leading-[1.05] mb-6">
            Estado de la Creator Economy en América Latina
          </h1>
          <p className="font-sans text-[18px] text-[#444] leading-relaxed mb-12">
            Primer informe sintético sobre la economía del creador en los 18 países hispanohablantes
            de América Latina. Datos públicos consolidados, fricciones documentadas, plataformas vigentes
            y proyección 2030. Publicado bajo licencia Creative Commons BY 4.0 — citable y reutilizable.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-16 text-center">
            <div className="bg-[#FFFBE6] p-6 border border-[#E0CC50]">
              <p className="font-serif text-[2rem] font-bold">US$38B</p>
              <p className="text-[11px] uppercase tracking-wider text-[#666] mt-1">Mercado 2022</p>
            </div>
            <div className="bg-[#FFFBE6] p-6 border border-[#E0CC50]">
              <p className="font-serif text-[2rem] font-bold">US$112B</p>
              <p className="text-[11px] uppercase tracking-wider text-[#666] mt-1">Proyección 2030</p>
            </div>
            <div className="bg-[#FFFBE6] p-6 border border-[#E0CC50]">
              <p className="font-serif text-[2rem] font-bold">19,7%</p>
              <p className="text-[11px] uppercase tracking-wider text-[#666] mt-1">CAGR</p>
            </div>
          </div>

          <section className="prose-content mb-12">
            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">1. Resumen ejecutivo</h2>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              La creator economy en América Latina hispanohablante crecerá de aproximadamente US$38.500
              millones en 2022 a US$112.700 millones hacia 2030, con una tasa anual compuesta de 19,7%
              según estimaciones de Mobility Foresights. A pesar de este crecimiento, el mercado está
              significativamente subatendido por las plataformas globales (Substack, Patreon, Beehiiv,
              Gumroad), que operan en USD y cobran comisiones diseñadas para audiencias anglosajonas.
            </p>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              El resultado: profesionales hispanohablantes con audiencia local terminan publicando
              gratis en LinkedIn o vendiendo cursos en plataformas como Hotmart, perdiendo el modelo
              de membresía recurrente que en EE.UU. se consolidó vía Substack.
            </p>

            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">2. Fricciones documentadas</h2>
            <h3 className="font-serif text-[1.2rem] font-bold mb-2 mt-6">2.1. Fricción cambiaria</h3>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              Las plataformas globales operan principalmente en USD. Un suscriptor en Bogotá pagando
              US$5 a un newsletter colombiano paga adicionalmente entre 1,5% y 4% de recargo internacional
              de su banco, más la diferencia entre tipo de cambio oficial y de la tarjeta. El costo
              efectivo para el lector LATAM es 8-15% superior al nominal en USD.
            </p>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              En países con control cambiario estricto (Argentina, Venezuela), el acceso a estos pagos
              está limitado por cupos o requiere fricciones administrativas que reducen la conversión a
              menos del 20% comparado con mercados sin control.
            </p>

            <h3 className="font-serif text-[1.2rem] font-bold mb-2 mt-6">2.2. Procesamiento de pagos</h3>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              Stripe, procesador estándar de Substack/Patreon/Beehiiv/Gumroad, no opera en Venezuela,
              Bolivia, Cuba ni Paraguay; opera con limitaciones en Argentina. Los procesadores locales
              (MercadoPago, PayU, Kushki, Khipu, dLocal) cubren la región pero suelen aplicar
              comisiones de 3-6% combinado con tarifas fijas por transacción.
            </p>

            <h3 className="font-serif text-[1.2rem] font-bold mb-2 mt-6">2.3. Fragmentación regulatoria</h3>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              Cada país tiene su propio régimen tributario para ingresos digitales: México (SAT, RIF/RESICO),
              Colombia (DIAN, régimen simplificado), Argentina (AFIP, monotributo), Chile (SII, boleta de
              honorarios). Un creador que quiere operar regional debe inscribirse en cada jurisdicción
              donde tiene suscriptores con monto facturable, generando una complejidad operativa que
              suele inhibir la expansión.
            </p>

            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">3. Comparativa de plataformas</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#121212]">
                    <th className="text-left py-3 px-2">Plataforma</th>
                    <th className="text-left py-3 px-2">Comisión variable</th>
                    <th className="text-left py-3 px-2">Moneda local LATAM</th>
                    <th className="text-left py-3 px-2">Idioma</th>
                  </tr>
                </thead>
                <tbody className="text-[#444]">
                  <tr className="border-b border-[#DEDEDE]"><td className="py-2 px-2 font-bold">Substack</td><td className="py-2 px-2">10%</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Inglés</td></tr>
                  <tr className="border-b border-[#DEDEDE]"><td className="py-2 px-2 font-bold">Patreon</td><td className="py-2 px-2">5–12%</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Inglés/parcial</td></tr>
                  <tr className="border-b border-[#DEDEDE]"><td className="py-2 px-2 font-bold">Beehiiv</td><td className="py-2 px-2">US$39/mes + Stripe</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Inglés</td></tr>
                  <tr className="border-b border-[#DEDEDE]"><td className="py-2 px-2 font-bold">Gumroad</td><td className="py-2 px-2">10% + ~3,5%</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Inglés</td></tr>
                  <tr className="border-b border-[#DEDEDE]"><td className="py-2 px-2 font-bold">Memberful</td><td className="py-2 px-2">0–4,9% + Stripe</td><td className="py-2 px-2">No</td><td className="py-2 px-2">Inglés</td></tr>
                  <tr className="bg-[#FFFBE6]"><td className="py-2 px-2 font-bold">Nebbuler</td><td className="py-2 px-2">0% (tarifa fija ~US$30/mes)</td><td className="py-2 px-2">Sí (COP/MXN/ARS/PEN/CLP+)</td><td className="py-2 px-2">Español LATAM</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">4. Modelos de monetización</h2>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-3">
              Los cinco modelos dominantes en LATAM hispanohablante son:
            </p>
            <ol className="text-[16px] text-[#222] leading-[1.7] ml-6 mb-4 list-decimal space-y-2">
              <li><strong>Suscripciones recurrentes</strong> a contenido editorial (newsletters profesionales, análisis económico/legal).</li>
              <li><strong>Membresías</strong> a comunidades cerradas (Discord, Telegram, foros con paywall).</li>
              <li><strong>Productos digitales únicos</strong> (ebooks, plantillas, cursos one-time) — modelo dominante actualmente vía Hotmart, Eduzz, Gumroad.</li>
              <li><strong>Patrocinios</strong> en contenido del creador (newsletter ads, podcast ads).</li>
              <li><strong>Donaciones</strong> puntuales (Ko-fi, Buy Me a Coffee, transferencias directas).</li>
            </ol>

            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">5. Proyección 2030</h2>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              El subsegmento de "profesionales monetizando conocimiento vía membresías recurrentes"
              representa hoy aproximadamente 5-10% del total creator economy LATAM. Si la categoría
              alcanza la penetración relativa que tiene en EE.UU. (~20%), el mercado direccionable
              hacia 2030 estaría entre US$15.000 y US$22.000 millones anuales.
            </p>

            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">6. Implicaciones para periodistas e investigadores</h2>
            <p className="text-[16px] text-[#222] leading-[1.7] mb-4">
              Este informe se publica bajo licencia Creative Commons Attribution 4.0. Las cifras,
              tablas y análisis pueden ser citados libremente con atribución a Nebbuler. Si requieres
              acceso a la base de datos de creadores, casos de uso específicos o entrevistas con el
              fundador para reportería: <a href="mailto:prensa@nebbuler.com" className="text-[#C41C1C] underline">prensa@nebbuler.com</a>.
            </p>

            <h2 className="font-serif text-[1.8rem] font-bold mb-4 mt-12">Referencias</h2>
            <ul className="text-[14px] text-[#444] space-y-2 list-disc ml-6 mb-12">
              <li>Mobility Foresights, "Latin America Creator Economy Market Report", 2023.</li>
              <li>Rest of World, "The creator economy is booming in Latin America", 2023.</li>
              <li>Bloomberg Línea, cobertura ecosistema startup LATAM, 2024-2025.</li>
              <li>MercadoPago Developers, documentación API Connect, 2024.</li>
              <li>Stripe, "International availability and limitations", 2025.</li>
              <li>Datos primarios de Nebbuler: muestra de 50 creadores hispanohablantes, mayo 2026.</li>
            </ul>
          </section>

          <section className="border-t border-[#DEDEDE] pt-8 text-center">
            <p className="text-[12px] uppercase tracking-wider text-[#666] mb-2">Licencia</p>
            <p className="text-[14px] text-[#444]">
              Este informe está publicado bajo{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" className="text-[#C41C1C] underline">Creative Commons Attribution 4.0</a>.
              Cita sugerida: <em>Nebbuler (2026). Estado de la Creator Economy en América Latina. https://nebbuler.com/informe-2026</em>
            </p>
          </section>
        </main>
      </div>
    </>
  )
}
