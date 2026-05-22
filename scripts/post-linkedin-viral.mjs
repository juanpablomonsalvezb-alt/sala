#!/usr/bin/env node
// Publica post viral en LinkedIn vía API oficial.
// Uso: node scripts/post-linkedin-viral.mjs [variante]
//   variante: 1 (calculadora), 2 (carta abierta), 3 (manifesto)

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Cargar .env.local
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

const POSTS = {
  '1': `Acabo de calcular cuánto pierde un creador LATAM al año en Substack.

Caso real: 100 suscriptores pagando $10/mes (~$10.000 CLP).

– Bruto mensual: US$1.000
– Comisión Substack (10%): −US$100
– Stripe (2.9% + $0.30/tx): −US$59
– Conversión cambiaria audiencia (4%): −US$40
– Conversión al retirar a CLP (2.5%): −US$25

Te queda: US$776/mes.

Pérdida anual: US$2.688 (≈ $2.6M CLP).

Eso es 2 meses y medio de ingresos completos que se van a intermediarios que ni siquiera operan en tu mercado.

Construí una calculadora que muestra esto para cualquier creador, en su moneda, con su plataforma actual. Sin registro, sin email.

→ nebbuler.com/cuanto-te-quitan

(También construí Nebbuler para resolverlo, pero la calculadora funciona aunque nunca uses Nebbuler.)`,

  '2': `Carta abierta a Substack, Patreon y Beehiiv:

América Latina existe.

Somos 600 millones de personas.
Hablamos español y portugués.
Tenemos creadores con audiencias enormes.
Y tenemos monedas que no son el dólar.

Cuando un creador colombiano cobra US$10/mes, su suscriptor paga ese US$10 desde una tarjeta en pesos colombianos, perdiendo 4-7% en conversión. El creador recibe US$10 menos 10% de comisión, menos 2.9% de Stripe, menos otra conversión cuando retira a su cuenta colombiana en pesos.

Total perdido: 18-22% del ingreso bruto.

Y eso es solo dinero. La fricción cultural es peor: interfaz solo en inglés, soporte en horario PST, métodos de pago que muchos países LATAM no usan.

Construí Nebbuler porque cansé de esperar a que ustedes nos consideraran un mercado.

Cobra en pesos. Soporte en español. 0% comisión variable los primeros 6 meses.

Si sos creador LATAM y querés ver cuánto pierdes hoy: nebbuler.com/cuanto-te-quitan

Gracias por leer hasta acá.`,

  '3': `Métricas honestas de Nebbuler hoy (día 5 después del lanzamiento):

— Usuarios registrados: 0
— Creadores activos: 0
— MRR: $0
— Visitas últimas 48h: 1

Sin embargo:

— 950 páginas SEO indexadas
— Pipeline AEO completo para que LLMs nos citen
— Dataset público CC-BY de salarios LATAM
— Stack growth: PostHog, GrowthBook, Meilisearch, Umami
— Integración LinkedIn, MercadoPago, Stripe
— 18 países LATAM soportados desde día 1

Lo difícil no era construir. Era construir lo correcto para un mercado que las plataformas globales ignoran.

Lo más difícil ahora: conseguir el primer creador real.

Si sos creador LATAM (Chile, Colombia, México, Argentina, Perú) y querés monetizar tu audiencia en moneda local, hablemos. Te ayudo a abrir tu sala personalmente. Sin formularios, sin pitch. Solo WhatsApp.

→ nebbuler.com

Y si solo te interesa la calculadora honesta de cuánto te quita tu plataforma actual:
→ nebbuler.com/cuanto-te-quitan`,
}

const variant = process.argv[2] ?? '1'
const text = POSTS[variant]
if (!text) {
  console.error(`Variante inválida. Usá: 1, 2 o 3`)
  process.exit(1)
}

console.log(`Publicando variante ${variant} (${text.length} chars)...`)

const body = {
  author: PERSON_URN,
  lifecycleState: 'PUBLISHED',
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text },
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
