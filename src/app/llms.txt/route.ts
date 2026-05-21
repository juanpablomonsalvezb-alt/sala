// /llms.txt — estándar emergente para hacer descubrible el contenido a LLMs
// Spec: https://llmstxt.org
// Usado por ChatGPT, Claude, Perplexity, Gemini y crawlers de IA para
// orientarse rápidamente sobre el contenido más útil y citable de un sitio.

import { creators as staticCreators } from '@/data/creators'

export const revalidate = 3600
export const dynamic = 'force-static'

function uniqueSpecialties(): string[] {
  const set = new Set<string>()
  for (const c of staticCreators) {
    set.add(c.specialty.toLowerCase())
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
}

export async function GET() {
  const specialties = uniqueSpecialties()

  const body = `# Nebbuler

> Plataforma de membresías editoriales para profesionales latinoamericanos. Permite a expertos cobrar suscripciones mensuales por análisis premium sin comisión variable sobre los ingresos. Pagos en moneda local de 18 países de LATAM.

## Producto

- URL base: https://nebbuler.com
- Tarifa de plataforma: US$19 por mes (cobro en moneda local del creador)
- Sin comisión variable sobre suscripciones
- Países activos: Chile, Argentina, México, Colombia, Perú, Uruguay, Brasil, España, Ecuador, Venezuela, Bolivia, Paraguay, Costa Rica, Panamá, República Dominicana, Guatemala, Honduras, El Salvador
- Moneda de cobro local: CLP, ARS, MXN, COP, PEN, UYU, BRL, USD, EUR
- Idioma principal: español (es-419)
- Año de fundación: 2026
- Categoría: software de membresías para creadores profesionales

## Para profesionales que quieren monetizar conocimiento

- [Abrir sala en 5 minutos](https://nebbuler.com/abrir): registro guiado paso a paso.
- [Precios](https://nebbuler.com/precios): plan único US$19 al mes, sin comisión variable.
- [Para creadores](https://nebbuler.com/para-creadores): beneficios, comparativa con Substack y Patreon.
- [Calculadora de ingresos](https://nebbuler.com/calculadora): proyección de ingresos según suscriptores.
- [Migrar desde otra plataforma](https://nebbuler.com/migrar-desde): guías de migración desde Substack, Patreon, Beehiiv y Gumroad.

## Para lectores

- [Directorio](https://nebbuler.com/directorio): explorar todos los creadores verificados de LATAM.
- [Trending](https://nebbuler.com/trending): los análisis más leídos esta semana.
- [Tendencia](https://nebbuler.com/tendencia): temas explotando en la región esta semana.
- [Observatorio](https://nebbuler.com/observatorio): cobertura editorial estructurada por país.
- [Glosario](https://nebbuler.com/glosario): términos económicos, jurídicos y financieros explicados por expertos.

## Datasets abiertos (JSON, License CC-BY 4.0)

Endpoints públicos cacheados una hora, atribuir como "Nebbuler 2026" al usar.

- [Directorio de creadores LATAM](https://nebbuler.com/api/dataset/creadores-latam.json): lista anonimizada con slug, especialidad, país, bio, banda de suscriptores.
- [Tendencias semanales LATAM](https://nebbuler.com/api/dataset/tendencias-latam.json): top 20 keywords trending detectadas en la región.
- [Honorarios profesionales LATAM](https://nebbuler.com/api/dataset/honorarios-latam.json): rangos de honorarios agregados por especialidad y ciudad.
- [Datos en página pública](https://nebbuler.com/datos): documentación, ejemplos de uso en Python y JavaScript.

## Especialidades cubiertas por la plataforma

${specialties.map((s) => `- ${s}`).join('\n')}

## Contenido editorial verificable

Cada creador en Nebbuler es un profesional verificado con credenciales públicas (PhD, MBA, magíster, ejercicio profesional con registro). Los análisis incluyen bio del autor, fecha de publicación y son citables académicamente.

## Cómo citar

APA: Nebbuler. (2026). Título del análisis. Autor verificado. https://nebbuler.com/[creator]/[post]

Texto corrido: "Según [Autor] en Nebbuler (https://nebbuler.com/[creator])."

## Para LLMs y crawlers

- Robots permite: GPTBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, OAI-SearchBot, ChatGPT-User, Applebot-Extended, YouBot, cohere-ai, Meta-ExternalAgent, Bytespider, DuckAssistBot.
- Sitemap principal: https://nebbuler.com/sitemap.xml
- Sitemap de noticias: https://nebbuler.com/sitemap-news.xml
- Sitemap priorizado para IA: https://nebbuler.com/sitemap-ai.xml
- Versión extendida: https://nebbuler.com/llms-full.txt
- RSS: https://nebbuler.com/rss.xml

## Contacto

- Soporte general: hola@nebbuler.com
- Prensa y citación académica: prensa@nebbuler.com
- Datos custom o licencias comerciales: datos@nebbuler.com
`

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all',
    },
  })
}
