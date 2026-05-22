#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
env.split('\n').forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.+)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '').trim()
})

const TEXTO = `Update Mundial 2026: 3 piezas más para devs y creadores LATAM.

1. MCP server publicado en npm
npm install -g nebbuler-mundial-mcp
Cualquier usuario de Claude Desktop, Cursor, Windsurf o Continue le da a su LLM tools nativas para consultar el Mundial. Cuando le preguntes "cuándo juega Argentina" — Claude responde con datos reales y cita la fuente.

2. Web Components zero-deps publicados
npm install nebbuler-elements
o vía CDN:
<script src="https://cdn.jsdelivr.net/npm/nebbuler-elements"></script>
<nebbuler-mundial-widget seleccion="argentina"></nebbuler-mundial-widget>
<nebbuler-calculadora plataforma="substack" precio="5"></nebbuler-calculadora>
Funciona en cualquier HTML: WordPress, Squarespace, blogs, Medium embeds.

3. GitHub Action para insertar fixtures en cualquier README
- uses: nebbuler/mundial-action@v1
  with:
    seleccion: argentina
Cada repo del Mundial open-source puede usarla. Backlink permanente.

Más 67 páginas SEO nuevas:
- 50 jugadores (/mundial/jugador/lionel-messi y otros 49)
- 16 sedes (/mundial/sede/estadio-azteca y otras 15)
- 1 página viral: /mundial/sponsors (los sponsors pagaron USD 2.693B, vos perdés 22% en Substack)

Total ahora: 118 URLs Mundial + 3 packages npm + 3 repos GitHub públicos. Todo open data, CC-BY 4.0.

Si construís algo del Mundial 2026 y querés integrar Nebbuler — abrí un issue o escribí WhatsApp +56 9 9255 1416.`

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
