#!/usr/bin/env node
// Borra posts de LinkedIn vía API. Recibe URNs como args.
// Uso: node scripts/delete-linkedin-posts.mjs urn:li:share:XXXX urn:li:share:YYYY

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
env.split('\n').forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.+)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
})

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
if (!TOKEN) {
  console.error('Falta LINKEDIN_ACCESS_TOKEN')
  process.exit(1)
}

const urns = process.argv.slice(2)
if (urns.length === 0) {
  console.error('Pasá los URNs a borrar como args.')
  process.exit(1)
}

for (const urn of urns) {
  const encoded = encodeURIComponent(urn)
  const res = await fetch(`https://api.linkedin.com/v2/ugcPosts/${encoded}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  })

  if (res.ok || res.status === 204) {
    console.log(`✓ Borrado: ${urn}`)
  } else {
    const body = await res.text()
    console.error(`✗ ${urn}: ${res.status} ${body}`)
  }
  await new Promise((r) => setTimeout(r, 500))
}
