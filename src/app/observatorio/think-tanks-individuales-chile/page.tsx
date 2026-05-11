import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Think Tanks Individuales en Chile: El Auge de los Analistas Independientes | Nebbuler',
  description:
    'Una generación de profesionales con credenciales de primer nivel rompe con las instituciones y construye audiencias directas. Modelo económico de los think tanks individuales en América Latina.',
  alternates: { canonical: 'https://nebbuler.com/observatorio/think-tanks-individuales-chile' },
  openGraph: {
    title: 'Think Tanks Individuales en Chile: El Auge de los Analistas Independientes',
    description:
      'Qué es un think tank individual, cómo difieren de CEP y Libertad y Desarrollo, y por qué los más exitosos cobran directamente a sus suscriptores.',
    url: 'https://nebbuler.com/observatorio/think-tanks-individuales-chile',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Think Tanks Individuales en Chile',
    description:
      'El fenómeno de los profesionales chilenos que construyen think tanks de una persona con audiencia directa y suscripción de pago.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline:
        'El Auge de los Think Tanks Individuales en Chile: Profesionales que Cobran por su Análisis',
      description:
        'Análisis del fenómeno de los think tanks unipersonales en Chile: modelo económico, diferencias con los think-tanks institucionales y casos reales en Nebbuler.',
      url: 'https://nebbuler.com/observatorio/think-tanks-individuales-chile',
      datePublished: '2026-02-15',
      dateModified: '2026-05-01',
      author: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
      publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
      inLanguage: 'es',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Observatorio',
          item: 'https://nebbuler.com/observatorio',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Think Tanks Individuales en Chile',
          item: 'https://nebbuler.com/observatorio/think-tanks-individuales-chile',
        },
      ],
    },
  ],
}

export default function ThinkTanksIndividualesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Ruta de navegación">
          <ol className="flex items-center gap-2 font-sans text-[12px] text-[#888]">
            <li><Link href="/" className="hover:text-[#121212] transition-colors">Nebbuler</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/observatorio" className="hover:text-[#121212] transition-colors">Observatorio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#121212]">Think Tanks Individuales Chile</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
            ANÁLISIS · ECOSISTEMA · MAYO 2026
          </p>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#121212] leading-tight mb-5">
            El Auge de los Think Tanks Individuales en Chile: Profesionales que Cobran por su Análisis
          </h1>
          <p className="font-sans text-[16px] text-[#555] leading-relaxed">
            Un think tank individual es un profesional con formación de doctorado o experiencia institucional de nivel comparable que produce análisis riguroso de forma independiente y lo distribuye directamente a su audiencia. En Chile, ese fenómeno está creciendo más rápido que cualquier otra forma de periodismo especializado.
          </p>
        </header>

        <div className="h-px bg-[#E5E5E5] mb-10" />

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Qué es un think tank individual
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El término &quot;think tank&quot; fue acuñado para describir organizaciones que producen investigación de política pública independiente de los gobiernos y los partidos políticos. La versión institucional tiene staff, financiamiento de fundaciones privadas o corporaciones, y publica reportes que buscan influir en el debate público de forma colectiva.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El think tank individual conserva el propósito —análisis independiente de calidad— pero concentra toda la producción en una persona. No tiene junta directiva, no tiene financiadores corporativos que pueda complacer, no tiene línea editorial que defender. Su única obligación es hacia sus suscriptores, que pagan porque el análisis tiene valor.
          </p>
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-4">
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              <strong>La diferencia fundamental:</strong> Un think tank institucional produce lo que sus financiadores valoran. Un think tank individual produce lo que sus suscriptores están dispuestos a pagar. La función objetivo es radicalmente distinta, y eso se nota en la calidad del análisis.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Diferencias con los think-tanks institucionales de Chile
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Chile tiene un ecosistema de think-tanks institucionales relativamente maduro para el tamaño del país. El CEP (Centro de Estudios Públicos) es el más antiguo y respetado, con una orientación hacia el liberalismo económico y la defensa de las instituciones democráticas. Libertad y Desarrollo es más explícitamente liberal en economía y conservador en políticas sociales. La Fundación Sol ocupa el espacio opuesto. Todos producen investigación de calidad, pero dentro de sus marcos ideológicos respectivos.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full font-sans text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#F7F7F7]">
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Dimensión</th>
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Think tank institucional</th>
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Think tank individual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 border border-[#E5E5E5] font-semibold text-[#121212]">Financiamiento</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Fundaciones, corporaciones, donantes</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Suscriptores directos</td>
                </tr>
                <tr className="bg-[#FAFAFA]">
                  <td className="px-3 py-2 border border-[#E5E5E5] font-semibold text-[#121212]">Marco ideológico</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Definido por los fundadores o financiadores</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Definido solo por el analista</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border border-[#E5E5E5] font-semibold text-[#121212]">Audiencia</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Policymakers, medios, academia</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Profesionales que pagan directamente</td>
                </tr>
                <tr className="bg-[#FAFAFA]">
                  <td className="px-3 py-2 border border-[#E5E5E5] font-semibold text-[#121212]">Velocidad de publicación</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Semanas o meses (proceso editorial)</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Días o horas (sin proceso editorial)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border border-[#E5E5E5] font-semibold text-[#121212]">Distribución de ingresos</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">Salario al investigador</td>
                  <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">100% al analista</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Lo que el think tank individual sacrifica en recursos y credencial institucional lo gana en velocidad, independencia y alineación directa con lo que sus lectores necesitan. Un economista del CEP tarda tres meses en publicar un paper sobre política monetaria. Rodrigo Fuentes Marín publica un análisis del último comunicado del Banco Central en 48 horas, porque sus 1.247 suscriptores lo están esperando.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Casos en Nebbuler: el think tank individual en acción
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Los creadores de Nebbuler ejemplifican el think tank individual en sus formas más desarrolladas. Cada uno opera en una disciplina específica, con credenciales que habrían calificado para un puesto de investigador en cualquier institución, pero que eligieron el modelo independiente:
          </p>

          <div className="space-y-4 mb-6">
            {[
              {
                name: 'Ignacio Leal Espinoza',
                specialty: 'Ciencia Política y Sistemas Electorales',
                credential: 'Doctor en Ciencia Política · Universidad de Salamanca',
                subscribers: 618,
                price: '$9.990',
                description: 'Sus análisis sobre el sistema político chileno —fragmentación parlamentaria, equilibrio de poderes, comportamiento electoral— funcionan como el observatorio político que ningún think-tank tradicional produce con esa velocidad de reacción.',
              },
              {
                name: 'Alejandro Vásquez Mora',
                specialty: 'Inteligencia Artificial y Estrategia Tecnológica',
                credential: 'MS Computer Science · Stanford · Ex CTO Fintual',
                subscribers: 412,
                price: '$16.990',
                description: 'Opera como el think tank tecnológico que ninguna empresa chilena tiene internamente. Sus análisis sobre IA en contexto empresarial local son únicos: no traducen artículos del MIT, sino que aplican los principios a la realidad de las empresas del IPSA.',
              },
              {
                name: 'Francisca Araya Medina',
                specialty: 'Arquitectura Urbana y Planificación Territorial',
                credential: 'Máster Urban Planning · Bartlett School, UCL',
                subscribers: 487,
                price: '$11.990',
                description: 'La única analista independiente en Chile que publica análisis regularmente sobre planificación territorial con datos catastrales reales. Su newsletter sobre densificación en la Región Metropolitana es leído por funcionarios del MINVU y desarrolladores inmobiliarios por igual.',
              },
            ].map((creator) => (
              <div key={creator.name} className="bg-[#FAFAFA] border border-[#E5E5E5] p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-serif text-[16px] font-bold text-[#121212]">{creator.name}</p>
                    <p className="font-sans text-[11px] font-semibold text-[#C41C1C] uppercase tracking-wider">{creator.specialty}</p>
                    <p className="font-sans text-[11px] text-[#888] mt-0.5">{creator.credential}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-serif text-[14px] font-bold text-[#121212]">{creator.price} CLP/mes</p>
                    <p className="font-sans text-[11px] text-[#888]">{creator.subscribers} suscriptores</p>
                  </div>
                </div>
                <p className="font-sans text-[13px] text-[#555] leading-relaxed">{creator.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Modelo económico: suscripción directa vs consultoría vs conferencias
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Los think tanks individuales más exitosos no dependen exclusivamente de la suscripción. El newsletter actúa como la base de un modelo económico que combina tres fuentes de ingreso:
          </p>

          <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
            1. Suscripción directa (recurrente y predecible)
          </h3>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Es el ingreso base. 800 suscriptores a $14.990 son $11.992.000 al mes, independientemente de si el analista da conferencias ese mes o no. Es el ingreso que permite planificar y mantener la calidad del análisis sin depender de contratos puntuales.
          </p>

          <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
            2. Consultoría derivada (mayor margen, menor volumen)
          </h3>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El newsletter funciona como una demostración continua de capacidades. Los suscriptores que son directores financieros, gerentes de inversiones o ejecutivos de empresas conocen el nivel de análisis antes de contratar. Las consultorías que derivan del newsletter tienen tasas de cierre mucho más altas que los contratos llegados por networking frío, porque el cliente ya confía en el criterio del analista.
          </p>

          <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
            3. Conferencias y clases magistrales (escalabilidad limitada pero alto valor)
          </h3>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Los analistas con audiencia establecida en su newsletter son los primeros invitados cuando una cámara de comercio, una universidad o una empresa organizan seminarios sobre su especialidad. La diferencia con el académico tradicional es que el conferenciante con newsletter llega con una audiencia propia que amplifica el evento.
          </p>

          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-4">
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              <strong>La palanca:</strong> El think tank individual escala más rápido que la consultoría tradicional porque el newsletter acumula reputación pública de forma continua. Cada análisis publicado es un argumento nuevo a favor de contratar al analista. La consultoría tradicional acumula credibilidad en silencio —dentro de las empresas cliente. El newsletter lo hace en público.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6 mb-10">
          <p className="font-serif text-[18px] font-bold text-[#121212] mb-2">
            Construye tu think tank individual en Nebbuler
          </p>
          <p className="font-sans text-[14px] text-[#555] mb-4 leading-relaxed">
            La plataforma para profesionales que quieren cobrar directamente por su análisis. Sin algoritmos. 0% de comisión. Pagos en CLP.
          </p>
          <Link
            href="/para-creadores"
            className="inline-block bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase"
          >
            Ver condiciones →
          </Link>
        </div>

        {/* Back link */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <Link
            href="/observatorio"
            className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors flex items-center gap-1"
          >
            <span aria-hidden="true">←</span> Volver al Observatorio
          </Link>
        </div>
      </article>
    </>
  )
}
