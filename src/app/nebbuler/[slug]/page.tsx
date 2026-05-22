import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/nav'
import { NEBBULER_POSTS } from '@/data/nebbuler-posts'

export const revalidate = 86400

export async function generateStaticParams() {
  return NEBBULER_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = NEBBULER_POSTS.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: `${post.title} · Nebbuler`,
    description: post.excerpt,
    alternates: { canonical: `https://nebbuler.com/nebbuler/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://nebbuler.com/nebbuler/${post.slug}`,
      type: 'article',
      publishedTime: post.isoDate,
    },
  }
}

export default async function NebbulerPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = NEBBULER_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const otherPosts = NEBBULER_POSTS.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-12">

          {/* Breadcrumb */}
          <nav className="text-xs text-[#999] mb-8">
            <Link href="/nebbuler" className="hover:text-[#121212]">
              Equipo Nebbuler
            </Link>
            {' / '}
            <span className="text-[#555]">{post.title.slice(0, 40)}…</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C41C1C] flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-[13px] font-bold text-white leading-none">N</span>
              </div>
              <div>
                <span className="font-sans text-[12px] font-semibold text-[#121212]">Equipo Nebbuler</span>
                <span className="text-[#DEDEDE] mx-2">·</span>
                <time dateTime={post.isoDate} className="font-sans text-[12px] text-[#999]">
                  {post.date}
                </time>
                <span className="text-[#DEDEDE] mx-2">·</span>
                <span className="font-sans text-[12px] text-[#999]">{post.readingTime} min de lectura</span>
              </div>
            </div>

            <h1 className="font-serif text-[28px] md:text-[34px] font-bold text-[#121212] leading-tight mb-4">
              {post.title}
            </h1>

            <p className="font-sans text-[15px] text-[#555] leading-relaxed border-l-2 border-[#C41C1C] pl-4">
              {post.excerpt}
            </p>
          </header>

          <div className="h-px bg-[#DEDEDE] mb-10" />

          {/* Content */}
          <article
            className="prose prose-slate max-w-none
              prose-headings:font-serif prose-headings:text-[#121212] prose-headings:font-bold
              prose-h2:text-[22px] prose-h2:mt-10 prose-h2:mb-4
              prose-p:font-sans prose-p:text-[15px] prose-p:text-[#333] prose-p:leading-[1.7] prose-p:mb-5
              prose-strong:text-[#121212] prose-strong:font-semibold
              prose-a:text-[#C41C1C] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="h-px bg-[#DEDEDE] mt-12 mb-10" />

          {/* Más artículos */}
          {otherPosts.length > 0 && (
            <section className="mb-10">
              <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#999] mb-5">
                Más del equipo Nebbuler
              </h2>
              <div className="space-y-4">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/nebbuler/${p.slug}`}
                    className="block border border-[#DEDEDE] bg-white p-4 hover:border-[#C41C1C] transition-colors group"
                  >
                    <h3 className="font-serif text-[15px] font-bold text-[#121212] leading-snug group-hover:text-[#C41C1C] transition-colors mb-1">
                      {p.title}
                    </h3>
                    <p className="font-sans text-[12px] text-[#999]">{p.date} · {p.readingTime} min</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="border border-[#DEDEDE] bg-[#F7F7F7] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-[15px] font-bold text-[#121212] mb-0.5">
                ¿Eres profesional independiente?
              </p>
              <p className="font-sans text-[12px] text-[#666]">
                Abre tu sala y cobra por tu conocimiento. 0% comisión.
              </p>
            </div>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] text-white font-sans text-[12px] font-semibold uppercase tracking-[0.06em] hover:bg-[#333] transition-colors whitespace-nowrap"
            >
              Abre tu sala →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
