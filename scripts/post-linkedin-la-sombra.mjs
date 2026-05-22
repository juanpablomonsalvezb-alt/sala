#!/usr/bin/env node
// Anuncia el Programa La Sombra (Mundial 2026) en LinkedIn vía API.

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

if (!TOKEN || !PERSON_URN) {
  console.error('Falta LINKEDIN_ACCESS_TOKEN o LINKEDIN_PERSON_URN')
  process.exit(1)
}

const TEXTO = `Anuncio: el Programa La Sombra.

En 21 días arranca el Mundial 2026. Y los periodistas, analistas tácticos y podcasters deportivos LATAM van a generar más contenido valioso del que producen en todo el año.

Y la mayoría lo va a regalar.

O peor: lo van a monetizar en Substack/Patreon perdiendo 22% entre comisiones y conversión cambiaria. Un analista con 200 suscriptores pagando US$5/mes deja US$220 en el camino. En 60 días de Mundial son US$440 que viajan a Silicon Valley en lugar de quedarse en pesos argentinos, colombianos, chilenos.

Por eso lanzamos La Sombra.

— 0% comisión variable hasta el 31 de julio de 2026
— Setup completo de tu sala en 24 horas
— Onboarding 1-a-1 conmigo por WhatsApp
— Cobrás en moneda local (ARS, COP, MXN, CLP, PEN, UYU, BRL)
— Aparecés en el directorio mundial.nebbuler.com

Calculadora honesta de cuánto perdés vs cuánto cobrarías con La Sombra:
nebbuler.com/mundial

No es un descuento. Es un programa para que probás Nebbuler durante el evento más importante del año sin riesgo financiero.

Si sos periodista deportivo LATAM y querés aplicar: WhatsApp directo +56 9 9255 1416.

Si conocés a alguien que debería estar en esto: etiquetalo abajo.

El Mundial se gana en silencio.`

console.log(`Publicando La Sombra (${TEXTO.length} chars)...`)

const body = {
  author: PERSON_URN,
  lifecycleState: 'PUBLISHED',
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text: TEXTO },
      shareMediaCategory: 'NONE',
    },
  },
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
  },
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
  const err = await res.text()
  console.error(`FALLO: ${res.status} ${err}`)
  process.exit(1)
}

const data = await res.json()
console.log(`✓ Publicado. ID: ${data.id}`)
console.log(`→ https://www.linkedin.com/feed/update/${data.id}`)
