import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// OG dinámico genérico — usa ?title=...&kicker=...&accent=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'Nebbuler').slice(0, 140)
  const kicker = (searchParams.get('kicker') ?? '').slice(0, 50)
  const accent = (searchParams.get('accent') ?? '').slice(0, 80)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          padding: '70px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 14, height: 48, background: '#C41C1C' }} />
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '0.08em' }}>
              NEBBULER
            </span>
          </div>
          {kicker && (
            <span
              style={{
                fontSize: 18,
                color: '#C41C1C',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                fontWeight: 700,
              }}
            >
              {kicker}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 56 : 72,
            fontWeight: 700,
            color: '#121212',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: 1040,
            fontFamily: 'serif',
          }}
        >
          {title}
        </div>

        {accent && (
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              padding: '16px 24px',
              background: '#FFFBE6',
              borderLeft: '6px solid #C41C1C',
              fontSize: 26,
              color: '#222',
              maxWidth: 1040,
            }}
          >
            {accent}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            fontSize: 22,
            color: '#666',
          }}
        >
          <span>Lo que se piensa bien, dura.</span>
          <span style={{ color: '#C41C1C', fontWeight: 700 }}>nebbuler.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
