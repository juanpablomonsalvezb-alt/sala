import { ImageResponse } from '@vercel/og'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const supabase = createServiceClient()

    const { data: quote } = await supabase
      .from('sala_post_quotes')
      .select('text, post_id')
      .eq('id', id)
      .single()

    if (!quote) {
      return new Response('Quote not found', { status: 404 })
    }

    const { data: post } = await supabase
      .from('sala_posts')
      .select('creator_id')
      .eq('id', quote.post_id)
      .single()

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    const { data: creator } = await supabase
      .from('sala_creators')
      .select('name, specialty')
      .eq('id', post.creator_id)
      .single()

    if (!creator) {
      return new Response('Creator not found', { status: 404 })
    }

    const quoteText = quote.text.length > 280 ? quote.text.substring(0, 277) + '...' : quote.text

    const containerStyle = {
      display: 'flex',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
      padding: '60px',
      justifyContent: 'space-between',
      flexDirection: 'column' as const,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }

    const centerStyle = {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      justifyContent: 'center',
    }

    const quoteStyle = {
      fontSize: 56,
      fontWeight: 'bold' as const,
      color: '#ffffff',
      lineHeight: 1.3,
      marginBottom: 40,
      fontStyle: 'italic' as const,
    }

    const nameStyle = {
      fontSize: 24,
      color: '#C41C1C',
      fontWeight: 600,
    }

    const specialtyStyle = {
      fontSize: 18,
      color: '#999999',
      marginTop: 8,
    }

    const footerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 18,
      color: '#666666',
      borderTop: '1px solid #333333',
      paddingTop: 30,
    }

    return new ImageResponse(
      <div style={containerStyle}>
        <div style={centerStyle}>
          <div style={quoteStyle}>"{quoteText}"</div>
          <div style={nameStyle}>— {creator.name}</div>
          <div style={specialtyStyle}>{creator.specialty}</div>
        </div>
        <div style={footerStyle}>
          <div style={{ fontWeight: 600, color: '#C41C1C' }}>Nebbuler</div>
          <div>nebbuler.com</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Internal error', { status: 500 })
  }
}
