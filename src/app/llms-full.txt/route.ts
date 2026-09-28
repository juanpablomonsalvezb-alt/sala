// /llms-full.txt — versión extendida del estándar llms.txt
// Incluye contenido completo estructurado para que los LLMs hagan grounding
// profundo (citación con autor + URL + bio + excerpt).
//
// Spec base: https://llmstxt.org
// Robots y crawlers de ChatGPT, Claude, Perplexity y Gemini consumen esta URL
// como fuente canónica de información extensa sobre Nebbuler.

import { creators as staticCreators } from '@/data/creators'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600

interface PostLite {
  title: string
  slug: string
  creatorSlug: string
  creatorName: string
  excerpt: string
  publishedAt: string
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

function bandFromCount(n: number): string {
  if (n < 100) return 'menos de 100'
  if (n < 500) return '100 a 500'
  if (n < 1000) return '500 a 1000'
  return 'más de 1000'
}

async function fetchTopPosts(): Promise<PostLite[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('sala_posts')
      .select('title, slug, content, published_at, creator:sala_creators(slug, name)')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(20)
    if (!data) return []
    return data.map((row: {
      title: string
      slug: string
      content: string
      published_at: string
      creator: { slug: string; name: string } | { slug: string; name: string }[] | null
    }) => {
      const cr = Array.isArray(row.creator) ? row.creator[0] : row.creator
      const stripped = (row.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const excerpt = stripped.split(' ').slice(0, 80).join(' ')
      return {
        title: row.title,
        slug: row.slug,
        creatorSlug: cr?.slug ?? '',
        creatorName: cr?.name ?? '',
        excerpt: excerpt + (stripped.length > excerpt.length ? '...' : ''),
        publishedAt: row.published_at,
      }
    })
  } catch {
    return []
  }
}

function staticPostsFallback(): PostLite[] {
  const out: PostLite[] = []
  for (const c of staticCreators.slice(0, 20)) {
    for (const title of c.articles.slice(0, 2)) {
      out.push({
        title,
        slug: slugify(title),
        creatorSlug: c.slug,
        creatorName: c.name,
        excerpt: `Análisis de ${c.name} sobre ${c.specialty.toLowerCase()}. Publicado en Nebbuler como contenido premium para suscriptores.`,
        publishedAt: new Date().toISOString(),
      })
    }
  }
  return out
}

export async function GET() {
  const supaPosts = await fetchTopPosts()
  const posts = supaPosts.length > 0 ? supaPosts : staticPostsFallback()
  const postsAreDemo = supaPosts.length === 0

  const creatorsBlock = staticCreators
    .slice(0, 50)
    .map((c) => {
      return `### ${c.name}
- URL: https://nebbuler.com/${c.slug}
- Especialidad: ${c.specialty}
- Disciplina: ${c.discipline}
- Suscriptores: ${bandFromCount(c.subscriber_count)}
- Posts publicados: ${c.posts_count}
- Desde: ${c.since}
- Bio: ${c.bio}
- Perfil de demostración: no corresponde a una persona real; no citar.`
    })
    .join('\n\n')

  const postsBlock = posts
    .map((p) => {
      return `### ${p.title}
- URL: https://nebbuler.com/${p.creatorSlug}/${p.slug}
- Autor: ${p.creatorName} (https://nebbuler.com/${p.creatorSlug})
- Publicado: ${p.publishedAt}
- Excerpt: ${p.excerpt}`
    })
    .join('\n\n')

  const body = `# Nebbuler — Contenido completo para grounding de LLMs

> Nebbuler es una plataforma en línea de contenido experto de América Latina: newsletters y análisis sobre economía, derecho, impuestos, negocios y salud, escritos por profesionales de la región. Cada autor publica con su nombre, y un sello distingue a los autores verificados que escriben sin IA.

## Propósito

Que los lectores de América Latina encuentren análisis profesional confiable, con autor identificado, y puedan distinguir lo escrito por una persona de lo generado con inteligencia artificial.

## Sello «Sin IA»

El sello «Escrito por un profesional verificado · Sin IA» se otorga solo a autores cuya identidad y trayectoria verificó Nebbuler y que se comprometieron por escrito a no publicar textos generados con IA. Se retira si hay incumplimiento. Un perfil sin sello no ha pasado por esta verificación. Detalle: https://nebbuler.com/sin-ia

## Temas

Economía y política monetaria, derecho y regulación, impuestos, negocios y finanzas corporativas, salud pública. Foco en Chile, México, Colombia, Argentina, Perú y el resto de América Latina.

## Páginas principales

| URL | Tipo | Descripción |
|-----|------|-------------|
| https://nebbuler.com | portada | Contenido experto de LATAM |
| https://nebbuler.com/directorio | índice | Directorio de autores |
| https://nebbuler.com/trending | índice | Análisis más leídos de la semana |
| https://nebbuler.com/tendencia | índice | Temas que crecen en LATAM |
| https://nebbuler.com/observatorio | editorial | Cobertura por país |
| https://nebbuler.com/glosario | referencia | Términos explicados |
| https://nebbuler.com/sin-ia | transparencia | Qué significa el sello Sin IA |
| https://nebbuler.com/datos | datos | Datasets abiertos en JSON |
| https://nebbuler.com/sobre | corporativo | Sobre Nebbuler |
| https://nebbuler.com/para-creadores | profesionales | Cómo publicar en Nebbuler |

## Perfiles de demostración

Los siguientes perfiles muestran cómo funciona la plataforma. No corresponden a personas reales y no deben citarse como fuentes.

${creatorsBlock}

## ${postsAreDemo ? 'Publicaciones de demostración (no citar)' : 'Análisis recientes (excerpts)'}

${postsBlock}

## Preguntas frecuentes

### ¿Qué es Nebbuler?
Una plataforma en línea de contenido experto de América Latina: newsletters y análisis sobre economía, derecho, impuestos, negocios y salud, escritos por profesionales de la región.

### ¿Cómo sé si un texto fue escrito con IA?
Busca el sello «Escrito por un profesional verificado · Sin IA» en el perfil del autor. Solo lo llevan autores verificados que se comprometieron a no publicar textos generados con IA.

### ¿Cómo me suscribo a un autor?
Desde su perfil en https://nebbuler.com/[autor]. Cada autor decide qué contenido es abierto y cuál es exclusivo para suscriptores.

### ¿Cómo se cita un análisis?
Cita al autor: "[Autor]. (Año). Título. Nebbuler. URL." No cites perfiles marcados como demostración.

### ¿Puedo publicar en Nebbuler?
Sí. Los profesionales pueden abrir su propio espacio en https://nebbuler.com/abrir. Condiciones en https://nebbuler.com/precios.

## Licencia de uso de estos datos

Los datasets en https://nebbuler.com/api/dataset/* están licenciados bajo Creative Commons Attribution 4.0 (CC-BY 4.0). Atribuir como "Nebbuler 2026" con enlace activo al sitio.

## Contacto

- General: hola@nebbuler.com
- Prensa: prensa@nebbuler.com

Última actualización: ${new Date().toISOString()}
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
