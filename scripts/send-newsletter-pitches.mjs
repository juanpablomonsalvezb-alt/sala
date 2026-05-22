#!/usr/bin/env node
// Envía pitches a newsletters LATAM vía Resend con tracking + bounce retry.
// Uso: node scripts/send-newsletter-pitches.mjs [--dry-run] [--priority alta|media]

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// Cargar .env.local
const envPath = resolve(ROOT, '.env.local')
const envContent = readFileSync(envPath, 'utf8')
envContent.split('\n').forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.+)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
})

const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
  console.error('Falta RESEND_API_KEY')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry-run')
const priorityFilter = (() => {
  const idx = process.argv.indexOf('--priority')
  return idx >= 0 ? process.argv[idx + 1] : null
})()

const pitchesPath = resolve(
  ROOT,
  'automation/outreach/campaigns/2026-05-21-newsletters/pitches-newsletters.json',
)
const pitchesRaw = JSON.parse(readFileSync(pitchesPath, 'utf8'))
const pitches = Array.isArray(pitchesRaw) ? pitchesRaw : pitchesRaw.pitches || []

const filtered = priorityFilter
  ? pitches.filter((p) => p.prioridad === priorityFilter)
  : pitches

console.log(
  `Enviando ${filtered.length} pitches${priorityFilter ? ` (prioridad ${priorityFilter})` : ''}${DRY_RUN ? ' [DRY RUN]' : ''}`,
)

const results = []
const FROM = 'Juan Pablo Monsalvez <juanpablo@nebbuler.com>'
const REPLY_TO = 'juanpablo@nebbuler.com'

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

for (const pitch of filtered) {
  const { nombre, email, asunto, cuerpo, prioridad } = pitch
  if (!email || !asunto || !cuerpo) {
    console.warn(`  ⚠ Saltando ${nombre}: falta email/asunto/cuerpo`)
    results.push({ nombre, email, status: 'skipped', reason: 'datos incompletos' })
    continue
  }
  if (!EMAIL_RE.test(email)) {
    console.warn(`  ⚠ Saltando ${nombre}: email inválido (${email})`)
    results.push({ nombre, email, status: 'skipped', reason: 'email inválido' })
    continue
  }

  if (DRY_RUN) {
    console.log(`  [DRY] → ${nombre} <${email}> | ${asunto}`)
    results.push({ nombre, email, status: 'dry-run' })
    continue
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        reply_to: REPLY_TO,
        subject: asunto,
        text: cuerpo,
        headers: {
          'X-Entity-Ref-ID': `nebbuler-pitch-${Date.now()}-${nombre.replace(/\s/g, '-').toLowerCase()}`,
        },
        tags: [
          { name: 'campaign', value: 'newsletters-pitch-may-2026' },
          { name: 'priority', value: prioridad || 'media' },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`  ✗ ${nombre}: ${res.status} ${err}`)
      results.push({ nombre, email, status: 'error', error: err })
    } else {
      const data = await res.json()
      console.log(`  ✓ ${nombre} <${email}> → ${data.id}`)
      results.push({ nombre, email, status: 'sent', id: data.id })
    }

    // Rate limit: 2 req/seg en Resend free
    await new Promise((r) => setTimeout(r, 600))
  } catch (e) {
    console.error(`  ✗ ${nombre}: ${e.message}`)
    results.push({ nombre, email, status: 'error', error: e.message })
  }
}

const logPath = resolve(
  ROOT,
  `automation/outreach/campaigns/2026-05-21-newsletters/log-${Date.now()}.json`,
)
writeFileSync(logPath, JSON.stringify(results, null, 2))

const stats = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1
  return acc
}, {})
console.log('\nResumen:', stats)
console.log(`Log: ${logPath}`)

// Verificar bounces a los 60 segundos (rebota inmediato si es invalid)
if (!DRY_RUN) {
  console.log('\nEsperando 60s antes de chequear bounces...')
  await new Promise((r) => setTimeout(r, 60000))

  for (const r of results.filter((x) => x.status === 'sent')) {
    try {
      const check = await fetch(`https://api.resend.com/emails/${r.id}`, {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      })
      const data = await check.json()
      if (data.last_event === 'bounced' || data.last_event === 'complained') {
        console.warn(`  ⚠ BOUNCE: ${r.nombre} <${r.email}> — ${data.last_event}`)
        r.bounced = true
        r.bounce_reason = data.last_event
      }
    } catch {}
  }

  writeFileSync(logPath, JSON.stringify(results, null, 2))
  const bounces = results.filter((r) => r.bounced)
  console.log(`\nBounces detectados: ${bounces.length}`)
  if (bounces.length > 0) {
    console.log('Bounces:')
    bounces.forEach((b) => console.log(`  - ${b.nombre} <${b.email}> (${b.bounce_reason})`))
  }
}
