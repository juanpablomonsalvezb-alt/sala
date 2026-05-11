/**
 * Kaggle Dataset Monitor — Nebbuler
 *
 * Monitorea Kaggle por datasets nuevos relevantes a las disciplinas
 * de los creadores de Nebbuler y genera briefs de contenido con Claude.
 *
 * API Kaggle: requiere credenciales para búsqueda completa.
 * Endpoint: https://www.kaggle.com/api/v1/datasets/list
 *
 * Uso:
 *   npx ts-node kaggle-monitor.ts --run           # Una pasada
 *   npx ts-node kaggle-monitor.ts --daemon        # Cada 6 horas
 *   npx ts-node kaggle-monitor.ts --preview       # Sin guardar estado
 *   npx ts-node kaggle-monitor.ts --brief "titulo del dataset"
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface KaggleDataset {
  id: string
  title: string
  subtitle: string
  description: string
  url: string
  ownerName: string
  totalBytes: number
  lastUpdated: string
  downloadCount: number
  voteCount: number
  usabilityRating: number
  tags: string[]
}

interface Creator {
  name: string
  slug: string
  specialty: string
  discipline: string
}

interface DatasetOpportunity {
  dataset: KaggleDataset
  matchedCreators: Creator[]
  relevanceScore: number
  matchedKeywords: string[]
  brief?: string
}

// ─── Creadores reales de Nebbuler ─────────────────────────────────────────────
// Fuente: src/data/creators.ts

const CREATORS: Creator[] = [
  { name: 'Rodrigo Fuentes Marín',   slug: 'rodrigo-fuentes-marin',   specialty: 'Macroeconomía y Política Monetaria',        discipline: 'economia'       },
  { name: 'Carolina Vega Toro',       slug: 'carolina-vega-toro',       specialty: 'Finanzas Corporativas y Valoración',         discipline: 'finanzas'       },
  { name: 'Matías Cornejo Silva',     slug: 'matias-cornejo-silva',     specialty: 'Derecho Tributario y Planificación Fiscal',  discipline: 'derecho'        },
  { name: 'Andrea Poblete Ríos',      slug: 'andrea-poblete-rios',      specialty: 'Salud Pública y Epidemiología Clínica',      discipline: 'medicina'       },
  { name: 'Ignacio Leal Espinoza',    slug: 'ignacio-leal-espinoza',    specialty: 'Ciencia Política y Sistemas Electorales',    discipline: 'ciencia-politica'},
  { name: 'Francisca Araya Medina',   slug: 'francisca-araya-medina',   specialty: 'Arquitectura Urbana y Planificación Territorial', discipline: 'arquitectura' },
  { name: 'Pablo Herrera Zúñiga',     slug: 'pablo-herrera-zuniga',     specialty: 'Derecho Laboral y Relaciones Colectivas',    discipline: 'derecho'        },
  { name: 'Valentina Soto Burgos',    slug: 'valentina-soto-burgos',    specialty: 'Nutrición Clínica y Metabolismo',            discipline: 'nutricion'      },
  { name: 'Sebastián Miranda Lagos',  slug: 'sebastian-miranda-lagos',  specialty: 'Ingeniería Civil e Infraestructura',         discipline: 'ingenieria'     },
  { name: 'Catalina Rojas Henríquez', slug: 'catalina-rojas-henriquez', specialty: 'Historia Económica de Chile y LATAM',        discipline: 'historia'       },
  { name: 'Alejandro Vásquez Mora',   slug: 'alejandro-vasquez-mora',   specialty: 'Inteligencia Artificial y Estrategia Tecnológica', discipline: 'tecnologia' },
]

// ─── Keywords por disciplina ──────────────────────────────────────────────────

const DISCIPLINE_KEYWORDS: Record<string, string[]> = {
  economia: [
    'chile economy', 'latin america gdp', 'inflation chile', 'monetary policy',
    'banco central', 'latam economic', 'chile macroeconomic', 'copper price',
    'south america economy', 'chile gdp', 'peru economy', 'colombia economy',
    'argentina inflation', 'mexico economy', 'latam inflation', 'emerging markets',
    'commodity prices', 'exchange rate latam', 'chile exports', 'trade latam',
    'tpm chile', 'ipc chile', 'banco central chile', 'economia chilena',
  ],
  finanzas: [
    'stock market chile', 'latam stocks', 'financial markets', 'corporate finance',
    'mergers acquisitions', 'private equity latam', 'startup funding latam',
    'venture capital latin america', 'ipsa', 'bolsa chile', 'dividends',
    'company valuation', 'financial ratios', 'banking latam', 'fintech latam',
    'ebitda', 'dcf valuation', 'manda latam', 'capital markets chile',
  ],
  derecho: [
    'legal chile', 'tax chile', 'regulation latam', 'sii chile', 'impuestos chile',
    'labor law', 'corporate law latam', 'regulatory compliance', 'contracts',
    'court decisions', 'legal data chile', 'criminal justice latam',
    'tributario chile', 'laboral chile', 'reforma tributaria', 'ocde tax',
  ],
  medicina: [
    'health chile', 'salud publica', 'epidemiology latam', 'covid chile',
    'mortality chile', 'disease prevalence latam', 'health indicators',
    'mental health latam', 'nutrition latam', 'medical data chile', 'hospital data',
    'cancer latam', 'cardiovascular disease', 'diabetes latam', 'fonasa',
    'antimicrobial resistance', 'lista espera chile', 'healthcare chile',
  ],
  'ciencia-politica': [
    'election chile', 'political data latam', 'voting behavior chile',
    'congress chile', 'parliament latam', 'electoral systems', 'political parties chile',
    'democracy latam', 'survey chile', 'approval ratings chile',
    'sistema electoral', 'fragmentacion parlamentaria', 'plebiscito chile',
  ],
  arquitectura: [
    'urban planning chile', 'housing chile', 'real estate latam', 'construction',
    'city planning', 'urbanization latam', 'smart cities', 'infrastructure chile',
    'housing prices chile', 'urban density', 'gentrification santiago',
    'catastro urbano', 'minvu', 'prms santiago', 'densificacion chile',
  ],
  nutricion: [
    'nutrition data latam', 'obesity chile', 'diabetes nutrition',
    'microbiome gut health', 'metabolic syndrome', 'glp1 semaglutide data',
    'fasting intermittent', 'insulin resistance data', 'dietary patterns latam',
    'food consumption chile', 'nutricion clinica', 'metabolismo',
  ],
  ingenieria: [
    'infrastructure chile', 'construction data chile', 'civil engineering latam',
    'road infrastructure', 'concessions chile', 'public works chile',
    'bim building', 'project finance infrastructure', 'obra publica chile',
    'concesiones viales', 'mop chile', 'besalco', 'infrastructure data',
  ],
  historia: [
    'chile historical data', 'latin america economic history', 'debt crisis latam',
    'financial crisis history', 'chile 20th century', 'corfo chile',
    'salitre chile history', 'copper history chile', 'latam historical gdp',
    'economic cycles latam', 'default sovereign latam', 'historia economica',
  ],
  tecnologia: [
    'ai machine learning latam', 'tech startup chile', 'digital economy latam',
    'llm applications', 'ai adoption enterprise', 'fintech data latam',
    'e-commerce latam', 'software industry chile', 'rag retrieval data',
    'ai benchmark', 'machine learning enterprise', 'tecnologia chile',
  ],
}

// ─── Kaggle API ────────────────────────────────────────────────────────────────

async function searchKaggleDatasets(query: string, maxResults = 10): Promise<KaggleDataset[]> {
  const kaggleUser = process.env.KAGGLE_USERNAME
  const kaggleKey = process.env.KAGGLE_KEY

  if (kaggleUser && kaggleKey) {
    return searchWithApiKey(query, kaggleUser, kaggleKey, maxResults)
  }

  return searchPublicFeed(query, maxResults)
}

async function searchWithApiKey(
  query: string,
  username: string,
  key: string,
  maxResults: number
): Promise<KaggleDataset[]> {
  const params = new URLSearchParams({
    search: query,
    sortBy: 'hottest',
    pageSize: String(maxResults),
    fileType: 'csv',
    minUsabilityRating: '0.5',
  })

  const response = await fetch(
    `https://www.kaggle.com/api/v1/datasets/list?${params}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${key}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    console.warn(`  Kaggle API error ${response.status} para: "${query}"`)
    return []
  }

  const data = await response.json() as Array<{
    ref: string
    title: string
    subtitle?: string
    description?: string
    url?: string
    ownerName: string
    totalBytes?: number
    lastUpdated: string
    downloadCount?: number
    voteCount?: number
    usabilityRating?: number
    tags?: Array<{ name: string }>
  }>

  return data.map(d => ({
    id: d.ref ?? d.title,
    title: d.title,
    subtitle: d.subtitle ?? '',
    description: d.description ?? '',
    url: `https://www.kaggle.com/datasets/${d.ref ?? d.url ?? d.title}`,
    ownerName: d.ownerName,
    totalBytes: d.totalBytes ?? 0,
    lastUpdated: d.lastUpdated,
    downloadCount: d.downloadCount ?? 0,
    voteCount: d.voteCount ?? 0,
    usabilityRating: d.usabilityRating ?? 0,
    tags: (d.tags ?? []).map(t => t.name),
  }))
}

async function searchPublicFeed(query: string, maxResults: number): Promise<KaggleDataset[]> {
  // Sin API key: intentar endpoint semi-público
  console.log(`  (Sin KAGGLE_KEY — acceso limitado para: "${query}")`)

  try {
    const response = await fetch(
      `https://www.kaggle.com/api/v1/datasets/list?search=${encodeURIComponent(query)}&sortBy=hottest&pageSize=${maxResults}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NebbulerBot/1.0)',
          'Accept': 'application/json',
        },
      }
    )

    if (response.ok) {
      const data = await response.json() as KaggleDataset[]
      return Array.isArray(data) ? data.slice(0, maxResults) : []
    }
  } catch {
    // silencioso
  }

  return []
}

// ─── Análisis de relevancia ───────────────────────────────────────────────────

function scoreDataset(dataset: KaggleDataset): {
  score: number
  discipline: string
  keywords: string[]
  creators: Creator[]
} {
  const text = `${dataset.title} ${dataset.subtitle} ${dataset.description} ${dataset.tags.join(' ')}`.toLowerCase()

  let bestScore = 0
  let bestDiscipline = ''
  let bestKeywords: string[] = []

  for (const [discipline, keywords] of Object.entries(DISCIPLINE_KEYWORDS)) {
    const matched = keywords.filter(kw => text.includes(kw.toLowerCase()))
    let score = matched.length * 2
    // Bonus por calidad del dataset
    if (dataset.voteCount > 100) score += 2
    if (dataset.voteCount > 500) score += 2
    if (dataset.usabilityRating > 0.8) score += 1
    if (dataset.downloadCount > 1000) score += 1

    if (score > bestScore) {
      bestScore = score
      bestDiscipline = discipline
      bestKeywords = matched
    }
  }

  const creators = CREATORS.filter(c => c.discipline === bestDiscipline)

  return { score: bestScore, discipline: bestDiscipline, keywords: bestKeywords, creators }
}

// ─── Brief con Claude ─────────────────────────────────────────────────────────

async function generateBrief(dataset: KaggleDataset, creator: Creator): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return '[Configura ANTHROPIC_API_KEY para generar briefs automáticos]'

  // Import dinámico para no fallar si no está instalado
  let Anthropic: { new(opts: { apiKey: string }): {
    messages: {
      create(opts: object): Promise<{ content: Array<{ type: string; text?: string }> }>
    }
  } }
  try {
    const mod = await import('@anthropic-ai/sdk')
    Anthropic = (mod as { default: typeof Anthropic }).default ?? mod as unknown as typeof Anthropic
  } catch {
    return '[Instala @anthropic-ai/sdk para generar briefs: npm i @anthropic-ai/sdk]'
  }

  const client = new Anthropic({ apiKey })

  const prompt = `Eres editor senior de un newsletter profesional de pago en Chile (Nebbuler).
Tu trabajo: convertir hallazgos de datasets en oportunidades de contenido accionables.

Creador: ${creator.name}
Especialidad: ${creator.specialty}
Disciplina: ${creator.discipline}

Dataset encontrado en Kaggle:
- Título: "${dataset.title}"
- Descripción: ${(dataset.description ?? 'Sin descripción').slice(0, 400)}
- Tags: ${dataset.tags.slice(0, 6).join(', ')}
- Votos: ${dataset.voteCount} | Descargas: ${dataset.downloadCount.toLocaleString()}
- URL: ${dataset.url}

Genera un brief editorial de 200-250 palabras con esta estructura exacta:

**Por qué importa:** (2-3 oraciones explicando la relevancia para los suscriptores del creador en Chile/LATAM)

**3 ángulos de análisis:**
1. [ángulo concreto con dato potencial]
2. [ángulo concreto con dato potencial]
3. [ángulo concreto con dato potencial]

**Pregunta central para el artículo:** (1 pregunta que podría ser el titular del newsletter)

**Datos clave a destacar:** (2-3 bullets con los números o hallazgos más impactantes del dataset)

Tono: profesional, editorial, directo. Sin adjetivos vacíos. Orientado a lectores que pagan por análisis de calidad.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 700,
    messages: [{ role: 'user', content: prompt }],
  })

  const block = response.content[0]
  return block.type === 'text' && block.text ? block.text : ''
}

// ─── Deduplicación ────────────────────────────────────────────────────────────

class SeenDatasets {
  private filePath: string
  private seen: Set<string>

  constructor(dir: string) {
    this.filePath = path.join(dir, 'seen-datasets.json')
    if (fs.existsSync(this.filePath)) {
      const raw = JSON.parse(fs.readFileSync(this.filePath, 'utf-8')) as string[]
      this.seen = new Set(raw)
    } else {
      this.seen = new Set()
    }
  }

  has(id: string): boolean { return this.seen.has(id) }

  add(id: string): void {
    this.seen.add(id)
    // Limitar a 5000 entradas; purgar mitad cuando se supera
    if (this.seen.size > 5000) {
      const arr = Array.from(this.seen)
      this.seen = new Set(arr.slice(-2500))
    }
    fs.writeFileSync(this.filePath, JSON.stringify(Array.from(this.seen), null, 2))
  }
}

// ─── Notificación ─────────────────────────────────────────────────────────────

async function notifyOpportunity(opp: DatasetOpportunity): Promise<void> {
  const separator = '─'.repeat(60)

  const creatorsLine = opp.matchedCreators.map(c => `${c.name} (${c.specialty})`).join(', ')
  const kwLine = opp.matchedKeywords.slice(0, 5).join(', ')
  const sizeKb = opp.dataset.totalBytes > 0
    ? `${(opp.dataset.totalBytes / 1024 / 1024).toFixed(1)} MB`
    : 'N/A'

  console.log(`
${separator}
DATASET KAGGLE — Score: ${opp.relevanceScore}/20
${opp.dataset.title}
Por: ${opp.dataset.ownerName}  |  Votos: ${opp.dataset.voteCount}  |  Descargas: ${opp.dataset.downloadCount.toLocaleString()}  |  Tamaño: ${sizeKb}
URL: ${opp.dataset.url}
${separator}
Creadores relevantes: ${creatorsLine}
Keywords coincidentes: ${kwLine}`)

  if (opp.brief) {
    console.log(`${separator}\nBRIEF EDITORIAL:\n\n${opp.brief}`)
  }
  console.log(separator)

  // Webhook opcional (ej. Slack, n8n, Make)
  const webhookUrl = process.env.NEBBULER_WEBHOOK_URL
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'kaggle_opportunity',
        dataset: {
          title: opp.dataset.title,
          url: opp.dataset.url,
          votes: opp.dataset.voteCount,
          downloads: opp.dataset.downloadCount,
          owner: opp.dataset.ownerName,
        },
        score: opp.relevanceScore,
        keywords: opp.matchedKeywords,
        creators: opp.matchedCreators,
        brief: opp.brief ?? null,
      }),
    }).catch(() => {})
  }
}

// ─── Grupos de búsqueda ───────────────────────────────────────────────────────

const SEARCH_GROUPS = [
  {
    discipline: 'economia',
    queries: [
      'chile economy inflation gdp latam',
      'latin america macroeconomics monetary policy',
      'banco central chile copper commodities',
    ],
  },
  {
    discipline: 'finanzas',
    queries: [
      'south america financial markets corporate finance',
      'latam stocks private equity valuation',
      'chile mergers acquisitions ebitda',
    ],
  },
  {
    discipline: 'derecho',
    queries: [
      'chile tax law sii tributario',
      'labor law regulation latin america',
      'legal compliance corporate chile',
    ],
  },
  {
    discipline: 'medicina',
    queries: [
      'chile health epidemiology public health',
      'latin america disease mortality clinical',
      'salud publica fonasa hospital chile',
    ],
  },
  {
    discipline: 'ciencia-politica',
    queries: [
      'chile election political data latam',
      'voting behavior democracy latin america',
      'survey electoral systems chile',
    ],
  },
  {
    discipline: 'arquitectura',
    queries: [
      'chile urban housing real estate santiago',
      'latin america urban planning city data',
      'construction infrastructure urbanization latam',
    ],
  },
  {
    discipline: 'nutricion',
    queries: [
      'nutrition metabolic obesity latam chile',
      'microbiome gut health insulin resistance',
      'glp1 semaglutide fasting dietary data',
    ],
  },
  {
    discipline: 'ingenieria',
    queries: [
      'chile infrastructure civil engineering data',
      'road construction public works latam',
      'concessions project finance infrastructure',
    ],
  },
  {
    discipline: 'historia',
    queries: [
      'latin america economic history historical gdp',
      'chile historical data debt crisis',
      'south america financial history sovereign',
    ],
  },
  {
    discipline: 'tecnologia',
    queries: [
      'ai machine learning enterprise latam',
      'tech startup digital economy chile',
      'llm artificial intelligence applications data',
    ],
  },
]

// ─── Runner principal ─────────────────────────────────────────────────────────

async function runOnce(preview = false, briefQuery?: string): Promise<void> {
  const outputDir = path.join(__dirname, 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const seen = preview ? null : new SeenDatasets(outputDir)

  // Modo brief manual
  if (briefQuery) {
    console.log(`\nGenerando brief para: "${briefQuery}"\n`)
    const fakeDataset: KaggleDataset = {
      id: `manual-${Date.now()}`,
      title: briefQuery,
      subtitle: '',
      description: briefQuery,
      url: `https://www.kaggle.com/search?q=${encodeURIComponent(briefQuery)}`,
      ownerName: 'manual',
      totalBytes: 0,
      lastUpdated: new Date().toISOString(),
      downloadCount: 0,
      voteCount: 0,
      usabilityRating: 1,
      tags: [],
    }
    const { creators } = scoreDataset(fakeDataset)
    const creator = creators[0] ?? {
      name: 'Equipo Nebbuler',
      specialty: 'Análisis Profesional',
      slug: 'nebbuler',
      discipline: 'general',
    }
    const brief = await generateBrief(fakeDataset, creator)
    console.log('\nBRIEF GENERADO:\n' + '─'.repeat(60))
    console.log(brief)

    const outPath = path.join(outputDir, `brief-manual-${Date.now()}.md`)
    fs.writeFileSync(
      outPath,
      `# Brief: ${briefQuery}\n\n**Creador sugerido:** ${creator.name} — ${creator.specialty}\n\n${brief}\n`
    )
    console.log(`\nGuardado en: ${outPath}`)
    return
  }

  const allOpportunities: DatasetOpportunity[] = []
  let totalSearches = 0
  let totalDatasets = 0

  console.log(`\nBuscando datasets en Kaggle para ${SEARCH_GROUPS.length} disciplinas...\n`)

  for (const group of SEARCH_GROUPS) {
    const groupCreators = CREATORS.filter(c => c.discipline === group.discipline)
    if (groupCreators.length === 0) continue

    console.log(`[${group.discipline.toUpperCase()}] — ${groupCreators.map(c => c.name).join(', ')}`)

    for (const query of group.queries) {
      process.stdout.write(`  Buscando: "${query}"... `)
      const datasets = await searchKaggleDatasets(query, 8)
      totalSearches++
      totalDatasets += datasets.length
      let found = 0

      for (const dataset of datasets) {
        if (!dataset.id || !dataset.title) continue
        if (!preview && seen?.has(dataset.id)) continue

        // Solo datasets actualizados en últimos 90 días
        const ageDays = (Date.now() - new Date(dataset.lastUpdated).getTime()) / 86400000
        if (ageDays > 90) continue

        const { score, keywords, creators } = scoreDataset(dataset)
        if (score < 2 || creators.length === 0) continue

        if (!preview) seen?.add(dataset.id)

        allOpportunities.push({
          dataset,
          matchedCreators: creators,
          relevanceScore: score,
          matchedKeywords: keywords,
        })
        found++
      }

      console.log(`${datasets.length} datasets, ${found} relevantes`)
      // Rate limit gentil
      await new Promise(r => setTimeout(r, 1200))
    }
    console.log('')
  }

  // Ordenar por relevancia y tomar top 5
  allOpportunities.sort((a, b) => b.relevanceScore - a.relevanceScore)
  const topOpps = allOpportunities.slice(0, 5)

  // Generar briefs para los mejores (si hay API key)
  if (topOpps.length > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log(`Generando briefs editoriales para top ${topOpps.length} datasets...\n`)
    for (const opp of topOpps) {
      const creator = opp.matchedCreators[0]
      if (creator) {
        opp.brief = await generateBrief(opp.dataset, creator)
        await new Promise(r => setTimeout(r, 800))
      }
    }
  }

  // Mostrar resultados
  console.log(`\n${'='.repeat(60)}`)
  console.log(`RESUMEN: ${allOpportunities.length} datasets relevantes de ${totalDatasets} analizados`)
  console.log(`Búsquedas: ${totalSearches} | Top ${topOpps.length} con brief`)
  console.log('='.repeat(60))

  if (topOpps.length === 0) {
    console.log('\nNo se encontraron datasets relevantes en esta pasada.')
    console.log('Verifica las credenciales KAGGLE_USERNAME y KAGGLE_KEY.')
    return
  }

  for (const opp of topOpps) {
    await notifyOpportunity(opp)
  }

  // Guardar log JSON
  if (!preview) {
    const dateStr = new Date().toISOString().slice(0, 10)
    const logPath = path.join(outputDir, `kaggle-log-${dateStr}.json`)
    const logData = topOpps.map(o => ({
      date: new Date().toISOString(),
      title: o.dataset.title,
      url: o.dataset.url,
      owner: o.dataset.ownerName,
      score: o.relevanceScore,
      votes: o.dataset.voteCount,
      downloads: o.dataset.downloadCount,
      keywords: o.matchedKeywords,
      creators: o.matchedCreators.map(c => ({ name: c.name, discipline: c.discipline })),
      briefSnippet: o.brief ? o.brief.slice(0, 200) + '...' : null,
    }))

    // Mergear con log existente del día si lo hay
    let existing: typeof logData = []
    if (fs.existsSync(logPath)) {
      try { existing = JSON.parse(fs.readFileSync(logPath, 'utf-8')) as typeof logData } catch { existing = [] }
    }
    fs.writeFileSync(logPath, JSON.stringify([...existing, ...logData], null, 2))
    console.log(`\nLog guardado: ${logPath}`)
  }
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  console.log('\n=== Kaggle Dataset Monitor — Nebbuler ===')
  console.log(`Creadores: ${CREATORS.length} | Disciplinas: ${[...new Set(CREATORS.map(c => c.discipline))].join(', ')}`)

  // Validar credenciales
  const hasKaggle = !!(process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY)
  const hasClaude = !!process.env.ANTHROPIC_API_KEY
  const hasWebhook = !!process.env.NEBBULER_WEBHOOK_URL

  console.log(`\nCredenciales: Kaggle ${hasKaggle ? 'OK' : 'FALTA'} | Claude ${hasClaude ? 'OK' : 'FALTA'} | Webhook ${hasWebhook ? 'OK' : 'NO'}`)

  if (!hasKaggle) {
    console.log(`
Para activar búsqueda completa en Kaggle:
  1. kaggle.com -> Account -> API -> Create New Token
  2. Agrega a .env.local:
       KAGGLE_USERNAME=tu_usuario
       KAGGLE_KEY=tu_api_key_de_40_chars

Para briefs automáticos con Claude:
       ANTHROPIC_API_KEY=sk-ant-...

Para notificaciones (opcional):
       NEBBULER_WEBHOOK_URL=https://...
`)
  }

  if (args.includes('--brief')) {
    const idx = args.indexOf('--brief')
    const query = args[idx + 1]
    if (!query) {
      console.error('Uso: npx ts-node kaggle-monitor.ts --brief "titulo del dataset"')
      process.exit(1)
    }
    await runOnce(false, query)

  } else if (args.includes('--preview')) {
    console.log('\nModo preview — sin guardar estado\n')
    await runOnce(true)

  } else if (args.includes('--daemon')) {
    const intervalHours = 6
    console.log(`\nModo daemon — revisando cada ${intervalHours} horas\n`)
    while (true) {
      await runOnce()
      console.log(`\nProxima revision en ${intervalHours} horas. (${new Date(Date.now() + intervalHours * 3600000).toLocaleString('es-CL')})\n`)
      await new Promise(r => setTimeout(r, intervalHours * 3600000))
    }

  } else {
    // --run o default
    await runOnce()
  }
}

main().catch(err => {
  console.error('\nError fatal:', err)
  process.exit(1)
})
