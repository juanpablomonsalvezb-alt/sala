/**
 * @nebbuler/elements — Zero-dependency Web Components for the Mundial 2026.
 *
 * Drop in any HTML page:
 *   <script src="https://cdn.jsdelivr.net/npm/@nebbuler/elements"></script>
 *   <nebbuler-mundial-widget seleccion="argentina"></nebbuler-mundial-widget>
 *   <nebbuler-calculadora></nebbuler-calculadora>
 *   <nebbuler-quiniela></nebbuler-quiniela>
 *
 * Data attribution: CC-BY 4.0 · Nebbuler · nebbuler.com
 */

const API_BASE = 'https://nebbuler.com/api/mundial/v1'
const UTM = '?utm_source=elements&utm_medium=web-component'

// ───────────────────────────────────────────────────────────────────────────
// Shared helpers
// ───────────────────────────────────────────────────────────────────────────

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Nebbuler API ${res.status}`)
  return res.json() as Promise<T>
}

const PALETTE = {
  dark: {
    bg: '#050505',
    fg: '#FFFFFF',
    muted: 'rgba(255,255,255,0.55)',
    border: 'rgba(255,255,255,0.1)',
    accent: '#C41C1C',
  },
  light: {
    bg: '#FFFFFF',
    fg: '#0A0A0A',
    muted: 'rgba(0,0,0,0.55)',
    border: 'rgba(0,0,0,0.1)',
    accent: '#C41C1C',
  },
}

function baseStyles(theme: 'dark' | 'light' = 'dark'): string {
  const p = PALETTE[theme]
  return `
    :host {
      display: block;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      color: ${p.fg};
      background: ${p.bg};
      border: 1px solid ${p.border};
      padding: 20px;
      max-width: 480px;
      box-sizing: border-box;
    }
    .label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: ${p.muted}; margin: 0 0 4px; }
    .value { font-size: 16px; font-weight: 700; margin: 0; }
    .accent { color: ${p.accent}; }
    a { color: ${p.accent}; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    button { font-family: inherit; cursor: pointer; }
    input, select { font-family: inherit; }
    .footer { margin-top: 14px; padding-top: 10px; border-top: 1px solid ${p.border}; font-size: 10px; color: ${p.muted}; display: flex; justify-content: space-between; align-items: center; }
  `
}

interface Seleccion {
  pais: string
  slug: string
  apodo: string
  bandera: string
  moneda: string
  moneda_simbolo: string
  audiencia_estimada: string
  creadores_potenciales: number
  urls?: { landing: string }
}

// ───────────────────────────────────────────────────────────────────────────
// <nebbuler-mundial-widget seleccion="argentina" theme="dark">
// ───────────────────────────────────────────────────────────────────────────

class NebbulerMundialWidget extends HTMLElement {
  static observedAttributes = ['seleccion', 'theme']
  private root: ShadowRoot
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }
  connectedCallback() {
    this.render()
  }
  attributeChangedCallback() {
    this.render()
  }
  private async render() {
    const seleccion = this.getAttribute('seleccion') ?? 'argentina'
    const theme = (this.getAttribute('theme') as 'dark' | 'light') ?? 'dark'
    this.root.innerHTML = `<style>${baseStyles(theme)}
      .hero { display: flex; align-items: center; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid ${PALETTE[theme].border}; margin-bottom: 14px; }
      .flag { font-size: 48px; line-height: 1; }
      .title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
      .subtitle { font-size: 13px; color: ${PALETTE[theme].muted}; font-style: italic; margin: 2px 0 0; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .cell { border: 1px solid ${PALETTE[theme].border}; padding: 10px; }
    </style>
    <div>Cargando…</div>`
    try {
      const data = await fetchJson<Seleccion>(`/selecciones/${seleccion.toLowerCase()}`)
      this.root.innerHTML = `<style>${baseStyles(theme)}
        .hero { display: flex; align-items: center; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid ${PALETTE[theme].border}; margin-bottom: 14px; }
        .flag { font-size: 48px; line-height: 1; }
        .title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
        .subtitle { font-size: 13px; color: ${PALETTE[theme].muted}; font-style: italic; margin: 2px 0 0; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .cell { border: 1px solid ${PALETTE[theme].border}; padding: 10px; }
      </style>
      <div class="hero">
        <span class="flag">${data.bandera}</span>
        <div>
          <p class="title">${escapeHtml(data.pais)}</p>
          <p class="subtitle">${escapeHtml(data.apodo)}</p>
        </div>
      </div>
      <div class="grid">
        <div class="cell"><p class="label">Moneda</p><p class="value">${escapeHtml(data.moneda)}</p></div>
        <div class="cell"><p class="label">Creadores</p><p class="value">~${data.creadores_potenciales}</p></div>
        <div class="cell"><p class="label">Comisión</p><p class="value accent">0%</p></div>
      </div>
      <div class="footer">
        <span>Programa La Sombra · Mundial 2026</span>
        <a href="https://nebbuler.com/mundial/${data.slug}${UTM}" target="_blank" rel="noopener">nebbuler.com →</a>
      </div>`
    } catch (e) {
      this.root.innerHTML = `<style>${baseStyles(theme)}</style><p class="value accent">Error cargando datos</p>`
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// <nebbuler-calculadora plataforma="substack" precio="5" suscriptores="200">
// ───────────────────────────────────────────────────────────────────────────

class NebbulerCalculadora extends HTMLElement {
  static observedAttributes = ['plataforma', 'precio', 'suscriptores', 'theme']
  private root: ShadowRoot
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }
  connectedCallback() {
    this.render()
  }
  attributeChangedCallback() {
    this.render()
  }
  private render() {
    const theme = (this.getAttribute('theme') as 'dark' | 'light') ?? 'dark'
    const plataforma = (this.getAttribute('plataforma') ?? 'substack').toLowerCase()
    const precio = Math.max(0, Number(this.getAttribute('precio') ?? 5))
    const subs = Math.max(0, Number(this.getAttribute('suscriptores') ?? 200))

    const bruto = precio * subs
    const comMap: Record<string, number> = {
      substack: 0.1,
      patreon: 0.1,
      gumroad: 0.1,
      beehiiv: 0,
    }
    const com = comMap[plataforma] ?? 0.1
    const stripe = subs * 0.3 + bruto * 0.029
    const fx = bruto * 0.065
    const perdidoMes = bruto * com + stripe + fx
    const netoMes = Math.max(0, bruto - perdidoMes)
    const netoNebbuler = bruto * (1 - 0.0399)
    const ganaMasAnual = (netoNebbuler - netoMes) * 12

    this.root.innerHTML = `<style>${baseStyles(theme)}
      .big { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; margin: 6px 0; }
      .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid ${PALETTE[theme].border}; font-size: 13px; }
      .row:last-of-type { border-bottom: none; }
    </style>
    <p class="label">Cuánto te quita ${escapeHtml(plataforma)} al año</p>
    <p class="big accent">US$${Math.round(perdidoMes * 12).toLocaleString('en-US')}</p>
    <p style="font-size: 12px; color: ${PALETTE[theme].muted}; margin: 0 0 12px;">${subs} suscriptores · US$${precio}/mes</p>
    <div class="row"><span>${escapeHtml(plataforma)} te deja</span><span>US$${Math.round(netoMes).toLocaleString('en-US')}/mes</span></div>
    <div class="row"><span>Nebbuler La Sombra</span><span class="accent">US$${Math.round(netoNebbuler).toLocaleString('en-US')}/mes</span></div>
    <div class="row"><span><strong>Ganás +</strong></span><span class="accent"><strong>US$${Math.round(ganaMasAnual).toLocaleString('en-US')}/año</strong></span></div>
    <div class="footer">
      <span>Calculadora honesta</span>
      <a href="https://nebbuler.com/cuanto-te-quitan${UTM}" target="_blank" rel="noopener">Ver más →</a>
    </div>`
  }
}

// ───────────────────────────────────────────────────────────────────────────
// <nebbuler-quiniela theme="dark">
// ───────────────────────────────────────────────────────────────────────────

class NebbulerQuiniela extends HTMLElement {
  static observedAttributes = ['theme']
  private root: ShadowRoot
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }
  connectedCallback() {
    this.render()
  }
  private render() {
    const theme = (this.getAttribute('theme') as 'dark' | 'light') ?? 'dark'
    this.root.innerHTML = `<style>${baseStyles(theme)}
      .cta { display: inline-block; background: ${PALETTE[theme].accent}; color: #fff; padding: 12px 20px; margin-top: 10px; font-weight: 700; text-decoration: none; }
      .title { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
      .desc { font-size: 14px; color: ${PALETTE[theme].muted}; margin: 0 0 14px; line-height: 1.4; }
    </style>
    <p class="label">Quiniela Mundial 2026</p>
    <p class="title">Predecí el Mundial.</p>
    <p class="desc">5 preguntas, 60 segundos, sin registro. Compartí tu pronóstico en WhatsApp y desafiá a tu hinchada.</p>
    <a class="cta" href="https://nebbuler.com/mundial/quiniela${UTM}" target="_blank" rel="noopener">Jugar gratis →</a>
    <div class="footer">
      <span>Powered by Nebbuler</span>
      <a href="https://nebbuler.com/mundial${UTM}" target="_blank" rel="noopener">nebbuler.com →</a>
    </div>`
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Utility + registration
// ───────────────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function define(name: string, ctor: CustomElementConstructor) {
  if (typeof customElements !== 'undefined' && !customElements.get(name)) {
    customElements.define(name, ctor)
  }
}

define('nebbuler-mundial-widget', NebbulerMundialWidget)
define('nebbuler-calculadora', NebbulerCalculadora)
define('nebbuler-quiniela', NebbulerQuiniela)

export { NebbulerMundialWidget, NebbulerCalculadora, NebbulerQuiniela }
export const version = '0.1.0'
