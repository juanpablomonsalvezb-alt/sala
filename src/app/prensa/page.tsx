import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'

export const metadata: Metadata = {
  title: 'Sala de prensa — Nebbuler',
  description: 'Recursos para periodistas: bio del fundador, ángulos de cobertura, datos sobre la economía del conocimiento en LATAM y contacto de prensa.',
  alternates: { canonical: 'https://nebbuler.com/prensa' },
  openGraph: {
    title: 'Sala de prensa — Nebbuler',
    description: 'Recursos para periodistas. Bio, ángulos de cobertura y contacto.',
    url: 'https://nebbuler.com/prensa',
  },
}

const ANGULOS = [
  {
    titulo: 'La Generación X y la IA: el profesional senior como mayor beneficiado',
    bajada: 'Mientras la conversación sobre IA la dominan jóvenes de 25 años en Silicon Valley, los profesionales latinoamericanos mayores de 40 tienen algo que la IA no puede replicar: décadas de criterio acumulado. Juan Pablo Monsalvez explica por qué el senior es el gran ganador de la IA, si sabe cobrar por su conocimiento.',
    keywords: ['IA', 'Generación X', 'trabajo independiente', 'profesionales senior'],
  },
  {
    titulo: 'Por qué los latinoamericanos no cobran por su conocimiento (y no es falta de audiencia)',
    bajada: 'Hay millones de profesionales en LATAM publicando análisis de calidad gratis en LinkedIn. El problema no es la audiencia — es que nunca existió infraestructura para cobrar en pesos. La historia de Nebbuler y lo que revela sobre la economía del conocimiento en América Latina.',
    keywords: ['economía del conocimiento', 'membresías', 'LATAM', 'fintech'],
  },
  {
    titulo: 'El profesional de 45 años que cobra más que nunca gracias a la IA',
    bajada: 'Psicólogos, consultores, abogados y nutricionistas independientes descubren que la IA no los reemplaza — los complementa. Su experiencia acumulada vale más cuando la IA hace el trabajo genérico. Nebbuler construyó la plataforma para que ese valor se traduzca en ingresos recurrentes.',
    keywords: ['profesionales independientes', 'IA', 'membresías', 'monetización'],
  },
  {
    titulo: 'Substack cobra el 10%, opera en dólares y no entiende LATAM',
    bajada: 'Las plataformas de membresías globales fueron diseñadas para el mercado anglosajón. Para un economista colombiano que quiere cobrar a su audiencia en pesos, la fricción es enorme. Cómo Nebbuler resolvió el problema que Substack, Patreon y Kajabi ignoraron.',
    keywords: ['Substack', 'Patreon', 'plataformas digitales', 'LATAM', 'fintech'],
  },
]

const DATOS = [
  { cifra: 'US$19/mes', descripcion: 'Tarifa fija. 0% comisión variable sobre ingresos del creador.' },
  { cifra: '18 países', descripcion: 'LATAM hispanohablante: desde México hasta Argentina.' },
  { cifra: '2026', descripcion: 'Año de fundación. Plataforma en producción desde abril 2026.' },
  { cifra: 'MercadoPago', descripcion: 'Pagos directos en moneda local. El dinero va al creador sin pasar por Nebbuler.' },
]

export default function PrensaPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-14">

          {/* Header */}
          <div className="mb-12">
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-3">
              Sala de prensa
            </p>
            <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-bold text-[#121212] leading-tight mb-4">
              Recursos para periodistas
            </h1>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed max-w-xl">
              Contacto directo, bio del fundador, ángulos de cobertura y datos sobre la economía del conocimiento en América Latina.
            </p>
            <div className="mt-6">
              <a
                href="mailto:prensa@nebbuler.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] text-white font-sans text-[13px] font-semibold hover:bg-[#333] transition-colors"
              >
                prensa@nebbuler.com →
              </a>
            </div>
          </div>

          <div className="h-px bg-[#DEDEDE] mb-12" />

          {/* Fundador */}
          <section className="mb-14">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#999] mb-6">
              El fundador
            </h2>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-[#121212] flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-[22px] font-bold text-white">JP</span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-1">
                  Juan Pablo Monsalvez
                </h3>
                <p className="font-sans text-[13px] text-[#C41C1C] font-semibold mb-4">
                  Fundador de Nebbuler · Experto en economía del conocimiento en LATAM
                </p>
                <div className="space-y-3 font-sans text-[14px] text-[#555] leading-relaxed mb-5">
                  <p>
                    Juan Pablo Monsalvez es fundador de Nebbuler, la primera plataforma de membresías diseñada específicamente para profesionales independientes en América Latina. Construyó Nebbuler para resolver un problema concreto: los profesionales latinoamericanos con décadas de experiencia tienen conocimiento acumulado que la inteligencia artificial no puede replicar, pero no tienen infraestructura para cobrar por ese conocimiento en su propia moneda.
                  </p>
                  <p>
                    Su área de expertise cubre la intersección entre la Generación X, los profesionales senior y la inteligencia artificial: cómo los trabajadores independientes con más experiencia están respondiendo al avance de la IA, y por qué —contrario al miedo predominante— son ellos quienes más tienen que ganar en la economía del conocimiento que viene.
                  </p>
                  <p>
                    Disponible para entrevistas, citas y columnas de opinión en medios de negocios, tecnología y economía laboral en América Latina.
                  </p>
                </div>
                <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#999] mb-2">
                    Bio corta (para pie de foto / cita en nota)
                  </p>
                  <p className="font-sans text-[13px] text-[#444] leading-relaxed italic">
                    "Juan Pablo Monsalvez es fundador de Nebbuler, plataforma de membresías para profesionales independientes en América Latina. Especialista en cómo la Generación X y los profesionales senior están monetizando el conocimiento que la IA no puede reemplazar."
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-[#DEDEDE] mb-12" />

          {/* Ángulos */}
          <section className="mb-14">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#999] mb-6">
              Ángulos de cobertura sugeridos
            </h2>
            <div className="space-y-7">
              {ANGULOS.map((a, i) => (
                <div key={i} className="border-l-2 border-[#C41C1C] pl-5">
                  <h3 className="font-serif text-[16px] font-bold text-[#121212] mb-2 leading-snug">
                    {a.titulo}
                  </h3>
                  <p className="font-sans text-[13px] text-[#555] leading-relaxed mb-3">
                    {a.bajada}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.keywords.map((kw) => (
                      <span key={kw} className="font-sans text-[10px] uppercase tracking-[0.07em] text-[#999] border border-[#E5E5E5] px-2 py-0.5">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-[#DEDEDE] mb-12" />

          {/* Datos */}
          <section className="mb-14">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#999] mb-6">
              Nebbuler en datos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DATOS.map((d, i) => (
                <div key={i} className="border border-[#DEDEDE] p-4">
                  <p className="font-serif text-[1.2rem] font-bold text-[#121212] mb-1">{d.cifra}</p>
                  <p className="font-sans text-[11px] text-[#666] leading-snug">{d.descripcion}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-[#DEDEDE] mb-12" />

          {/* Sobre Nebbuler */}
          <section className="mb-14">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#999] mb-4">
              Sobre Nebbuler (para boilerplate)
            </h2>
            <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-5">
              <p className="font-sans text-[13px] text-[#444] leading-relaxed italic">
                "Nebbuler es una plataforma de membresías para profesionales independientes de América Latina. Psicólogos, coaches, consultores, abogados y analistas abren su sala, publican su contenido y reciben pagos recurrentes en moneda local — sin comisión variable. Opera en 18 países de LATAM hispanohablante con pagos directos vía MercadoPago. Precio: US$19/mes. nebbuler.com"
              </p>
            </div>
          </section>

          {/* Contacto */}
          <div className="bg-[#121212] text-white p-6">
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#AAAAAA] mb-3">
              Contacto de prensa
            </p>
            <p className="font-serif text-[18px] font-bold mb-1">Juan Pablo Monsalvez</p>
            <p className="font-sans text-[13px] text-[#AAAAAA] mb-4">Fundador, Nebbuler</p>
            <a
              href="mailto:prensa@nebbuler.com"
              className="font-sans text-[14px] text-[#C41C1C] hover:underline"
            >
              prensa@nebbuler.com
            </a>
            <p className="font-sans text-[12px] text-[#666] mt-3">
              Tiempo de respuesta habitual: menos de 24 horas. Disponible para entrevistas en español.
            </p>
          </div>

        </div>
      </main>
    </>
  )
}
