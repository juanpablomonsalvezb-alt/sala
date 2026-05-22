import { ImageResponse } from 'next/og'
import mundialData from '@/data/mundial-2026.json'

export const runtime = 'edge'

type Grupo = { id: string; selecciones: string[]; cabeza_serie: string }
const GRUPOS: Grupo[] = (mundialData as { grupos: Grupo[] }).grupos

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = (searchParams.get('id') ?? 'A').toUpperCase()
  const grupo = GRUPOS.find((g) => g.id.toUpperCase() === id) ?? GRUPOS[0]

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
            left: -100,
            width: 450,
            height: 450,
            background: '#C41C1C',
            filter: 'blur(140px)',
            opacity: 0.35,
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 14, height: 48, background: '#C41C1C' }} />
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.08em' }}>NEBBULER</span>
          </div>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>
            La Sombra · Mundial 2026
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
          <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
            Fase de Grupos
          </span>
          <span
            style={{
              fontSize: 200,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              marginBottom: 24,
            }}
          >
            Grupo <span style={{ color: '#C41C1C', fontStyle: 'italic' }}>{grupo.id}</span>
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {grupo.selecciones.map((s) => (
              <span
                key={s}
                style={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px 18px',
                  fontSize: 26,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 24,
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }}>
            nebbuler.com/mundial/grupo/{grupo.id.toLowerCase()}
          </span>
          <span style={{ fontSize: 20, color: '#C41C1C', fontWeight: 700 }}>
            0% COMISIÓN
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
