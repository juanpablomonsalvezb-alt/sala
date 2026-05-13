import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 86400 // 24h ISR

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('generated_pages')
    .select('specialty, country_code')
    .eq('status', 'published')
    .limit(100)

  return (pages || []).map(p => ({
    specialty: (p.specialty || 'general').toLowerCase().replace(/\s+/g, '-'),
    country: p.country_code || 'CL',
  }))
}

async function getPageContent(specialty: string, country: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('generated_pages')
    .select('*')
    .eq('specialty', specialty)
    .eq('country_code', country)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string; country: string }>
}): Promise<Metadata> {
  const { specialty, country } = await params
  const page = await getPageContent(specialty, country)

  if (!page) {
    return { title: 'No encontrado' }
  }

  return {
    title: `${page.keyword} — Guía profesional`,
    description: page.content_markdown?.slice(0, 160) || 'Artículo profesional',
    openGraph: {
      title: `${page.keyword} — Guía profesional`,
      description: page.content_markdown?.slice(0, 160) || 'Artículo profesional',
      url: `https://nebbuler.com/${specialty}-${country}`,
    },
  }
}

export default async function GeneratedPageComponent({
  params,
}: {
  params: Promise<{ specialty: string; country: string }>
}) {
  const { specialty, country } = await params
  const page = await getPageContent(specialty, country)

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">
            Nebbuler
          </Link>
          <span>/</span>
          <span className="capitalize">{specialty}</span>
          <span>/</span>
          <span>{country}</span>
        </nav>

        <article>
          <h1 className="font-serif text-4xl font-bold text-[#121212] mb-4">
            {page.keyword}
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Publicado: {new Date(page.created_at).toLocaleDateString('es-CL')}
          </p>

          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: page.content_html || '' }}
          />

          <hr className="my-12" />

          <section className="bg-gray-50 p-8 rounded-lg">
            <h3 className="font-serif text-xl font-bold mb-4">
              Conecta con expertos en {page.specialty}
            </h3>
            <p className="text-gray-700 mb-6">
              En Nebbuler encontrarás profesionales verificados especializados en {page.specialty}.
              Accede a boletines especializados y aprende directamente de expertos.
            </p>
            <Link
              href="/directorio"
              className="inline-block bg-[#121212] text-white px-6 py-3 rounded hover:bg-gray-800 transition"
            >
              Explorar directorio de expertos
            </Link>
          </section>
        </article>
      </div>
    </main>
  )
}
