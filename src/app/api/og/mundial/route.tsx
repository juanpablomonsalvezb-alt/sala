import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
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
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -150,
            width: 500,
            height: 500,
            background: '#C41C1C',
            filter: 'blur(140px)',
            opacity: 0.35,
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -150,
            width: 450,
            height: 450,
            background: '#1C3FC4',
            filter: 'blur(140px)',
            opacity: 0.3,
            borderRadius: '50%',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 60,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 14,
                height: 48,
                background: 'linear-gradient(180deg, #C41C1C 0%, #1C3FC4 100%)',
              }}
            />
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.08em' }}>
              NEBBULER
            </span>
          </div>
          <span
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Programa Mundial 2026
          </span>
        </div>

        {/* Big title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 140,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 24,
            }}
          >
            La Sombra.
          </span>
          <span
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.3,
              maxWidth: 920,
            }}
          >
            Mientras Substack te cobra <span style={{ color: '#C41C1C', fontWeight: 700 }}>10%</span>{' '}
            durante el Mundial, vos cobrás{' '}
            <span style={{ fontStyle: 'italic', color: 'white', fontWeight: 600 }}>en pesos</span>,
            con <span style={{ color: '#C41C1C', fontWeight: 700 }}>0% comisión</span> hasta el 31 de julio.
          </span>
        </div>

        {/* Footer */}
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
            nebbuler.com/mundial
          </span>
          <span
            style={{
              fontSize: 20,
              color: '#FFFFFF',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            🇦🇷 🇧🇷 🇲🇽 🇨🇴 🇺🇾 🇪🇨 🇨🇱 🇵🇪
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
