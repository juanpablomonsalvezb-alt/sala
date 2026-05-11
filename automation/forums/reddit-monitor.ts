/**
 * Reddit Monitor — Nebbuler
 *
 * Monitorea subreddits relevantes para detectar preguntas donde los creadores
 * de Nebbuler pueden responder con valor genuino.
 *
 * NO hace posting automático. Alerta para que un humano responda.
 *
 * API Reddit: sin auth para lectura pública (JSON endpoint nativo de Reddit)
 *
 * Uso:
 *   npx ts-node reddit-monitor.ts --run          # una pasada
 *   npx ts-node reddit-monitor.ts --daemon       # cada 15 minutos
 *   npx ts-node reddit-monitor.ts --preview      # muestra subreddits sin guardar estado
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Subreddits objetivo ──────────────────────────────────────────────────────

const TARGET_SUBREDDITS = [
  // Chile — alta prioridad
  { sub: 'chile', priority: 10, lang: 'es' },
  { sub: 'chileeconomia', priority: 10, lang: 'es' },
  { sub: 'chileInvierte', priority: 9, lang: 'es' },

  // LATAM por país
  { sub: 'Colombia', priority: 7, lang: 'es' },
  { sub: 'mexico', priority: 7, lang: 'es' },
  { sub: 'argentina', priority: 7, lang: 'es' },
  { sub: 'peru', priority: 6, lang: 'es' },

  // Temáticos en español
  { sub: 'finanzaspersonales', priority: 9, lang: 'es' },
  { sub: 'economia', priority: 9, lang: 'es' },
  { sub: 'Derecho', priority: 8, lang: 'es' },
  { sub: 'emprendimiento', priority: 8, lang: 'es' },
  { sub: 'investing', priority: 5, lang: 'en' },
  { sub: 'LatinAmerica', priority: 7, lang: 'en' },
  { sub: 'EconomiaPolitica', priority: 8, lang: 'es' },
  { sub: 'medicina', priority: 7, lang: 'es' },
  { sub: 'urbanismo', priority: 6, lang: 'es' },
  { sub: 'tecnologia', priority: 7, lang: 'es' },
]

// ─── Keywords por disciplina — alineadas con los creadores reales ─────────────

const KEYWORD_RULES: Array<{
  keywords: string[]
  discipline: string
  minMatchCount: number
  creators: Array<{ name: string; slug: string; specialty: string }>
}> = [
  // Rodrigo Fuentes Marín — Macroeconomía y Política Monetaria
  {
    keywords: [
      'tpm', 'banco central', 'inflación', 'inflacion', 'política monetaria', 'politica monetaria',
      'tipo de cambio', 'dólar', 'dolar', 'recesión', 'recesion', 'macroeconomía', 'macroeconomia',
      'pib', 'gdp', 'crecimiento económico', 'ipc', 'regla de taylor', 'tasa de política',
      'expectativas inflacionarias', 'inflación subyacente', 'balance estructural', 'fees',
      'cobre precio', 'ciclo económico', 'q3 recorte', 'pausa monetaria',
    ],
    discipline: 'macroeconomía',
    minMatchCount: 1,
    creators: [
      {
        name: 'Rodrigo Fuentes Marín',
        slug: 'rodrigo-fuentes-marin',
        specialty: 'Macroeconomía y Política Monetaria (ex Banco Central de Chile, PhD Minnesota)',
      },
    ],
  },

  // Carolina Vega Toro — Finanzas Corporativas y Valoración
  {
    keywords: [
      'ebitda', 'valoración', 'valoracion', 'finanzas corporativas', 'inversión', 'inversion',
      'm&a', 'adquisición', 'adquisicion', 'capital privado', 'private equity', 'dcf', 'wacc',
      'bolsa', 'acciones', 'dividendos', 'due diligence', 'family office', 'fusión', 'fusion',
      'tasa de descuento', 'goodwill', 'múltiplos', 'multiplos', 'banchile', 'transacción',
      'transaccion', 'compra empresa', 'venta empresa', 'capital de trabajo',
    ],
    discipline: 'finanzas corporativas',
    minMatchCount: 1,
    creators: [
      {
        name: 'Carolina Vega Toro',
        slug: 'carolina-vega-toro',
        specialty: 'Finanzas Corporativas y Valoración (ex Banchile M&A, MBA Chicago Booth)',
      },
    ],
  },

  // Matías Cornejo Silva — Derecho Tributario
  {
    keywords: [
      'sii', 'impuesto', 'tributario', 'iva', 'declaración de renta', 'declaracion de renta',
      'f22', 'boleta', 'factura', 'rut', 'spa', 'eirl', 'sociedad', 'constitución empresa',
      'constitucion empresa', 'global complementario', 'primera categoría', 'primera categoria',
      'impuesto renta', 'planificación fiscal', 'reorganización', 'reorganizacion',
      'precios de transferencia', 'goodwill tributario', 'reforma tributaria', 'idpc',
      'retiro', 'dividendo empresa', 'tributación internacional', 'tributacion internacional',
    ],
    discipline: 'derecho tributario',
    minMatchCount: 1,
    creators: [
      {
        name: 'Matías Cornejo Silva',
        slug: 'matias-cornejo-silva',
        specialty: 'Derecho Tributario y Planificación Fiscal (Urenda Rencoret, LLM Leiden)',
      },
    ],
  },

  // Pablo Herrera Zúñiga — Derecho Laboral
  {
    keywords: [
      'finiquito', 'despido', 'contrato trabajo', 'laboral', 'licencia médica', 'licencia medica',
      'indemnización', 'indemnizacion', 'sindicato', 'derecho del trabajo', 'negociación colectiva',
      'negociacion colectiva', 'teletrabajo despido', 'subcontratación', 'subcontratacion',
      'huelga', 'despido indirecto', 'código del trabajo', 'reforma laboral', 'cut',
      'remuneración', 'remuneracion', 'gratificación', 'gratificacion',
    ],
    discipline: 'derecho laboral',
    minMatchCount: 1,
    creators: [
      {
        name: 'Pablo Herrera Zúñiga',
        slug: 'pablo-herrera-zuniga',
        specialty: 'Derecho Laboral y Relaciones Colectivas (litigios CUT, Magíster PUC)',
      },
    ],
  },

  // Andrea Poblete Ríos — Salud Pública y Epidemiología
  {
    keywords: [
      'fonasa', 'isapre', 'lista de espera', 'salud pública', 'salud publica', 'epidemiología',
      'epidemiologia', 'resistencia antimicrobiana', 'glp-1', 'ozempic', 'lista espera quirúrgica',
      'sistema salud chile', 'minsal', 'uci', 'envejecimiento demográfico', 'envejecimiento demografico',
      'vacuna', 'covid', 'microbiota', 'insulinoresistencia', 'reforma salud',
    ],
    discipline: 'salud pública',
    minMatchCount: 1,
    creators: [
      {
        name: 'Andrea Poblete Ríos',
        slug: 'andrea-poblete-rios',
        specialty: 'Salud Pública y Epidemiología Clínica (MPH Johns Hopkins, ex MINSAL)',
      },
    ],
  },

  // Alejandro Vásquez Mora — IA y Tecnología
  {
    keywords: [
      'inteligencia artificial', 'llm', 'gpt', 'claude', 'rag', 'fine-tuning', 'machine learning',
      'ia empresa', 'transformación digital', 'transformacion digital', 'startup tech',
      'venture capital chile', 'fintual', 'chatgpt empresa', 'automatización ia',
      'evaluación modelo', 'evaluacion modelo', 'ai latam', 'cto startup',
    ],
    discipline: 'tecnología e IA',
    minMatchCount: 1,
    creators: [
      {
        name: 'Alejandro Vásquez Mora',
        slug: 'alejandro-vasquez-mora',
        specialty: 'IA y Estrategia Tecnológica (ex CTO Fintual, MS Stanford)',
      },
    ],
  },

  // Ignacio Leal Espinoza — Ciencia Política
  {
    keywords: [
      'política chilena', 'politica chilena', 'sistema electoral', 'fragmentación parlamentaria',
      'fragmentacion parlamentaria', 'presidencialismo', 'parlamentarismo', 'constitución',
      'plebiscito', 'congreso chile', 'gobierno chile', 'elecciones chile', 'partidos políticos',
      'partidos politicos', 'ciencia política', 'ciencia politica', 'observatorio político',
    ],
    discipline: 'ciencia política',
    minMatchCount: 1,
    creators: [
      {
        name: 'Ignacio Leal Espinoza',
        slug: 'ignacio-leal-espinoza',
        specialty: 'Ciencia Política y Sistemas Electorales (Dr. Salamanca, Escuela Gobierno UAI)',
      },
    ],
  },

  // Francisca Araya Medina — Arquitectura y Urbanismo
  {
    keywords: [
      'planificación territorial', 'planificacion territorial', 'minvu', 'urbanismo', 'densificación',
      'densificacion', 'prms', 'santiago expansión', 'gentrificación', 'gentrificacion',
      'barrio italia', 'macromanzana', 'patrimonio urbano', 'permiso edificación',
      'permiso edificacion', 'suelo urbano', 'altura edificio', 'zona mixta',
    ],
    discipline: 'arquitectura urbana',
    minMatchCount: 1,
    creators: [
      {
        name: 'Francisca Araya Medina',
        slug: 'francisca-araya-medina',
        specialty: 'Arquitectura Urbana y Planificación Territorial (Bartlett UCL, MINVU)',
      },
    ],
  },

  // Catalina Rojas Henríquez — Historia Económica
  {
    keywords: [
      'historia económica', 'historia economica', 'crisis 1929 chile', 'salitre', 'litio historia',
      'deuda externa latam', 'default chile', 'corfo historia', 'ciclo económico histórico',
      'ciclo economico historico', 'dependencia economica', 'chicago boys', 'crisis 1982 chile',
      'historia financiera', 'colmex', 'cambridge historia',
    ],
    discipline: 'historia económica',
    minMatchCount: 1,
    creators: [
      {
        name: 'Catalina Rojas Henríquez',
        slug: 'catalina-rojas-henriquez',
        specialty: 'Historia Económica de Chile y LATAM (Dr. El Colegio de México, postdoc Cambridge)',
      },
    ],
  },

  // Sebastián Miranda Lagos — Ingeniería Civil e Infraestructura
  {
    keywords: [
      'concesión vial', 'concesion vial', 'mop', 'infraestructura chile', 'bim', 'obra pública',
      'obra publica', 'ruta 5', 'licitación mop', 'licitacion mop', 'constructora chile',
      'project finance', 'ingeniería civil', 'ingenieria civil', 'besalco', 'plazo obra',
      'contrato construcción', 'contrato construccion',
    ],
    discipline: 'ingeniería e infraestructura',
    minMatchCount: 1,
    creators: [
      {
        name: 'Sebastián Miranda Lagos',
        slug: 'sebastian-miranda-lagos',
        specialty: 'Ingeniería Civil e Infraestructura (MIT Project Finance, ex Besalco)',
      },
    ],
  },

  // Valentina Soto Burgos — Nutrición
  {
    keywords: [
      'nutrición', 'nutricion', 'ozempic musculo', 'glp-1 efectos', 'ayuno intermitente',
      'microbiota intestinal', 'insulinorresistencia', 'dieta cetogénica', 'dieta cetogenica',
      'metabolismo', 'semaglutida', 'pérdida peso', 'perdida peso', 'nutrición clínica',
      'nutricion clinica', 'adultos mayores nutrición', 'fasting',
    ],
    discipline: 'nutrición clínica',
    minMatchCount: 1,
    creators: [
      {
        name: 'Valentina Soto Burgos',
        slug: 'valentina-soto-burgos',
        specialty: 'Nutrición Clínica y Metabolismo (Dr. Navarra, Centro Nutrición Molecular U. de Chile)',
      },
    ],
  },

  // Nebbuler — directo
  {
    keywords: [
      'newsletter', 'substack', 'monetizar contenido', 'monetization newsletter', 'cobrar por contenido',
      'paid newsletter', 'newsletter español', 'newsletter latam', 'publicar análisis',
      'publicar analisis', 'newsletter plataforma', 'alternativa substack', 'beehiiv español',
      'cobrar suscripción', 'cobrar suscripcion', 'newsletter chile', 'newsletter pago',
    ],
    discipline: 'nebbuler-directo',
    minMatchCount: 1,
    creators: [
      { name: 'Nebbuler', slug: '', specialty: 'Plataforma de newsletters profesionales para Chile y LATAM' },
    ],
  },
]

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RedditPost {
  id: string
  subreddit: string
  title: string
  selftext: string
  url: string
  score: number
  numComments: number
  createdUtc: number
  author: string
  permalink: string
  isQuestion: boolean
}

interface RedditOpportunity {
  post: RedditPost
  discipline: string
  matchedKeywords: string[]
  suggestedCreators: Array<{ name: string; slug: string; specialty: string }>
  opportunityScore: number
  suggestedResponse: string
}

// ─── Reddit API (sin auth, JSON endpoint público) ─────────────────────────────

async function fetchSubredditNew(subreddit: string, limit = 25): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}&sort=new`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Nebbuler-Monitor/1.0 (content analysis tool; contact: hello@nebbuler.com)',
        'Accept': 'application/json',
      },
    })

    if (response.status === 429) {
      console.warn(`  Rate limit en r/${subreddit}. Esperando 60s...`)
      await new Promise(r => setTimeout(r, 60000))
      return []
    }

    if (!response.ok) {
      console.warn(`  r/${subreddit}: HTTP ${response.status}`)
      return []
    }

    const data = await response.json() as {
      data: {
        children: Array<{
          data: {
            id: string
            subreddit: string
            title: string
            selftext: string
            url: string
            score: number
            num_comments: number
            created_utc: number
            author: string
            permalink: string
          }
        }>
      }
    }

    return data.data.children.map(child => ({
      id: child.data.id,
      subreddit: child.data.subreddit,
      title: child.data.title,
      selftext: child.data.selftext ?? '',
      url: child.data.url,
      score: child.data.score,
      numComments: child.data.num_comments,
      createdUtc: child.data.created_utc,
      author: child.data.author,
      permalink: `https://www.reddit.com${child.data.permalink}`,
      isQuestion:
        child.data.title.includes('?') ||
        /\bcómo\b|\bcomo\b|\bqué\b|\bque\b|\bcuál\b|\bcual\b|\bcuándo\b|\bcuando\b|\balguien\b|\bsabe\b|\bpuede\b|\bconviene\b|\bdebería\b|\bdeberia\b/i.test(
          child.data.title
        ),
    }))
  } catch (err) {
    console.warn(`  Error al consultar r/${subreddit}:`, (err as Error).message)
    return []
  }
}

// ─── Matching de keywords ─────────────────────────────────────────────────────

function analyzePost(post: RedditPost): RedditOpportunity | null {
  const fullText = (post.title + ' ' + post.selftext).toLowerCase()

  for (const rule of KEYWORD_RULES) {
    const matched = rule.keywords.filter(kw => fullText.includes(kw.toLowerCase()))
    if (matched.length < rule.minMatchCount) continue

    // Score: preguntas valen más, posts con poco engagement tienen más oportunidad
    const opportunityScore =
      (post.isQuestion ? 4 : 1) +
      Math.min(3, Math.floor(post.score / 10)) +
      (post.numComments < 5 ? 2 : 0) + // Pocos comentarios = menos competencia
      Math.min(3, matched.length)

    const suggestedResponse = generateResponseSuggestion(post, rule.discipline, rule.creators)

    return {
      post,
      discipline: rule.discipline,
      matchedKeywords: matched,
      suggestedCreators: rule.creators,
      opportunityScore,
      suggestedResponse,
    }
  }

  return null
}

function generateResponseSuggestion(
  post: RedditPost,
  discipline: string,
  creators: Array<{ name: string; slug: string; specialty: string }>
): string {
  const creator = creators[0]

  if (discipline === 'nebbuler-directo') {
    return `Responder mencionando Nebbuler como la plataforma para newsletters profesionales en Chile/LATAM.
Datos clave: 0% comisión, pagos MercadoPago en CLP/ARS/COP/MXN, tarifa fija $29.990 CLP/mes.
URL: nebbuler.com
Ejemplo: "Para monetizar newsletters en español con pagos locales, existe Nebbuler (nebbuler.com) — 0% de comisión sobre suscripciones, pagos en CLP con MercadoPago."`
  }

  return `Oportunidad para ${creator.name}
Especialidad: ${creator.specialty}

ESTRATEGIA DE RESPUESTA (regla de oro: valor primero, firma al final):
1. Responder la pregunta directamente con 2-3 párrafos de expertise real
2. Usar datos concretos o ejemplos de Chile/LATAM cuando sea posible
3. Si el post es una pregunta técnica, dar la respuesta completa sin truncar
4. Firma sugerida al final:
   — ${creator.name} | Escribo sobre ${discipline} en nebbuler.com/${creator.slug}

NO HACER:
- Mencionar precios ni "suscríbete" en la respuesta
- Poner el link en el cuerpo de la respuesta (solo en la firma)
- Responder si no tienes conocimiento genuino del tema específico`
}

// ─── Deduplicación persistente ────────────────────────────────────────────────

class SeenPosts {
  private filePath: string
  private seen: Set<string>

  constructor(dir: string) {
    this.filePath = path.join(dir, 'seen-reddit.txt')
    const data = fs.existsSync(this.filePath)
      ? fs.readFileSync(this.filePath, 'utf-8').trim().split('\n').filter(Boolean)
      : []
    this.seen = new Set(data)
  }

  has(id: string) { return this.seen.has(id) }

  add(id: string) {
    this.seen.add(id)
    // Rotar si crece demasiado
    if (this.seen.size > 20000) {
      const arr = Array.from(this.seen)
      this.seen = new Set(arr.slice(-10000))
    }
    fs.writeFileSync(this.filePath, Array.from(this.seen).join('\n') + '\n')
  }
}

// ─── Notificación ─────────────────────────────────────────────────────────────

function printOpportunity(opp: RedditOpportunity): void {
  const age = Math.round((Date.now() / 1000 - opp.post.createdUtc) / 60)
  const scoreBar = '█'.repeat(Math.min(10, opp.opportunityScore)) + '░'.repeat(Math.max(0, 10 - opp.opportunityScore))

  console.log(`
+─────────────────────────────────────────────────────────────
| OPORTUNIDAD Reddit — Score: ${opp.opportunityScore}/10  [${scoreBar}]
| r/${opp.post.subreddit}  ·  hace ${age} min  ·  ${opp.post.score} pts  ·  ${opp.post.numComments} comentarios
| ${opp.post.isQuestion ? '[PREGUNTA]' : '[POST]'}  ·  Disciplina: ${opp.discipline}
+─────────────────────────────────────────────────────────────
| Titulo: ${opp.post.title.slice(0, 80)}${opp.post.title.length > 80 ? '...' : ''}
| Keywords: ${opp.matchedKeywords.slice(0, 5).join(', ')}
| Link: ${opp.post.permalink}
+─────────────────────────────────────────────────────────────
| SUGERENCIA:
${opp.suggestedResponse.split('\n').map(l => `| ${l}`).join('\n')}
+─────────────────────────────────────────────────────────────`)
}

async function notifyWebhook(opp: RedditOpportunity): Promise<void> {
  const webhookUrl = process.env.NEBBULER_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'reddit_opportunity',
        score: opp.opportunityScore,
        discipline: opp.discipline,
        subreddit: opp.post.subreddit,
        title: opp.post.title,
        url: opp.post.permalink,
        creator: opp.suggestedCreators[0],
        strategy: opp.suggestedResponse,
        isQuestion: opp.post.isQuestion,
        matchedKeywords: opp.matchedKeywords,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {
    // Fallos silenciosos en webhook — no interrumpir el monitor
  }
}

// ─── Runner principal ─────────────────────────────────────────────────────────

async function runOnce(preview = false): Promise<void> {
  const outputDir = path.join(__dirname, 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const seen = preview ? null : new SeenPosts(outputDir)
  const allOpportunities: RedditOpportunity[] = []

  const sorted = [...TARGET_SUBREDDITS].sort((a, b) => b.priority - a.priority)

  for (const { sub } of sorted) {
    process.stdout.write(`  r/${sub.padEnd(24)}`)

    const posts = await fetchSubredditNew(sub, 25)
    let found = 0

    for (const post of posts) {
      if (!preview && seen?.has(post.id)) continue

      const ageHours = (Date.now() / 1000 - post.createdUtc) / 3600
      if (ageHours > 6) continue

      const opp = analyzePost(post)
      if (opp && opp.opportunityScore >= 3) {
        if (!preview) seen?.add(post.id)
        allOpportunities.push(opp)
        found++
      }
    }

    console.log(`${posts.length} posts revisados  →  ${found} oportunidades`)
    await new Promise(r => setTimeout(r, 2000)) // Respetar rate limit Reddit
  }

  allOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore)

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  ${allOpportunities.length} oportunidades encontradas`)
  console.log('═'.repeat(60))

  for (const opp of allOpportunities) {
    printOpportunity(opp)
    await notifyWebhook(opp)
  }

  // Guardar log JSON diario
  if (!preview && allOpportunities.length > 0) {
    const logPath = path.join(outputDir, `reddit-log-${new Date().toISOString().slice(0, 10)}.json`)
    const existing: unknown[] = fs.existsSync(logPath)
      ? JSON.parse(fs.readFileSync(logPath, 'utf-8'))
      : []

    fs.writeFileSync(
      logPath,
      JSON.stringify(
        [
          ...existing,
          ...allOpportunities.map(o => ({
            date: new Date().toISOString(),
            score: o.opportunityScore,
            subreddit: o.post.subreddit,
            title: o.post.title,
            url: o.post.permalink,
            discipline: o.discipline,
            creator: o.suggestedCreators[0]?.name,
            keywords: o.matchedKeywords,
            isQuestion: o.post.isQuestion,
          })),
        ],
        null,
        2
      )
    )
    console.log(`\nLog guardado: ${logPath}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  console.log('\n=== Reddit Monitor — Nebbuler ===')
  console.log('Monitorea oportunidades para que los creadores respondan con valor genuino.')
  console.log('El link a Nebbuler va SOLO en la firma, nunca en el cuerpo.\n')

  if (args.includes('--preview')) {
    console.log('Modo preview (sin guardar estado)\n')
    await runOnce(true)
    return
  }

  if (args.includes('--daemon')) {
    const interval = 15 // minutos
    console.log(`Modo daemon — revisando cada ${interval} minutos\n`)
    while (true) {
      await runOnce()
      console.log(`\nEsperando ${interval} minutos... (${new Date().toLocaleTimeString()})`)
      await new Promise(r => setTimeout(r, interval * 60 * 1000))
    }
  } else {
    // --run o sin argumentos
    await runOnce()
  }
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
