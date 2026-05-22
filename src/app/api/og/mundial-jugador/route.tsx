import { ImageResponse } from 'next/og'
import jugadoresData from '@/data/mundial-jugadores.json'

export const runtime = 'edge'

interface Jugador {
  slug: string
  nombre_completo: string
  seleccion: string
  bandera: string
  posicion: string
  club_2026: string
  mundiales_jugados: number
  apodo?: string
  caso_especial?: string
}

const JUGADORES: Jugador[] = (jugadoresData as { jugadores: Jugador[] }).jugadores

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? 'lionel-messi'
  const j = JUGADORES.find((x) => x.slug === slug) ?? JUGADORES[0]

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
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
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
            marginBottom: 40,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 12, height: 44, background: '#C41C1C' }} />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.08em' }}>NEBBULER</span>
          </div>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>Mundial 2026 · La Sombra</span>
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
          <span style={{ fontSize: 100, lineHeight: 1, marginBottom: 8 }}>{j.bandera}</span>
          <span
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 10,
            }}
          >
            {j.nombre_completo}
          </span>
          {j.apodo && (
            <span
              style={{
                fontSize: 32,
                color: 'rgba(255,255,255,0.6)',
                fontStyle: 'italic',
                marginBottom: 18,
              }}
            >
              "{j.apodo}"
            </span>
          )}
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)' }}>
            {j.seleccion} · <span style={{ textTransform: 'capitalize' }}>{j.posicion}</span> · {j.club_2026}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 22,
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
            nebbuler.com/mundial/jugador/{j.slug}
          </span>
          <span
            style={{
              fontSize: 18,
              color: '#C41C1C',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            {j.mundiales_jugados === 0 ? 'DEBUT' : `${j.mundiales_jugados}° MUNDIAL`}
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
