import Link from 'next/link'
import CopyButton from '../../embed/_components/CopyButton'

interface Props {
  slug: string
}

export default function EmbedCodeCard({ slug }: Props) {
  const scriptSnippet = `<script src="https://nebbuler.com/embed.js" data-nebbuler-creator="${slug}" async></script>`
  const iframeSnippet = `<iframe src="https://nebbuler.com/embed/iframe/${slug}?size=standard" width="100%" height="600" frameborder="0" scrolling="no" style="max-width:480px;border:0" title="Mi sala en Nebbuler" loading="lazy"></iframe>`
  const buttonSnippet = `<a href="https://nebbuler.com/suscribirse/${slug}" style="display:inline-block;background:#C41C1C;color:#fff;padding:12px 22px;font-family:Inter,sans-serif;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:.06em;text-transform:uppercase">Suscribirme en Nebbuler</a>`

  const formats = [
    {
      key: 'script',
      title: 'Script tag',
      tag: 'Recomendado',
      desc: 'Una línea, autoresize, ancho 100%. Pega en Notion, blogs, sitios personales.',
      code: scriptSnippet,
    },
    {
      key: 'iframe',
      title: 'Iframe directo',
      tag: 'Sin JS',
      desc: 'Para plataformas que bloquean script externo (WordPress.com, Substack).',
      code: iframeSnippet,
    },
    {
      key: 'button',
      title: 'Botón HTML',
      tag: 'Mínimo',
      desc: 'CTA estático para email firmas, footers o sidebars.',
      code: buttonSnippet,
    },
  ]

  return (
    <section className="bg-white border border-[#DEDEDE]">
      <div className="px-6 py-4 border-b border-[#DEDEDE] flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#121212]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Embebe tu sala
          </h2>
          <p
            className="text-[12px] text-[#666] mt-1"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Pega cualquiera de estos snippets en tu sitio para capturar suscriptores desde fuera de Nebbuler.
          </p>
        </div>
        <Link
          href={`/embed/iframe/${slug}?size=expanded`}
          target="_blank"
          rel="noopener"
          className="text-[12px] text-[#C41C1C] hover:underline font-medium"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Ver vista previa →
        </Link>
      </div>

      <div className="divide-y divide-[#DEDEDE]">
        {formats.map((f) => (
          <div key={f.key} className="px-6 py-5">
            <div className="flex items-center gap-3 mb-1">
              <h3
                className="text-[14px] font-bold text-[#121212]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {f.title}
              </h3>
              <span
                className="text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#FAFAF7] border border-[#ECECE6] text-[#666] font-semibold"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                {f.tag}
              </span>
            </div>
            <p
              className="text-[12px] text-[#666] mb-3 leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {f.desc}
            </p>
            <div className="bg-[#FAFAF7] border border-[#ECECE6] relative">
              <pre
                className="overflow-x-auto p-3 pr-24 text-[11px] text-[#121212] leading-relaxed"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
              >
                <code>{f.code}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={f.code} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 border-t border-[#DEDEDE] bg-[#FAFAF7]">
        <Link
          href="/embed"
          className="text-[12px] text-[#666] hover:text-[#C41C1C] transition-colors"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Documentación completa de embeds →
        </Link>
      </div>
    </section>
  )
}
