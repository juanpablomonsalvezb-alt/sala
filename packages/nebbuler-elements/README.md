# @nebbuler/elements

> Zero-dependency Web Components for embedding Nebbuler Mundial 2026 widgets in any HTML page.

Works in WordPress, Squarespace, Shopify, raw HTML, Hugo, Astro, blogs, anything that can run a `<script>` tag. No React, no Vue, no framework. Pure custom elements.

## Install

### Via CDN (recommended, zero setup)

```html
<script src="https://cdn.jsdelivr.net/npm/@nebbuler/elements"></script>

<!-- Then use any of these custom elements anywhere -->
<nebbuler-mundial-widget seleccion="argentina"></nebbuler-mundial-widget>
<nebbuler-calculadora plataforma="substack" precio="5" suscriptores="200"></nebbuler-calculadora>
<nebbuler-quiniela></nebbuler-quiniela>
```

### Via npm

```bash
npm install @nebbuler/elements
```

```js
import '@nebbuler/elements'
```

## Components

### `<nebbuler-mundial-widget>`

Show a country card with flag, currency, creator ecosystem size, and Programa La Sombra commission.

| Attribute   | Type                          | Default      |
|-------------|-------------------------------|--------------|
| `seleccion` | argentina · brasil · mexico · colombia · uruguay · ecuador · chile · peru | argentina |
| `theme`     | dark · light                  | dark         |

### `<nebbuler-calculadora>`

Embed the "how much your platform takes from you" calculator inline.

| Attribute      | Type                                  | Default   |
|----------------|---------------------------------------|-----------|
| `plataforma`   | substack · patreon · gumroad · beehiiv | substack |
| `precio`       | number (USD/month)                    | 5         |
| `suscriptores` | number                                | 200       |
| `theme`        | dark · light                          | dark      |

### `<nebbuler-quiniela>`

CTA card pointing to the World Cup prediction game.

| Attribute | Type         | Default |
|-----------|--------------|---------|
| `theme`   | dark · light | dark    |

## Example: blog post embed

```html
<h2>¿Vale la pena cobrar membresías en Substack siendo argentino?</h2>

<p>Calculá lo que perdés en comisiones:</p>

<nebbuler-calculadora plataforma="substack" precio="5" suscriptores="500"></nebbuler-calculadora>

<p>Para creadores argentinos que cubren el Mundial 2026, Nebbuler tiene 0% comisión hasta el 31 de julio:</p>

<nebbuler-mundial-widget seleccion="argentina"></nebbuler-mundial-widget>
```

## Bundle size

ESM: ~3 KB gzipped. UMD: ~3.5 KB gzipped. No dependencies.

## Browser support

Modern browsers with Custom Elements v1 support (Chrome 67+, Firefox 63+, Safari 10.1+, Edge 79+).

## License

MIT © Juan Pablo Monsalvez

## Related

- [Open API](https://nebbuler.com/api/mundial/v1/docs)
- [TypeScript SDK (for React, Vue, Svelte, Node)](https://www.npmjs.com/package/nebbuler-mundial-sdk)
- [MCP Server (for Claude, Cursor, Windsurf)](https://www.npmjs.com/package/nebbuler-mundial-mcp)
- [Nebbuler · Programa La Sombra](https://nebbuler.com/mundial)
