/**
 * GSC Optimizer — Analiza Google Search Console y mejora CTR con IA
 *
 * Identifica páginas con ALTO impressions pero BAJO CTR, luego usa Claude
 * para reescribir meta titles y descriptions más atractivos.
 *
 * Requisitos:
 *   1. Google Search Console API habilitada en Google Cloud Console
 *   2. Service Account con permiso de lectura en la propiedad de GSC
 *   3. Archivo credentials.json descargado
 *   4. ANTHROPIC_API_KEY
 *
 * Uso:
 *   npx ts-node gsc-optimizer.ts --analyze          # Solo analiza, no escribe
 *   npx ts-node gsc-optimizer.ts --optimize         # Analiza + genera mejoras
 *   npx ts-node gsc-optimizer.ts --url /observatorio/substack-en-espanol-2026
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface GscRow {
  page: string
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface PageOpportunity {
  page: string
  totalImpressions: number
  totalClicks: number
  avgCtr: number
  avgPosition: number
  topQueries: string[]
  opportunityScore: number // impressions * (expectedCtr - actualCtr)
}

interface MetaImprovement {
  page: string
  currentTitle?: string
  currentDescription?: string
  suggestedTitle: string
  suggestedDescription: string
  reasoning: string
  topQueries: string[]
}

// ─── GSC API Client ────────────────────────────────────────────────────────────

async function fetchGscData(
  credentialsPath: string,
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<GscRow[]> {
  // Cargar credenciales de Service Account
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials no encontradas en: ${credentialsPath}\n\nPara configurar:\n1. Google Cloud Console → APIs → Search Console API → Habilitar\n2. Crear Service Account → Descargar JSON\n3. En GSC: Configuración → Usuarios → Añadir (el email del service account, como lector)\n4. Guardar el JSON como: automation/gsc-optimizer/credentials.json`)
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'))

  // Obtener token JWT para Service Account
  const token = await getServiceAccountToken(credentials)

  const response = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['page', 'query'],
        rowLimit: 1000,
        startRow: 0,
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`GSC API error ${response.status}: ${err}`)
  }

  const data = await response.json() as { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> }

  return (data.rows ?? []).map(row => ({
    page: row.keys[0],
    query: row.keys[1],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }))
}

async function getServiceAccountToken(credentials: {
  client_email: string
  private_key: string
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url')

  // Firmar con la clave privada RSA del service account
  const { createSign } = await import('crypto')
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  const signature = signer.sign(credentials.private_key, 'base64url')

  const jwt = `${header}.${payload}.${signature}`

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  const tokenData = await tokenResponse.json() as { access_token: string }
  return tokenData.access_token
}

// ─── Análisis de oportunidades ────────────────────────────────────────────────

function findOpportunities(rows: GscRow[], minImpressions = 50): PageOpportunity[] {
  // Agrupar por página
  const byPage = new Map<string, GscRow[]>()
  for (const row of rows) {
    const existing = byPage.get(row.page) ?? []
    existing.push(row)
    byPage.set(row.page, existing)
  }

  const opportunities: PageOpportunity[] = []

  for (const [page, pageRows] of byPage.entries()) {
    const totalImpressions = pageRows.reduce((s, r) => s + r.impressions, 0)
    const totalClicks = pageRows.reduce((s, r) => s + r.clicks, 0)
    const avgCtr = totalClicks / totalImpressions
    const avgPosition = pageRows.reduce((s, r) => s + r.position, 0) / pageRows.length

    if (totalImpressions < minImpressions) continue

    // CTR esperado según posición promedio (benchmarks de industria)
    const expectedCtr = avgPosition <= 1 ? 0.28 :
                        avgPosition <= 2 ? 0.15 :
                        avgPosition <= 3 ? 0.11 :
                        avgPosition <= 5 ? 0.07 :
                        avgPosition <= 10 ? 0.04 : 0.02

    // Solo páginas con CTR real MENOR al esperado (oportunidades reales)
    if (avgCtr >= expectedCtr * 0.8) continue

    const opportunityScore = Math.round(totalImpressions * (expectedCtr - avgCtr))

    const topQueries = pageRows
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5)
      .map(r => r.query)

    opportunities.push({
      page,
      totalImpressions,
      totalClicks,
      avgCtr,
      avgPosition,
      topQueries,
      opportunityScore,
    })
  }

  return opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore)
}

// ─── Generación de mejoras con Claude ─────────────────────────────────────────

async function generateMetaImprovements(
  opportunities: PageOpportunity[],
  limit = 10
): Promise<MetaImprovement[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY no configurada. Solo mostrando análisis sin sugerencias.')
    return []
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey })

  const improvements: MetaImprovement[] = []
  const toProcess = opportunities.slice(0, limit)

  for (const opp of toProcess) {
    console.log(`  Optimizando: ${opp.page}`)

    const prompt = `Eres un experto en SEO y copywriting para Nebbuler, una plataforma de newsletters profesionales de pago en Chile y LATAM.

Página a optimizar: ${opp.page}
Impresiones mensuales: ${opp.totalImpressions}
CTR actual: ${(opp.avgCtr * 100).toFixed(1)}%
Posición promedio: ${opp.avgPosition.toFixed(1)}
Queries principales por las que rankea:
${opp.topQueries.map(q => `  - "${q}"`).join('\n')}

Genera un nuevo meta title (máximo 60 caracteres) y meta description (máximo 155 caracteres) que:
1. Incluyan la query principal naturalmente
2. Sean atractivos para el público profesional chileno/latinoamericano
3. Incluyan un beneficio claro o dato concreto
4. Usen verbos de acción cuando aplique
5. Diferencien a Nebbuler (plataforma de pago, 0% comisión, profesionales verificados)

Responde SOLO con este JSON exacto:
{
  "title": "...",
  "description": "...",
  "reasoning": "..."
}`

    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { title: string; description: string; reasoning: string }
        improvements.push({
          page: opp.page,
          suggestedTitle: parsed.title,
          suggestedDescription: parsed.description,
          reasoning: parsed.reasoning,
          topQueries: opp.topQueries,
        })
      }
    } catch (err) {
      console.warn(`  Error generando mejora para ${opp.page}:`, err)
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  return improvements
}

// ─── Reporte ──────────────────────────────────────────────────────────────────

function generateReport(
  opportunities: PageOpportunity[],
  improvements: MetaImprovement[]
): string {
  const date = new Date().toISOString().slice(0, 10)
  let report = `# GSC Optimization Report — Nebbuler\nFecha: ${date}\n\n`

  report += `## Oportunidades identificadas (top ${Math.min(opportunities.length, 20)})\n\n`
  report += `| Página | Impresiones | CTR actual | Posición | Oportunidad |\n`
  report += `|--------|-------------|-----------|----------|-------------|\n`

  opportunities.slice(0, 20).forEach(opp => {
    report += `| ${opp.page.replace('https://nebbuler.com', '')} | ${opp.totalImpressions} | ${(opp.avgCtr * 100).toFixed(1)}% | ${opp.avgPosition.toFixed(1)} | +${opp.opportunityScore} clicks/mes |\n`
  })

  if (improvements.length > 0) {
    report += `\n## Mejoras generadas con IA\n\n`
    improvements.forEach(imp => {
      report += `### ${imp.page.replace('https://nebbuler.com', '')}\n`
      report += `**Queries:** ${imp.topQueries.slice(0, 3).join(', ')}\n\n`
      report += `**Title sugerido:** ${imp.suggestedTitle}\n\n`
      report += `**Description sugerida:** ${imp.suggestedDescription}\n\n`
      report += `**Razón:** ${imp.reasoning}\n\n---\n\n`
    })
  }

  return report
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  console.log('\n=== GSC Optimizer — Nebbuler ===\n')

  const credentialsPath = path.join(__dirname, 'credentials.json')
  const siteUrl = 'https://nebbuler.com/'

  // Últimos 28 días
  const endDate = new Date().toISOString().slice(0, 10)
  const startDate = new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10)

  if (!fs.existsSync(credentialsPath)) {
    console.log(`
Para configurar el GSC Optimizer:

1. Google Cloud Console: console.cloud.google.com
   → Crear proyecto → APIs y Servicios → Habilitar "Google Search Console API"

2. Crear Service Account:
   → IAM y Administración → Cuentas de servicio → Crear
   → Rol: Visualizador
   → Crear clave → JSON → Guardar como automation/gsc-optimizer/credentials.json

3. Google Search Console: search.google.com/search-console
   → Configuración → Usuarios y permisos → Agregar usuario
   → Email del service account (ej: nombre@proyecto.iam.gserviceaccount.com)
   → Permiso: Propietario (para lectura de datos)

4. Variables de entorno:
   ANTHROPIC_API_KEY=sk-ant-...

Luego ejecuta: npx ts-node gsc-optimizer.ts --analyze
    `)
    return
  }

  console.log(`Período: ${startDate} → ${endDate}`)
  console.log('Obteniendo datos de GSC...')

  let rows: GscRow[]
  try {
    rows = await fetchGscData(credentialsPath, siteUrl, startDate, endDate)
    console.log(`  ${rows.length} filas obtenidas`)
  } catch (err) {
    console.error('Error obteniendo datos de GSC:', err)
    process.exit(1)
  }

  const opportunities = findOpportunities(rows, 50)
  console.log(`\nOportunidades encontradas: ${opportunities.length}`)

  if (args.includes('--analyze')) {
    opportunities.slice(0, 20).forEach((opp, i) => {
      console.log(`\n${i+1}. ${opp.page.replace('https://nebbuler.com', '')}`)
      console.log(`   Impresiones: ${opp.totalImpressions} | CTR: ${(opp.avgCtr*100).toFixed(1)}% | Pos: ${opp.avgPosition.toFixed(1)}`)
      console.log(`   Oportunidad: +${opp.opportunityScore} clicks/mes`)
      console.log(`   Queries: ${opp.topQueries.slice(0, 3).join(', ')}`)
    })
  }

  let improvements: MetaImprovement[] = []
  if (args.includes('--optimize')) {
    console.log('\nGenerando mejoras con Claude...')
    improvements = await generateMetaImprovements(opportunities, 10)
  }

  const report = generateReport(opportunities, improvements)
  const outputDir = path.join(__dirname, 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
  const reportPath = path.join(outputDir, `gsc-report-${endDate}.md`)
  fs.writeFileSync(reportPath, report)
  console.log(`\nReporte guardado en: ${reportPath}`)
}

main().catch(err => { console.error(err); process.exit(1) })
