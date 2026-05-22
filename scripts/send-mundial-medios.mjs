#!/usr/bin/env node
// Envía pitches a medios deportivos LATAM (Programa La Sombra).
// Parsea el MD para extraer el body real de cada pitch.

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

const DRY_RUN = process.argv.includes('--dry-run')
const VERIFIED_ONLY = process.argv.includes('--verified-only')

const jsonPath = resolve(
  ROOT,
  'automation/outreach/campaigns/2026-05-21-mundial-medios/pitches-medios-deportivos.json',
)
const mdPath = resolve(
  ROOT,
  'automation/outreach/campaigns/2026-05-21-mundial-medios/pitches-medios-deportivos.md',
)

const config = JSON.parse(readFileSync(jsonPath, 'utf8'))
const md = readFileSync(mdPath, 'utf8')

// Extraer bodies del MD por sección numerada
function extractBody(outletName) {
  const re = new RegExp(
    `## \\d+\\. ${outletName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}[\\s\\S]*?\`\`\`([\\s\\S]*?)\`\`\``,
  )
  const m = md.match(re)
  return m ? m[1].trim() : null
}

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
const FROM = 'Juan Pablo Monsalvez <juanpablo@nebbuler.com>'

const recipients = (config.recipients || []).filter((r) => {
  if (VERIFIED_ONLY && r.email_source && !r.email_source.includes('verified')) return false
  return EMAIL_RE.test(r.primary_email)
})

console.log(
  `Enviando ${recipients.length} pitches a medios deportivos${DRY_RUN ? ' [DRY RUN]' : ''}${VERIFIED_ONLY ? ' (verified-only)' : ''}`,
)

const results = []
for (const r of recipients) {
  const body = extractBody(r.outlet)
  if (!body) {
    console.warn(`  ⚠ ${r.outlet}: no se encontró body en el MD`)
    results.push({ ...r, status: 'skipped', reason: 'sin body' })
    continue
  }

  if (DRY_RUN) {
    console.log(`  [DRY] → ${r.outlet} <${r.primary_email}> | ${r.subject}`)
    results.push({ ...r, status: 'dry-run' })
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
        to: [r.primary_email],
        reply_to: 'juanpablo@nebbuler.com',
        subject: r.subject,
        text: body,
        tags: [
          { name: 'campaign', value: 'la-sombra-mundial-2026' },
          { name: 'outlet_id', value: r.id },
          { name: 'country', value: r.country.toLowerCase() },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`  ✗ ${r.outlet}: ${res.status} ${err}`)
      results.push({ ...r, status: 'error', error: err })
    } else {
      const data = await res.json()
      console.log(`  ✓ ${r.outlet} <${r.primary_email}> → ${data.id}`)
      results.push({ ...r, status: 'sent', id: data.id })
    }
    await new Promise((res) => setTimeout(res, 600))
  } catch (e) {
    console.error(`  ✗ ${r.outlet}: ${e.message}`)
    results.push({ ...r, status: 'error', error: e.message })
  }
}

const logPath = resolve(
  ROOT,
  `automation/outreach/campaigns/2026-05-21-mundial-medios/log-${Date.now()}.json`,
)
writeFileSync(logPath, JSON.stringify(results, null, 2))

if (!DRY_RUN) {
  console.log('\nEsperando 60s para chequear bounces...')
  await new Promise((r) => setTimeout(r, 60000))

  for (const r of results.filter((x) => x.status === 'sent')) {
    try {
      const check = await fetch(`https://api.resend.com/emails/${r.id}`, {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      })
      const data = await check.json()
      r.last_event = data.last_event
      if (data.last_event === 'bounced' || data.last_event === 'complained') {
        r.bounced = true
      }
    } catch {}
  }

  writeFileSync(logPath, JSON.stringify(results, null, 2))

  const sent = results.filter((r) => r.status === 'sent' && !r.bounced).length
  const bounced = results.filter((r) => r.bounced).length
  const errored = results.filter((r) => r.status === 'error').length
  console.log(`\nResultado: ${sent} entregados, ${bounced} rebotados, ${errored} errores`)
  console.log(`Log: ${logPath}`)
}
