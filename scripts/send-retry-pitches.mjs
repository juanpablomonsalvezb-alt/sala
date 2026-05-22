#!/usr/bin/env node
// Reenvía pitches a emails alternativos cuando hubo bounces.
// Uso: node scripts/send-retry-pitches.mjs <path-json>

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

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

const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('Falta path al JSON de retries')
  process.exit(1)
}

const pitches = JSON.parse(readFileSync(jsonPath, 'utf8'))
console.log(`Reenviando ${pitches.length} pitches...`)

const FROM = 'Juan Pablo Monsalvez <juanpablo@nebbuler.com>'
const results = []

for (const p of pitches) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [p.email],
        reply_to: 'juanpablo@nebbuler.com',
        subject: p.asunto,
        text: p.cuerpo,
        tags: [
          { name: 'campaign', value: 'newsletters-pitch-retry-may-2026' },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`  ✗ ${p.nombre}: ${res.status} ${err}`)
      results.push({ ...p, status: 'error', error: err })
    } else {
      const data = await res.json()
      console.log(`  ✓ ${p.nombre} <${p.email}> → ${data.id}`)
      results.push({ ...p, status: 'sent', id: data.id })
    }
    await new Promise((r) => setTimeout(r, 600))
  } catch (e) {
    console.error(`  ✗ ${p.nombre}: ${e.message}`)
    results.push({ ...p, status: 'error', error: e.message })
  }
}

console.log('\nEsperando 90s para chequear bounces de retry...')
await new Promise((r) => setTimeout(r, 90000))

for (const r of results.filter((x) => x.status === 'sent')) {
  try {
    const check = await fetch(`https://api.resend.com/emails/${r.id}`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    })
    const data = await check.json()
    r.last_event = data.last_event
    if (data.last_event === 'bounced' || data.last_event === 'complained') {
      console.warn(`  ⚠ RETRY BOUNCE: ${r.nombre} <${r.email}>`)
      r.bounced = true
    }
  } catch {}
}

const logPath = resolve(
  ROOT,
  `automation/outreach/campaigns/2026-05-21-newsletters/retry-log-${Date.now()}.json`,
)
writeFileSync(logPath, JSON.stringify(results, null, 2))

const bounces = results.filter((r) => r.bounced)
const sent = results.filter((r) => r.status === 'sent' && !r.bounced)
console.log(`\nResultado retry: ${sent.length} entregados, ${bounces.length} rebotados`)
console.log(`Log: ${logPath}`)
