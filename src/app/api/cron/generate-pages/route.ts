import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Anthropic } from '@anthropic-ai/sdk'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get keywords without generated pages
    const { data: keywords, error: fetchError } = await supabase
      .from('trending_keywords')
      .select('id, keyword, search_volume, country_code')
      .eq('status', 'detected')
      .order('search_volume', { ascending: false })
      .limit(5)

    if (fetchError) throw fetchError

    const client = new Anthropic()
    const generated = []

    for (const kw of keywords || []) {
      // Generate content using Claude
      const message = await client.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Escribe un artículo profesional sobre "${kw.keyword}" de 800-1000 palabras.
              Incluye:
              - Título SEO optimizado
              - Introducción con pregunta de featured snippet
              - 3 secciones principales
              - Conclusión con CTA
              Formato: HTML limpio, sin estilos inline.`,
          },
        ],
      })

      const content = message.content[0].type === 'text' ? message.content[0].text : ''

      // Save to database
      const { error: insertError } = await supabase.from('generated_pages').insert({
        keyword: kw.keyword,
        specialty: 'General',
        country_code: kw.country_code || 'CL',
        content_html: content,
        content_markdown: content,
        seo_score: 75,
        status: 'draft',
        trending_keyword_id: kw.id,
      })

      if (!insertError) {
        generated.push(kw.keyword)
        // Update keyword status
        await supabase
          .from('trending_keywords')
          .update({ status: 'generated' })
          .eq('id', kw.id)
      }

      // Rate limiting: 1 request every 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      generated: generated.length,
      pages: generated,
    })
  } catch (error) {
    console.error('Page generation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
