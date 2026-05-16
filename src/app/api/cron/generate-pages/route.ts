import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Rotación de 7 keys para evitar rate limits de Gemini
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
].filter(Boolean) as string[]

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'

async function generateWithGemini(prompt: string, keyIndex = 0): Promise<string> {
  const key = GEMINI_KEYS[keyIndex % GEMINI_KEYS.length]
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    // Si rate limit, rotar a la siguiente key
    if (res.status === 429 && keyIndex < GEMINI_KEYS.length - 1) {
      return generateWithGemini(prompt, keyIndex + 1)
    }
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    // Get keywords without generated pages
    const { data: keywords, error: fetchError } = await supabase
      .from('trending_keywords')
      .select('id, keyword, search_volume, country_code, monthly_growth')
      .eq('status', 'detected')
      .order('monthly_growth', { ascending: false })
      .limit(3)

    if (fetchError) throw fetchError

    const generated = []

    for (const kw of keywords || []) {
      const prompt = `Escribe un artículo profesional corto sobre "${kw.keyword}" (500-600 palabras).

Estructura:
- Título SEO fuerte: "¿Qué es ${kw.keyword}? Guía 2026"
- Párrafo de intro con pregunta (para featured snippet)
- 2-3 secciones clave
- Conclusión corta
- Una frase final de CTA

Formato: HTML limpio. Solo etiquetas: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>.
Sin <div>, <span>, <style>, atributos inline.`

      // Verificar que no exista ya una página para este keyword+país
      const { data: existing } = await supabase
        .from('generated_pages')
        .select('id')
        .eq('keyword', kw.keyword)
        .eq('country_code', kw.country_code || 'CL')
        .maybeSingle()

      if (existing) {
        await supabase.from('trending_keywords').update({ status: 'generated' }).eq('id', kw.id)
        continue
      }

      const content = await generateWithGemini(prompt)
      if (!content) continue

      const slug = kw.keyword.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-')

      const seoScore = Math.min(90, 65 + Math.floor((kw.search_volume / 100) * 2) + Math.floor(kw.monthly_growth))

      // Save to database
      const { error: insertError } = await supabase.from('generated_pages').insert({
        keyword: kw.keyword,
        specialty: 'Profesional',
        country_code: kw.country_code || 'CL',
        content_html: content,
        content_markdown: content,
        seo_score: seoScore,
        status: 'published',
        trending_keyword_id: kw.id,
        slug,
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
