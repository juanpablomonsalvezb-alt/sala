import { ImageResponse } from 'next/og'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const revalidate = 21600

interface Keyword {
  keyword: string
  search_volume: number | null
  monthly_growth: number | null
  country_code: string | null
}

const FALLBACK: Keyword[] = [
  { keyword: 'inteligencia artificial latam', search_volume: 49000, monthly_growth: 38, country_code: 'AR' },
  { keyword: 'monetizar conocimiento', search_volume: 22000, monthly_growth: 64, country_code: 'CL' },
  { keyword: 'membresías profesionales', search_volume: 14000, monthly_growth: 51, country_code: 'MX' },
]

export async function GET() {
  let kws: Keyword[] = []
  try {
    const supabase = createServiceClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
    const { data } = await supabase
      .from('trending_keywords')
      .select('keyword, search_volume, monthly_growth, country_code')
      .gte('created_at', sevenDaysAgo)
      .order('monthly_growth', { ascending: false })
      .limit(3)
    kws = (data ?? []) as Keyword[]
  } catch {
    kws = []
  }
  if (kws.length === 0) kws = FALLBACK

  const semana = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#121212',
          color: '#FAFAF7',
          padding: '60px 70px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 26,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 12, height: 44, background: '#C41C1C' }} />
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '0.18em',
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
            Pulse · Semana del {semana}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            color: '#FAFAF7',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: 1060,
            marginBottom: 36,
          }}
        >
          Lo que está moviendo a LATAM esta semana
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            borderTop: '2px solid #C41C1C',
            paddingTop: 24,
          }}
        >
          {kws.slice(0, 3).map((k, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 22,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#C41C1C',
                  width: 50,
                  fontFamily: 'sans-serif',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  flex: 1,
                  textTransform: 'capitalize',
                }}
              >
                {k.keyword}
              </span>
              <span
                style={{
                  fontSize: 22,
                  color: '#9CCC65',
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                }}
              >
                +{Math.round(k.monthly_growth ?? 0)}%
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: 24,
            fontSize: 18,
            color: '#999',
            fontFamily: 'sans-serif',
          }}
        >
          <span>Actualizado cada 6 horas</span>
          <span style={{ color: '#C41C1C', fontWeight: 700 }}>nebbuler.com/pulse</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
