// Quote-as-Image Viral Engine — endpoint Satori
// Genera imagen 1080x1080 (IG square) o 1080x1920 (IG story) a partir del
// texto seleccionado por el lector. Diseño editorial NYT-like.
//
// Params:
//   ?text=     (obligatorio, 20-280 chars)
//   ?author=   (opcional, nombre del creador)
//   ?username= (opcional, slug del creador)
//   ?postUrl=  (opcional, URL completa del post para footer)
//   ?format=   (opcional, '1:1' default | '9:16')
//   ?avatar=   (opcional, URL a la foto circular del creador)
//
// Cache: 1h public, sirve desde edge. No usa Supabase (todo via query string)
// para que pueda generarse sin hits a DB en cada share.

import { ImageResponse } from '@vercel/og'

export const runtime = 'nodejs'
export const revalidate = 3600

const BRAND_RED = '#C41C1C'
const BRAND_BLACK = '#121212'
const BRAND_CREAM = '#FAFAF7'
const BRAND_MUTED = '#6B6B68'

// Limites duros para evitar abuso del endpoint
const MIN_TEXT = 20
const MAX_TEXT = 280
const MAX_AUTHOR = 60
const MAX_USERNAME = 60
const MAX_POSTURL = 200

let cachedPlayfair: ArrayBuffer | null = null
let cachedPlayfairItalic: ArrayBuffer | null = null
let cachedInter: ArrayBuffer | null = null

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { cache: 'force-cache' })
  if (!res.ok) throw new Error(`Failed to fetch font: ${url}`)
  return await res.arrayBuffer()
}

async function loadFonts() {
  // Google Fonts CSS API — extraemos el .ttf raw para Satori
  if (!cachedPlayfair) {
    cachedPlayfair = await fetchFont(
      'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf'
    )
  }
  if (!cachedPlayfairItalic) {
    cachedPlayfairItalic = await fetchFont(
      'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf'
    )
  }
  if (!cachedInter) {
    cachedInter = await fetchFont(
      'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf'
    )
  }
  return {
    playfair: cachedPlayfair,
    playfairItalic: cachedPlayfairItalic,
    inter: cachedInter,
  }
}

function sanitize(input: string | null, max: number): string {
  if (!input) return ''
  // strip control chars (0x00-0x1F y 0x7F) + recortar
  // eslint-disable-next-line no-control-regex
  const cleaned = input.replace(/[\x00-\x1F\x7F]/g, '').trim()
  return cleaned.length > max ? cleaned.slice(0, max - 1) + '…' : cleaned
}

function quoteFontSize(textLen: number, isStory: boolean): number {
  // Escalado tipográfico: frases cortas se ven más grandes
  if (isStory) {
    if (textLen < 80) return 76
    if (textLen < 140) return 64
    if (textLen < 200) return 54
    return 46
  }
  if (textLen < 80) return 72
  if (textLen < 140) return 60
  if (textLen < 200) return 50
  return 42
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const text = sanitize(url.searchParams.get('text'), MAX_TEXT)
    const author = sanitize(url.searchParams.get('author'), MAX_AUTHOR)
    const username = sanitize(url.searchParams.get('username'), MAX_USERNAME)
    const postUrl = sanitize(url.searchParams.get('postUrl'), MAX_POSTURL)
    const avatarParam = url.searchParams.get('avatar')
    const format = url.searchParams.get('format') === '9:16' ? '9:16' : '1:1'

    if (!text || text.length < MIN_TEXT) {
      return new Response(
        `Texto requerido (${MIN_TEXT}-${MAX_TEXT} chars)`,
        { status: 400 }
      )
    }

    const isStory = format === '9:16'
    const width = isStory ? 1080 : 1080
    const height = isStory ? 1920 : 1080

    const { playfair, playfairItalic, inter } = await loadFonts()

    // Avatar URL solo si es https y de dominios permitidos (anti-SSRF básico)
    let avatarSrc: string | null = null
    if (avatarParam) {
      try {
        const av = new URL(avatarParam)
        const allowed = ['supabase.co', 'supabase.in', 'githubusercontent.com', 'gravatar.com', 'nebbuler.com']
        if (av.protocol === 'https:' && allowed.some((d) => av.hostname.endsWith(d))) {
          avatarSrc = av.toString()
        }
      } catch {
        avatarSrc = null
      }
    }

    const fontSize = quoteFontSize(text.length, isStory)
    const padding = isStory ? 88 : 72
    const footerUrl = postUrl
      ? postUrl.replace(/^https?:\/\//, '')
      : username
        ? `nebbuler.com/${username}`
        : 'nebbuler.com'

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: BRAND_CREAM,
            padding,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'Inter',
            position: 'relative',
          }}
        >
          {/* Header — masthead estilo periódico */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `2px solid ${BRAND_BLACK}`,
              paddingBottom: 18,
            }}
          >
            <div
              style={{
                fontFamily: 'Playfair',
                fontSize: isStory ? 38 : 34,
                fontWeight: 900,
                color: BRAND_BLACK,
                letterSpacing: -1,
              }}
            >
              Nebbuler
            </div>
            <div
              style={{
                fontSize: isStory ? 18 : 16,
                fontWeight: 600,
                color: BRAND_MUTED,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Periodismo independiente
            </div>
          </div>

          {/* Quote body */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: isStory ? 60 : 30,
              paddingBottom: isStory ? 60 : 30,
              position: 'relative',
            }}
          >
            {/* Comilla tipográfica gigante */}
            <div
              style={{
                fontFamily: 'Playfair',
                fontSize: isStory ? 280 : 220,
                lineHeight: 1,
                color: BRAND_RED,
                position: 'absolute',
                top: isStory ? 20 : -10,
                left: -8,
                fontWeight: 900,
                opacity: 0.95,
              }}
            >
              “
            </div>

            <div
              style={{
                fontFamily: 'PlayfairItalic',
                fontSize,
                fontStyle: 'italic',
                lineHeight: 1.28,
                color: BRAND_BLACK,
                letterSpacing: -0.5,
                marginTop: isStory ? 140 : 110,
                zIndex: 2,
                display: 'flex',
              }}
            >
              {text}
            </div>

            {/* Línea roja divisora */}
            <div
              style={{
                marginTop: 40,
                width: 96,
                height: 4,
                background: BRAND_RED,
              }}
            />
          </div>

          {/* Footer — atribución */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${BRAND_BLACK}`,
              paddingTop: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  width={isStory ? 84 : 72}
                  height={isStory ? 84 : 72}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${BRAND_BLACK}`,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: isStory ? 84 : 72,
                    height: isStory ? 84 : 72,
                    borderRadius: '50%',
                    background: BRAND_BLACK,
                    color: BRAND_CREAM,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Playfair',
                    fontSize: isStory ? 38 : 32,
                    fontWeight: 900,
                  }}
                >
                  {(author || 'N').slice(0, 1).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontFamily: 'Playfair',
                    fontSize: isStory ? 32 : 28,
                    fontWeight: 700,
                    color: BRAND_BLACK,
                    letterSpacing: -0.5,
                  }}
                >
                  {author || 'Nebbuler'}
                </div>
                {username && (
                  <div
                    style={{
                      fontSize: isStory ? 18 : 16,
                      color: BRAND_MUTED,
                      marginTop: 4,
                    }}
                  >
                    @{username}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  fontSize: isStory ? 16 : 14,
                  color: BRAND_MUTED,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  fontWeight: 600,
                }}
              >
                Lee la nota completa
              </div>
              <div
                style={{
                  fontFamily: 'Playfair',
                  fontSize: isStory ? 22 : 20,
                  fontWeight: 700,
                  color: BRAND_RED,
                  marginTop: 4,
                  maxWidth: isStory ? 480 : 420,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                }}
              >
                {footerUrl}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
        fonts: [
          { name: 'Playfair', data: playfair, style: 'normal', weight: 700 },
          { name: 'PlayfairItalic', data: playfairItalic, style: 'italic', weight: 700 },
          { name: 'Inter', data: inter, style: 'normal', weight: 500 },
        ],
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    )
  } catch (error) {
    console.error('[og/quote] error:', error)
    return new Response('Internal error generating quote image', { status: 500 })
  }
}
