# nebbuler-mundial-sdk

> TypeScript SDK for the [Nebbuler Mundial 2026 open API](https://nebbuler.com/api/mundial/v1/docs).

Zero dependencies. Optional React widget. Data is CC-BY 4.0.

## Install

```bash
npm install nebbuler-mundial-sdk
```

## Usage

```ts
import {
  getMundialData,
  getGrupo,
  getSeleccion,
  getProgramaLaSombra,
} from 'nebbuler-mundial-sdk'

// Full dataset
const all = await getMundialData()
console.log(all.data.torneo.fecha_inicio) // "2026-06-11"

// Single group
const grupoA = await getGrupo('A')
console.log(grupoA.selecciones) // ["Mexico", "Sudafrica", "Corea del Sur", "Republica Checa"]

// Single LATAM team
const argentina = await getSeleccion('argentina')
console.log(argentina.bandera, argentina.apodo) // "🇦🇷" "La Albiceleste"

// Programa La Sombra (Nebbuler's World Cup creator program)
const programa = await getProgramaLaSombra()
console.log(programa.mundial.dias_restantes) // days until kickoff
```

## React widget

```tsx
import { MundialWidget } from 'nebbuler-mundial-sdk/react'

export default function Page() {
  return <MundialWidget seleccion="argentina" theme="dark" />
}
```

Props:

| Prop              | Type             | Default | Description                                  |
|-------------------|------------------|---------|----------------------------------------------|
| `seleccion`       | `string`         | —       | Slug: argentina, brasil, mexico, colombia, uruguay, ecuador, chile, peru |
| `theme`           | `'dark'\|'light'`| `dark`  | Theme variant                                |
| `showAttribution` | `boolean`        | `true`  | Show "Powered by Nebbuler" link              |
| `utmSource`       | `string`         | —       | Optional UTM tag added to outbound link      |

## API

All functions take an optional second argument:

```ts
{ baseUrl?: string; fetch?: typeof fetch; cache?: RequestCache }
```

| Function                  | Returns                                                |
|---------------------------|--------------------------------------------------------|
| `getMundialData()`        | Full dataset (meta + endpoints + data + program)       |
| `getTorneo()`             | Tournament metadata                                    |
| `getGrupos()`             | All 12 groups                                          |
| `getGrupo(id)`            | Single group by ID (a..l)                              |
| `getSedes()`              | All 16 host venues                                     |
| `getSelecciones()`        | All Nebbuler-tracked LATAM teams                       |
| `getSeleccion(slug)`      | Single LATAM team by slug                              |
| `getProgramaLaSombra()`   | Programa La Sombra details + days until kickoff        |

## Bundle size

ESM build is < 2 KB gzipped. React widget adds ~1.5 KB.

## Open data

All data is published under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Attribution required: "Data by Nebbuler · nebbuler.com"

## License

MIT © Juan Pablo Monsalvez

## Related

- [Nebbuler](https://nebbuler.com) — Membership platform for LATAM creators
- [Programa La Sombra](https://nebbuler.com/mundial) — 0% commission during World Cup 2026
- [Open API docs](https://nebbuler.com/api/mundial/v1/docs)
- [Open dataset (salaries)](https://nebbuler.com/datos)
