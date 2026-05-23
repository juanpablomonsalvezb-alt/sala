'use client'

/**
 * "Powered by Nebbuler" badge — se incrusta en las páginas públicas de cada creador.
 * Cada impresión = backlink orgánico + brand awareness.
 * Estilo: minimalista, no intrusivo, clickeable.
 */
export function PoweredByBadge({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'

  return (
    <a
      href="https://nebbuler.com?ref=badge"
      target="_blank"
      rel="noopener"
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium
        tracking-[0.06em] transition-all duration-200 no-underline
        ${isDark
          ? 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/10'
          : 'bg-black/[0.03] text-black/40 hover:text-black/70 hover:bg-black/[0.06] border border-black/[0.06]'
        }
      `}
      title="Crea tu membresía en Nebbuler — 0% comisión"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect x="2" y="4" width="4" height="16" fill="#C41C1C" />
        <path d="M10 4h4l6 16h-4l-1.5-4h-5L8 20H4L10 4Z" fill="currentColor" />
      </svg>
      Powered by <span className="font-bold">Nebbuler</span>
    </a>
  )
}

/**
 * Embed snippet para creadores — copian este HTML en su blog/web.
 * Lo mostramos en el dashboard del creador.
 */
export const EMBED_SNIPPET = `<!-- Powered by Nebbuler -->
<a href="https://nebbuler.com?ref=badge" target="_blank" rel="noopener"
   style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font-size:11px;
   font-family:system-ui,sans-serif;color:rgba(0,0,0,0.4);background:rgba(0,0,0,0.03);
   border:1px solid rgba(0,0,0,0.06);text-decoration:none;letter-spacing:0.06em;">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="4" height="16" fill="#C41C1C"/>
    <path d="M10 4h4l6 16h-4l-1.5-4h-5L8 20H4L10 4Z" fill="currentColor"/>
  </svg>
  Powered by <strong>Nebbuler</strong>
</a>`
