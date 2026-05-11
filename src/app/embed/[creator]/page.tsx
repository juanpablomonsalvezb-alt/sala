import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { creators } from '@/data/creators'

export const metadata: Metadata = {
  robots: 'noindex',
}

interface Props {
  params: Promise<{ creator: string }>
}

export default async function EmbedPage({ params }: Props) {
  const { creator: slug } = await params
  const found = creators.find((c) => c.slug === slug)
  if (!found) notFound()

  const initial = found.name.charAt(0).toUpperCase()
  const priceFormatted = found.price_clp.toLocaleString('es-CL')

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Public+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #ffffff;
            font-family: 'Public Sans', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </head>
      <body>
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #DEDEDE',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#ffffff',
            position: 'relative',
          }}
        >
          {/* Logo Nebbuler top-right */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '14px',
              fontFamily: "'Libre Baskerville', serif",
              fontSize: '11px',
              color: '#999',
              letterSpacing: '0.04em',
              fontWeight: 400,
            }}
          >
            NEBBULER
          </div>

          {/* Avatar + nombre + especialidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '80px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#C41C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                {initial}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#121212',
                  lineHeight: 1.2,
                }}
              >
                {found.name}
              </div>
              <div
                style={{
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: '11px',
                  color: '#888',
                  marginTop: '2px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {found.specialty}
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div style={{ height: '1px', background: '#F0F0F0', margin: '0 -2px' }} />

          {/* Últimas 3 publicaciones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {found.articles.map((title, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <div
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#121212',
                    lineHeight: 1.35,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontSize: '10px',
                    color: '#999',
                  }}
                >
                  Última publicación
                </div>
              </div>
            ))}
          </div>

          {/* Precio */}
          <div
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: '13px',
              color: '#121212',
              fontWeight: 700,
            }}
          >
            Desde ${priceFormatted}/mes
          </div>

          {/* Botón suscribirse */}
          <a
            href={`https://nebbuler.com/suscribirse/${found.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#C41C1C',
              color: '#ffffff',
              textAlign: 'center',
              padding: '9px 12px',
              borderRadius: '3px',
              fontFamily: "'Public Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Suscribirse
          </a>

          {/* Powered by */}
          <div
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: '10px',
              color: '#999',
              textAlign: 'center',
              marginTop: '-4px',
            }}
          >
            Powered by{' '}
            <a
              href="https://nebbuler.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#999', textDecoration: 'none' }}
            >
              Nebbuler
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
