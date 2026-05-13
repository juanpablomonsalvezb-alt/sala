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
      .select('id, keyword, search_volume, country_code, monthly_growth')
      .eq('status', 'detected')
      .order('monthly_growth', { ascending: false })
      .limit(3)

    if (fetchError) throw fetchError

    const client = new Anthropic()
    const generated = []

    for (const kw of keywords || []) {
      // Generate SEO-optimized content using Haiku
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Escribe un artículo profesional corto sobre "${kw.keyword}" (500-600 palabras).

Estructura:
- Título SEO fuerte: "¿Qué es ${kw.keyword}? Guía 2026"
- Párrafo de intro con pregunta (para featured snippet)
- 2-3 secciones clave
- Conclusión corta
- Una frase final de CTA

Formato: HTML limpio. Solo etiquetas: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>.
Sin <div>, <span>, <style>, atributos inline.`,
          },
        ],
      })

      const content = message.content[0].type === 'text' ? message.content[0].text : ''
      const seoScore = Math.min(90, 65 + Math.floor((kw.search_volume / 100) * 2) + Math.floor(kw.monthly_growth))

      // Save to database
      const { error: insertError } = await supabase.from('generated_pages').insert({
        keyword: kw.keyword,
        specialty: 'Profesional',
        country_code: kw.country_code || 'CL',
        content_html: content,
        content_markdown: content,
        seo_score: seoScore,
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
