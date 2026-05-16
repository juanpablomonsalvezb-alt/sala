import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog — Nebbuler: Guías para profesionales LATAM',
  description: 'Guías, estrategias y casos reales para que economistas, abogados, médicos y contadores moneticen su conocimiento en Latinoamérica.',
  alternates: { canonical: 'https://nebbuler.com/blog' },
  openGraph: {
    title: 'Blog Nebbuler — Monetiza tu conocimiento profesional en LATAM',
    description: 'Guías prácticas para profesionales que quieren cobrar por su expertise.',
    type: 'website',
    url: 'https://nebbuler.com/blog',
  },
}

const POSTS = [
  {
    slug: 'plataforma-newsletter-de-pago-espanol',
    title: 'La mejor plataforma de newsletter de pago en español para profesionales',
    excerpt: 'Por qué las plataformas en inglés no funcionan para LATAM y qué buscar en una alternativa regional.',
    tag: 'Plataforma',
  },
  {
    slug: 'como-monetizar-conocimientos-economia',
    title: 'Cómo monetizar tus conocimientos de economía: guía para economistas en LATAM',
    excerpt: 'Los 4 modelos para que economistas en LATAM cobren por su análisis. Con números reales.',
    tag: 'Economistas',
  },
  {
    slug: 'newsletter-de-pago-para-abogados',
    title: 'Newsletter de pago para abogados: cómo cobrar por tu conocimiento jurídico',
    excerpt: 'El modelo de ingreso recurrente para abogados que ya funciona en México, Colombia y Argentina.',
    tag: 'Abogados',
  },
  {
    slug: 'cobrar-analisis-financiero-online-latinoamerica',
    title: 'Cómo cobrar por tus análisis financieros online en Latinoamérica',
    excerpt: 'El mercado de análisis financiero en español está desatendido. Esta guía te muestra cómo monetizarlo.',
    tag: 'Finanzas',
  },
  {
    slug: 'crear-newsletter-pago-sin-conocimientos-tecnicos',
    title: 'Cómo crear una newsletter de pago sin conocimientos técnicos',
    excerpt: 'La barrera técnica ya no existe. 5 pasos para lanzar tu newsletter esta semana.',
    tag: 'Guía práctica',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[#DEDEDE]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
            Nebbuler · Blog
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-4">
            Guías para monetizar tu conocimiento
          </h1>
          <p className="font-sans text-base text-[#666] max-w-xl leading-relaxed">
            Para economistas, abogados, médicos y contadores en LATAM que quieren cobrar por su expertise.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="divide-y divide-[#DEDEDE]">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block py-8 group hover:bg-[#FAFAFA] -mx-4 px-4 transition-colors"
            >
              <span className="inline-block text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">
                {post.tag}
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-[#121212] leading-snug mb-2 group-hover:text-[#C41C1C] transition-colors">
                {post.title}
              </h2>
              <p className="font-sans text-sm text-[#666] leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
