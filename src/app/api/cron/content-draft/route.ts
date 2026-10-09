import { NextResponse } from 'next/server'
import { geminiComplete } from '@/lib/gemini'
import { fetchStartupBusinessArticles, formatArticlesForPrompt } from '@/lib/news-feeds'
import { sendTelegramMessage } from '@/lib/telegram'
import { captureError, setTag } from '@/lib/observability'

export const runtime = 'nodejs'
export const maxDuration = 90

export async function GET(request: Request) {
  setTag('cron', 'content-draft')
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

    const prompt = `Eres el estratega de contenido de Nebbuler, una plataforma de contenido profesional para Latinoamérica. Juan Pablo (fundador) revisa y edita todo antes de publicar, así que tu trabajo es dejarle un borrador fuerte, no una versión final.

Con base en estos artículos recientes del ecosistema de startups y negocios en Latinoamérica:

${formatArticlesForPrompt(articles)}

Genera dos cosas, en español:

1. UN borrador de artículo de blog (600-900 palabras) con un punto de vista propio sobre una tendencia que se desprenda de estas noticias. Estructura: título, 3-4 subtítulos, cierre con una reflexión propia. Al final agrega una línea "Fuentes:" con los links de los artículos que usaste como base.

2. CINCO posts para LinkedIn (80-150 palabras cada uno), en primera persona, tono profesional pero cercano, cada uno con un ángulo distinto (noticia + opinión, dato + pregunta a la audiencia, mini-caso, predicción, recomendación práctica). Cada post debe mencionar al menos una fuente (nombre del medio) de la lista.

Formato de salida exacto (usa SOLO las etiquetas HTML <b> y <a>, nada de markdown):
<b>📝 BORRADOR DE ARTÍCULO</b>

<b>Título del artículo</b>
... cuerpo ...
Fuentes: <a href="URL">Nombre medio</a>, <a href="URL">Nombre medio</a>

<b>💼 LINKEDIN 1/5</b>
... post ...

<b>💼 LINKEDIN 2/5</b>
... post ...

(continúa hasta 5/5)

No agregues explicaciones fuera de este formato.`

    const draft = await geminiComplete(prompt, 4000)

    const header = `✍️ <b>Nebbuler — Borradores del día</b>\n\n`

    await sendTelegramMessage(header + draft)

    return NextResponse.json({ ok: true, articles_considered: articles.length })
  } catch (error) {
    console.error('content-draft error:', error)
    captureError(error, { cron: 'content-draft' })
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
