#!/usr/bin/env node
// Anuncia la API pública + SDK + stickers + Wikipedia plan en LinkedIn.

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

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const PERSON_URN = (process.env.LINKEDIN_PERSON_URN ?? '').trim()

const TEXTO = `Hoy abro 3 cosas para el ecosistema dev/creador LATAM:

1. API pública del Mundial 2026
nebbuler.com/api/mundial/v1
CC-BY 4.0, sin auth, sin rate limit, CORS abierto.
12 grupos, 16 sedes, 8 selecciones LATAM, fixtures, programa La Sombra.
Si construís una app del Mundial → usa esto como backend, gratis.

2. SDK TypeScript en npm
npm install nebbuler-mundial-sdk
Zero dependencies, <2KB gzipped, ESM+CJS, componente React opcional.

3. Pack de stickers Mundial para WhatsApp
nebbuler.com/stickers
12 stickers gratis sin registro. Importables a WhatsApp con cualquier app de stickers.

Estrategia detrás de esto: las plataformas globales (Substack, Patreon) cobran 10-12% + USD. Nosotros queremos ser infraestructura citada del creator economy LATAM. API abierta + SDK + dataset CC-BY + stickers = backlinks orgánicos + adopción real.

El Mundial 2026 arranca en 21 días. La Sombra (nuestro programa para periodistas deportivos LATAM) sigue abierto: 0% comisión variable hasta el 31 de julio.

PRs welcome en el SDK. Adopciones documentadas en el README.

Nebbuler. Cobrá en pesos.`

const body = {
  author: PERSON_URN,
  lifecycleState: 'PUBLISHED',
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text: TEXTO },
      shareMediaCategory: 'NONE',
    },
  },
  visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
}

const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  },
  body: JSON.stringify(body),
})

if (!res.ok) {
  console.error(`FALLO: ${res.status} ${await res.text()}`)
  process.exit(1)
}

const data = await res.json()
console.log(`✓ Publicado. ID: ${data.id}`)
console.log(`→ https://www.linkedin.com/feed/update/${data.id}`)
