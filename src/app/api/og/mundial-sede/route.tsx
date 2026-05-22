import { ImageResponse } from 'next/og'
import sedesData from '@/data/mundial-sedes-detalle.json'

export const runtime = 'edge'

interface Sede {
  slug: string
  ciudad: string
  pais: string
  estadio_nombre_oficial: string
  capacidad_mundial: number
  partidos_asignados: number
  rol_especial?: string
}

const SEDES: Sede[] = (sedesData as { sedes: Sede[] }).sedes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? 'ciudad-de-mexico'
  const s = SEDES.find((x) => x.slug === slug) ?? SEDES[0]

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
            bottom: -100,
            left: -100,
            width: 500,
            height: 500,
            background: '#1C3FC4',
            filter: 'blur(140px)',
            opacity: 0.3,
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
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>Sede · Mundial 2026</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', zIndex: 1 }}>
          <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>{s.pais}</span>
          <span
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}
          >
            {s.ciudad}
          </span>
          <span
            style={{
              fontSize: 38,
              color: 'rgba(255,255,255,0.75)',
              fontStyle: 'italic',
              marginBottom: 24,
            }}
          >
            {s.estadio_nombre_oficial}
          </span>
          <div style={{ display: 'flex', gap: 32 }}>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)' }}>
              {s.capacidad_mundial.toLocaleString('en-US')} espectadores
            </span>
            <span style={{ fontSize: 22, color: '#C41C1C', fontWeight: 700 }}>
              {s.partidos_asignados} partido{s.partidos_asignados > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 22,
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
            nebbuler.com/mundial/sede/{s.slug}
          </span>
          <span style={{ fontSize: 18, color: '#C41C1C', fontWeight: 700 }}>LA SOMBRA</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
