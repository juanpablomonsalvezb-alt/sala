import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Macroeconomía en Latinoamérica 2026: Dónde Leer Análisis Independientes | Nebbuler',
  description:
    'Estado macroeconómico de Chile, Argentina, Colombia, México y Perú en 2026. Por qué los analistas independientes en newsletters de pago superan a los medios masivos en profundidad y velocidad.',
  alternates: { canonical: 'https://nebbuler.com/observatorio/macroeconomia-latam' },
  openGraph: {
    title: 'Macroeconomía en Latinoamérica 2026: Dónde Leer Análisis Independientes',
    description:
      'Radiografía macroeconómica de los cinco principales países de América Latina y el directorio de newsletters independientes que los cubren con mayor profundidad que los medios masivos.',
    url: 'https://nebbuler.com/observatorio/macroeconomia-latam',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macroeconomía en Latinoamérica 2026',
    description:
      'Chile, Argentina, Colombia, México y Perú: estado macro y los mejores newsletters para seguirlos.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Macroeconomía en Latinoamérica 2026: Dónde Leer Análisis Independientes',
      description:
        'Estado macroeconómico de los principales países de América Latina en 2026 y por qué los analistas independientes en newsletters de pago superan a los medios masivos.',
      url: 'https://nebbuler.com/observatorio/macroeconomia-latam',
      datePublished: '2026-01-01',
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
          name: 'Macroeconomía en Latinoamérica 2026',
          item: 'https://nebbuler.com/observatorio/macroeconomia-latam',
        },
      ],
    },
  ],
}

export default function MacroeconomiaLatamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Ruta de navegación">
          <ol className="flex items-center gap-2 font-sans text-[12px] text-[#888]">
            <li><Link href="/" className="hover:text-[#121212] transition-colors">Nebbuler</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/observatorio" className="hover:text-[#121212] transition-colors">Observatorio</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#121212]">Macroeconomía América Latina 2026</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
            ANÁLISIS MACRO · MAYO 2026
          </p>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#121212] leading-tight mb-5">
            Macroeconomía en Latinoamérica 2026: Dónde Leer Análisis Independientes
          </h1>
          <p className="font-sans text-[16px] text-[#555] leading-relaxed">
            Latinoamérica entra en 2026 con cinco historias macroeconómicas distintas que se cruzan en los mercados de capitales, los flujos de inversión y las decisiones de política monetaria. Este análisis mapea el estado de cada economía principal y los mejores canales independientes para seguirlas.
          </p>
        </header>

        <div className="h-px bg-[#E5E5E5] mb-10" />

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            El mapa macroeconómico de América Latina en 2026
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            La región no es un bloque homogéneo. Chile y Colombia convergen en sus ciclos monetarios de forma bastante sincronizada con la Reserva Federal; Argentina sigue siendo un caso aparte con su propia dinámica inflacionaria y cambiaria; México está profundamente influido por su relación comercial con Estados Unidos; Perú muestra estabilidad macroeconómica pero fragilidad institucional persistente.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Entender LATAM en 2026 requiere leer cada país con sus propias variables, pero también comprender las correlaciones: cuando la Reserva Federal ajusta tasas, el impacto en el costo de financiamiento soberano en Santiago, Bogotá y Lima es casi simultáneo, aunque los canales de transmisión y la intensidad del efecto difieren significativamente.
          </p>
        </section>

        {/* Section 2 — Country by country */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-6">
            Estado macroeconómico por país
          </h2>

          {/* Chile */}
          <div className="mb-8">
            <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-3 flex items-center gap-2">
              <span className="text-[#C41C1C]">CL</span> Chile
            </h3>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              Chile entra en 2026 en una fase de consolidación después de un ciclo de tasas restrictivo que duró más de dos años. El Banco Central terminó el ciclo de alzas en 2023 y pasó a recortes graduales durante 2024 y 2025. El debate actual es la velocidad del ciclo descendente: con inflación subyacente aún por encima del 3% en servicios, el directorio del BCCH mantiene una postura de cautela que frustra a los agentes del mercado que esperan tasas más bajas más rápido.
            </p>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              Los temas macro de mayor relevancia para 2026 son tres: la inversión en el sector minero (litio y cobre siguen siendo el ancla del ciclo externo), la evolución del empleo en los sectores no transables, y la reforma previsional cuyo impacto fiscal está siendo aún modelado con alta incertidumbre.
            </p>
            <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-3">
              <p className="font-sans text-[13px] text-[#555]">
                <strong className="text-[#121212]">Para seguir en Nebbuler:</strong> Rodrigo Fuentes Marín publica análisis semanales sobre política monetaria, ciclo económico y proyecciones de TPM. Con 1.247 suscriptores activos, es el newsletter de economía más leído en la plataforma. $14.990 CLP/mes.
              </p>
            </div>
          </div>

          {/* Argentina */}
          <div className="mb-8">
            <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-3 flex items-center gap-2">
              <span className="text-[#C41C1C]">AR</span> Argentina
            </h3>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              Argentina es el caso más complejo de la región. El proceso de desregulación del mercado cambiario iniciado a finales de 2023 marcó un punto de inflexión en la trayectoria fiscal: por primera vez en más de una década, el país logró superávit primario sostenido durante varios trimestres consecutivos. La inflación, que llegó al 200% anual en el pico de 2024, inició una trayectoria descendente que sorprendió a la mayoría de los modelos.
            </p>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              El riesgo principal para 2026 sigue siendo la sostenibilidad de las reservas del Banco Central en el contexto de la apertura cambiaria y las obligaciones de deuda con el FMI y bonistas privados. Cualquier shock externo que presione las reservas puede reactivar las presiones cambiarias con velocidad.
            </p>
            <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-3">
              <p className="font-sans text-[13px] text-[#555]">
                <strong className="text-[#121212]">Perspectiva histórica:</strong> El newsletter de Catalina Rojas Henríquez en Nebbuler analiza los ciclos de deuda latinoamericanos desde la perspectiva histórica, con comparaciones entre el default de 1931 y los dilemas de deuda actuales. $8.990 CLP/mes.
              </p>
            </div>
          </div>

          {/* Colombia */}
          <div className="mb-8">
            <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-3 flex items-center gap-2">
              <span className="text-[#C41C1C]">CO</span> Colombia
            </h3>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              Colombia lleva el peor desempeño de crecimiento del grupo desde 2023. La reforma tributaria de 2022 generó incertidumbre inversora que se materializó en menor formación de capital privado. El Banco de la República comenzó su ciclo de recortes más tarde que sus pares de la región y a mayor velocidad para compensar.
            </p>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              El panorama fiscal es desafiante: el déficit del gobierno nacional se mantiene amplio, y los ingresos petroleros —que dependen del precio del crudo y de la producción— tienen una trayectoria incierta en el mediano plazo en el contexto de la transición energética global.
            </p>
          </div>

          {/* México */}
          <div className="mb-8">
            <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-3 flex items-center gap-2">
              <span className="text-[#C41C1C]">MX</span> México
            </h3>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              México es la economía de la región más vinculada al ciclo norteamericano, y eso es tanto su fortaleza como su vulnerabilidad en 2026. El nearshoring —la reconfiguración de cadenas de suministro desde Asia hacia México por la cercanía geográfica con EE.UU.— ha sido el motor de crecimiento del sector industrial norteño. Sin embargo, la infraestructura (energía, agua, conectividad) está limitando la velocidad de absorción de esa inversión.
            </p>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              Banxico sigue el ciclo de la Reserva Federal con cierto rezago y mantiene el tipo de cambio como ancla nominal implícita. El riesgo fiscal, tras el incremento del gasto en los últimos tres años, es uno de los factores que más preocupa a los inversionistas institucionales.
            </p>
          </div>

          {/* Perú */}
          <div className="mb-8">
            <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-3 flex items-center gap-2">
              <span className="text-[#C41C1C]">PE</span> Perú
            </h3>
            <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-3">
              Perú mantiene los fundamentos macroeconómicos más sólidos de la región —regla fiscal, banco central creíble, tipo de cambio flexible— pero la inestabilidad política crónica limita la inversión privada de largo plazo y mantiene al país por debajo de su potencial de crecimiento estructural. El sector minero (cobre principalmente) es el ancla del ciclo externo y el principal vínculo de Perú con la dinámica de China.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Por qué los analistas independientes superan a los medios masivos
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Los medios masivos tienen tres limitaciones estructurales cuando cubren macroeconomía en América Latina:
          </p>
          <div className="space-y-4 mb-6">
            {[
              {
                title: 'Velocidad vs profundidad',
                body: 'Los diarios deben publicar dentro de horas. Un análisis sobre la reunión del directorio del BCCH que requiere leer el comunicado completo, las actas anteriores y modelar las expectativas implícitas en los contratos de swap no cabe en el ciclo noticioso de un periódico. El newsletter profesional no tiene ese límite.',
              },
              {
                title: 'Audiencia generalista',
                body: 'Un diario nacional escribe para lectores con muy distintos niveles de conocimiento económico. El newsletter de pago escribe para lectores que pagan porque tienen el nivel técnico para valorar el análisis. Eso permite ir a la profundidad que el análisis requiere, sin notas al pie que expliquen qué es una curva de rendimientos.',
              },
              {
                title: 'Independencia de los avisadores',
                body: 'Los grandes medios tienen contratos publicitarios con los bancos y las AFP que generan análisis. Un newsletter independiente no tiene esa relación. Rodrigo Fuentes Marín puede concluir que el Banco Central actuó tarde sin que ningún editor le pida suavizar la conclusión para proteger una relación comercial.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4">
                <p className="font-sans text-[14px] font-bold text-[#121212] mb-1">{item.title}</p>
                <p className="font-sans text-[14px] text-[#444] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El resultado es una asimetría informacional que beneficia a los suscriptores de newsletters profesionales. Para un CFO de una empresa chilena con operaciones en Colombia y Argentina, leer a Rodrigo Fuentes Marín y Catalina Rojas Henríquez en Nebbuler aporta más información accionable por peso gastado que tres suscripciones a periódicos económicos de la región.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Newsletters recomendados en Nebbuler para seguir la macro de América Latina
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-6">
            Para lectores que siguen la macroeconomía regional, estos son los perfiles más relevantes en la plataforma por su cobertura y frecuencia de publicación:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full font-sans text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#F7F7F7]">
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Creador</th>
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Especialidad</th>
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Cobertura geo</th>
                  <th className="text-left px-3 py-2 font-bold text-[#121212] border border-[#E5E5E5]">Precio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Rodrigo Fuentes Marín',
                    specialty: 'Política Monetaria',
                    geo: 'Chile / LATAM',
                    price: '$14.990 CLP',
                  },
                  {
                    name: 'Carolina Vega Toro',
                    specialty: 'Finanzas Corporativas',
                    geo: 'Chile',
                    price: '$19.990 CLP',
                  },
                  {
                    name: 'Catalina Rojas Henríquez',
                    specialty: 'Historia Económica',
                    geo: 'Chile / LATAM',
                    price: '$8.990 CLP',
                  },
                  {
                    name: 'Alejandro Vásquez Mora',
                    specialty: 'Tecnología y Estrategia',
                    geo: 'Chile',
                    price: '$16.990 CLP',
                  },
                ].map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}>
                    <td className="px-3 py-2 border border-[#E5E5E5] font-semibold text-[#121212]">{row.name}</td>
                    <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">{row.specialty}</td>
                    <td className="px-3 py-2 border border-[#E5E5E5] text-[#555]">{row.geo}</td>
                    <td className="px-3 py-2 border border-[#E5E5E5] text-[#121212] font-semibold">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Todos los perfiles tienen los últimos tres análisis disponibles en abierto. La suscripción activa el acceso al archivo completo y a las publicaciones futuras, procesada en pesos chilenos con MercadoPago o tarjeta.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6 mb-10">
          <p className="font-serif text-[18px] font-bold text-[#121212] mb-2">
            Ver el directorio completo de newsletters de economía
          </p>
          <p className="font-sans text-[14px] text-[#555] mb-4 leading-relaxed">
            Filtra por disciplina, país de cobertura y precio. Todos los perfiles son verificados con credenciales reales.
          </p>
          <Link
            href="/directorio"
            className="inline-block bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase"
          >
            Ir al directorio →
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
