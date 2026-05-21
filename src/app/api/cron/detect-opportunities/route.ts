import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getNextImage, getNextTemplate } from '@/lib/social'
import { isAuthorizedCron } from '@/lib/cron-auth'

export const runtime = 'nodejs'
export const maxDuration = 60

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Queries de búsqueda para detectar oportunidades virales en LATAM
const SEARCH_QUERIES = [
  'monetizar conocimiento Chile Colombia México Argentina 2026',
  'newsletter de pago creadores LATAM',
  'cobrar por contenido profesional latinoamérica',
  'substack alternativa español LATAM',
  'creador de contenido membresía pesos',
  'economista abogado psicólogo contenido pago',
  'curso online LATAM membresía suscripción',
  'monetizar audiencia LinkedIn Chile',
]

interface Opportunity {
  platform: string
  post_url: string
  post_id: string
  post_text: string
  author_handle: string
  author_followers: number
  engagement_score: number
  mode: string
  suggested_response: string | null
}

// Usa Gemini con Google Search grounding para encontrar menciones reales
async function searchWithGemini(query: string): Promise<Opportunity[]> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_API_KEY) return []

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

  const body = {
    contents: [{
      parts: [{
        text: `Busca en Google: "${query}"

Encuentra 3-5 posts de LinkedIn, artículos o publicaciones recientes (últimos 30 días) donde profesionales LATAM hablan sobre monetizar su conocimiento, cobrar por contenido, o buscan plataformas de membresía.

Para cada resultado encontrado, devuelve JSON con este formato exacto:
[
  {
    "url": "URL del post o artículo",
    "title": "título o primeras palabras del post",
    "author": "nombre del autor o handle",
    "platform": "linkedin|web|twitter",
    "snippet": "extracto relevante máximo 200 chars",
    "engagement_estimate": número del 1 al 100 según relevancia,
    "suggested_comment": "comentario de 100 chars max que Nebbuler podría dejar mencionando que existe una plataforma LATAM para esto"
  }
]

Solo devuelve el JSON, sin texto adicional. Si no encuentras resultados relevantes, devuelve [].`
      }]
    }],
    tools: [{
      googleSearch: {}
    }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1000,
    }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return []

    const data = await res.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> }
      }>
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Extraer JSON del texto
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    const results = JSON.parse(jsonMatch[0]) as Array<{
      url: string
      title: string
      author: string
      platform: string
      snippet: string
      engagement_estimate: number
      suggested_comment: string
    }>

    return results.map((r, i) => ({
      // Mapear platform a valores permitidos por la tabla
      platform: r.platform === 'twitter' ? 'x' : 'linkedin',
      post_url: r.url ?? '',
      post_id: `gemini-${Date.now()}-${i}`,
      // Incluir suggested_response en post_text para no perderla
      post_text: `${r.title}\n${r.snippet}\n---\nRespuesta sugerida: ${r.suggested_comment ?? ''}`.slice(0, 500),
      author_handle: r.author ?? 'unknown',
      author_followers: 0,
      engagement_score: r.engagement_estimate ?? 50,
      mode: 'professional',
      suggested_response: r.suggested_comment ?? null,
    })).filter(o => o.post_url.startsWith('http'))

  } catch {
    return []
  }
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = adminClient()
  const results = { web: 0, errors: [] as string[], queries_run: 0 }

  // Rotar queries para no repetir siempre las mismas
  const dayOfYear = Math.floor(Date.now() / 86400000) % SEARCH_QUERIES.length
  const queriesToday = [
    SEARCH_QUERIES[dayOfYear],
    SEARCH_QUERIES[(dayOfYear + 1) % SEARCH_QUERIES.length],
    SEARCH_QUERIES[(dayOfYear + 2) % SEARCH_QUERIES.length],
  ]

  for (const query of queriesToday) {
    try {
      results.queries_run++
      const opportunities = await searchWithGemini(query)

      for (const opp of opportunities) {
        if (!opp.post_url) continue
        const image = await getNextImage('professional')
        const template = await getNextTemplate('linkedin', 'professional')

        const { error } = await supabase.from('social_opportunities').upsert({
          platform: opp.platform,
          post_url: opp.post_url,
          post_id: opp.post_id,
          post_text: opp.post_text,
          author_handle: opp.author_handle,
          author_followers: opp.author_followers,
          engagement_score: opp.engagement_score,
          mode: opp.mode,
          suggested_image_id: image?.id ?? null,
          suggested_comment_id: template?.id ?? null,
        }, { onConflict: 'platform,post_id', ignoreDuplicates: true })

        if (!error) results.web++
      }

      // Pequeña pausa entre queries para no saturar Gemini
      await new Promise(r => setTimeout(r, 1000))
    } catch (e) {
      results.errors.push(`query "${query.slice(0, 30)}": ${String(e).slice(0, 80)}`)
    }
  }

  return NextResponse.json({ ok: true, ...results, detectedAt: new Date().toISOString() })
}
