/**
 * Creator Discovery Pipeline para Nebbuler
 *
 * Busca profesionales con presencia pública que podrían publicar en Nebbuler.
 * Solo accede a páginas públicas institucionales.
 *
 * Uso:
 *   npx ts-node automation/discovery/discover-creators.ts --source uc-economia
 *   npx ts-node automation/discovery/discover-creators.ts --all
 *   npx ts-node automation/discovery/discover-creators.ts --export csv
 */

import { chromium, type Browser, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PotentialCreator {
  name: string
  title: string          // "Profesor Asociado", "Director de Investigación"
  specialty: string      // área de expertise inferida
  institution: string
  email?: string
  linkedinUrl?: string
  profileUrl: string     // URL pública de donde se extrajo
  discipline: string     // economia | derecho | medicina | arquitectura | finanzas
  score: number          // 0-10, relevancia estimada para Nebbuler
  source: string         // "uc-economia" | "cep" | etc.
  extractedAt: string
}

type SelectorConfig = {
  container: string
  name: string
  title: string
  email?: string
  link?: string
}

type SourceConfig = {
  name: string
  url: string
  discipline: string
  selector: SelectorConfig
}

// ─── Fuentes de datos ────────────────────────────────────────────────────────

const SOURCES: Record<string, SourceConfig> = {
  'uc-economia': {
    name: 'PUC — Economía',
    url: 'https://economia.uc.cl/personas/academicos/',
    discipline: 'economia',
    selector: {
      container: '.person-card, .academic-card, article',
      name: 'h2, h3, .name',
      title: '.title, .cargo, .position',
      email: 'a[href^="mailto:"]',
      link: 'a[href*="/personas/"]',
    },
  },
  'uchile-economia': {
    name: 'U. de Chile — Economía',
    url: 'https://fen.uchile.cl/es/academicos',
    discipline: 'economia',
    selector: {
      container: '.docente, .profesor, .academic',
      name: 'h2, h3, .nombre',
      title: '.cargo, .especialidad',
      email: 'a[href^="mailto:"]',
      link: 'a',
    },
  },
  'uai-negocios': {
    name: 'UAI — Escuela de Negocios',
    url: 'https://www.uai.cl/escuela-de-negocios/academicos/',
    discipline: 'finanzas',
    selector: {
      container: '.academic-item, .profesor-card, article',
      name: 'h2, h3, .nombre',
      title: '.cargo, .especialidad, .area',
      email: 'a[href^="mailto:"]',
      link: 'a[href*="/academicos/"]',
    },
  },
  'cep': {
    name: 'CEP Chile',
    url: 'https://www.cepchile.cl/investigadores/',
    discipline: 'economia',
    selector: {
      container: 'article, .investigador',
      name: 'h2, h3',
      title: '.descripcion, .especialidad, p',
      email: 'a[href^="mailto:"]',
      link: 'a[href*="/investigadores/"]',
    },
  },
  'libertad-desarrollo': {
    name: 'Libertad y Desarrollo',
    url: 'https://lyd.org/quienes-somos/equipo/',
    discipline: 'economia',
    selector: {
      container: '.team-member, .persona',
      name: 'h2, h3, .nombre',
      title: '.cargo, .area',
      email: 'a[href^="mailto:"]',
      link: 'a',
    },
  },
  'clapes-uc': {
    name: 'CLAPES UC',
    url: 'https://clapesuc.cl/investigadores/',
    discipline: 'economia',
    selector: {
      container: 'article, .investigador-card, .person',
      name: 'h2, h3, .nombre',
      title: '.cargo, .descripcion, p',
      email: 'a[href^="mailto:"]',
      link: 'a',
    },
  },
  'espacio-publico': {
    name: 'Espacio Público',
    url: 'https://www.espaciopublico.cl/equipo/',
    discipline: 'economia',
    selector: {
      container: '.team-member, article, .persona',
      name: 'h2, h3',
      title: '.cargo, .especialidad, p',
      email: 'a[href^="mailto:"]',
      link: 'a',
    },
  },
  'usach-ingenieria': {
    name: 'USACH — Ingeniería Comercial',
    url: 'https://www.usach.cl/ingenieria-comercial-academicos',
    discipline: 'economia',
    selector: {
      container: '.academico, .profesor, article',
      name: 'h2, h3, .nombre',
      title: '.cargo, .grado, .area',
      email: 'a[href^="mailto:"]',
      link: 'a',
    },
  },
}

// ─── Scoring de relevancia ────────────────────────────────────────────────────

const HIGH_VALUE_KEYWORDS = [
  'director', 'investigador senior', 'phd', 'doctor', 'ex-banco central',
  'ex-ministerio', 'consultor', 'socio', 'gerente', 'jefe de',
  'columnista', 'analista', 'ex-ministro', 'ex-superintendente',
]

const MEDIUM_VALUE_KEYWORDS = [
  'profesor', 'académico', 'investigador', 'especialista',
  'coordinador', 'coordinadora', 'director adjunto',
]

function scoreProfile(name: string, title: string): number {
  const text = (name + ' ' + title).toLowerCase()
  let score = 5 // base

  for (const kw of HIGH_VALUE_KEYWORDS) {
    if (text.includes(kw)) score += 2
  }
  for (const kw of MEDIUM_VALUE_KEYWORDS) {
    if (text.includes(kw)) score += 1
  }

  // Bonus por título de doctor/PhD
  if (text.match(/\bph\.?d\b|doctorado|doctor en/i)) score += 2

  return Math.min(score, 10)
}

// ─── Scraper ─────────────────────────────────────────────────────────────────

async function scrapeSource(
  page: Page,
  sourceKey: string,
  source: SourceConfig
): Promise<PotentialCreator[]> {
  console.log(`\n  Scrapeando: ${source.name}`)
  console.log(`  URL: ${source.url}`)

  try {
    await page.goto(source.url, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    })
    await page.waitForTimeout(2000) // Esperar JS

    // Extraer datos genéricamente
    const creators = await page.evaluate((sel: SelectorConfig) => {
      const results: Array<{
        name: string
        title: string
        email: string
        link: string
      }> = []

      // Intentar múltiples selectores para el contenedor
      const containers = document.querySelectorAll(sel.container)

      containers.forEach(container => {
        const nameEl = container.querySelector(sel.name)
        const titleEl = container.querySelector(sel.title)
        const emailEl = sel.email ? container.querySelector(sel.email) : null
        const linkEl = sel.link ? container.querySelector(sel.link) : null

        const name = nameEl?.textContent?.trim() ?? ''
        const title = titleEl?.textContent?.trim() ?? ''

        if (name && name.length > 3) {
          results.push({
            name,
            title,
            email: (emailEl as HTMLAnchorElement)?.href?.replace('mailto:', '') ?? '',
            link: (linkEl as HTMLAnchorElement)?.href ?? '',
          })
        }
      })

      return results
    }, source.selector)

    return creators
      .filter(c => c.name.length > 3)
      .map(c => ({
        name: c.name,
        title: c.title,
        specialty: source.discipline,
        institution: source.name,
        email: c.email || undefined,
        profileUrl: c.link || source.url,
        discipline: source.discipline,
        score: scoreProfile(c.name, c.title),
        source: sourceKey,
        extractedAt: new Date().toISOString(),
      }))

  } catch (err) {
    console.error(`  Error scrapeando ${source.name}:`, err)
    return []
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

function exportToCsv(creators: PotentialCreator[], outputPath: string): void {
  const headers = [
    'name', 'title', 'discipline', 'institution',
    'email', 'score', 'profileUrl', 'source', 'extractedAt',
  ]

  const rows = creators.map(c =>
    headers.map(h => {
      const val = (c as Record<string, unknown>)[h] ?? ''
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    }).join(',')
  )

  const csv = [headers.join(','), ...rows].join('\n')
  fs.writeFileSync(outputPath, csv, 'utf-8')
  console.log(`\nExportado a: ${outputPath}`)
}

function exportToJson(creators: PotentialCreator[], outputPath: string): void {
  fs.writeFileSync(outputPath, JSON.stringify(creators, null, 2), 'utf-8')
  console.log(`Exportado a: ${outputPath}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const sourceFilter = args.includes('--source')
    ? args[args.indexOf('--source') + 1]
    : null
  const exportFormat = args.includes('--export')
    ? args[args.indexOf('--export') + 1]
    : 'json'
  const minScore = args.includes('--min-score')
    ? parseInt(args[args.indexOf('--min-score') + 1], 10)
    : 6

  const sourcesToRun: Record<string, SourceConfig> = sourceFilter
    ? (SOURCES[sourceFilter] ? { [sourceFilter]: SOURCES[sourceFilter] } : {})
    : SOURCES

  if (Object.keys(sourcesToRun).length === 0) {
    console.error(`Fuente no encontrada. Disponibles: ${Object.keys(SOURCES).join(', ')}`)
    process.exit(1)
  }

  console.log('\n=== Creator Discovery Pipeline — Nebbuler ===')
  console.log(`Fuentes: ${Object.keys(sourcesToRun).join(', ')}`)
  console.log(`Score mínimo: ${minScore}/10`)

  const browser: Browser = await chromium.launch({ headless: true })
  const page: Page = await browser.newPage()

  // User agent real para no parecer bot
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8',
  })

  const allCreators: PotentialCreator[] = []

  for (const [key, source] of Object.entries(sourcesToRun)) {
    const found = await scrapeSource(page, key, source)
    allCreators.push(...found)
    console.log(`  → ${found.length} perfiles encontrados`)

    // Pausa entre requests para ser respetuoso con los servidores
    await page.waitForTimeout(3000)
  }

  await browser.close()

  // Filtrar por score y deduplicar por nombre
  const filtered = allCreators
    .filter(c => c.score >= minScore)
    .filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i)
    .sort((a, b) => b.score - a.score)

  console.log(`\n=== Resultados ===`)
  console.log(`Total encontrados: ${allCreators.length}`)
  console.log(`Con score >= ${minScore}: ${filtered.length}`)

  // Preview top 10
  console.log('\nTop 10:')
  filtered.slice(0, 10).forEach((c, i) => {
    console.log(`  ${i + 1}. [${c.score}/10] ${c.name} — ${c.title} (${c.institution})`)
    if (c.email) console.log(`     Email: ${c.email}`)
  })

  // Exportar
  const outputDir = path.join(process.cwd(), 'automation', 'discovery', 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const timestamp = new Date().toISOString().slice(0, 10)
  const outputBase = path.join(outputDir, `creators-${timestamp}`)

  if (exportFormat === 'csv' || exportFormat === 'both') {
    exportToCsv(filtered, `${outputBase}.csv`)
  }
  if (exportFormat === 'json' || exportFormat === 'both' || exportFormat !== 'csv') {
    exportToJson(filtered, `${outputBase}.json`)
  }

  console.log('\nDiscovery completado.')
}

main().catch(err => { console.error(err); process.exit(1) })
