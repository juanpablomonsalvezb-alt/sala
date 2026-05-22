import { notFound } from 'next/navigation'
import { SELECCIONES_LATAM, MUNDIAL } from '@/data/mundial-bootstrap'

export const revalidate = 3600

export async function generateStaticParams() {
  return SELECCIONES_LATAM.map((s) => ({ seleccion: s.slug }))
}

// Widget HTML mínimo, sin layout, ideal para iframe embebido en blogs/medios
export default async function WidgetMundialSeleccion({
  params,
}: {
  params: Promise<{ seleccion: string }>
}) {
  const { seleccion: slug } = await params
  const s = SELECCIONES_LATAM.find((x) => x.slug === slug)
  if (!s) notFound()

  const dias = MUNDIAL.dias_para_inicio()

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{s.pais} · Mundial 2026 · Nebbuler Widget</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { background: #050505; color: #fff; font-family: ui-sans-serif, system-ui, sans-serif; min-height: 100vh; }
          .widget { padding: 20px; max-width: 100%; overflow: hidden; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; }
          .brand { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; color: rgba(255,255,255,0.6); }
          .countdown { font-size: 11px; color: #C41C1C; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
          .hero { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
          .flag { font-size: 56px; line-height: 1; }
          .info p { line-height: 1.2; }
          .info .name { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
          .info .nickname { font-size: 14px; color: rgba(255,255,255,0.5); font-style: italic; margin-top: 2px; }
          .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
          .stat { border: 1px solid rgba(255,255,255,0.1); padding: 10px; }
          .stat-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
          .stat-value { font-size: 18px; font-weight: 700; }
          .footer { display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
          .footer a { color: #C41C1C; text-decoration: none; font-weight: 600; }
          .footer a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>
        <div className="widget">
          <div className="header">
            <span className="brand">NEBBULER · LA SOMBRA</span>
            <span className="countdown">Faltan {dias} días</span>
          </div>

          <div className="hero">
            <span className="flag">{s.bandera}</span>
            <div className="info">
              <p className="name">{s.pais}</p>
              <p className="nickname">{s.apodo}</p>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat">
              <p className="stat-label">Moneda</p>
              <p className="stat-value">{s.moneda}</p>
            </div>
            <div className="stat">
              <p className="stat-label">Creadores</p>
              <p className="stat-value">~{s.creadores_potenciales}</p>
            </div>
            <div className="stat">
              <p className="stat-label">Comisión</p>
              <p className="stat-value" style={{ color: '#C41C1C' }}>
                0%
              </p>
            </div>
          </div>

          <div className="footer">
            <span>Programa La Sombra · Mundial 2026</span>
            <a
              href={`https://nebbuler.com/mundial/${s.slug}?utm_source=widget&utm_medium=embed`}
              target="_blank"
              rel="noopener"
            >
              nebbuler.com/mundial →
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
