#!/usr/bin/env node
/**
 * Reddit poster local — controla Chrome existente via AppleScript.
 * Usa la sesión activa de Reddit (sin login, sin bot detection).
 * Corre desde Mac con launchd: lunes/miércoles/viernes a las 14:00.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync, exec } from 'child_process'
import { promisify } from 'util'
import ws from 'ws'

const execAsync = promisify(exec)

// Leer .env.local
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '../../.env.local')
const env = {}
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
  })
} catch {}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SECRET_KEY

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------
const TEMPLATES = {
  chile: {
    subreddit: 'chile',
    title: '¿Alguien ha intentado monetizar sus análisis profesionales? Encontré algo interesante',
    text: `Llevo tiempo preguntándome por qué los profesionales en Chile regalamos nuestro criterio. Un economista conocido mío lleva 8 meses con una newsletter de pago sobre análisis macro. Tiene más de 200 suscriptores pagando ~$19.990 al mes. Son casi $4M recurrentes, sin dejar su trabajo. La plataforma que usa es nebbuler.com, que cobra 0% de comisión (a diferencia de Substack que cobra 10%). ¿Alguien en este sub lo ha intentado? ¿Hay demanda real para esto en Chile?`,
  },
  colombia: {
    subreddit: 'colombia',
    title: 'Los profesionales colombianos cobramos por hora pero regalamos lo más valioso que tenemos',
    text: `Llevo años en consultoría y hay algo que me molesta: nuestro criterio se regala constantemente. En grupos de WhatsApp, en LinkedIn, en reuniones de networking. Gratis. Vi que un abogado en Bogotá tiene una newsletter de análisis tributario con 300+ suscriptores a $150.000 COP/mes. Son $45M mensuales recurrentes sin ampliar el estudio. La plataforma es nebbuler.com, nativa LATAM, 0% comisión. ¿Alguien en r/colombia ha explorado esto?`,
  },
  mexico: {
    subreddit: 'mexico',
    title: 'Los consultores mexicanos regalamos nuestro expertise en redes — ¿alguien más nota esto?',
    text: `Soy consultor financiero. El mes pasado publiqué análisis que ayudó a ~3,000 personas a tomar decisiones. Cobré $0 por ese contenido. Vi el caso de alguien en CDMX con newsletter de finanzas personales, 180 suscriptores a $550 MXN/mes — son $99,000 pesos mensuales recurrentes. La plataforma que usa es nebbuler.com (0% comisión, pagos en pesos). ¿Alguien ha intentado algo similar?`,
  },
  argentina: {
    subreddit: 'argentina',
    title: 'Con el cepo y la inflación — ¿los profesionales argentinos están monetizando sus análisis?',
    text: `Contexto económico argentino aparte, hay algo curioso: el mercado de análisis económico en pesos es enorme ahora. Todo el mundo quiere entender qué está pasando. Un economista que conozco tiene 250 suscriptores pagando por su análisis mensual usando nebbuler.com. 0% comisión, sin complicaciones con dólares. ¿Alguien en r/argentina está en esto?`,
  },
  Entrepreneur: {
    subreddit: 'Entrepreneur',
    title: 'Newsletter de pago for LATAM professionals — a gap in the market nobody is filling',
    text: `Been looking at the creator economy in Latin America. Substack has 3M+ paying subscribers, almost all English. The Spanish-language professional content market is virtually empty. Economists, lawyers, doctors in Chile/Colombia/Mexico are giving away analysis that people clearly want to pay for. Nebbuler.com is building the infrastructure for this (0% commission, local currency payments via MercadoPago). Has anyone here built a professional newsletter business in LATAM?`,
  },
}

const ROTATION = ['chile', 'colombia', 'mexico', 'argentina', 'Entrepreneur', 'chile', 'colombia']
const COOLDOWN_HOURS = 48

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------
function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws } })
}

async function wasPostedRecently(subreddit) {
  const supabase = getSupabase()
  const cutoff = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('social_posted_content')
    .select('id')
    .eq('platform', 'reddit')
    .ilike('text', `%${subreddit}%`)
    .gte('posted_at', cutoff)
    .limit(1)
  return (data?.length ?? 0) > 0
}

async function saveResult(subreddit, title, success, errorMsg) {
  const supabase = getSupabase()
  await supabase.from('social_posted_content').insert({
    platform: 'reddit',
    text: `[${subreddit}] ${title}`,
    image_url: null,
    posted_at: new Date().toISOString(),
    success,
    error_message: errorMsg ?? null,
  })
}

// ---------------------------------------------------------------------------
// AppleScript helpers
// ---------------------------------------------------------------------------
async function runAppleScript(script) {
  const tmpFile = join(__dir, '.tmp-reddit.applescript')
  writeFileSync(tmpFile, script)
  try {
    const { stdout } = await execAsync(`osascript "${tmpFile}"`)
    return stdout.trim()
  } finally {
    try { execSync(`rm "${tmpFile}"`) } catch {}
  }
}

async function openTabAndPost(subreddit, title, text) {
  // Escapar para AppleScript (comillas dobles y backslashes)
  const escTitle = title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const escText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
  // old.reddit.com tiene formulario HTML clásico — sin JS requerido
  const submitUrl = `https://old.reddit.com/r/${subreddit}/submit?selftext=true`

  const script = `
tell application "Google Chrome"
  activate
  set newTab to make new tab at end of tabs of window 1
  set URL of newTab to "${submitUrl}"
  delay 6
end tell

-- Usar System Events para teclear en los campos del formulario
tell application "System Events"
  tell process "Google Chrome"
    set frontmost to true
    delay 1

    -- Ir al campo título con Cmd+F no funciona; usamos Tab desde el URL bar
    -- Hacer click en el área principal primero
    key code 53 -- Escape para salir del URL bar si está activo
    delay 0.5

    -- Tab hasta el primer campo del formulario (title)
    -- En old.reddit el form tiene: title (textarea), then body (textarea), then submit
    key code 48 -- Tab
    delay 0.5
    key code 48
    delay 0.5
    key code 48
    delay 0.5

    -- Seleccionar todo y escribir el título
    keystroke "a" using command down
    delay 0.3
    keystroke "${escTitle}"
    delay 0.5

    -- Tab al campo de texto (body)
    key code 48
    delay 0.5
    keystroke "a" using command down
    delay 0.3
    keystroke "${escText}"
    delay 0.5

    -- Tab al botón submit y presionar Enter
    key code 48
    delay 0.3
    key code 36 -- Return
    delay 5
  end tell
end tell

tell application "Google Chrome"
  set finalURL to URL of active tab of window 1
  return finalURL
end tell
`

  return await runAppleScript(script)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const dayOfWeek = new Date().getDay()
  const subredditKey = ROTATION[dayOfWeek]
  const template = TEMPLATES[subredditKey]

  console.log(`[reddit] Subreddit de hoy: r/${template.subreddit}`)

  const alreadyPosted = await wasPostedRecently(subredditKey)
  if (alreadyPosted) {
    console.log(`[reddit] Ya se posteó en r/${subredditKey} en las últimas ${COOLDOWN_HOURS}h. Saltando.`)
    process.exit(0)
  }

  console.log(`[reddit] Abriendo Chrome en r/${template.subreddit}/submit...`)

  try {
    const finalUrl = await openTabAndPost(template.subreddit, template.title, template.text)
    console.log('[reddit] URL final:', finalUrl)

    const success = finalUrl.includes('/comments/') || (finalUrl.includes(`/r/${template.subreddit}`) && !finalUrl.includes('/submit'))
    await saveResult(subredditKey, template.title, success, success ? undefined : `URL final: ${finalUrl}`)
    console.log(`[reddit] ${success ? '✅ Post publicado' : '⚠️ Resultado incierto — revisar Chrome'} en Supabase.`)
  } catch (err) {
    console.error('[reddit] Error:', err.message)
    await saveResult(subredditKey, template.title, false, err.message)
  }
}

main().catch(err => {
  console.error('[reddit] Fatal:', err.message)
  process.exit(1)
})
