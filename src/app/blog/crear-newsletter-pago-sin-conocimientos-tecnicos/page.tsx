import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Cómo crear una newsletter de pago sin conocimientos técnicos — Nebbuler',
  description: 'Crea una newsletter de pago sin conocimientos técnicos. Guía para profesionales LATAM que quieren cobrar por su contenido sin programar nada.',
  alternates: { canonical: 'https://nebbuler.com/blog/crear-newsletter-pago-sin-conocimientos-tecnicos' },
  openGraph: {
    title: 'Cómo crear una newsletter de pago sin conocimientos técnicos',
    description: 'La barrera técnica ya no existe. 5 pasos para lanzar tu newsletter de pago esta semana.',
    type: 'article',
    url: 'https://nebbuler.com/blog/crear-newsletter-pago-sin-conocimientos-tecnicos',
    publishedTime: '2026-05-16T00:00:00Z',
  },
}

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo crear una newsletter de pago sin conocimientos técnicos',
  description: 'Guía para profesionales LATAM que quieren monetizar su conocimiento sin programar.',
  datePublished: '2026-05-16',
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  url: 'https://nebbuler.com/blog/crear-newsletter-pago-sin-conocimientos-tecnicos',
}

const PASOS = [
  { paso: '1', titulo: 'Define tu nicho y a quién le cobras', desc: 'No necesitas una audiencia masiva. Necesitas claridad: ¿quién paga por leer lo que sabes? Economistas → lectores con decisiones financieras. Abogados → empresas que necesitan alertas legales. Médicos → pacientes informados o colegas.' },
  { paso: '2', titulo: 'Crea tu cuenta en Nebbuler', desc: 'Toma 5 minutos. No pides ningún dato técnico. Defines tu perfil profesional, el nombre de tu newsletter y listo. No hay código, no hay servidores.' },
  { paso: '3', titulo: 'Configura el precio y conecta tu pago', desc: 'Defines cuánto cobras por mes. Nebbuler te conecta con MercadoPago en un clic. Tu suscriptor paga con su tarjeta local, tú recibes en tu cuenta. 0% de comisión.' },
  { paso: '4', titulo: 'Escribe tu primer número', desc: 'No tiene que ser perfecto. Tiene que ser útil. Un análisis de 600–1200 palabras sobre algo que tu audiencia necesita entender hoy. Ese es tu primer número.' },
  { paso: '5', titulo: 'Consigue tus primeros 10 suscriptores', desc: 'Escríbele directamente a 20 contactos de confianza. Cuéntales qué vas a publicar y a qué precio. Pídeles que se suscriban. 10 de esas 20 personas van a decir que sí si tu propuesta es clara.' },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">

          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Nebbuler · Guía de inicio
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-6">
            Cómo crear una newsletter de pago sin conocimientos técnicos
          </h1>

          <p className="font-sans text-lg text-[#444] leading-relaxed mb-10 border-l-4 border-[#C41C1C] pl-5">
            Crear una newsletter de pago sin conocimientos técnicos es completamente posible en 2026. Médicos, abogados, economistas y contadores están construyendo ingresos recurrentes con newsletters sin haber escrito una línea de código. La barrera técnica que existía hace cinco años ya no existe: las plataformas actuales manejan el cobro, la entrega y la gestión de suscriptores automáticamente.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            La objeción que frena a la mayoría: &quot;es que yo no soy técnico&quot;
          </h2>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-4">
            Esta es la objeción más común y la más innecesaria. Crear una newsletter de pago en 2026 requiere el mismo nivel técnico que crear un perfil de LinkedIn. Las plataformas modernas te guían paso a paso: configuras tu perfil, defines el precio de tu suscripción, conectas tu cuenta de pago y empiezas a escribir.
          </p>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-8">
            No hay código. No hay servidores. No hay diseño web. <strong>Solo tu conocimiento y la plataforma que lo gestiona.</strong>
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-6">
            Los 5 pasos para lanzar sin tocar código
          </h2>
          <div className="space-y-4 mb-10">
            {PASOS.map((p) => (
              <div key={p.paso} className="flex gap-5 border-b border-[#DEDEDE] pb-5">
                <div className="shrink-0 w-10 h-10 bg-[#121212] text-white font-serif font-bold text-lg flex items-center justify-center">
                  {p.paso}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-[#121212] mb-1">{p.titulo}</h3>
                  <p className="font-sans text-sm text-[#555] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Lo que NO necesitas (aunque creas que sí)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#FFF5F5] border border-[#FFD0D0] p-5">
              <p className="font-sans font-bold text-sm text-[#C41C1C] mb-3">❌ No necesitas</p>
              <ul className="space-y-1.5 font-sans text-sm text-[#333]">
                {['WordPress o CMS', 'Pasarela de pago propia', 'Diseñador gráfico', 'Programador', 'Miles de seguidores'].map((i) => (
                  <li key={i}>— {i}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#F5FFF5] border border-[#D0FFD0] p-5">
              <p className="font-sans font-bold text-sm text-[#1C7A1C] mb-3">✅ Sí necesitas</p>
              <ul className="space-y-1.5 font-sans text-sm text-[#333]">
                {['Tu expertise profesional', 'Claridad en qué vas a publicar', 'Consistencia para publicar 90 días', 'Nebbuler para gestionar el resto'].map((i) => (
                  <li key={i}>— {i}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-6 mb-10 text-center">
            <p className="font-serif text-xl font-bold text-[#121212]">
              &quot;El 80% de los creadores en Nebbuler lanzaron sin experiencia técnica previa.&quot;
            </p>
            <p className="font-sans text-sm text-[#666] mt-2">Lo único que los diferencia: lo hicieron.</p>
          </div>

          <div className="border-t-4 border-[#121212] bg-[#121212] p-8 text-center mt-12">
            <p className="font-sans text-sm text-[#999] mb-2">Sin código. Sin fricción. Sin excusas.</p>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              Lanza tu newsletter de pago esta semana.
            </h3>
            <Link
              href="/para-creadores"
              className="inline-block bg-[#C41C1C] text-white font-sans font-bold text-sm tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#A01515] transition-colors"
            >
              Empezar en Nebbuler — es gratis →
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
