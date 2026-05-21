import { ImageResponse } from 'next/og'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const revalidate = 3600

interface TopCreator {
  name: string
  slug: string
  specialty: string | null
  subscriber_count: number
}

export async function GET() {
  let top: TopCreator[] = []
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('sala_creators')
      .select('name, slug, specialty, subscriber_count')
      .order('subscriber_count', { ascending: false })
      .limit(5)
    top = (data ?? []) as TopCreator[]
  } catch {
    top = []
  }

  // Placeholders si Supabase está vacío
  while (top.length < 5) {
    top.push({
      name: 'Esperando creador',
      slug: '',
      specialty: 'Reservado',
      subscriber_count: 0,
    })
  }

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
            Leaderboard 2026
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 700,
            color: '#121212',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: 1060,
            marginBottom: 28,
          }}
        >
          Los profesionales más leídos en LATAM
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            borderTop: '2px solid #121212',
            paddingTop: 18,
          }}
        >
          {top.slice(0, 5).map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                paddingBottom: 8,
                borderBottom: '1px solid #DEDEDE',
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#C41C1C',
                  width: 60,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#121212',
                  flex: 1,
                }}
              >
                {c.name}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: '#666',
                  fontFamily: 'sans-serif',
                }}
              >
                {c.specialty ?? '—'}
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
            color: '#666',
            fontFamily: 'sans-serif',
          }}
        >
          <span>Ranking en vivo — actualizado cada hora</span>
          <span style={{ color: '#C41C1C', fontWeight: 700 }}>nebbuler.com/leaderboard</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
