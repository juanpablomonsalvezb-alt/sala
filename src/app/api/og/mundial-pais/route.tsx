import { ImageResponse } from 'next/og'
import { SELECCIONES_LATAM } from '@/data/mundial-bootstrap'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? 'argentina'
  const s =
    SELECCIONES_LATAM.find((x) => x.slug === slug) ?? SELECCIONES_LATAM[0]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#050505',
          color: '#FFFFFF',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -100,
            width: 400,
            height: 400,
            background: '#C41C1C',
            filter: 'blur(120px)',
            opacity: 0.4,
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 48,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 14, height: 48, background: '#C41C1C' }} />
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.08em' }}>
              NEBBULER · LA SOMBRA
            </span>
          </div>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            Mundial 2026
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 140, lineHeight: 1, marginBottom: 16 }}>{s.bandera}</span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 12,
            }}
          >
            Creadores de {s.pais}
          </span>
          <span
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic',
              marginBottom: 24,
            }}
          >
            {s.apodo}
          </span>
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', maxWidth: 900 }}>
            0% comisión durante el Mundial. Cobrá en {s.moneda} a tu hinchada.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 24,
            marginTop: 32,
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>
            nebbuler.com/mundial/{s.slug}
          </span>
          <span
            style={{ fontSize: 20, color: '#C41C1C', fontWeight: 700, letterSpacing: '0.1em' }}
          >
            APLICAR
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
