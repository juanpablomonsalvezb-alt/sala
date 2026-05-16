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
        generationConfig: { maxOutputTokens: 4000, temperature: 0.65, thinkingConfig: { thinkingBudget: 0 } },
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
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  // Gemini a veces envuelve el HTML en ```html ... ``` — lo removemos
  return raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/,'').trim()
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
      .limit(5)

    if (fetchError) throw fetchError

    const generated = []

    for (const kw of keywords || []) {
      const prompt = `Escribe un artículo profesional completo sobre "${kw.keyword}" para un sitio web de profesionales en América Latina.

REQUISITOS OBLIGATORIOS:
- Mínimo 500 palabras, máximo 650 palabras. NO menos de 500 palabras.
- Idioma: español latinoamericano
- Tono: experto, útil, confiable

ESTRUCTURA EXACTA (usa estas etiquetas):
<h2>¿Qué es ${kw.keyword}? Guía Completa 2026</h2>
<p>[Intro de 60-80 palabras con la pregunta principal respondida directamente para Google Featured Snippet]</p>

<h3>[Subtítulo relevante 1]</h3>
<p>[2-3 párrafos de 80-100 palabras cada uno explicando el tema]</p>
<ul><li>[punto 1]</li><li>[punto 2]</li><li>[punto 3]</li></ul>

<h3>[Subtítulo relevante 2]</h3>
<p>[2 párrafos de 80-100 palabras sobre aplicaciones prácticas en LATAM]</p>

<h3>[Subtítulo relevante 3]</h3>
<p>[2 párrafos de 80-100 palabras con datos actuales y tendencias]</p>

<h3>Conclusión</h3>
<p>[Párrafo final de 60 palabras con CTA para consultar con un profesional en Nebbuler]</p>

REGLAS DE FORMATO:
- Solo etiquetas: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>
- Sin <div>, <span>, <style>, sin atributos inline
- Sin markdown, sin backticks, sin comillas de código
- Responde SOLO con el HTML, nada más antes ni después`

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

      const seoScore = Math.min(90, 65 + Math.floor((kw.search_volume / 100) * 2) + Math.floor(kw.monthly_growth))

      // Save to database — slug se genera en runtime desde el keyword (ruta /tendencia/[slug])
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
