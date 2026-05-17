#!/usr/bin/env node
/**
 * LinkedIn Outreach — busca perfiles reales y envía mensajes de conexión.
 * Usa las cookies de Chrome (sesión activa de Juan Pablo).
 * Límite: 20 solicitudes/día para evitar restricciones de LinkedIn.
 */

import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import ws from 'ws'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '../../.env.local')
const env = {}
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
  })
} catch {}

// ---------------------------------------------------------------------------
// Targets y mensajes
// ---------------------------------------------------------------------------
const SEARCHES = [
  // CHILE
  { query: 'finanzas personales Chile', country: 'CL', msg: 'MSG-FINANZAS' },
  { query: 'inversión acciones Chile creador', country: 'CL', msg: 'MSG-FINANZAS' },
  { query: 'educación financiera Chile', country: 'CL', msg: 'MSG-FINANZAS' },
  { query: 'coach carrera Chile', country: 'CL', msg: 'MSG-COACH' },
  { query: 'liderazgo Chile LinkedIn', country: 'CL', msg: 'MSG-COACH' },
  { query: 'derecho laboral Chile divulgador', country: 'CL', msg: 'MSG-LEGAL' },
  { query: 'SII Chile tributario creador', country: 'CL', msg: 'MSG-LEGAL' },
  { query: 'psicología organizacional Chile', country: 'CL', msg: 'MSG-SALUD' },
  { query: 'emprendimiento Chile fundador contenido', country: 'CL', msg: 'MSG-EMPRENDIMIENTO' },
  { query: 'marketing digital Chile consultor', country: 'CL', msg: 'MSG-EMPRENDIMIENTO' },
  // COLOMBIA
  { query: 'finanzas personales Colombia creador', country: 'CO', msg: 'MSG-FINANZAS' },
  { query: 'educación financiera Colombia', country: 'CO', msg: 'MSG-FINANZAS' },
  { query: 'coach ejecutivo Colombia', country: 'CO', msg: 'MSG-COACH' },
  { query: 'liderazgo empresarial Colombia', country: 'CO', msg: 'MSG-COACH' },
  { query: 'DIAN Colombia tributario divulgador', country: 'CO', msg: 'MSG-LEGAL' },
  { query: 'derecho laboral Colombia', country: 'CO', msg: 'MSG-LEGAL' },
  { query: 'psicólogo Colombia contenido LinkedIn', country: 'CO', msg: 'MSG-SALUD' },
  { query: 'emprendimiento Colombia fundador', country: 'CO', msg: 'MSG-EMPRENDIMIENTO' },
  // MEXICO
  { query: 'finanzas personales Mexico creador', country: 'MX', msg: 'MSG-FINANZAS' },
  { query: 'SAT Mexico tributario divulgador', country: 'MX', msg: 'MSG-LEGAL' },
  { query: 'coach carrera Mexico LinkedIn', country: 'MX', msg: 'MSG-COACH' },
  { query: 'emprendimiento Mexico startup fundador', country: 'MX', msg: 'MSG-EMPRENDIMIENTO' },
  // ARGENTINA
  { query: 'finanzas personales Argentina economista', country: 'AR', msg: 'MSG-FINANZAS' },
  { query: 'coach Argentina LinkedIn creador', country: 'AR', msg: 'MSG-COACH' },
  { query: 'emprendimiento Argentina startup', country: 'AR', msg: 'MSG-EMPRENDIMIENTO' },
]

const MESSAGES = {
  'MSG-FINANZAS': `Hola [NOMBRE], sigo tu contenido de finanzas. Fundé Nebbuler, plataforma de membresías para creadores LATAM. 0% comisión primeros 6 meses, pagos en moneda local. ¿Te muestro cómo se vería tu sala?`,
  'MSG-COACH': `Hola [NOMBRE], vi tu contenido sobre liderazgo y desarrollo profesional. Fundé Nebbuler para que creadores como tú cobren membresías en tu moneda, sin comisión los primeros 6 meses. ¿15 min para mostrarte?`,
  'MSG-LEGAL': `Hola [NOMBRE], tu contenido legal/tributario tiene exactamente la audiencia que paga por acceso exclusivo. Fundé Nebbuler: membresías en tu moneda, 0% comisión 6 meses. ¿Conversamos?`,
  'MSG-SALUD': `Hola [NOMBRE], tu contenido de salud y bienestar genera confianza real — ideal para una membresía. Fundé Nebbuler para creadores LATAM: pagos en tu moneda, sin comisión primeros 6 meses. ¿Te interesa?`,
  'MSG-EMPRENDIMIENTO': `Hola [NOMBRE], tu contenido sobre emprendimiento encaja perfecto con Nebbuler: membresías pagas en tu moneda local, 0% comisión 6 meses. Fundé la plataforma para creadores LATAM como tú. ¿Charlamos?`,
}

const DELAY = (min, max) => new Promise(r => setTimeout(r, min * 1000 + Math.random() * (max - min) * 1000))
const MAX_PER_RUN = 20
const LOG_FILE = join(__dir, 'outreach-log.json')

function loadLog() {
  if (existsSync(LOG_FILE)) return JSON.parse(readFileSync(LOG_FILE, 'utf8'))
  return { sent: [], date: new Date().toISOString().split('T')[0] }
}

function saveLog(log) {
  writeFileSync(LOG_FILE, JSON.stringify(log, null, 2))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const log = loadLog()
  const today = new Date().toISOString().split('T')[0]
  if (log.date !== today) { log.sent = []; log.date = today }

  const sentToday = log.sent.filter(s => s.date === today).length
  if (sentToday >= MAX_PER_RUN) {
    console.log(`[outreach] Límite diario alcanzado (${sentToday}/${MAX_PER_RUN}). Volvé mañana.`)
    process.exit(0)
  }

  console.log(`[outreach] Iniciando. Enviados hoy: ${sentToday}/${MAX_PER_RUN}`)

  // Cargar cookies de LinkedIn desde JSON generado por Python
  const COOKIES_FILE = '/tmp/linkedin_cookies.json'
  if (!existsSync(COOKIES_FILE)) {
    console.error('[outreach] Falta /tmp/linkedin_cookies.json. Ejecutar: python3 -c "import browser_cookie3,json; json.dump([{\'name\':c.name,\'value\':c.value,\'domain\':c.domain,\'path\':c.path or \'/\',\'secure\':bool(c.secure)} for c in browser_cookie3.chrome(domain_name=\'.linkedin.com\')],open(\'/tmp/linkedin_cookies.json\',\'w\'))"')
    process.exit(1)
  }
  const cookies = JSON.parse(readFileSync(COOKIES_FILE, 'utf8'))

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox'],
    slowMo: 100,
  })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  await context.addCookies(cookies)
  const page = await context.newPage()

  let sent = sentToday
  const results = []

  for (const search of SEARCHES) {
    if (sent >= MAX_PER_RUN) break

    try {
      console.log(`\n[outreach] Buscando: "${search.query}"`)

      // Buscar en LinkedIn
      const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(search.query)}&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH`
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await DELAY(3, 5)

      // Tomar los primeros 3 resultados
      const profileLinks = await page.$$eval(
        'a[href*="/in/"]',
        links => links
          .map(a => ({ href: a.href, text: a.innerText.trim() }))
          .filter(l => l.href.includes('/in/') && !l.href.includes('/search/') && l.text.length > 2)
          .slice(0, 3)
      )

      console.log(`  Encontrados: ${profileLinks.length} perfiles`)

      for (const profile of profileLinks) {
        if (sent >= MAX_PER_RUN) break

        // Evitar duplicados
        if (log.sent.some(s => s.url === profile.href)) {
          console.log(`  [skip] Ya enviado: ${profile.href}`)
          continue
        }

        try {
          await page.goto(profile.href, { waitUntil: 'domcontentloaded', timeout: 20000 })
          await DELAY(2, 4)

          // Obtener nombre del perfil
          const name = await page.$eval('h1', el => el.innerText.split(' ')[0]).catch(() => 'creador/a')

          const msg = MESSAGES[search.msg].replace('[NOMBRE]', name)

          // Ver si hay botón "Conectar" o "Mensaje"
          const connectBtn = await page.$('button:has-text("Conectar"), button:has-text("Connect")')
          const msgBtn = await page.$('button:has-text("Mensaje"), button:has-text("Message")')

          if (connectBtn) {
            await connectBtn.click()
            await DELAY(1, 2)

            // Buscar "Añadir nota" / "Add a note"
            const addNoteBtn = await page.$('button:has-text("Añadir una nota"), button:has-text("Add a note")')
            if (addNoteBtn) {
              await addNoteBtn.click()
              await DELAY(1, 2)
              const textarea = await page.$('textarea[name="message"]')
              if (textarea) {
                await textarea.fill(msg.slice(0, 300))
                await DELAY(1, 2)
                const sendBtn = await page.$('button:has-text("Enviar invitación"), button:has-text("Send invitation"), button[aria-label*="Send"]')
                if (sendBtn) {
                  await sendBtn.click()
                  console.log(`  ✅ Solicitud enviada a ${name} (${profile.href})`)
                  results.push({ name, url: profile.href, msg: search.msg, type: 'connection', date: today })
                  log.sent.push({ name, url: profile.href, date: today })
                  sent++
                  saveLog(log)
                  await DELAY(5, 10)
                }
              }
            }
          } else if (msgBtn) {
            await msgBtn.click()
            await DELAY(1, 2)
            const textarea = await page.$('div[contenteditable="true"], textarea.msg-form__contenteditable')
            if (textarea) {
              await textarea.click()
              await textarea.type(msg, { delay: 30 })
              await DELAY(1, 2)
              const sendBtn = await page.$('button:has-text("Enviar"), button[type="submit"]')
              if (sendBtn) {
                await sendBtn.click()
                console.log(`  ✅ DM enviado a ${name} (${profile.href})`)
                results.push({ name, url: profile.href, msg: search.msg, type: 'dm', date: today })
                log.sent.push({ name, url: profile.href, date: today })
                sent++
                saveLog(log)
                await DELAY(5, 10)
              }
            }
          } else {
            console.log(`  [skip] ${name} — sin botón disponible (ya conectado o bloqueado)`)
          }
        } catch (profileErr) {
          console.log(`  [error] ${profile.href}: ${profileErr.message.slice(0, 80)}`)
        }
      }
    } catch (searchErr) {
      console.log(`  [error] búsqueda "${search.query}": ${searchErr.message.slice(0, 80)}`)
    }
  }

  await browser.close()

  console.log(`\n[outreach] RESUMEN: ${sent - sentToday} mensajes enviados en esta sesión`)
  console.log('[outreach] Perfiles contactados:')
  results.forEach(r => console.log(`  - ${r.name} (${r.type}): ${r.url}`))
}

main().catch(e => { console.error('[outreach] Fatal:', e.message); process.exit(1) })
