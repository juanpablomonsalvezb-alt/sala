#!/usr/bin/env node
// Anuncia que el SDK ya está publicado en npm
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
env.split('\n').forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.+)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
})

const TEXTO = `Update: nebbuler-mundial-sdk ya está publicado en npm.

npm install nebbuler-mundial-sdk

Zero dependencies. 930 bytes gzipped. ESM + CJS + types.
8 funciones puras + componente React opcional.

import { getGrupo, getSeleccion } from 'nebbuler-mundial-sdk'

const grupoA = await getGrupo('A')
const argentina = await getSeleccion('argentina')

Si construís una app del Mundial 2026 (predicciones, fixtures, fantasy, tracker, lo que sea) — esto te ahorra 3 horas de buscar datos. Y todo es CC-BY 4.0.

npm: npmjs.com/package/nebbuler-mundial-sdk
repo: github.com/juanpablomonsalvezb-alt/nebbuler-mundial-sdk
api docs: nebbuler.com/api/mundial/v1/docs

Mañana viene la v0.2.0 con fixtures completos. Si querés un endpoint específico, abrí un issue.`

const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  },
  body: JSON.stringify({
    author: process.env.LINKEDIN_PERSON_URN.trim(),
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: TEXTO },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  }),
})

if (!res.ok) {
  console.error(`FALLO: ${res.status} ${await res.text()}`)
  process.exit(1)
}
const d = await res.json()
console.log(`✓ ${d.id}`)
console.log(`→ https://www.linkedin.com/feed/update/${d.id}`)
