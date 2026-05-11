/**
 * Kaggle Creator Discovery — Nebbuler
 *
 * Encuentra analistas y científicos de datos en LATAM que publican
 * trabajo de calidad en Kaggle sobre economía, salud, finanzas, etc.
 * Son candidatos para abrir sala en Nebbuler.
 *
 * API Kaggle (requiere KAGGLE_USERNAME y KAGGLE_KEY):
 *   - Busca notebooks con análisis de LATAM/Chile por disciplina
 *   - Filtra por upvotes y calidad
 *   - Genera profile de cada candidato
 *
 * Uso:
 *   npx ts-node kaggle-creator-discovery.ts --run
 *   npx ts-node kaggle-creator-discovery.ts --profile usuario_kaggle
 *   npx ts-node kaggle-creator-discovery.ts --export csv
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface KaggleNotebook {
  ref: string           // "username/notebook-title"
  title: string
  author: string        // username
  totalVotes: number
  url: string
  lastRunTime: string
  language: string      // Python, R, etc.
}

interface KaggleUserProfile {
  userName: string
  displayName: string
  url: string
  thumbnailUrl?: string
  bio?: string
  occupation?: string
  location?: string
  twitterName?: string
  websiteUrl?: string
  totalVotes: number
  totalDownloads: number
  notebooksCount: number
  datasetsCount: number
  tier: string          // Novice, Contributor, Expert, Master, Grandmaster
}

interface CreatorCandidate {
  kaggleUsername: string
  displayName: string
  kaggleUrl: string
  twitterHandle?: string
  websiteUrl?: string
  location?: string
  occupation?: string
  bio?: string
  tier: string
  totalVotes: number
  topNotebook: string
  discipline: string
  nebbulerFit: string   // descripción de por qué encaja en Nebbuler
  score: number
  source: string
}

// ─── Queries de búsqueda de notebooks ────────────────────────────────────────

const NOTEBOOK_SEARCHES: Array<{
  query: string
  discipline: string
  minVotes: number
}> = [
  // Economía Chile/LATAM
  { query: 'chile economy analysis', discipline: 'economia', minVotes: 5 },
  { query: 'inflacion chile python', discipline: 'economia', minVotes: 3 },
  { query: 'latin america gdp analysis', discipline: 'economia', minVotes: 10 },
  { query: 'banco central chile datos', discipline: 'economia', minVotes: 3 },
  { query: 'latam macroeconomics', discipline: 'economia', minVotes: 5 },
  { query: 'chile copper price analysis', discipline: 'economia', minVotes: 5 },

  // Finanzas
  { query: 'chile stock market analysis', discipline: 'finanzas', minVotes: 5 },
  { query: 'latin america financial data', discipline: 'finanzas', minVotes: 8 },
  { query: 'bolsa valores latam', discipline: 'finanzas', minVotes: 3 },

  // Salud pública
  { query: 'chile health statistics', discipline: 'medicina', minVotes: 5 },
  { query: 'latam epidemiology analysis', discipline: 'medicina', minVotes: 8 },
  { query: 'salud publica colombia mexico', discipline: 'medicina', minVotes: 3 },

  // Urbanismo / Arquitectura
  { query: 'chile urban data analysis', discipline: 'arquitectura', minVotes: 5 },
  { query: 'latin america housing', discipline: 'arquitectura', minVotes: 5 },

  // Tecnología
  { query: 'latam tech startup data', discipline: 'tecnologia', minVotes: 10 },
]

// ─── Kaggle API helpers ───────────────────────────────────────────────────────

function getAuthHeader(): string {
  const user = process.env.KAGGLE_USERNAME
  const key = process.env.KAGGLE_KEY
  if (!user || !key) throw new Error('KAGGLE_USERNAME y KAGGLE_KEY requeridos')
  return `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}`
}

async function searchNotebooks(query: string, limit = 20): Promise<KaggleNotebook[]> {
  try {
    const params = new URLSearchParams({
      search: query,
      sortBy: 'voteCount',
      pageSize: String(limit),
    })

    const response = await fetch(
      `https://www.kaggle.com/api/v1/kernels/list?${params}`,
      { headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' } }
    )

    if (!response.ok) return []

    const data = await response.json() as Array<{
      ref: string; title: string; author: string;
      totalVotes: number; url: string; lastRunTime: string; language: string
    }>
    return data
  } catch {
    return []
  }
}

async function getUserProfile(username: string): Promise<KaggleUserProfile | null> {
  try {
    const response = await fetch(
      `https://www.kaggle.com/api/v1/users/${username}`,
      { headers: { Authorization: getAuthHeader() } }
    )

    if (!response.ok) return null
    return await response.json() as KaggleUserProfile
  } catch {
    return null
  }
}

// ─── Scoring de candidatos ────────────────────────────────────────────────────

const TIER_SCORES: Record<string, number> = {
  'Grandmaster': 10, 'Master': 8, 'Expert': 6, 'Contributor': 4, 'Novice': 2,
}

const LOCATION_BONUS: Record<string, number> = {
  'chile': 5, 'colombia': 4, 'mexico': 4, 'argentina': 4, 'peru': 3,
  'brazil': 2, 'latam': 3, 'latin america': 3, 'santiago': 5, 'bogota': 4,
  'buenos aires': 4, 'ciudad de mexico': 4, 'lima': 3,
}

function scoreCandidate(
  profile: KaggleUserProfile,
  discipline: string,
  topNotebook: KaggleNotebook
): number {
  let score = 0

  // Tier de Kaggle
  score += TIER_SCORES[profile.tier] ?? 1

  // Votos totales
  score += Math.min(5, Math.floor(profile.totalVotes / 50))

  // Localización LATAM
  const location = (profile.location ?? '').toLowerCase()
  for (const [loc, bonus] of Object.entries(LOCATION_BONUS)) {
    if (location.includes(loc)) { score += bonus; break }
  }

  // Tiene presencia web (más profesional)
  if (profile.websiteUrl) score += 2
  if (profile.twitterName) score += 1

  // Tiene bio descriptiva
  if (profile.bio && profile.bio.length > 50) score += 1

  // Calidad del notebook top
  score += Math.min(3, Math.floor(topNotebook.totalVotes / 20))

  return score
}

function getNebbulerFit(profile: KaggleUserProfile, discipline: string): string {
  const fits: Record<string, string> = {
    economia: `Analista de datos con expertise en economía LATAM. Sus notebooks demuestran capacidad para traducir datos complejos en insights accesibles — exactamente lo que los lectores de Nebbuler buscan.`,
    finanzas: `Especialista en análisis financiero con datos reales de mercados LATAM. Podría publicar análisis de empresas, valoraciones y tendencias del mercado chileno.`,
    medicina: `Analista de datos de salud pública con foco en LATAM. Sus análisis epidemiológicos y de sistemas de salud resonarían con médicos y gestores sanitarios de la región.`,
    arquitectura: `Analista urbano con datos de ciudades y vivienda en LATAM. Podría cubrir planificación urbana, mercado inmobiliario y movilidad con rigor cuantitativo.`,
    tecnologia: `Data scientist con enfoque en ecosistemas tech de LATAM. Podría analizar tendencias de startups, adopción de IA y transformación digital en la región.`,
  }
  return fits[discipline] ?? `Analista de datos con expertise relevante para lectores profesionales de Nebbuler.`
}

// ─── Export ───────────────────────────────────────────────────────────────────

function exportToCsv(candidates: CreatorCandidate[], outputPath: string): void {
  const headers = [
    'displayName', 'kaggleUsername', 'kaggleUrl', 'twitterHandle',
    'websiteUrl', 'location', 'discipline', 'tier', 'score', 'nebbulerFit', 'topNotebook',
  ]
  const rows = candidates.map(c =>
    headers.map(h => {
      const val = String((c as Record<string, unknown>)[h] ?? '')
      return val.includes(',') ? `"${val.replace(/"/g, '""')}"` : val
    }).join(',')
  )
  fs.writeFileSync(outputPath, [headers.join(','), ...rows].join('\n'), 'utf-8')
  console.log(`CSV exportado: ${outputPath}`)
}

function exportToMarkdown(candidates: CreatorCandidate[], outputPath: string): void {
  const lines: string[] = [
    `# Kaggle Creator Discovery — Nebbuler`,
    ``,
    `**Generado**: ${new Date().toISOString().slice(0, 10)}  `,
    `**Total candidatos**: ${candidates.length}`,
    ``,
    `---`,
    ``,
  ]

  const byDiscipline = candidates.reduce<Record<string, CreatorCandidate[]>>((acc, c) => {
    if (!acc[c.discipline]) acc[c.discipline] = []
    acc[c.discipline].push(c)
    return acc
  }, {})

  for (const [discipline, group] of Object.entries(byDiscipline)) {
    lines.push(`## ${discipline.charAt(0).toUpperCase() + discipline.slice(1)}`)
    lines.push(``)
    for (const c of group.slice(0, 10)) {
      lines.push(`### ${c.displayName} — Score: ${c.score}/20`)
      lines.push(``)
      lines.push(`- **Kaggle**: [${c.kaggleUsername}](${c.kaggleUrl})`)
      lines.push(`- **Tier**: ${c.tier}`)
      lines.push(`- **Ubicación**: ${c.location ?? 'No especificada'}`)
      if (c.twitterHandle) lines.push(`- **Twitter**: [@${c.twitterHandle}](https://twitter.com/${c.twitterHandle})`)
      if (c.websiteUrl) lines.push(`- **Web**: ${c.websiteUrl}`)
      if (c.occupation) lines.push(`- **Ocupación**: ${c.occupation}`)
      if (c.bio) lines.push(`- **Bio**: ${c.bio}`)
      lines.push(`- **Notebook top**: ${c.topNotebook}`)
      lines.push(`- **Fit Nebbuler**: ${c.nebbulerFit}`)
      lines.push(``)
    }
    lines.push(`---`)
    lines.push(``)
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')
  console.log(`Markdown exportado: ${outputPath}`)
}

// ─── Discovery principal ──────────────────────────────────────────────────────

async function runDiscovery(): Promise<CreatorCandidate[]> {
  const allCandidates: CreatorCandidate[] = []
  const seenUsers = new Set<string>()

  for (const search of NOTEBOOK_SEARCHES) {
    process.stdout.write(`  Buscando notebooks: "${search.query}"... `)

    const notebooks = await searchNotebooks(search.query, 15)
    let found = 0

    for (const notebook of notebooks) {
      if (notebook.totalVotes < search.minVotes) continue
      if (seenUsers.has(notebook.author)) continue
      seenUsers.add(notebook.author)

      // Pausa para respetar rate limits de Kaggle
      await new Promise(r => setTimeout(r, 500))

      const profile = await getUserProfile(notebook.author)
      if (!profile) continue

      // Filtro: solo LATAM o sin ubicación (podría ser LATAM)
      const location = (profile.location ?? '').toLowerCase()
      const isLatam = Object.keys(LOCATION_BONUS).some(l => location.includes(l))
      const noLocation = !profile.location || profile.location.trim() === ''
      if (!isLatam && !noLocation) continue

      const score = scoreCandidate(profile, search.discipline, notebook)
      if (score < 5) continue

      allCandidates.push({
        kaggleUsername: profile.userName,
        displayName: profile.displayName,
        kaggleUrl: `https://www.kaggle.com/${profile.userName}`,
        twitterHandle: profile.twitterName,
        websiteUrl: profile.websiteUrl,
        location: profile.location,
        occupation: profile.occupation,
        bio: profile.bio?.slice(0, 200),
        tier: profile.tier,
        totalVotes: profile.totalVotes,
        topNotebook: `${notebook.title} (${notebook.totalVotes} votos) — ${notebook.url}`,
        discipline: search.discipline,
        nebbulerFit: getNebbulerFit(profile, search.discipline),
        score,
        source: `kaggle-notebooks:${search.query}`,
      })
      found++

      if (found >= 5) break // máximo 5 candidatos por query
    }

    console.log(`${notebooks.length} notebooks, ${found} candidatos`)

    // Pausa entre queries para no saturar la API
    await new Promise(r => setTimeout(r, 2000))
  }

  // Deduplicar y ordenar por score desc
  return allCandidates
    .filter((c, i, arr) => arr.findIndex(x => x.kaggleUsername === c.kaggleUsername) === i)
    .sort((a, b) => b.score - a.score)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  console.log('\n=== Kaggle Creator Discovery — Nebbuler ===\n')

  const outputDir = path.join(__dirname, 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  // Validar credenciales antes de cualquier operación
  if (!process.env.KAGGLE_USERNAME || !process.env.KAGGLE_KEY) {
    console.log(`
Requiere credenciales de Kaggle:
  KAGGLE_USERNAME=tu_usuario
  KAGGLE_KEY=tu_api_key

Obtener en: kaggle.com → Account → Create New API Token
El token descarga un archivo kaggle.json con ambos valores.

Ejemplo de uso:
  KAGGLE_USERNAME=miusuario KAGGLE_KEY=abc123 npx ts-node kaggle-creator-discovery.ts --run
    `)
    process.exit(1)
  }

  // ── Modo: perfil individual ──
  if (args.includes('--profile')) {
    const username = args[args.indexOf('--profile') + 1]
    if (!username) { console.error('Uso: --profile <username>'); process.exit(1) }

    console.log(`Perfil de @${username} en Kaggle...\n`)
    const profile = await getUserProfile(username)
    if (!profile) { console.error('Usuario no encontrado o API error'); process.exit(1) }

    console.log(`Nombre:     ${profile.displayName}`)
    console.log(`Tier:       ${profile.tier}`)
    console.log(`Votos:      ${profile.totalVotes}`)
    console.log(`Notebooks:  ${profile.notebooksCount}`)
    console.log(`Datasets:   ${profile.datasetsCount}`)
    console.log(`Ubicación:  ${profile.location ?? 'No especificada'}`)
    console.log(`Ocupación:  ${profile.occupation ?? 'No especificada'}`)
    console.log(`Bio:        ${profile.bio ?? 'Sin bio'}`)
    console.log(`Web:        ${profile.websiteUrl ?? 'N/A'}`)
    console.log(`Twitter:    ${profile.twitterName ? '@' + profile.twitterName : 'N/A'}`)
    console.log(`URL Kaggle: https://www.kaggle.com/${profile.userName}`)
    return
  }

  // ── Modo: discovery completo ──
  console.log(`Iniciando discovery sobre ${NOTEBOOK_SEARCHES.length} queries...\n`)
  const candidates = await runDiscovery()

  console.log(`\n════════ ${candidates.length} candidatos encontrados ════════\n`)

  candidates.slice(0, 10).forEach((c, i) => {
    console.log(`${i + 1}. [${c.score}/20] ${c.displayName} (@${c.kaggleUsername})`)
    console.log(`   ${c.tier} · ${c.discipline} · ${c.location ?? 'Ubicación no especificada'}`)
    console.log(`   ${c.kaggleUrl}`)
    if (c.websiteUrl) console.log(`   Web: ${c.websiteUrl}`)
    if (c.twitterHandle) console.log(`   Twitter: @${c.twitterHandle}`)
    console.log()
  })

  const timestamp = new Date().toISOString().slice(0, 10)
  const jsonPath = path.join(outputDir, `kaggle-creators-${timestamp}.json`)
  const csvPath = path.join(outputDir, `kaggle-creators-${timestamp}.csv`)
  const mdPath = path.join(outputDir, `kaggle-creators-${timestamp}.md`)

  fs.writeFileSync(jsonPath, JSON.stringify(candidates, null, 2), 'utf-8')
  exportToCsv(candidates, csvPath)
  exportToMarkdown(candidates, mdPath)

  console.log(`\nExportado a:`)
  console.log(`  JSON: ${jsonPath}`)
  console.log(`  CSV:  ${csvPath}`)
  console.log(`  MD:   ${mdPath}`)
  console.log(`\nSiguiente paso: usar outreach/cold-email.ts para contactar a los candidatos con email publico`)
}

main().catch(err => {
  console.error('\nError fatal:', err)
  process.exit(1)
})
