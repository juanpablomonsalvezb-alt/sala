import { ImageResponse } from 'next/og'
import { PAISES, PROFESIONES, SALARIOS } from '@/data/salarios'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const profesionSlug = searchParams.get('profesion') ?? ''
  const paisSlug = searchParams.get('pais') ?? ''

  const profesion = PROFESIONES.find((p) => p.slug === profesionSlug)
  const pais = PAISES.find((p) => p.slug === paisSlug)
  const salario = SALARIOS[profesionSlug]?.[paisSlug]

  if (!profesion || !pais || !salario) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: '#FFFBE6',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
            fontWeight: 700,
            color: '#121212',
          }}
        >
          Nebbuler
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const fmt = (n: number) =>
    `${pais.simbolo}${n.toLocaleString('es-CL')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          padding: '60px 80px',
          fontFamily: 'serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 40,
                background: '#C41C1C',
              }}
            />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.1em' }}>
              NEBBULER
            </span>
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
            {profesion.area} · {pais.nombre}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 700,
            color: '#121212',
            lineHeight: 1.1,
            marginBottom: 30,
            maxWidth: 950,
          }}
        >
          ¿Cuánto gana un {profesion.nombre} en {pais.nombre}?
        </div>

        {/* Salary highlight */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 40px',
            background: '#F7F7F7',
            border: '2px solid #E0E0E0',
            marginBottom: 30,
          }}
        >
          <span style={{ fontSize: 18, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
            Salario promedio mensual
          </span>
          <span style={{ fontSize: 88, fontWeight: 700, color: '#121212', lineHeight: 1 }}>
            {fmt(salario.promedio)} {pais.moneda}
          </span>
        </div>

        {/* Bottom */}
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
          <span>Rango: {fmt(salario.min)} → {fmt(salario.max)}</span>
          <span style={{ color: '#C41C1C', fontWeight: 600 }}>nebbuler.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
