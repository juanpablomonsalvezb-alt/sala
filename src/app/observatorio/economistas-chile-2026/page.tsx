import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Economistas Chilenos con Newsletter en 2026 | Observatorio Nebbuler',
  description:
    'Ex Banco Central, PhDs y analistas independientes que cobran por sus análisis de política monetaria, inflación y ciclo económico en Chile. Directorio verificado de newsletters de economía en español.',
  alternates: { canonical: 'https://nebbuler.com/observatorio/economistas-chile-2026' },
  openGraph: {
    title: 'Economistas Chilenos con Newsletter en 2026',
    description:
      'El fenómeno de los economistas chilenos que dejaron los think-tanks para publicar análisis directamente a sus suscriptores.',
    url: 'https://nebbuler.com/observatorio/economistas-chile-2026',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Economistas Chilenos con Newsletter en 2026',
    description:
      'Ex Banco Central, PhDs y analistas que cobran por su criterio económico. Directorio verificado.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Economistas Chilenos que Publican Newsletters en 2026',
      description:
        'El fenómeno de los economistas chilenos que monetizan su análisis de forma independiente fuera de los think-tanks institucionales.',
      url: 'https://nebbuler.com/observatorio/economistas-chile-2026',
      datePublished: '2026-01-15',
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
          name: 'Economistas Chilenos con Newsletter en 2026',
          item: 'https://nebbuler.com/observatorio/economistas-chile-2026',
        },
      ],
    },
  ],
}

export default function EconomistaChile2026Page() {
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
            <li className="text-[#121212]">Economistas Chilenos 2026</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
            DIRECTORIO · ECONOMÍA · MAYO 2026
          </p>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#121212] leading-tight mb-5">
            Economistas Chilenos que Publican Newsletters en 2026
          </h1>
          <p className="font-sans text-[16px] text-[#555] leading-relaxed">
            Un número creciente de economistas con credenciales de primer nivel —ex Banco Central, PhDs de universidades top, directores de fondos— ha dejado de publicar en medios masivos para cobrar directamente a sus lectores. Este es el mapa de ese fenómeno en Chile.
          </p>
        </header>

        <div className="h-px bg-[#E5E5E5] mb-10" />

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            El fenómeno: por qué los economistas chilenos están monetizando de forma independiente
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Durante décadas, el análisis económico en Chile circuló por tres canales: los think-tanks ideológicos (CEP, Libertad y Desarrollo, Fundación Sol), los departamentos de estudios de los bancos, y las columnas de opinión en El Mercurio, La Tercera o El Mostrador. Los tres canales tienen algo en común: no pagaban al analista por cada lector, sino un sueldo fijo o ningún honorario.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El newsletter de pago cambia esa ecuación radicalmente. Un economista con 1.000 suscriptores a $12.000 CLP al mes genera $12 millones al mes, sin depender de ningún editor, sin alinearse con ninguna visión ideológica institucional, sin esperar que un medio le asigne espacio editorial. La relación es directa: el lector paga porque el análisis tiene valor, y el analista escribe porque le conviene económicamente mantener ese valor.
          </p>
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-4">
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              <strong>El cambio estructural:</strong> Los medios masivos han reducido sus equipos de economía. Los lectores sofisticados que antes leían al economista jefe del Banco de Chile en el suplemento económico del domingo ahora pagan directamente al mismo economista, que escribe con más libertad y más profundidad fuera de la institución.
            </p>
          </div>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Hay también un factor generacional: los economistas que se formaron en los años 2000 y 2010 tienen un perfil más internacional que sus predecesores. PhDs en Minnesota, Chicago, MIT o LSE que regresan a Chile con capacidad analítica de nivel global pero encuentran un mercado laboral académico estrecho. El newsletter es la vía para monetizar ese capital humano de forma independiente.
          </p>
        </section>

        {/* Section 2 — Economists list */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-6">
            Economistas verificados en Nebbuler
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-6">
            Estos son los creadores con disciplina económica o financiera activos en la plataforma, con credenciales verificadas y análisis disponibles por suscripción:
          </p>

          {/* Rodrigo Fuentes */}
          <div className="border border-[#E5E5E5] mb-6">
            <div className="bg-[#F7F7F7] px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-[17px] font-bold text-[#121212]">Rodrigo Fuentes Marín</p>
                <p className="font-sans text-[11px] font-semibold tracking-wider text-[#C41C1C] uppercase">MACROECONOMÍA Y POLÍTICA MONETARIA</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-[15px] font-bold text-[#121212]">$14.990 CLP/mes</p>
                <p className="font-sans text-[11px] text-[#888]">1.247 suscriptores · +38%</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-3">
                Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota. Consultor independiente en política monetaria para gobiernos de la región.
              </p>
              <p className="font-sans text-[13px] text-[#666] mb-3">
                <strong className="text-[#121212]">Análisis recientes:</strong>
              </p>
              <ul className="space-y-1.5">
                {[
                  'TPM en pausa: por qué el Banco Central no recortará antes del Q3 — análisis de expectativas implícitas',
                  'Inflación subyacente en Chile: la trampa del IPC servicios que nadie está mirando',
                  'Regla de Taylor vs discreción: lecciones del ciclo 2021-2024 para la próxima administración',
                ].map((article) => (
                  <li key={article} className="font-sans text-[13px] text-[#555] flex gap-2">
                    <span className="text-[#C41C1C] shrink-0">—</span>
                    <span>{article}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Carolina Vega */}
          <div className="border border-[#E5E5E5] mb-6">
            <div className="bg-[#F7F7F7] px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-[17px] font-bold text-[#121212]">Carolina Vega Toro</p>
                <p className="font-sans text-[11px] font-semibold tracking-wider text-[#C41C1C] uppercase">FINANZAS CORPORATIVAS Y VALORACIÓN</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-[15px] font-bold text-[#121212]">$19.990 CLP/mes</p>
                <p className="font-sans text-[11px] text-[#888]">934 suscriptores · +43%</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-3">
                Directora de M&A en Banchile Inversiones por 9 años. MBA por la Universidad de Chicago Booth. Asesora a family offices y fondos de capital privado en transacciones de mediano tamaño.
              </p>
              <p className="font-sans text-[13px] text-[#666] mb-3">
                <strong className="text-[#121212]">Análisis recientes:</strong>
              </p>
              <ul className="space-y-1.5">
                {[
                  'EBITDA ajustado: el KPI que los compradores chilenos manipulan — y cómo detectarlo en due diligence',
                  'Tasa de descuento en mercados emergentes: el error que destruye el 30% del valor en las DCF locales',
                  'Tres transacciones fallidas de 2024 en Chile y qué revelan sobre la madurez del mercado M&A',
                ].map((article) => (
                  <li key={article} className="font-sans text-[13px] text-[#555] flex gap-2">
                    <span className="text-[#C41C1C] shrink-0">—</span>
                    <span>{article}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Catalina Rojas */}
          <div className="border border-[#E5E5E5] mb-6">
            <div className="bg-[#F7F7F7] px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-[17px] font-bold text-[#121212]">Catalina Rojas Henríquez</p>
                <p className="font-sans text-[11px] font-semibold tracking-wider text-[#C41C1C] uppercase">HISTORIA ECONÓMICA DE AMÉRICA LATINA</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-[15px] font-bold text-[#121212]">$8.990 CLP/mes</p>
                <p className="font-sans text-[11px] text-[#888]">89 suscriptores · +16%</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-3">
                Doctora por El Colegio de México, postdoctorante en Cambridge. Profesora del Instituto de Historia de la PUC. Especialista en ciclos de deuda y crisis financieras latinoamericanas.
              </p>
              <ul className="space-y-1.5">
                {[
                  'El ciclo del salitre y la crisis de 1929: paralelismos estructurales con la dependencia actual del litio',
                  'Cómo Chile defaulteó en 1931 y lo que eso le hizo al sistema bancario en la siguiente década',
                  'CORFO a los 87 años: radiografía histórica de la institución que construyó el Estado empresario',
                ].map((article) => (
                  <li key={article} className="font-sans text-[13px] text-[#555] flex gap-2">
                    <span className="text-[#C41C1C] shrink-0">—</span>
                    <span>{article}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Por qué están monetizando fuera de los think-tanks
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            La respuesta corta es: independencia, ingresos y audiencia directa.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            En un think-tank institucional, el economista publica dentro de la línea editorial de la institución. El CEP tiene una visión de política económica. Libertad y Desarrollo tiene otra. La Fundación Sol tiene la suya. El analista que trabaja para cualquiera de esas instituciones tiene un techo implícito sobre lo que puede concluir.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El newsletter rompe ese techo. Rodrigo Fuentes Marín puede escribir que el Banco Central debería haber actuado antes sin preocuparse de que su análisis incomode a nadie. Carolina Vega Toro puede decir que tres transacciones específicas de M&A del año pasado fueron mal ejecutadas sin que ningún editor de un banco le pida suavizar el lenguaje.
          </p>
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-4">
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              <strong>El modelo económico:</strong> 1.000 suscriptores a $14.990 CLP generan casi $15 millones al mes. Un economista jefe en un banco grande en Santiago gana entre $8 y $12 millones brutos. La aritmética del newsletter, para quien tiene la audiencia, es difícil de ignorar.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Cómo suscribirse a newsletters de economía en Chile
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Todos los creadores de economía y finanzas en Nebbuler tienen su perfil público con los últimos tres análisis visibles de forma gratuita. Para acceder al archivo completo y a las ediciones nuevas, se activa la suscripción directamente desde la página de cada creador con MercadoPago o tarjeta de crédito en pesos chilenos, sin conversión de divisa.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            No hay período de prueba gratuito indefinido: los tres artículos gratuitos son suficientes para evaluar si el análisis justifica el precio. Si justifica, se suscribe. Si no, no. Es un modelo transparente para ambas partes.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6 mb-10">
          <p className="font-serif text-[18px] font-bold text-[#121212] mb-2">
            Ver directorio completo de economistas en Nebbuler
          </p>
          <p className="font-sans text-[14px] text-[#555] mb-4 leading-relaxed">
            Filtra por disciplina, precio y frecuencia de publicación. Todos los perfiles son verificados.
          </p>
          <Link
            href="/directorio?discipline=economia"
            className="inline-block bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase"
          >
            Ver newsletters de economía →
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
