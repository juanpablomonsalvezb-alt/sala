import type { Metadata } from 'next'
import { FounderSubscribeForm } from './founder-subscribe-form'
import Link from 'next/link'
import Nav from '@/components/nav'

export const metadata: Metadata = {
  title: 'Construyendo Nebbuler · Build in Public desde Chile',
  description:
    'El equipo de Nebbuler publica 2 veces por semana sobre el proceso de construir una plataforma de newsletters profesionales desde Chile. Métricas reales, decisiones de producto, errores y aprendizajes.',
  openGraph: {
    title: 'Construyendo Nebbuler · Build in Public desde Chile',
    description:
      'El equipo de Nebbuler publica 2 veces por semana: métricas reales, decisiones de producto, errores y aprendizajes.',
    url: 'https://nebbuler.com/nebbuler',
  },
}

const POSTS = [
  {
    id: 1,
    title: 'Cero a lanzamiento: los primeros 30 días construyendo Nebbuler',
    date: '8 mayo 2026',
    isoDate: '2026-05-08',
    excerpt:
      'Arrancamos desde una hoja en blanco y en 30 días teníamos un producto en producción con los primeros creadores. Acá el registro exacto de decisiones, errores y lo que haríamos diferente.',
  },
  {
    id: 2,
    title: 'Por qué elegimos MercadoPago y no Stripe para Chile',
    date: '5 mayo 2026',
    isoDate: '2026-05-05',
    excerpt:
      'Stripe es la opción obvia para cualquier SaaS, pero en Chile la tasa de conversión con tarjetas locales lo cambia todo. Detallamos los números que nos hicieron cambiar de decisión.',
  },
  {
    id: 3,
    title: 'El stack técnico de Nebbuler: Next.js 16, Supabase, Vercel y lo que aprendimos',
    date: '1 mayo 2026',
    isoDate: '2026-05-01',
    excerpt:
      'Un recorrido por cada pieza del stack que elegimos, qué funcionó desde el día uno y qué tuvimos que refactorizar a la semana de lanzar.',
  },
]

export default function NebbulerPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Cabecera del creador */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-[#C41C1C] flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-[22px] font-bold text-white leading-none">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-serif text-[22px] font-bold text-[#121212] leading-tight">
                  Equipo Nebbuler
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#C41C1C] rounded text-white font-sans text-[9px] uppercase tracking-[0.08em] font-semibold">
                  Oficial
                </span>
              </div>
              <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#999]">
                CONSTRUYENDO EN PÚBLICO
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-4">
            El equipo detrás de Nebbuler. Publicamos 2 veces por semana sobre el proceso de
            construir una plataforma de newsletters profesionales desde Chile: métricas reales,
            decisiones de producto, errores y aprendizajes.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-8">
            <span className="font-sans text-[12px] text-[#666]">12 publicaciones</span>
            <span className="text-[#DEDEDE]">·</span>
            <span className="font-sans text-[12px] text-[#666]">Desde mayo 2026</span>
            <span className="text-[#DEDEDE]">·</span>
            <span className="font-sans text-[12px] text-[#999]">2× por semana</span>
          </div>

          <div className="h-px bg-[#DEDEDE] mb-8" />

          {/* Lista de posts */}
          <section className="space-y-6 mb-12">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#999]">
              Publicaciones recientes
            </h2>
            {POSTS.map((post) => (
              <article key={post.id} className="border border-[#DEDEDE] bg-white p-5 rounded">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif text-[16px] font-bold text-[#121212] leading-snug flex-1">
                    {post.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#F0FFF4] border border-[#BBEECC] font-sans text-[9px] uppercase tracking-[0.06em] text-[#2A7A47] font-semibold whitespace-nowrap flex-shrink-0">
                    Gratuito
                  </span>
                </div>
                <time
                  dateTime={post.isoDate}
                  className="block font-sans text-[11px] text-[#999] mb-3"
                >
                  {post.date}
                </time>
                <p className="font-sans text-[13px] text-[#555] leading-relaxed">{post.excerpt}</p>
              </article>
            ))}
          </section>

          <div className="h-px bg-[#DEDEDE] mb-8" />

          {/* Formulario de suscripción */}
          <section className="mb-10">
            <h2 className="font-serif text-[20px] font-bold text-[#121212] mb-1">
              Suscríbete gratis
            </h2>
            <p className="font-sans text-[13px] text-[#666] mb-5">
              Recibe cada publicación directo en tu correo. Sin spam.
            </p>
            <FounderSubscribeForm />
          </section>

          {/* CTA para creadores */}
          <div className="border border-[#DEDEDE] bg-[#F7F7F7] rounded p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-[15px] font-bold text-[#121212] mb-0.5">
                ¿Eres profesional?
              </p>
              <p className="font-sans text-[12px] text-[#666]">
                Abre tu sala y cobra por tu conocimiento. 0% comisión.
              </p>
            </div>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] text-white rounded font-sans text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#333] transition-colors duration-150 whitespace-nowrap"
            >
              Abre tu sala →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
