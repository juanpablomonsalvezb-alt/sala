import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface QuotePayload {
  q?: string
  a?: string
}

function decodeId(id: string): { quoteText: string; authorName: string } {
  // Intentar decodificar como base64url (citas inline sin DB)
  try {
    const base64 = id.replace(/-/g, '+').replace(/_/g, '/')
    const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
    const decoded = atob(base64 + padding)
    const parsed: QuotePayload = JSON.parse(decoded)
    return {
      quoteText: parsed.q ?? decoded,
      authorName: parsed.a ?? '',
    }
  } catch {
    // Fallback: tratar el id como texto URL-encoded
    try {
      return {
        quoteText: decodeURIComponent(id),
        authorName: '',
      }
    } catch {
      return {
        quoteText: 'El conocimiento tiene precio.',
        authorName: '',
      }
    }
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { quoteText, authorName } = decodeId(id)

  const finalQuote = quoteText.length > 200 ? quoteText.slice(0, 197) + '…' : quoteText
  const finalAuthor = authorName.length > 80 ? authorName.slice(0, 77) + '…' : authorName

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          padding: '60px 80px 60px 96px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
        }}
      >
        {/* Barra roja izquierda */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            backgroundColor: '#C41C1C',
          }}
        />

        {/* Comillas decorativas */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 80,
            fontSize: 120,
            color: '#F0F0F0',
            lineHeight: 1,
            fontFamily: 'Georgia, serif',
          }}
        >
          &ldquo;
        </div>

        {/* Cita principal */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
          }}
        >
          <p
            style={{
              fontSize: finalQuote.length > 120 ? 32 : 40,
              color: '#121212',
              lineHeight: 1.5,
              textAlign: 'center',
              maxWidth: 900,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {finalQuote}
          </p>
        </div>

        {/* Separador */}
        <div
          style={{
            width: 48,
            height: 2,
            backgroundColor: '#C41C1C',
            marginBottom: 24,
            alignSelf: 'center',
          }}
        />

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#121212',
              letterSpacing: 4,
              fontFamily: 'Georgia, serif',
            }}
          >
            NEBBULER
          </span>

          {finalAuthor ? (
            <span
              style={{
                fontSize: 16,
                color: '#444444',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontStyle: 'normal',
              }}
            >
              — {finalAuthor}
            </span>
          ) : (
            <span style={{ fontSize: 16, color: 'transparent' }}>·</span>
          )}

          <span
            style={{
              fontSize: 12,
              color: '#999999',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            nebbuler.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
