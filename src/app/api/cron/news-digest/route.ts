import { NextResponse } from 'next/server'
import { geminiComplete } from '@/lib/gemini'
import { fetchStartupBusinessArticles, formatArticlesForPrompt } from '@/lib/news-feeds'
import { sendTelegramMessage } from '@/lib/telegram'
import { captureError, setTag } from '@/lib/observability'

export const runtime = 'nodejs'
export const maxDuration = 60

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET(request: Request) {
  setTag('cron', 'news-digest')
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const articles = await fetchStartupBusinessArticles()
    if (articles.length === 0) {
      return NextResponse.json({ ok: false, message: 'No se pudo obtener ningún feed de noticias' })
    }

    const prompt = `Eres el editor de noticias de Nebbuler, una plataforma de contenido profesional para Latinoamérica.
De la siguiente lista de artículos, elige los 6 a 8 MÁS RELEVANTES para alguien que sigue el ecosistema de startups y negocios en Latinoamérica (financiamiento, M&A, lanzamientos, regulación, macroeconomía que afecte a empresas). Descarta duplicados y notas irrelevantes.

Para cada uno entrega, en español, en este formato exacto (sin markdown, usa SOLO las etiquetas HTML <b> y <a>):
<b>Titular corto y claro</b>
Resumen de 1-2 frases con el dato concreto (cifra, empresa, país).
<a href="URL">Leer más</a>

Separa cada noticia con una línea en blanco. No agregues introducción ni cierre, solo las noticias.

ARTÍCULOS:
${formatArticlesForPrompt(articles)}`

    const digest = await geminiComplete(prompt, 1500)

    const today = new Date().toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'America/Santiago',
    })
    const header = `📰 <b>Nebbuler — Noticias del día</b>\n${escapeHtml(today)}\n\n`

    await sendTelegramMessage(header + digest)

    return NextResponse.json({ ok: true, articles_considered: articles.length })
  } catch (error) {
    console.error('news-digest error:', error)
    captureError(error, { cron: 'news-digest' })
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
