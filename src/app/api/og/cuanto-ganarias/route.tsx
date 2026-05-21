import { ImageResponse } from 'next/og'
import { estimarIngresos, PROFESSIONS_CONFIG, COUNTRIES_CONFIG, formatLocal } from '@/lib/ingresos-estimator'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const profesionSlug = searchParams.get('profesion') ?? PROFESSIONS_CONFIG[0].slug
  const paisCode = searchParams.get('pais') ?? 'CL'
  const followers = parseInt(searchParams.get('followers') ?? '5000', 10)
  const horasSemana = parseInt(searchParams.get('horas') ?? '8', 10)

  const profesion =
    PROFESSIONS_CONFIG.find(p => p.slug === profesionSlug) ?? PROFESSIONS_CONFIG[0]
  const pais =
    COUNTRIES_CONFIG.find(c => c.code === paisCode) ?? COUNTRIES_CONFIG[0]

  const result = estimarIngresos({
    profesionSlug: profesion.slug,
    paisCode: pais.code,
    followers: isFinite(followers) ? followers : 5000,
    horasSemana: isFinite(horasSemana) ? horasSemana : 8,
  })

  const ingresoStr = formatLocal(
    result.nebbuler.ingresoMensualNeto,
    result.precioSugerido.locale,
    result.precioSugerido.symbol
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#FAFAF7',
          padding: '60px 70px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 12, height: 44, background: '#C41C1C' }} />
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#121212',
              }}
            >
              NEBBULER
            </span>
          </div>
          <span
            style={{
              fontSize: 16,
              color: '#C41C1C',
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              fontWeight: 700,
            }}
          >
            Calculadora de ingresos
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#666',
            fontFamily: 'sans-serif',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          {profesion.nombre} en {pais.nombre}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#121212',
            marginBottom: 18,
            fontFamily: 'sans-serif',
          }}
        >
          Con {followers.toLocaleString('es-CL')} seguidores podrías generar
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 110,
            fontWeight: 700,
            color: '#C41C1C',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}
        >
          {ingresoStr}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#121212',
            marginBottom: 28,
            fontFamily: 'sans-serif',
          }}
        >
          /mes — netos con Nebbuler
        </div>

        <div
          style={{
            display: 'flex',
            gap: 20,
            borderTop: '2px solid #121212',
            paddingTop: 18,
          }}
        >
          <ComparativaBox
            nombre="Nebbuler"
            valor={formatLocal(result.nebbuler.ingresoMensualNeto, result.precioSugerido.locale, result.precioSugerido.symbol)}
            highlight
          />
          <ComparativaBox
            nombre="Substack"
            valor={formatLocal(result.substack.ingresoMensualNeto, result.precioSugerido.locale, result.precioSugerido.symbol)}
            sub="−10%"
          />
          <ComparativaBox
            nombre="Patreon"
            valor={formatLocal(result.patreon.ingresoMensualNeto, result.precioSugerido.locale, result.precioSugerido.symbol)}
            sub="−8%"
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            fontSize: 18,
            color: '#666',
            fontFamily: 'sans-serif',
          }}
        >
          <span>Calcula el tuyo →</span>
          <span style={{ color: '#C41C1C', fontWeight: 700 }}>
            nebbuler.com/cuanto-podrias-ganar
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

function ComparativaBox({
  nombre,
  valor,
  sub,
  highlight,
}: {
  nombre: string
  valor: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '16px 20px',
        background: highlight ? '#121212' : '#FFFFFF',
        color: highlight ? '#FAFAF7' : '#121212',
        border: highlight ? 'none' : '1px solid #DEDEDE',
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontFamily: 'sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: highlight ? '#C41C1C' : '#999',
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {nombre}
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {valor}
      </span>
      {sub && (
        <span
          style={{
            fontSize: 14,
            fontFamily: 'sans-serif',
            color: highlight ? '#FAFAF7' : '#999',
            marginTop: 2,
          }}
        >
          {sub} comisión
        </span>
      )}
    </div>
  )
}
