// OG image templates for Nebbuler — used by /api/og/* routes
// OG_ENABLED=true/false controls whether dynamic OG is active

import { ImageResponse } from '@vercel/og'

export interface OGPostData {
  title: string
  creatorName: string
  creatorSpecialty: string
  interactionCount?: number
  publishedAt?: string
}

export interface OGCreatorData {
  name: string
  specialty: string
  bio: string
  subscriberCount?: number
  price?: number
}

const BRAND_RED = '#C41C1C'
const BRAND_BLACK = '#121212'

export function buildPostOGResponse(data: OGPostData): ImageResponse {
  const title = data.title.length > 80 ? data.title.slice(0, 77) + '...' : data.title

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: `linear-gradient(145deg, ${BRAND_BLACK} 0%, #1e1e1e 100%)`,
        padding: '64px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: BRAND_RED, letterSpacing: '-0.5px' }}>
          Nebbuler
        </div>
        <div style={{ fontSize: 16, color: '#555', marginTop: 2 }}>·</div>
        <div style={{ fontSize: 16, color: '#888' }}>{data.creatorSpecialty}</div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: title.length > 60 ? 44 : 56,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.25,
          letterSpacing: '-1px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {title}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #2a2a2a',
          paddingTop: '28px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{data.creatorName}</div>
          {data.publishedAt && (
            <div style={{ fontSize: 16, color: '#666' }}>{data.publishedAt}</div>
          )}
        </div>
        {data.interactionCount !== undefined && data.interactionCount > 0 && (
          <div
            style={{
              fontSize: 16,
              color: '#888',
              background: '#1e1e1e',
              border: '1px solid #333',
              borderRadius: 8,
              padding: '8px 16px',
            }}
          >
            {data.interactionCount} lectores
          </div>
        )}
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}

export function buildCreatorOGResponse(data: OGCreatorData): ImageResponse {
  const bio = data.bio.length > 120 ? data.bio.slice(0, 117) + '...' : data.bio

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#fff',
        padding: '64px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        border: '8px solid #f5f5f5',
      }}
    >
      {/* Nombre y especialidad */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: BRAND_BLACK, letterSpacing: '-2px', lineHeight: 1 }}>
          {data.name}
        </div>
        <div
          style={{
            fontSize: 22,
            color: BRAND_RED,
            fontWeight: 600,
            background: '#fff5f5',
            border: `1px solid #fecaca`,
            borderRadius: 8,
            padding: '6px 16px',
            display: 'inline-flex',
            width: 'fit-content',
          }}
        >
          {data.specialty}
        </div>
      </div>

      {/* Bio */}
      <div style={{ fontSize: 26, color: '#444', lineHeight: 1.5, flex: 1, display: 'flex', alignItems: 'center' }}>
        {bio}
      </div>

      {/* Stats + branding */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {data.subscriberCount !== undefined && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: BRAND_BLACK }}>
                {data.subscriberCount.toLocaleString('es-CL')}
              </div>
              <div style={{ fontSize: 16, color: '#888' }}>suscriptores</div>
            </div>
          )}
          {data.price && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: BRAND_BLACK }}>
                ${data.price.toLocaleString('es-CL')}
              </div>
              <div style={{ fontSize: 16, color: '#888' }}>CLP / mes</div>
            </div>
          )}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: BRAND_RED }}>nebbuler.com</div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}

export function buildFallbackOGResponse(): Response {
  return Response.redirect('https://nebbuler.com/og-default.png', 302)
}
