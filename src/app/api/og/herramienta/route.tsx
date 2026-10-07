import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const clip = (s: string | null, n: number) => (s ?? '').slice(0, n)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const label = clip(searchParams.get('t'), 60) || 'Herramienta gratuita'
  const value = clip(searchParams.get('v'), 24)
  const sub = clip(searchParams.get('s'), 110)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          padding: '60px 80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 12, height: 40, background: '#C41C1C' }} />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.1em' }}>NEBBULER</span>
          </div>
          <span
            style={{
              fontSize: 18,
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 600,
            }}
          >
            Herramientas
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 26,
              color: '#C41C1C',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {label}
          </span>
          {value ? (
            <span style={{ fontSize: 150, fontWeight: 700, color: '#121212', lineHeight: 1 }}>
              {value}
            </span>
          ) : null}
          {sub ? (
            <span style={{ fontSize: 32, color: '#555', marginTop: 24, lineHeight: 1.3 }}>{sub}</span>
          ) : null}
        </div>

        <span style={{ fontSize: 22, color: '#999' }}>Calcula el tuyo gratis en nebbuler.com/herramientas</span>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
