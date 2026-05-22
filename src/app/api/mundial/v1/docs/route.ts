import { NextResponse } from 'next/server'

export const revalidate = 3600

const DOCS = `# Nebbuler Mundial API v1

> Open API (CC-BY 4.0) con datos del Mundial 2026 para desarrolladores LATAM.

**Base URL:** \`https://nebbuler.com/api/mundial/v1\`

**Autenticación:** Ninguna. API abierta.

**CORS:** \`Access-Control-Allow-Origin: *\` en todos los endpoints.

**Rate limit:** Sin límite (cacheado en edge).

**Licencia:** CC-BY 4.0. Atribución requerida: "Datos por Nebbuler · nebbuler.com"

---

## Endpoints

### \`GET /\` — Metadata + todo

Devuelve metadata + listado de endpoints + dataset completo.

### \`GET /torneo\` — Datos generales del torneo

Devuelve fechas, sedes (países), trofeo, campeón vigente, datos curiosos.

### \`GET /grupos\` — Los 12 grupos

Devuelve los 12 grupos del Mundial (A-L) con sus selecciones.

### \`GET /grupos/{id}\` — Detalle de grupo

Devuelve un grupo específico (id: a, b, c, ..., l).

### \`GET /sedes\` — 16 sedes

Devuelve las 16 ciudades sede con estadio + capacidad + rol (inaugural/final/etc).

### \`GET /selecciones\` — Selecciones LATAM

Devuelve summary + detalle de 8 selecciones LATAM (Argentina, Brasil, México, Colombia, Uruguay, Ecuador, Chile, Perú).

### \`GET /selecciones/{slug}\` — Detalle de selección

slug ∈ {argentina, brasil, mexico, colombia, uruguay, ecuador, chile, peru}

### \`GET /programa-la-sombra\` — Programa Nebbuler

Devuelve beneficios + vigencia + CTAs para aplicar al programa La Sombra.

---

## SDK oficial (npm)

\`\`\`bash
npm install nebbuler-mundial-sdk
\`\`\`

\`\`\`ts
import { getMundialData, getGrupo, getSeleccion } from 'nebbuler-mundial-sdk'

const data = await getMundialData()
const grupoA = await getGrupo('A')
const argentina = await getSeleccion('argentina')
\`\`\`

Componente React opcional:

\`\`\`tsx
import { MundialWidget } from 'nebbuler-mundial-sdk/react'
<MundialWidget seleccion="argentina" theme="dark" />
\`\`\`

---

## Ejemplos curl

\`\`\`bash
# Datos del torneo
curl https://nebbuler.com/api/mundial/v1/torneo

# Grupo A
curl https://nebbuler.com/api/mundial/v1/grupos/a

# Argentina
curl https://nebbuler.com/api/mundial/v1/selecciones/argentina

# Programa La Sombra
curl https://nebbuler.com/api/mundial/v1/programa-la-sombra
\`\`\`

---

## Atribución

Cuando uses esta API, incluye en tu sitio:

\`\`\`html
<a href="https://nebbuler.com">Datos por Nebbuler</a>
\`\`\`

---

## Soporte

- Email: juanpablo@nebbuler.com
- WhatsApp: +56 9 9255 1416
- Issues: https://github.com/juanpablomonsalvezb-alt/sala/issues

---

## Endpoints planificados (próximas versiones)

- \`POST /predicciones\` — registrar quinielas
- \`GET /creadores\` — directorio de creadores Nebbuler
- \`GET /partidos\` — fixtures completos
- \`WS /partidos/live\` — websocket de partidos en vivo
`

export async function GET() {
  return new NextResponse(DOCS, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'X-Powered-By': 'Nebbuler',
    },
  })
}
