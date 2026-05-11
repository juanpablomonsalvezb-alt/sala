import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newsletters de Derecho Tributario en América Latina | Observatorio Nebbuler',
  description:
    'Abogados tributarios con LLM internacional que publican análisis sobre el SII, reforma fiscal, precios de transferencia y tributación internacional para contadores y CFOs. Directorio verificado.',
  alternates: { canonical: 'https://nebbuler.com/observatorio/derecho-tributario-latam' },
  openGraph: {
    title: 'Newsletters de Derecho Tributario en América Latina',
    description:
      'Los abogados tributarios chilenos que monetizan su expertise de forma independiente. Análisis del SII, tributación internacional y planificación fiscal.',
    url: 'https://nebbuler.com/observatorio/derecho-tributario-latam',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletters de Derecho Tributario en América Latina',
    description:
      'Abogados tributarios que cobran por su análisis. Directorio verificado de newsletters legales en Nebbuler.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline:
        'Newsletters de Derecho Tributario en América Latina: Los Profesionales que Debes Seguir',
      description:
        'El crecimiento del análisis legal independiente y los abogados tributarios que monetizan su expertise fuera de los grandes estudios.',
      url: 'https://nebbuler.com/observatorio/derecho-tributario-latam',
      datePublished: '2026-02-01',
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
          name: 'Newsletters de Derecho Tributario en América Latina',
          item: 'https://nebbuler.com/observatorio/derecho-tributario-latam',
        },
      ],
    },
  ],
}

export default function DerechoTributarioLatamPage() {
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
            <li className="text-[#121212]">Derecho Tributario LATAM</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
            DIRECTORIO · DERECHO · MAYO 2026
          </p>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-[#121212] leading-tight mb-5">
            Newsletters de Derecho Tributario en América Latina: Los Profesionales que Debes Seguir
          </h1>
          <p className="font-sans text-[16px] text-[#555] leading-relaxed">
            El análisis tributario independiente está emergiendo como uno de los segmentos más valiosos del mercado de newsletters profesionales en español. Abogados con LLM internacional que antes solo publicaban en revistas especializadas o de forma interna en grandes estudios ahora cobran directamente a contadores, CFOs y directores financieros.
          </p>
        </header>

        <div className="h-px bg-[#E5E5E5] mb-10" />

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            El crecimiento del análisis legal independiente en Chile
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El derecho tributario es una de las disciplinas con mayor brecha entre la demanda de análisis especializado y la oferta de contenido accesible. Los cambios tributarios en Chile —la reforma de 2020, las modificaciones post-OCDE, los nuevos criterios del SII en fiscalización de precios de transferencia— afectan directamente las decisiones financieras de miles de empresas. Pero el análisis experto de esos cambios ha estado históricamente encerrado en dos lugares: las circulares internas de los grandes estudios jurídicos, y los seminarios de la Asociación de Abogados de Empresas a los que solo llegan los socios.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El newsletter rompe ese monopolio de acceso. Un contador de una pyme en Temuco puede suscribirse al análisis de Matías Cornejo Silva —socio del área tributaria de un estudio top— por $17.990 CLP al mes y recibir el mismo nivel de análisis que antes estaba reservado para los clientes del estudio que pagan honorarios por hora. Eso es, fundamentalmente, una democratización del conocimiento jurídico especializado.
          </p>
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-4">
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              <strong>El contexto regulatorio:</strong> Chile adhirió a las recomendaciones BEPS de la OCDE en 2021, modificó sus reglas de precios de transferencia en 2022, y el SII ha intensificado las auditorías a empresas con operaciones transfronterizas desde 2023. Para cualquier empresa con filiales o transacciones internacionales, el análisis tributario actualizado es operativamente crítico.
            </p>
          </div>
        </section>

        {/* Section 2 — Lawyers */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-6">
            Abogados tributarios verificados en Nebbuler
          </h2>

          {/* Matias Cornejo */}
          <div className="border border-[#E5E5E5] mb-6">
            <div className="bg-[#F7F7F7] px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-[17px] font-bold text-[#121212]">Matías Cornejo Silva</p>
                <p className="font-sans text-[11px] font-semibold tracking-wider text-[#C41C1C] uppercase">DERECHO TRIBUTARIO Y PLANIFICACIÓN FISCAL</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-[15px] font-bold text-[#121212]">$17.990 CLP/mes</p>
                <p className="font-sans text-[11px] text-[#888]">812 suscriptores · +29%</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-3">
                Socio del área tributaria en Urenda, Rencoret, Orrego &amp; Dörr. LLM en Tax Law por la Universidad de Leiden. Especialista en reorganizaciones empresariales y tributación internacional. Sus análisis son referencia entre los contadores del BigFour y los directores financieros de grupos empresariales chilenos.
              </p>
              <p className="font-sans text-[13px] text-[#666] mb-2"><strong className="text-[#121212]">Análisis recientes:</strong></p>
              <ul className="space-y-1.5">
                {[
                  'Reforma previsional y su impacto tributario: lo que el SII ya está auditando',
                  'Precios de transferencia en Chile post-OCDE: cinco casos donde las filiales quedaron expuestas',
                  'Goodwill tributario: el activo que desaparece en la fusión y nadie calcula correctamente',
                ].map((article) => (
                  <li key={article} className="font-sans text-[13px] text-[#555] flex gap-2">
                    <span className="text-[#C41C1C] shrink-0">—</span>
                    <span>{article}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pablo Herrera */}
          <div className="border border-[#E5E5E5] mb-6">
            <div className="bg-[#F7F7F7] px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-[17px] font-bold text-[#121212]">Pablo Herrera Zúñiga</p>
                <p className="font-sans text-[11px] font-semibold tracking-wider text-[#C41C1C] uppercase">DERECHO LABORAL Y RELACIONES COLECTIVAS</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-[15px] font-bold text-[#121212]">$13.990 CLP/mes</p>
                <p className="font-sans text-[11px] text-[#888]">374 suscriptores · +19%</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-3">
                Abogado laboralista con 14 años en litigios colectivos. Magíster por la PUC. Ex asesor jurídico de la CUT en tres procesos de huelga estratégica. Sus análisis cubren el derecho del trabajo desde la perspectiva del litigante, con atención a los nuevos criterios del Tribunal Laboral de Santiago.
              </p>
              <ul className="space-y-1.5">
                {[
                  'Despido indirecto en la era del teletrabajo: el nuevo criterio del Tribunal Laboral de Santiago',
                  'Negociación colectiva reglada vs. no reglada: qué cambió realmente con la reforma',
                  'Subcontratación y responsabilidad solidaria: los vacíos que los jueces están llenando',
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
            Diferencias entre análisis tributario en Chile, Argentina y Colombia
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Aunque los tres países forman parte del ecosistema latinoamericano de habla hispana, sus regímenes tributarios son sustancialmente distintos, y los newsletters más valiosos son los que pueden navegar esas diferencias para lectores con operaciones en múltiples jurisdicciones.
          </p>

          <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
            Chile: el más alineado con la OCDE
          </h3>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Chile es el país de América Latina con mayor integración a las recomendaciones OCDE en materia tributaria. Desde la implementación del CRS (Common Reporting Standard) y las normas BEPS, las empresas chilenas con operaciones transfronterizas enfrentan un nivel de fiscalización comparable al europeo. Los newsletters más relevantes para Chile cubren la interpretación del SII, las modificaciones al artículo 38 de la Ley de Impuesto a la Renta, y los criterios de la jurisprudencia del Tribunal Tributario y Aduanero.
          </p>

          <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
            Argentina: complejidad estructural e inestabilidad normativa
          </h3>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            El análisis tributario argentino requiere actualización casi diaria. Los cambios en el régimen cambiario, las restricciones al dólar y las modificaciones al impuesto a las Ganancias hacen que los boletines especializados sean herramientas operativas, no solo académicas. Los newsletters más demandados en Argentina se enfocan en la interface entre el régimen cambiario y la tributación internacional.
          </p>

          <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
            Colombia: reforma tributaria de 2022 y sus consecuencias en cascada
          </h3>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            La reforma tributaria colombiana de 2022 fue la más significativa en décadas: nuevas tasas para personas jurídicas, impuesto al patrimonio, cambios en el tratamiento de dividendos. El mercado colombiano de newsletters tributarios está emergiendo con fuerza, especialmente entre firmas que asesoran a empresas con sede en Bogotá y operaciones en Chile o México.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">
            Por qué los abogados publican newsletters de pago
          </h2>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            La razón primaria es la misma que en economía: independencia analítica. En un estudio jurídico grande, el abogado escribe memorandos que quedan en el servidor interno del cliente. En un newsletter, ese mismo análisis llega a 800 suscriptores que pagan por él y que lo referencian en sus decisiones.
          </p>
          <p className="font-sans text-[15px] text-[#333] leading-relaxed mb-4">
            Hay también una razón de posicionamiento. Un abogado que publica análisis semanales sobre precios de transferencia en Chile construye autoridad pública en esa especialidad. Ese posicionamiento genera derivaciones de trabajo: clientes que leyeron el newsletter y llegan al estudio directamente pidiendo al autor.
          </p>
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 mb-4">
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              <strong>El modelo compuesto:</strong> Los abogados más exitosos en Nebbuler no reemplazan su práctica con el newsletter — la complementan. El newsletter actúa como marketing de contenido especializado que genera consultas directas, al mismo tiempo que genera ingresos recurrentes independientes de la carga de trabajo del estudio.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6 mb-10">
          <p className="font-serif text-[18px] font-bold text-[#121212] mb-2">
            ¿Abogado tributario con criterio que cobrar?
          </p>
          <p className="font-sans text-[14px] text-[#555] mb-4 leading-relaxed">
            Nebbuler es la plataforma para abogados que quieren monetizar su análisis jurídico de forma independiente. Sin comisión. Pagos en CLP.
          </p>
          <Link
            href="/para-creadores"
            className="inline-block bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase"
          >
            Abrir mi newsletter de derecho →
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
