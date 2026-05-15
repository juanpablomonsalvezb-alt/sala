import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PAISES, PROFESIONES, SALARIOS } from '@/data/salarios'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

const AÑO = 2026

export async function generateStaticParams(): Promise<{ profesion: string; pais: string }[]> {
  const params: { profesion: string; pais: string }[] = []
  for (const profesion of PROFESIONES) {
    for (const pais of PAISES) {
      params.push({ profesion: profesion.slug, pais: pais.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profesion: string; pais: string }>
}): Promise<Metadata> {
  const { profesion: profesionSlug, pais: paisSlug } = await params
  const profesion = PROFESIONES.find(p => p.slug === profesionSlug)
  const pais = PAISES.find(p => p.slug === paisSlug)

  if (!profesion || !pais) return {}

  const salario = SALARIOS[profesionSlug]?.[paisSlug]
  const promedioStr = salario
    ? `${pais.simbolo}${salario.promedio.toLocaleString('es-CL')} ${pais.moneda}/mes`
    : ''

  const title = `¿Cuánto gana un ${profesion.nombre} en ${pais.nombre}? [${AÑO}]`
  const description = `Salario promedio de un ${profesion.nombre} en ${pais.nombre}${salario ? `: ${promedioStr}` : ''}. Rango completo, factores que influyen y cómo aumentar tus ingresos como ${profesion.nombre}.`

  return {
    title,
    description,
    alternates: { canonical: `https://nebbuler.com/salario/${profesionSlug}/${paisSlug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://nebbuler.com/salario/${profesionSlug}/${paisSlug}`,
    },
  }
}

export default async function SalarioPage({
  params,
}: {
  params: Promise<{ profesion: string; pais: string }>
}) {
  const { profesion: profesionSlug, pais: paisSlug } = await params

  const profesion = PROFESIONES.find(p => p.slug === profesionSlug)
  const pais = PAISES.find(p => p.slug === paisSlug)

  if (!profesion || !pais) notFound()

  const salario = SALARIOS[profesionSlug]?.[paisSlug]
  if (!salario) notFound()

  const fmt = (n: number) => `${pais.simbolo}${n.toLocaleString('es-CL')}`

  // 5 países de comparación (excluir el actual)
  const paisesComparacion = PAISES.filter(p => p.slug !== paisSlug).slice(0, 5)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuánto gana un ${profesion.nombre} en ${pais.nombre}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `El salario promedio de un ${profesion.nombre} en ${pais.nombre} es de ${fmt(salario.promedio)} ${pais.moneda} al mes. El rango va desde ${fmt(salario.min)} hasta ${fmt(salario.max)} según la experiencia y especialización.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Cuánto gana un ${profesion.nombre} junior en ${pais.nombre}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Un ${profesion.nombre} junior en ${pais.nombre} (0-3 años de experiencia) gana aproximadamente ${fmt(salario.min)} ${pais.moneda} al mes.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Cuánto gana un ${profesion.nombre} senior en ${pais.nombre}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Un ${profesion.nombre} senior en ${pais.nombre} (más de 7 años de experiencia) puede ganar hasta ${fmt(salario.max)} ${pais.moneda} al mes o más en posiciones de alta especialización.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Nav */}
        <header>
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="border-b border-[#DEDEDE] py-3 px-6">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
                NEBBULER
              </Link>
              <Link
                href="/registro"
                className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
              >
                Crear cuenta →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <Link href="/salario" className="hover:text-[#121212]">Salarios</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">{profesion.nombreMayus} en {pais.nombre}</span>
          </nav>

          {/* Hero */}
          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {profesion.area} · {pais.nombre} {pais.emoji}
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-6">
              ¿Cuánto gana un {profesion.nombre} en {pais.nombre}? [{AÑO}]
            </h1>

            {/* Salario destacado */}
            <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 mb-6">
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-2">
                Salario promedio mensual
              </p>
              <p className="font-serif text-5xl font-bold text-[#121212] mb-2">
                {fmt(salario.promedio)}
              </p>
              <p className="font-sans text-[14px] text-[#666]">
                {pais.moneda} al mes · Datos {salario.fuente}
              </p>
            </div>

            <p className="font-sans text-[16px] text-[#555] leading-relaxed">
              El rango salarial de un <strong>{profesion.nombre}</strong> en {pais.nombre} va desde{' '}
              <strong>{fmt(salario.min)}</strong> hasta{' '}
              <strong>{fmt(salario.max)}</strong> al mes, dependiendo de la experiencia,
              especialización y sector de trabajo.
            </p>
          </div>

          {/* Tabla de rangos */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Tabla de salarios por nivel de experiencia
            </h2>
            <div className="border border-[#DEDEDE] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F7F7] border-b border-[#DEDEDE]">
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-left px-5 py-3">
                      Nivel
                    </th>
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-left px-5 py-3">
                      Experiencia
                    </th>
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-right px-5 py-3">
                      Salario mensual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#F0F0F0]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Junior</td>
                    <td className="font-sans text-[13px] text-[#666] px-5 py-4">0–3 años</td>
                    <td className="font-sans text-[15px] text-[#121212] font-bold text-right px-5 py-4">
                      {fmt(salario.min)}
                    </td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Semi-Senior</td>
                    <td className="font-sans text-[13px] text-[#666] px-5 py-4">3–7 años</td>
                    <td className="font-sans text-[15px] text-[#C41C1C] font-bold text-right px-5 py-4">
                      {fmt(salario.promedio)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Senior</td>
                    <td className="font-sans text-[13px] text-[#666] px-5 py-4">7+ años</td>
                    <td className="font-sans text-[15px] text-[#121212] font-bold text-right px-5 py-4">
                      {fmt(salario.max)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-sans text-[12px] text-[#999] mt-3">
              Fuente: {salario.fuente}
            </p>
          </section>

          {/* Cómo aumentar ingresos */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-2">
              ¿Cómo aumentar tus ingresos como {profesion.nombre}?
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed mb-6">
              Más allá del empleo tradicional, los {profesion.nombre}s en {pais.nombre} tienen
              múltiples formas de incrementar sus ingresos significativamente.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Card 1 */}
              <div className="border border-[#DEDEDE] p-5">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-3">
                  01
                </p>
                <h3 className="font-serif text-[17px] font-bold text-[#121212] mb-2">
                  Especialización
                </h3>
                <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                  Enfocarte en un nicho dentro de {profesion.area} puede multiplicar tu tarifa
                  por 2 o 3 veces frente al promedio del mercado.
                </p>
              </div>

              {/* Card 2 */}
              <div className="border border-[#DEDEDE] p-5">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-3">
                  02
                </p>
                <h3 className="font-serif text-[17px] font-bold text-[#121212] mb-2">
                  Consultoría independiente
                </h3>
                <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                  Ofrecer servicios directos a empresas y particulares como freelance te da
                  control total sobre tu tarifa y clientes.
                </p>
              </div>

              {/* Card 3 — Nebbuler CTA */}
              <div className="border border-[#121212] bg-[#121212] p-5">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
                  03
                </p>
                <h3 className="font-serif text-[17px] font-bold text-white mb-2">
                  Monetizar en Nebbuler
                </h3>
                <p className="font-sans text-[13px] text-[#AAA] leading-relaxed mb-4">
                  Publica newsletters de pago con tu expertise. Suscripciones directas,
                  0% de comisión, con pagos en tu moneda local.
                </p>
                <Link
                  href="/registro"
                  className="inline-block font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-2 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
                >
                  Abrir mi sala →
                </Link>
              </div>
            </div>
          </section>

          {/* Comparación con otros países */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Comparación: {profesion.nombreMayus} en otros países
            </h2>
            <div className="grid gap-2">
              {paisesComparacion.map(otroPais => {
                const otroDato = SALARIOS[profesionSlug]?.[otroPais.slug]
                if (!otroDato) return null
                return (
                  <Link
                    key={otroPais.slug}
                    href={`/salario/${profesionSlug}/${otroPais.slug}`}
                    className="flex items-center justify-between border border-[#DEDEDE] px-5 py-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <span className="font-sans text-[14px] text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                      {otroPais.emoji} {profesion.nombreMayus} en {otroPais.nombre}
                    </span>
                    <span className="font-sans text-[14px] font-bold text-[#121212]">
                      {otroPais.simbolo}{otroDato.promedio.toLocaleString('es-CL')} {otroPais.moneda}/mes
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* FAQ inline */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Preguntas frecuentes
            </h2>
            <div className="grid gap-6">
              <div>
                <h3 className="font-sans text-[15px] font-bold text-[#121212] mb-2">
                  ¿Cuánto gana un {profesion.nombre} junior en {pais.nombre}?
                </h3>
                <p className="font-sans text-[14px] text-[#555] leading-relaxed">
                  Un {profesion.nombre} con menos de 3 años de experiencia en {pais.nombre} gana
                  aproximadamente {fmt(salario.min)} {pais.moneda} al mes. Este monto varía según
                  el sector, la ciudad y el tamaño de la empresa.
                </p>
              </div>
              <div>
                <h3 className="font-sans text-[15px] font-bold text-[#121212] mb-2">
                  ¿Cuánto gana un {profesion.nombre} senior en {pais.nombre}?
                </h3>
                <p className="font-sans text-[14px] text-[#555] leading-relaxed">
                  Los {profesion.nombre}s con más de 7 años de experiencia y especialización
                  pueden alcanzar {fmt(salario.max)} {pais.moneda} al mes o más. Los consultores
                  independientes suelen superar estos montos.
                </p>
              </div>
              <div>
                <h3 className="font-sans text-[15px] font-bold text-[#121212] mb-2">
                  ¿Cómo cobra un {profesion.nombre} en {pais.nombre} por conocimiento digital?
                </h3>
                <p className="font-sans text-[14px] text-[#555] leading-relaxed">
                  Plataformas como Nebbuler permiten a los {profesion.nombre}s en {pais.nombre}
                  crear salas de suscripción mensual con pagos en tu moneda local, sin comisión, publicando
                  análisis y guías de valor para sus suscriptores.
                </p>
              </div>
            </div>
          </section>

          {/* CTA final */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Para {profesion.nombre}s en {pais.nombre}
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
              ¿Eres {profesion.nombre}? Monetiza tu conocimiento.
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed max-w-lg mx-auto">
              Publica contenido de pago en Nebbuler en tu moneda local — sin comisión.
              Tarifa fija mensual. 100% de tus suscripciones es tuyo.
            </p>
            <Link
              href="/registro"
              className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors"
            >
              Abrir mi sala en Nebbuler →
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
