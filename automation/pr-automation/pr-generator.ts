/**
 * PR Generator — Comunicados de prensa automáticos para Nebbuler
 *
 * Genera comunicados de prensa y los distribuye a medios chilenos
 * cuando los creadores alcanzan hitos importantes.
 *
 * Distribución a (gratuita):
 *   - PressReleasePoint (pressreleasepoint.com)
 *   - PRLog (prlog.org)
 *   - OpenPR (openpr.com)
 *   - i-Newswire (i-newswire.com)
 *   - PRFree (prfree.org)
 *
 * Uso:
 *   npx ts-node pr-generator.ts --creator rodrigo-fuentes-marin --milestone 100-suscriptores
 *   npx ts-node pr-generator.ts --generate-only --creator carolina-vega-toro
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Hitos configurables ──────────────────────────────────────────────────────

const MILESTONES: Record<string, {
  title: string
  threshold: number
  template: (data: CreatorData) => string
}> = {
  'lanzamiento': {
    title: 'Lanzamiento de newsletter',
    threshold: 0,
    template: (d) => generatePRLaunch(d),
  },
  '100-suscriptores': {
    title: '100 suscriptores',
    threshold: 100,
    template: (d) => generatePR100Subscribers(d),
  },
  '500-suscriptores': {
    title: '500 suscriptores',
    threshold: 500,
    template: (d) => generatePR500Subscribers(d),
  },
  'primer-aniversario': {
    title: '1 año publicando',
    threshold: 0,
    template: (d) => generatePRAnniversary(d),
  },
}

interface CreatorData {
  name: string
  slug: string
  specialty: string
  institution?: string
  bio: string
  subscribers: number
  since: string
  price_clp: number
}

// ─── Templates de PR ──────────────────────────────────────────────────────────

function generatePRLaunch(d: CreatorData): string {
  const fecha = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  return `COMUNICADO DE PRENSA
Para publicación inmediata

${d.name} lanza newsletter profesional de pago en Nebbuler: análisis de ${d.specialty} directamente a profesionales de Chile y LATAM

SANTIAGO, CHILE — ${fecha} — ${d.name}, ${d.bio.slice(0, 120)}, lanzó hoy su newsletter profesional en Nebbuler (nebbuler.com), la primera plataforma chilena de newsletters de pago especializada en análisis profesional de alto nivel.

La publicación, disponible en nebbuler.com/${d.slug}, cobra $${d.price_clp.toLocaleString('es-CL')} CLP mensual y ofrece análisis sobre ${d.specialty} para profesionales del sector.

"Nebbuler me permite cobrar directamente por mi conocimiento sin intermediarios", comentó ${d.name.split(' ')[0]}. "La plataforma no cobra comisión sobre las suscripciones, lo que hace el modelo completamente diferente a otras alternativas en español."

Nebbuler es la única plataforma de newsletters profesionales en español que integra pagos con MercadoPago, permitiendo cobrar en pesos chilenos, argentinos, colombianos y mexicanos sin conversión de divisas.

Sobre Nebbuler: nebbuler.com es la plataforma de newsletters profesionales de pago para Chile y Latinoamérica. 0% de comisión. Economistas, abogados, médicos y arquitectos verificados publican análisis de nivel premium.

Contacto de prensa: hello@nebbuler.com
Web: https://nebbuler.com/${d.slug}
`
}

function generatePR100Subscribers(d: CreatorData): string {
  const fecha = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  const monthlyRevenue = (d.price_clp * d.subscribers).toLocaleString('es-CL')
  return `COMUNICADO DE PRENSA
Para publicación inmediata

${d.name} supera 100 suscriptores de pago en Nebbuler con su newsletter de ${d.specialty}

SANTIAGO, CHILE — ${fecha} — El newsletter de ${d.name} en Nebbuler (nebbuler.com/${d.slug}) superó los 100 suscriptores de pago, representando $${monthlyRevenue} CLP en ingresos mensuales recurrentes directos al autor.

El logro llega ${d.since} después del lanzamiento, consolidando el modelo de newsletter profesional de pago en español como una alternativa viable para expertos de LATAM.

Nebbuler, la plataforma que aloja la publicación, cobra $29.990 CLP/mes a sus creadores y cero comisión sobre las suscripciones.

Contacto: hello@nebbuler.com
`
}

function generatePR500Subscribers(d: CreatorData): string {
  const fecha = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  const monthlyRevenue = (d.price_clp * d.subscribers).toLocaleString('es-CL')
  return `COMUNICADO DE PRENSA
Para publicación inmediata

Newsletter de ${d.specialty} en Nebbuler alcanza 500 suscriptores de pago y $${monthlyRevenue} CLP/mes

SANTIAGO, CHILE — ${fecha} — ${d.name}, autor del newsletter de ${d.specialty} en Nebbuler, superó los 500 suscriptores activos de pago, generando $${monthlyRevenue} CLP mensuales de ingreso recurrente.

El caso demuestra la viabilidad del modelo de conocimiento profesional de pago en español a escala regional, donde las barreras de pago local fueron históricamente el principal obstáculo.

Sobre Nebbuler: La plataforma conecta a los profesionales más rigurosos de Chile y LATAM con lectores dispuestos a pagar por análisis de calidad. MercadoPago como procesador, 0% comisión.

Más información: hello@nebbuler.com | nebbuler.com/${d.slug}
`
}

function generatePRAnniversary(d: CreatorData): string {
  const fecha = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  return `COMUNICADO DE PRENSA
Para publicación inmediata

Un año publicando: ${d.name} celebra aniversario de su newsletter de ${d.specialty} en Nebbuler

SANTIAGO — ${fecha} — A un año del lanzamiento de su publicación en Nebbuler, ${d.name} consolida el modelo de newsletter profesional de pago en español, con ${d.subscribers} suscriptores activos en Chile y Latinoamérica.

Durante el primer año publicó análisis profundos sobre ${d.specialty}, generando una comunidad de lectores que pagan mes a mes por acceso directo al expertise profesional.

Contacto: hello@nebbuler.com
`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  // Catálogo de creadores (mock — reemplazar con fetch a Supabase en producción)
  const MOCK_CREATORS: CreatorData[] = [
    {
      name: 'Rodrigo Fuentes Marín',
      slug: 'rodrigo-fuentes-marin',
      specialty: 'Macroeconomía y Política Monetaria',
      bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
      subscribers: 1247,
      since: '6 meses',
      price_clp: 14990,
    },
    {
      name: 'Carolina Vega Toro',
      slug: 'carolina-vega-toro',
      specialty: 'Finanzas Corporativas',
      bio: 'Directora de M&A en Banchile Inversiones por 9 años. MBA por la Universidad de Chicago Booth.',
      subscribers: 934,
      since: '5 meses',
      price_clp: 19990,
    },
    {
      name: 'Matías Cornejo Silva',
      slug: 'matias-cornejo-silva',
      specialty: 'Derecho Tributario',
      bio: 'Abogado tributarista con 15 años de experiencia en el SII y firma privada.',
      subscribers: 721,
      since: '4 meses',
      price_clp: 14990,
    },
    {
      name: 'Andrea Poblete Ríos',
      slug: 'andrea-poblete-rios',
      specialty: 'Salud Pública',
      bio: 'Médica epidemióloga, ex asesora del MINSAL. Doctora en Salud Pública por la Universidad de Chile.',
      subscribers: 456,
      since: '3 meses',
      price_clp: 9990,
    },
    {
      name: 'Pablo Herrera Zúñiga',
      slug: 'pablo-herrera-zuniga',
      specialty: 'Derecho Laboral',
      bio: 'Socio de Estudio Herrera & Asociados. 20 años asesorando empresas en relaciones laborales.',
      subscribers: 312,
      since: '2 meses',
      price_clp: 14990,
    },
    {
      name: 'Catalina Rojas Henríquez',
      slug: 'catalina-rojas-henriquez',
      specialty: 'Historia Económica',
      bio: 'Historiadora económica, Profesora Asociada PUC. Autora de tres libros sobre desarrollo económico chileno.',
      subscribers: 289,
      since: '3 meses',
      price_clp: 9990,
    },
  ]

  const creatorSlug = args.includes('--creator') ? args[args.indexOf('--creator') + 1] : null
  const milestone = args.includes('--milestone') ? args[args.indexOf('--milestone') + 1] : 'lanzamiento'

  if (!creatorSlug) {
    console.log('\n=== PR Generator — Nebbuler ===\n')
    console.log('Uso:')
    console.log('  npx ts-node pr-generator.ts --creator [slug] --milestone [hito]\n')
    console.log('Creadores disponibles:')
    MOCK_CREATORS.forEach(c => console.log(`  ${c.slug} — ${c.specialty}`))
    console.log('\nHitos disponibles:')
    Object.entries(MILESTONES).forEach(([key, val]) => console.log(`  ${key} — ${val.title}`))
    return
  }

  const creator = MOCK_CREATORS.find(c => c.slug === creatorSlug)
  if (!creator) {
    console.error(`Creador "${creatorSlug}" no encontrado.`)
    process.exit(1)
  }

  const milestoneConfig = MILESTONES[milestone]
  if (!milestoneConfig) {
    console.error(`Hito "${milestone}" no reconocido. Opciones: ${Object.keys(MILESTONES).join(', ')}`)
    process.exit(1)
  }

  const pr = milestoneConfig.template(creator)

  const outputDir = path.join(__dirname, 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, `pr-${creatorSlug}-${milestone}-${new Date().toISOString().slice(0, 10)}.txt`)
  fs.writeFileSync(outputPath, pr)

  console.log('\n=== Comunicado generado ===\n')
  console.log(pr)
  console.log(`\nGuardado en: ${outputPath}`)
  console.log('\nDistribuir en:')
  console.log('  → https://www.pressreleasepoint.com/add-press-release')
  console.log('  → https://www.prlog.org/post/')
  console.log('  → https://www.openpr.com/news/submit/')
  console.log('  → https://prfree.org/?q=submit')
  console.log('  → https://i-newswire.com/submit-press-release.html')
}

main().catch(err => { console.error(err); process.exit(1) })
