#!/usr/bin/env node
// Ping IndexNow para las 67 URLs nuevas (jugadores + sedes + sponsors)
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
env.split('\n').forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.+)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
})

const jugadores = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'src/data/mundial-jugadores.json'), 'utf8'),
).jugadores
const sedes = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'src/data/mundial-sedes-detalle.json'), 'utf8'),
).sedes

const BASE = 'https://nebbuler.com'
const urls = []

// 1 página de sponsors
urls.push(`${BASE}/mundial/sponsors`)

// 50 jugadores + 50 OG
for (const j of jugadores) {
  urls.push(`${BASE}/mundial/jugador/${j.slug}`)
}

// 16 sedes + 16 OG
for (const s of sedes) {
  urls.push(`${BASE}/mundial/sede/${s.slug}`)
}

console.log(`Pingueando IndexNow con ${urls.length} URLs...`)

const payload = {
  host: 'nebbuler.com',
  key: process.env.INDEXNOW_KEY,
  keyLocation: `https://nebbuler.com/${process.env.INDEXNOW_KEY}.txt`,
  urlList: urls,
}

const engines = [
  ['IndexNow.org', 'https://api.indexnow.org/indexnow'],
  ['Bing', 'https://www.bing.com/indexnow'],
  ['Yandex', 'https://yandex.com/indexnow'],
]

for (const [name, url] of engines) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    console.log(`  ${r.ok ? '✓' : '⚠'} ${name}: ${r.status}`)
  } catch (e) {
    console.error(`  ✗ ${name}: ${e.message}`)
  }
}

console.log(`\n${urls.length} URLs notificadas:`)
console.log(`  - 1 sponsors`)
console.log(`  - ${jugadores.length} jugadores`)
console.log(`  - ${sedes.length} sedes`)
