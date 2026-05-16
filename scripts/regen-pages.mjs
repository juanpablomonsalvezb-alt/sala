#!/usr/bin/env node
/**
 * Regenera todas las páginas con status='detected' usando Gemini 2.5 Flash
 * Uso: node scripts/regen-pages.mjs
 */

const SUPABASE_URL = 'https://pnezuntljreblaefalpl.supabase.co'
const SUPABASE_KEY = '***REMOVED***'
const GEMINI_KEYS = [
  '***REMOVED***',
  '***REMOVED***',
  '***REMOVED***',
  '***REMOVED***',
  '***REMOVED***',
  '***REMOVED***',
  '***REMOVED***',
]
const GEMINI_MODEL = 'gemini-2.5-flash'

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
}

async function generateWithGemini(prompt, keyIndex = 0) {
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
    if (res.status === 429 && keyIndex < GEMINI_KEYS.length - 1) {
      console.log(`  [key ${keyIndex + 1} rate limited → rotando]`)
      await sleep(1000)
      return generateWithGemini(prompt, keyIndex + 1)
    }
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return raw
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function wordCount(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length
}

async function run() {
  // Fetch all detected keywords
  const res = await fetch(
    SUPABASE_URL + '/rest/v1/trending_keywords?status=eq.detected&select=id,keyword,search_volume,country_code,monthly_growth&order=monthly_growth.desc&limit=100',
    { headers }
  )
  const keywords = await res.json()

  if (!Array.isArray(keywords)) {
    console.error('Error fetching keywords:', keywords)
    process.exit(1)
  }

  console.log(`\n🚀 Regenerando ${keywords.length} páginas...\n`)

  let generated = 0
  let failed = 0
  let keyIndex = 0

  for (const kw of keywords) {
    console.log(`[${generated + failed + 1}/${keywords.length}] ${kw.keyword} (${kw.country_code})`)

    // Check if page already exists
    const checkRes = await fetch(
      SUPABASE_URL + `/rest/v1/generated_pages?keyword=eq.${encodeURIComponent(kw.keyword)}&country_code=eq.${kw.country_code || 'CL'}&select=id`,
      { headers }
    )
    const existing = await checkRes.json()
    if (Array.isArray(existing) && existing.length > 0) {
      console.log(`  ⏭️  Ya existe — saltando`)
      await fetch(SUPABASE_URL + `/rest/v1/trending_keywords?id=eq.${kw.id}`, {
        method: 'PATCH', headers, body: JSON.stringify({ status: 'generated' })
      })
      continue
    }

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

    try {
      const content = await generateWithGemini(prompt, keyIndex)
      keyIndex = (keyIndex + 1) % GEMINI_KEYS.length

      if (!content) {
        console.log(`  ❌ Gemini devolvió vacío`)
        failed++
        continue
      }

      const words = wordCount(content)
      console.log(`  📝 ${words} palabras generadas`)

      if (words < 100) {
        console.log(`  ⚠️  Muy corto (${words} palabras) — saltando`)
        failed++
        continue
      }

      const seoScore = Math.min(90, 65 + Math.floor((kw.search_volume / 100) * 2) + Math.floor(kw.monthly_growth))

      const insertRes = await fetch(SUPABASE_URL + '/rest/v1/generated_pages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          keyword: kw.keyword,
          specialty: 'Profesional',
          country_code: kw.country_code || 'CL',
          content_html: content,
          content_markdown: content,
          seo_score: seoScore,
          status: 'draft',
          trending_keyword_id: kw.id,
        }),
      })

      if (insertRes.ok || insertRes.status === 201) {
        await fetch(SUPABASE_URL + `/rest/v1/trending_keywords?id=eq.${kw.id}`, {
          method: 'PATCH', headers, body: JSON.stringify({ status: 'generated' })
        })
        console.log(`  ✅ Guardado (${words} palabras)`)
        generated++
      } else {
        const err = await insertRes.text()
        console.log(`  ❌ Insert error: ${err.slice(0, 100)}`)
        failed++
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`)
      failed++
    }

    // Rate limiting entre requests
    await sleep(2500)
  }

  console.log(`\n✅ Completado: ${generated} generadas, ${failed} fallidas de ${keywords.length} keywords`)
}

run().catch(console.error)
