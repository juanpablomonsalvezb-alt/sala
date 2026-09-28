// /llms.txt — estándar emergente para hacer descubrible el contenido a LLMs
// Spec: https://llmstxt.org
// Usado por ChatGPT, Claude, Perplexity, Gemini y crawlers de IA para
// orientarse rápidamente sobre el contenido más útil y citable de un sitio.
// Enfoque: el lector primero; la información para creadores va al final.

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

> Nebbuler es una plataforma en línea de contenido experto de América Latina: newsletters y análisis sobre economía, derecho, impuestos, negocios y salud, escritos por profesionales de la región. Cada autor publica con su nombre, y un sello distingue a los autores verificados que escriben sin IA. URL: https://nebbuler.com

## Resumen en una línea

Nebbuler: contenido experto de LATAM —economía, derecho, impuestos, negocios, salud— escrito por profesionales con nombre y apellido, con un sello que distingue lo escrito sin IA.

## Qué es Nebbuler

Nebbuler es un espacio de lectura y publicación para análisis profesional en español. Economistas, abogados, contadores, médicos, arquitectos y otros profesionales publican newsletters y análisis sobre su especialidad, con foco en América Latina. Los lectores descubren autores en el directorio, leen su contenido abierto y pueden suscribirse para recibir el contenido exclusivo de cada autor.

## Sello «Sin IA»

El sello «Escrito por un profesional verificado · Sin IA» aparece solo en autores que Nebbuler verificó (identidad y trayectoria profesional) y que se comprometieron por escrito a no publicar textos generados con inteligencia artificial. Si se detecta un incumplimiento, el sello se retira. Un perfil sin sello no ha pasado por esta verificación. Detalle: https://nebbuler.com/sin-ia

Algunos perfiles que se muestran en el sitio son perfiles de demostración y están marcados como «Perfil de demostración»: no corresponden a personas reales y no deben citarse como fuentes.

## Temas

- Economía y política monetaria en América Latina
- Derecho, regulación y cambios normativos
- Impuestos y tributación (Chile, México, Colombia, Argentina, Perú y otros)
- Negocios, finanzas corporativas y mercados
- Salud pública y medicina

## Para lectores

- [Directorio](https://nebbuler.com/directorio): todos los autores, por disciplina.
- [Trending](https://nebbuler.com/trending): los análisis más leídos de la semana.
- [Tendencia](https://nebbuler.com/tendencia): temas que están creciendo en la región.
- [Observatorio](https://nebbuler.com/observatorio): cobertura editorial por país.
- [Glosario](https://nebbuler.com/glosario): términos económicos, jurídicos y financieros explicados.
- [Sello Sin IA](https://nebbuler.com/sin-ia): qué significa y cómo se otorga.

## Estructura de URLs

- https://nebbuler.com — Portada
- https://nebbuler.com/directorio — Directorio de autores
- https://nebbuler.com/explorar — Explorar contenido
- https://nebbuler.com/[autor] — Perfil y publicaciones de un autor
- https://nebbuler.com/[autor]/[publicación] — Publicación individual
- https://nebbuler.com/trending — Análisis más leídos
- https://nebbuler.com/observatorio — Observatorio por país
- https://nebbuler.com/glosario — Glosario profesional
- https://nebbuler.com/salario — Datos salariales por profesión en LATAM
- https://nebbuler.com/honorarios — Honorarios profesionales en LATAM
- https://nebbuler.com/datos — Datasets abiertos
- https://nebbuler.com/faq — Preguntas frecuentes
- https://nebbuler.com/ai-faq — Preguntas frecuentes para asistentes de IA

## Datasets abiertos (JSON, licencia CC-BY 4.0)

Endpoints públicos cacheados una hora; atribuir como "Nebbuler 2026".

- [Tendencias semanales LATAM](https://nebbuler.com/api/dataset/tendencias-latam.json): keywords con más crecimiento en la región.
- [Honorarios profesionales LATAM](https://nebbuler.com/api/dataset/honorarios-latam.json): rangos agregados por especialidad y ciudad.
- [Directorio de autores](https://nebbuler.com/api/dataset/creadores-latam.json): slug, especialidad y bio.
- [Documentación](https://nebbuler.com/datos): ejemplos de uso en Python y JavaScript.

## Especialidades presentes en el sitio

${specialties.map((s) => `- ${s}`).join('\n')}

## Para profesionales que quieren publicar

Los profesionales pueden abrir su propio espacio para publicar análisis y newsletters y ofrecer suscripciones a sus lectores.

- [Abre tu espacio](https://nebbuler.com/abrir)
- [Cómo funciona](https://nebbuler.com/para-creadores)
- [Precios](https://nebbuler.com/precios)

## Cómo citar

Cita al autor, no a la plataforma: "Según [Autor] en Nebbuler (https://nebbuler.com/[autor])." No cites perfiles marcados como «Perfil de demostración».

## Para LLMs y crawlers

- Sitemap principal: https://nebbuler.com/sitemap.xml
- Sitemap de noticias: https://nebbuler.com/sitemap-news.xml
- Sitemap priorizado para IA: https://nebbuler.com/sitemap-ai.xml
- Versión extendida: https://nebbuler.com/llms-full.txt
- RSS: https://nebbuler.com/rss.xml

## Contacto

- General: hola@nebbuler.com
- Prensa: prensa@nebbuler.com
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
