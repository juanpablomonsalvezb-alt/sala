/**
 * Core Web Vitals Analyzer
 * Analiza métricas de performance críticas para SEO
 * https://web.dev/vitals/
 */

export interface CoreWebVitals {
  // Largest Contentful Paint (LCP) — Velocidad de carga
  lcp: number | null
  lcpThreshold: 'good' | 'needs-improvement' | 'poor'

  // First Input Delay (FID) / Interaction to Next Paint (INP) — Interactividad
  inp: number | null
  inpThreshold: 'good' | 'needs-improvement' | 'poor'

  // Cumulative Layout Shift (CLS) — Estabilidad visual
  cls: number | null
  clsThreshold: 'good' | 'needs-improvement' | 'poor'

  // Field data (real users)
  fieldData?: {
    goog: string // Google CrUX report
    mobile: string
    desktop: string
  }
}

/**
 * Thresholds según Google
 */
const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },      // milisegundos
  inp: { good: 200, poor: 500 },        // milisegundos
  cls: { good: 0.1, poor: 0.25 },       // número sin unidad
}

/**
 * Convierte métrica a categoría
 */
function getThreshold(metric: number, type: 'lcp' | 'inp' | 'cls'): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[type]
  if (metric <= threshold.good) return 'good'
  if (metric <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Simula Core Web Vitals (para testing sin PerformanceObserver)
 * En producción, usar Web Vitals library: https://github.com/GoogleChrome/web-vitals
 */
export function createMockCoreWebVitals(): CoreWebVitals {
  return {
    lcp: 1800,  // 1.8s = bueno
    lcpThreshold: 'good',

    inp: 120,   // 120ms = bueno
    inpThreshold: 'good',

    cls: 0.08,  // 0.08 = bueno
    clsThreshold: 'good',

    fieldData: {
      goog: 'https://pagespeedonline.com/insights/?url=https://nebbuler.com',
      mobile: 'Monitorear con PageSpeed Insights',
      desktop: 'Monitorear con PageSpeed Insights',
    },
  }
}

/**
 * Genera reporte de Core Web Vitals
 */
export function generateCoreWebVitalsReport(vitals: CoreWebVitals): {
  overall: 'good' | 'needs-improvement' | 'poor'
  details: string
  recommendations: string[]
} {
  const results = [vitals.lcpThreshold, vitals.inpThreshold, vitals.clsThreshold]
  const overall = results.includes('poor') ? 'poor'
                : results.includes('needs-improvement') ? 'needs-improvement'
                : 'good'

  const details = `
Core Web Vitals Report:
- LCP (Largest Contentful Paint): ${vitals.lcp}ms → ${vitals.lcpThreshold}
- INP (Interaction to Next Paint): ${vitals.inp}ms → ${vitals.inpThreshold}
- CLS (Cumulative Layout Shift): ${vitals.cls} → ${vitals.clsThreshold}
Overall: ${overall}
`

  const recommendations: string[] = []

  if (vitals.lcpThreshold !== 'good') {
    recommendations.push('⚠️ LCP: Optimizar tiempo de carga (imagen hero, cache, CDN)')
  }
  if (vitals.inpThreshold !== 'good') {
    recommendations.push('⚠️ INP: Reducir JavaScript de bloqueo (lazy load, code splitting)')
  }
  if (vitals.clsThreshold !== 'good') {
    recommendations.push('⚠️ CLS: Fijar dimensiones de imágenes y ads (evitar layout shift)')
  }

  if (overall === 'good') {
    recommendations.push('✅ Core Web Vitals están optimizadas para SEO')
  }

  return { overall, details, recommendations }
}

/**
 * URL para Google PageSpeed Insights
 */
export function getPageSpeedInsightsUrl(url: string = 'https://nebbuler.com'): string {
  return `https://pagespeedonline.com/insights/?url=${encodeURIComponent(url)}`
}

/**
 * URL para CrUX Dashboard (Google Chrome User Experience Report)
 */
export function getCrUXDashboardUrl(): string {
  return 'https://crux-dashboard.firebaseapp.com/'
}
