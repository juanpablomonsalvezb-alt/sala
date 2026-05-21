import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import CopyButton from './_components/CopyButton'

export const metadata: Metadata = {
  title: 'Embebe tu sala en cualquier sitio',
  description:
    'Copia un fragmento de código y muestra tu sala de Nebbuler en Notion, WordPress, Webflow, Substack o tu blog personal. Suscripción directa + backlinks dofollow.',
  alternates: { canonical: 'https://nebbuler.com/embed' },
  openGraph: {
    title: 'Embebe tu sala en cualquier sitio · Nebbuler',
    description:
      'Genera un embed editorial para tu sala. Funciona en Notion, WordPress, Webflow, Squarespace, Carrd, Substack y blogs personales.',
    type: 'website',
    url: 'https://nebbuler.com/embed',
  },
}

export const revalidate = 3600

// ─── Sample slug para preview vivo ────────────────────────────────────────────

async function pickPreviewSlug(): Promise<string> {
  try {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data } = await db
      .from('sala_creators')
      .select('slug')
      .neq('plan', 'free')
      .order('subscriber_count', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data?.slug) return data.slug as string

    const { data: fallback } = await db
      .from('sala_creators')
      .select('slug')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (fallback?.slug) return fallback.slug as string
  } catch {
    // sin DB local
  }
  return 'rodrigo-fuentes-marin'
}

// ─── Snippet renderer ─────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-[#FAFAF7] border border-[#ECECE6] relative">
      <pre
        className="overflow-x-auto p-4 text-[12px] text-[#121212] leading-relaxed"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
      >
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EmbedDocsPage() {
  const previewSlug = await pickPreviewSlug()

  const scriptSnippet = `<script src="https://nebbuler.com/embed.js" data-nebbuler-creator="${previewSlug}" async></script>`
  const iframeSnippet = `<iframe
  src="https://nebbuler.com/embed/iframe/${previewSlug}?size=standard"
  width="100%" height="600" frameborder="0" scrolling="no"
  style="max-width:480px;border:0;background:transparent"
  title="Sala de ${previewSlug} en Nebbuler"
  loading="lazy"></iframe>`
  const buttonSnippet = `<a href="https://nebbuler.com/suscribirse/${previewSlug}"
   style="display:inline-block;background:#C41C1C;color:#fff;padding:12px 22px;font-family:Inter,sans-serif;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:.06em;text-transform:uppercase">
  Suscribirme en Nebbuler
</a>`

  const works = [
    'Notion',
    'WordPress',
    'Webflow',
    'Squarespace',
    'Carrd',
    'Substack',
    'Ghost',
    'Blog personal',
    'Linkedin Pulse',
    'Framer',
  ]

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1080px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        {/* ── Hero ── */}
        <header className="mb-14 lg:mb-20 max-w-3xl">
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-[#C41C1C] font-semibold mb-5"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Embed widget · Para creadores Nebbuler
          </p>
          <h1
            className="text-[2.4rem] lg:text-[3.2rem] font-bold text-[#121212] leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Embebe tu sala en cualquier sitio
          </h1>
          <p
            className="text-[16px] lg:text-[17px] text-[#444] leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Convierte cualquier página — tu Notion público, tu blog, tu LinkedIn o tu portfolio — en
            un canal de captación de suscriptores. Pega una línea de código y muestra una tarjeta
            editorial con tus últimos análisis, tu precio y un botón directo de suscripción.
          </p>
        </header>

        {/* ── Preview vivo + opciones ── */}
        <section className="grid lg:grid-cols-[1fr_480px] gap-10 lg:gap-14 mb-16 items-start">
          <div className="space-y-10">
            {/* Script (recomendado) */}
            <article>
              <div className="flex items-baseline justify-between mb-3">
                <h2
                  className="text-[18px] font-bold text-[#121212]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  1 · Script tag <span className="text-[#C41C1C] text-[12px] uppercase tracking-[0.14em] font-semibold ml-2">Recomendado</span>
                </h2>
              </div>
              <p
                className="text-[13px] text-[#555] mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Una sola línea. Se ajusta al ancho del contenedor y autoresize por altura. Ideal para Notion (vía embed.ly), Webflow, Substack notes.
              </p>
              <CodeBlock code={scriptSnippet} />
            </article>

            {/* Iframe directo */}
            <article>
              <h2
                className="text-[18px] font-bold text-[#121212] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                2 · Iframe directo
              </h2>
              <p
                className="text-[13px] text-[#555] mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Si tu plataforma no permite ejecutar JavaScript externo (WordPress.com gratuito,
                Substack, algunas wikis), usa el iframe directo. Reemplaza
                <code className="px-1 mx-1 bg-[#FAFAF7] border border-[#ECECE6]">size=</code> por
                <code className="px-1 mx-1 bg-[#FAFAF7] border border-[#ECECE6]">compact</code>,
                <code className="px-1 mx-1 bg-[#FAFAF7] border border-[#ECECE6]">standard</code> o
                <code className="px-1 mx-1 bg-[#FAFAF7] border border-[#ECECE6]">expanded</code>.
              </p>
              <CodeBlock code={iframeSnippet} />
            </article>

            {/* Botón estático */}
            <article>
              <h2
                className="text-[18px] font-bold text-[#121212] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                3 · Botón estático HTML
              </h2>
              <p
                className="text-[13px] text-[#555] mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Si solo quieres un CTA simple — sin iframe — pega este botón. Funciona en email
                firmas, footers, sidebars de blog.
              </p>
              <CodeBlock code={buttonSnippet} />
            </article>
          </div>

          {/* Preview en vivo */}
          <aside className="lg:sticky lg:top-10">
            <div
              className="text-[11px] uppercase tracking-[0.18em] text-[#999] font-semibold mb-3"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Vista previa en vivo
            </div>
            <div className="border border-[#ECECE6] bg-[#FAFAF7] p-4 lg:p-6">
              <iframe
                src={`/embed/iframe/${previewSlug}?size=standard`}
                width="100%"
                height="600"
                frameBorder={0}
                scrolling="no"
                style={{ maxWidth: 480, border: 0, background: 'transparent', display: 'block', margin: '0 auto' }}
                title="Vista previa de embed Nebbuler"
                loading="lazy"
              />
            </div>
            <p
              className="text-[11px] text-[#999] mt-3 text-center"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Así se ve un embed real con tamaño <code>standard</code>.
            </p>
          </aside>
        </section>

        {/* ── Funciona en ── */}
        <section className="mb-16 py-12 border-t border-b border-[#ECECE6]">
          <h2
            className="text-[12px] uppercase tracking-[0.22em] text-[#999] font-semibold mb-6 text-center"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Funciona en
          </h2>
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center">
            {works.map((w) => (
              <span
                key={w}
                className="text-[15px] text-[#121212] font-medium"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {w}
              </span>
            ))}
          </div>
        </section>

        {/* ── Detalles técnicos ── */}
        <section className="mb-16 grid md:grid-cols-3 gap-px bg-[#ECECE6] border border-[#ECECE6]">
          {[
            {
              title: 'Backlink dofollow',
              body: 'Cada embed enlaza a tu sala y al sitio Nebbuler con rel sin "nofollow". Mejora tu SEO y el de la red.',
            },
            {
              title: 'Auto-resize sin saltos',
              body: 'El iframe envía postMessage con su altura real. Sin scrollbars, sin huecos.',
            },
            {
              title: 'Schema.org Person',
              body: 'Cada embed inyecta JSON-LD Person/CreativeWork. Google entiende quién eres aunque vivas en un iframe.',
            },
          ].map((b) => (
            <div key={b.title} className="bg-white p-7">
              <h3
                className="text-[15px] font-bold text-[#121212] mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {b.title}
              </h3>
              <p
                className="text-[13px] text-[#555] leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                {b.body}
              </p>
            </div>
          ))}
        </section>

        {/* ── CTA final ── */}
        <section className="text-center py-10">
          <h2
            className="text-[1.8rem] font-bold text-[#121212] mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Genera tu código embed
          </h2>
          <p
            className="text-[14px] text-[#555] mb-7 max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Si ya tienes una sala activa, encontrarás el snippet pre-rellenado en tu dashboard. Si todavía no abriste la tuya, comienza ahora.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#121212] text-white text-[13px] font-semibold px-6 py-3.5 hover:bg-[#2a2a2a] transition-colors"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Ir a mi dashboard →
            </Link>
            <Link
              href="/abrir"
              className="inline-flex items-center gap-2 bg-[#C41C1C] text-white text-[13px] font-semibold px-6 py-3.5 hover:bg-[#a01515] transition-colors"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Abrir mi sala →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
