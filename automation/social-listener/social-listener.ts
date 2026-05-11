/**
 * Social Listener — Monitorea Twitter/X para oportunidades de engagement orgánico
 *
 * Busca tweets donde personas preguntan sobre economía chilena, derecho tributario,
 * finanzas corporativas, etc. Notifica al creador relevante para que responda.
 *
 * Usa la API gratuita de Twitter v2 (hasta 500k tweets/mes en el plan Basic).
 *
 * Uso:
 *   npx ts-node social-listener.ts --run        # Corre una vez
 *   npx ts-node social-listener.ts --daemon     # Corre cada 30 minutos (cron)
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Tweet {
  id: string
  text: string
  authorId: string
  authorUsername?: string
  createdAt: string
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
}

interface Opportunity {
  tweet: Tweet
  matchedCreator: {
    name: string
    slug: string
    specialty: string
    discipline: string
  }
  matchedQuery: string
  relevanceScore: number // 0-10
}

// ─── Queries de búsqueda por disciplina ──────────────────────────────────────

const SEARCH_QUERIES: Array<{
  query: string
  discipline: string
  minEngagement: number
}> = [
  // Economía — Chile
  { query: '(TPM OR "banco central" OR inflación OR "política monetaria") (Chile OR chilena) (? OR recomienda OR explica OR analiza) lang:es', discipline: 'economia', minEngagement: 2 },
  { query: '("tipo de cambio" OR dólar OR CLP) (Chile OR peso chileno) (? OR explicar OR sube OR baja) lang:es', discipline: 'economia', minEngagement: 1 },
  { query: '(economista OR economía) Chile (recomiend OR seguir OR newsletter OR análisis) lang:es', discipline: 'economia', minEngagement: 1 },

  // Finanzas — LATAM
  { query: '(EBITDA OR valoración OR "due diligence" OR M&A) (Chile OR Colombia OR Argentina) (? OR aprend OR explic) lang:es', discipline: 'finanzas', minEngagement: 2 },
  { query: '("invertir en" OR inversión) Chile (? OR cómo OR recomiend OR consejo) lang:es', discipline: 'finanzas', minEngagement: 3 },

  // Derecho tributario — Chile
  { query: '(tributario OR SII OR IVA OR "impuesto a la renta") Chile (? OR ayuda OR pregunta OR confusion OR no entiendo) lang:es', discipline: 'derecho', minEngagement: 1 },
  { query: '("impuesto" OR "declaración de renta" OR F22) Chile (? OR cómo OR cuándo OR plazo) lang:es', discipline: 'derecho', minEngagement: 2 },

  // Newsletters profesionales — LATAM
  { query: '(newsletter OR substack) español (? OR recomiend OR siguen OR mejor OR alternativa) lang:es', discipline: 'general', minEngagement: 2 },
  { query: 'newsletters profesionales (economía OR finanzas OR derecho) (? OR siguen OR recomiendan OR conocen) lang:es', discipline: 'general', minEngagement: 1 },

  // Salud pública — Chile
  { query: '(epidemiología OR "salud pública" OR "sistema de salud") Chile (? OR análisis OR explica OR dato) lang:es', discipline: 'medicina', minEngagement: 2 },
]

const CREATORS_BY_DISCIPLINE: Record<string, Array<{ name: string; slug: string; specialty: string }>> = {
  'economia': [
    { name: 'Rodrigo Fuentes Marín', slug: 'rodrigo-fuentes-marin', specialty: 'Macroeconomía y Política Monetaria' },
    { name: 'Catalina Rojas Henríquez', slug: 'catalina-rojas-henriquez', specialty: 'Historia Económica' },
  ],
  'finanzas': [
    { name: 'Carolina Vega Toro', slug: 'carolina-vega-toro', specialty: 'Finanzas Corporativas' },
  ],
  'derecho': [
    { name: 'Matías Cornejo Silva', slug: 'matias-cornejo-silva', specialty: 'Derecho Tributario' },
    { name: 'Pablo Herrera Zúñiga', slug: 'pablo-herrera-zuniga', specialty: 'Derecho Laboral' },
  ],
  'medicina': [
    { name: 'Andrea Poblete Ríos', slug: 'andrea-poblete-rios', specialty: 'Salud Pública' },
  ],
  'general': [
    { name: 'Rodrigo Fuentes Marín', slug: 'rodrigo-fuentes-marin', specialty: 'Macroeconomía' },
    { name: 'Carolina Vega Toro', slug: 'carolina-vega-toro', specialty: 'Finanzas' },
  ],
}

// ─── Twitter API v2 ───────────────────────────────────────────────────────────

async function searchTweets(query: string, bearerToken: string): Promise<Tweet[]> {
  const params = new URLSearchParams({
    query: `${query} -is:retweet -is:reply`,
    max_results: '10',
    'tweet.fields': 'created_at,public_metrics,author_id',
    'user.fields': 'username',
    expansions: 'author_id',
    start_time: new Date(Date.now() - 30 * 60000).toISOString(), // Últimos 30 min
  })

  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?${params}`,
    { headers: { 'Authorization': `Bearer ${bearerToken}` } }
  )

  if (response.status === 429) {
    console.warn('  Rate limit de Twitter alcanzado. Esperando 15 minutos...')
    await new Promise(r => setTimeout(r, 15 * 60000))
    return []
  }

  if (!response.ok) {
    const err = await response.text()
    console.warn(`  Twitter API error ${response.status}: ${err.slice(0, 100)}`)
    return []
  }

  const data = await response.json() as {
    data?: Array<{ id: string; text: string; author_id: string; created_at: string; public_metrics: Record<string, number> }>
    includes?: { users?: Array<{ id: string; username: string }> }
  }

  if (!data.data) return []

  const userMap = new Map((data.includes?.users ?? []).map(u => [u.id, u.username]))

  return data.data.map(t => ({
    id: t.id,
    text: t.text,
    authorId: t.author_id,
    authorUsername: userMap.get(t.author_id),
    createdAt: t.created_at,
    metrics: {
      likes: t.public_metrics['like_count'] ?? 0,
      retweets: t.public_metrics['retweet_count'] ?? 0,
      replies: t.public_metrics['reply_count'] ?? 0,
    },
  }))
}

// ─── Deduplicación ────────────────────────────────────────────────────────────

class SeenTweets {
  private file: string
  private seen: Set<string>

  constructor(file: string) {
    this.file = file
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8').trim().split('\n').filter(Boolean)
      this.seen = new Set(data)
    } else {
      this.seen = new Set()
    }
  }

  has(id: string): boolean { return this.seen.has(id) }

  add(id: string): void {
    this.seen.add(id)
    // Mantener solo los últimos 10000 IDs
    if (this.seen.size > 10000) {
      const arr = Array.from(this.seen)
      this.seen = new Set(arr.slice(-5000))
    }
    fs.writeFileSync(this.file, Array.from(this.seen).join('\n') + '\n')
  }
}

// ─── Notificación por email/webhook ───────────────────────────────────────────

async function notifyCreator(opportunity: Opportunity): Promise<void> {
  const webhookUrl = process.env.NEBBULER_WEBHOOK_URL

  if (!webhookUrl) {
    // Log en consola como fallback
    console.log(`\n  OPORTUNIDAD DETECTADA`)
    console.log(`  Para: ${opportunity.matchedCreator.name}`)
    console.log(`  Tweet: https://twitter.com/i/web/status/${opportunity.tweet.id}`)
    console.log(`  Texto: "${opportunity.tweet.text.slice(0, 100)}..."`)
    console.log(`  Score: ${opportunity.relevanceScore}/10`)
    return
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'social_opportunity',
      creator: opportunity.matchedCreator,
      tweet: {
        id: opportunity.tweet.id,
        text: opportunity.tweet.text,
        url: `https://twitter.com/i/web/status/${opportunity.tweet.id}`,
        author: `@${opportunity.tweet.authorUsername}`,
      },
      suggestion: `Responder con expertise en ${opportunity.matchedCreator.specialty}. Tu sala: nebbuler.com/${opportunity.matchedCreator.slug}`,
      score: opportunity.relevanceScore,
    }),
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runOnce(): Promise<void> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    console.log(`
Para configurar el Social Listener:

1. developer.twitter.com → Portal de desarrolladores
2. Crear App → Bearer Token (plan gratuito es suficiente)
3. Variables de entorno:
   TWITTER_BEARER_TOKEN=AAAA...
   NEBBULER_WEBHOOK_URL=https://nebbuler.com/api/internal/social-alert (opcional)
    `)
    return
  }

  const seenPath = path.join(__dirname, 'seen-tweets.txt')
  const seen = new SeenTweets(seenPath)
  const opportunities: Opportunity[] = []

  for (const searchConfig of SEARCH_QUERIES) {
    const tweets = await searchTweets(searchConfig.query, bearerToken)

    for (const tweet of tweets) {
      if (seen.has(tweet.id)) continue
      seen.add(tweet.id)

      const totalEngagement = tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies
      if (totalEngagement < searchConfig.minEngagement) continue

      const creator = CREATORS_BY_DISCIPLINE[searchConfig.discipline]?.[0]
      if (!creator) continue

      const relevanceScore = Math.min(10, 5 + Math.floor(totalEngagement / 2))

      opportunities.push({
        tweet,
        matchedCreator: { ...creator, discipline: searchConfig.discipline },
        matchedQuery: searchConfig.query.slice(0, 50),
        relevanceScore,
      })
    }

    // Pausa entre requests
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`\nOportunidades encontradas: ${opportunities.length}`)

  for (const opp of opportunities.sort((a, b) => b.relevanceScore - a.relevanceScore)) {
    await notifyCreator(opp)
  }
}

async function main() {
  const args = process.argv.slice(2)
  console.log('\n=== Social Listener — Nebbuler ===\n')

  if (args.includes('--daemon')) {
    console.log('Modo daemon: revisando cada 30 minutos...')
    while (true) {
      try {
        await runOnce()
      } catch (err) {
        console.error('Error en ciclo:', err)
      }
      console.log('\nEsperando 30 minutos...')
      await new Promise(r => setTimeout(r, 30 * 60000))
    }
  } else {
    await runOnce()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
