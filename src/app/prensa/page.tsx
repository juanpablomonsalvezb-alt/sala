import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press Kit — Nebbuler',
  description: 'Material de prensa, logos, cifras y contacto para periodistas y medios sobre Nebbuler.',
  alternates: { canonical: 'https://nebbuler.com/prensa' },
}

export default function PrensaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
            NEBBULER
          </Link>
          <Link
            href="/directorio"
            className="font-sans text-[12px] font-medium text-[#666] hover:text-[#121212] transition-colors"
          >
            Ver directorio →
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <nav className="font-sans text-[12px] text-[#999] mb-12">
          <Link href="/" className="hover:text-[#121212]">Inicio</Link>
          <span className="mx-2">·</span>
          <span className="text-[#121212]">Prensa</span>
        </nav>

        {/* Hero */}
        <div className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h1 className="font-serif text-[3rem] font-bold text-[#121212] leading-[1.1] mb-6">
            Press Kit — Nebbuler
          </h1>
          <p className="font-sans text-[18px] text-[#555] leading-relaxed mb-8">
            La plataforma que conecta profesionales latinoamericanos con suscriptores que pagan por su expertise. Sin comisión. Tarifa fija de $29.990 CLP/mes.
          </p>
          <a
            href="mailto:prensa@nebbuler.com"
            className="font-sans text-[14px] font-bold text-[#C41C1C] hover:underline"
          >
            Contacto para prensa: prensa@nebbuler.com
          </a>
        </div>

        {/* Key Facts */}
        <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-8">
            Datos clave
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-serif text-[32px] font-bold text-[#C41C1C] mb-2">18</p>
              <p className="font-sans text-[14px] text-[#555]">Países en América Latina</p>
            </div>
            <div>
              <p className="font-serif text-[32px] font-bold text-[#C41C1C] mb-2">0%</p>
              <p className="font-sans text-[14px] text-[#555]">Comisión sobre suscripciones</p>
            </div>
            <div>
              <p className="font-serif text-[32px] font-bold text-[#C41C1C] mb-2">396</p>
              <p className="font-sans text-[14px] text-[#555]">Análisis de expertos verificados</p>
            </div>
          </div>
        </section>

        {/* Misión */}
        <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Misión
          </h2>
          <p className="font-sans text-[16px] text-[#333] leading-[1.8] mb-4">
            En América Latina hay un gap enorme: millones de personas y empresas toman decisiones críticas sin acceso a análisis riguroso y especializado. Al mismo tiempo, hay miles de economistas, abogados, médicos, analistas financieros con expertise profunda que no tienen canales para monetizar su conocimiento directo.
          </p>
          <p className="font-sans text-[16px] text-[#333] leading-[1.8]">
            Nebbuler conecta estos dos mundos. Permitimos que profesionales verificados publiquen análisis de calidad premium y cobren directamente a sus lectores, sin intermediarios, sin comisión, en su moneda local.
          </p>
        </section>

        {/* Modelo */}
        <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-8">
            Modelo de negocio
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-3">Para creadores</h3>
              <p className="font-sans text-[14px] text-[#555] mb-3">
                Tarifa fija de $29.990 CLP/mes (~$35 USD). 0% de comisión sobre suscripciones. Pagos en moneda local en 18 países.
              </p>
              <ul className="font-sans text-[14px] text-[#666] space-y-2">
                <li>• Plataforma de publicación editorial premium</li>
                <li>• Sistema de suscripciones integrado</li>
                <li>• Analytics y reportes de suscriptores</li>
                <li>• Verificación de expertise (e-credentials)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-3">Para lectores</h3>
              <p className="font-sans text-[14px] text-[#555] mb-3">
                Acceso a análisis especializado de economistas, abogados, médicos, analistas verificados. Suscripción directa sin intermediarios.
              </p>
            </div>
          </div>
        </section>

        {/* Cifras de tracción */}
        <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-8">
            Tracción (2026)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-serif text-[24px] font-bold text-[#121212] mb-2">396 análisis</p>
              <p className="font-sans text-[13px] text-[#666]">20 profesiones × 15 países + 50 casos de estudio + 50 FAQs</p>
            </div>
            <div>
              <p className="font-serif text-[24px] font-bold text-[#121212] mb-2">751 rutas SSG</p>
              <p className="font-sans text-[13px] text-[#666]">Pre-renderizadas estáticamente para máxima performance</p>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Logo y marca
          </h2>
          <p className="font-sans text-[14px] text-[#666] mb-6">
            Descarga assets en alta resolución en{' '}
            <a href="https://drive.google.com" className="text-[#C41C1C] font-bold hover:underline">
              nuestro press kit en Google Drive
            </a>
            .
          </p>
          <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-8 text-center">
            <p className="font-serif text-[32px] font-bold text-[#121212]">NEBBULER</p>
            <p className="font-sans text-[12px] text-[#999] mt-2">Logo principal — marca registrada</p>
          </div>
        </section>

        {/* Historias de creadores */}
        <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-8">
            Creadores en Nebbuler
          </h2>
          <p className="font-sans text-[14px] text-[#666] mb-8">
            Economistas, abogados, médicos, analistas financieros, consultores empresariales y otros profesionales verificados que publican análisis especializado.
          </p>
          <div className="border border-[#DEDEDE] p-6">
            <p className="font-sans text-[13px] text-[#999]">
              Las historias de creadores y análisis de mercado están disponibles en{' '}
              <Link href="/directorio" className="text-[#C41C1C] font-bold hover:underline">
                el directorio público de Nebbuler
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Contacto */}
        <section>
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Contacto
          </h2>
          <div className="space-y-4">
            <p className="font-sans text-[14px]">
              <strong className="text-[#121212]">Email de prensa:</strong>{' '}
              <a href="mailto:prensa@nebbuler.com" className="text-[#C41C1C] hover:underline">
                prensa@nebbuler.com
              </a>
            </p>
            <p className="font-sans text-[14px]">
              <strong className="text-[#121212]">General:</strong>{' '}
              <a href="mailto:hola@nebbuler.com" className="text-[#C41C1C] hover:underline">
                hola@nebbuler.com
              </a>
            </p>
            <p className="font-sans text-[14px]">
              <strong className="text-[#121212]">Web:</strong>{' '}
              <a href="https://nebbuler.com" className="text-[#C41C1C] hover:underline">
                nebbuler.com
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
