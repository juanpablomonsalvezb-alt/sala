#!/usr/bin/env node
// Dispara IndexNow para todas las URLs del Programa La Sombra (Mundial 2026).
// Notifica a Bing, Yandex, Naver, Seznam de los nuevos URLs.
// Uso: node scripts/indexnow-mundial.mjs

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf8')
envContent.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.+)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
})

const INDEXNOW_KEY = process.env.INDEXNOW_KEY
if (!INDEXNOW_KEY) {
  console.error('Falta INDEXNOW_KEY en .env.local')
  console.error('Genera una key de 32 caracteres y agrégala a Vercel + .env.local')
  console.error('Y subí <KEY>.txt con el contenido <KEY> en /public/<KEY>.txt')
  process.exit(1)
}

// Cargar datos del Mundial
const mundialJsonPath = resolve(__dirname, '..', 'src/data/mundial-2026.json')
const mundial = JSON.parse(readFileSync(mundialJsonPath, 'utf8'))
const grupos = mundial.grupos || []

const SELECCIONES_LATAM_SLUGS = [
  'argentina',
  'brasil',
  'mexico',
  'colombia',
  'uruguay',
  'ecuador',
  'chile',
  'peru',
]

const BASE = 'https://nebbuler.com'

const urls = [
  `${BASE}/mundial`,
  `${BASE}/mundial/quiniela`,
  `${BASE}/llms-mundial.txt`,
  `${BASE}/sitemap-mundial.xml`,
]

// Selecciones + widgets
for (const slug of SELECCIONES_LATAM_SLUGS) {
  urls.push(`${BASE}/mundial/${slug}`)
  urls.push(`${BASE}/widget/mundial/${slug}`)
}

// Grupos
for (const g of grupos) {
  urls.push(`${BASE}/mundial/grupo/${g.id.toLowerCase()}`)
}

console.log(`Notificando IndexNow a ${urls.length} URLs...`)

const payload = {
  host: 'nebbuler.com',
  key: INDEXNOW_KEY,
  keyLocation: `https://nebbuler.com/${INDEXNOW_KEY}.txt`,
  urlList: urls,
}

const engines = [
  { name: 'IndexNow.org (multi)', url: 'https://api.indexnow.org/indexnow' },
  { name: 'Bing', url: 'https://www.bing.com/indexnow' },
  { name: 'Yandex', url: 'https://yandex.com/indexnow' },
]

for (const engine of engines) {
  try {
    const res = await fetch(engine.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      console.log(`  ✓ ${engine.name}: ${res.status} ${res.statusText}`)
    } else {
      const body = await res.text()
      console.warn(`  ⚠ ${engine.name}: ${res.status} ${res.statusText} — ${body.slice(0, 200)}`)
    }
  } catch (e) {
    console.error(`  ✗ ${engine.name}: ${e.message}`)
  }
}

console.log('\nIndexNow completado.')
console.log(`URLs notificadas:\n${urls.map((u) => `  • ${u}`).join('\n')}`)
