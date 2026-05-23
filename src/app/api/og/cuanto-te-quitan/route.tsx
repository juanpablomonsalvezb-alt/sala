import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const plataforma = searchParams.get('p') ?? ''
  const perdida = searchParams.get('perdida') ?? ''
  const moneda = searchParams.get('moneda') ?? ''

  // Si tiene params dinámicos → OG personalizado con resultado
  if (plataforma && perdida) {
    const nombres: Record<string, string> = {
      substack: 'Substack',
      patreon: 'Patreon',
      beehiiv: 'Beehiiv',
      gumroad: 'Gumroad',
    }
    const nombre = nombres[plataforma] ?? plataforma
    const monedaLabel = moneda || 'USD'

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0A0A0A',
            color: '#FFFFFF',
            padding: '70px 80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{ width: 14, height: 48, background: '#C41C1C' }} />
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '0.08em' }}>
              NEBBULER
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 18,
                color: '#C41C1C',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Resultado real
            </span>
          </div>

          {/* Result */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 30,
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 16,
              }}
            >
              Cada año pierdo en {nombre}:
            </span>
            <span
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: '#C41C1C',
                lineHeight: 1,
                marginBottom: 20,
                letterSpacing: '-0.03em',
              }}
            >
              US${perdida}
            </span>
            {monedaLabel !== 'USD' && (
              <span
                style={{
                  fontSize: 28,
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 8,
                }}
              >
                en comisiones, conversión y fees ocultos
              </span>
            )}
            <span
              style={{
                fontSize: 26,
                color: '#4CAF50',
                fontWeight: 700,
                marginTop: 16,
              }}
            >
              En Nebbuler me quedo con el 100%. US$19/mes, 0% comisión.
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 24,
              marginTop: 32,
            }}
          >
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)' }}>
              nebbuler.com/cuanto-te-quitan
            </span>
            <span style={{ fontSize: 22, color: '#C41C1C', fontWeight: 700 }}>
              Calcula el tuyo gratis →
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    )
  }

  // Default: OG genérico (sin resultado)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0A0A0A',
          color: '#FFFFFF',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <div style={{ width: 14, height: 48, background: '#C41C1C' }} />
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '0.08em' }}>
            NEBBULER
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 18,
              color: '#C41C1C',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Calculadora honesta
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            ¿Cuánto te está quitando
          </span>
          <span
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ fontStyle: 'italic', color: '#C41C1C' }}>Substack</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>, </span>
            <span style={{ fontStyle: 'italic', color: '#C41C1C' }}>Patreon</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}> o </span>
            <span style={{ fontStyle: 'italic', color: '#C41C1C' }}>Beehiiv</span>
            <span>?</span>
          </span>
          <span
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            Calcula en 10 segundos cuánto pierdes al año por ser creador LATAM en plataformas
            pensadas para EE.UU.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 24,
            marginTop: 32,
          }}
        >
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)' }}>
            nebbuler.com/cuanto-te-quitan
          </span>
          <span style={{ fontSize: 22, color: '#C41C1C', fontWeight: 700 }}>
            Gratis · Sin registro
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
