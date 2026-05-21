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
- Cómo citar: ${c.name}. Nebbuler 2026. https://nebbuler.com/${c.slug}`
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

> Plataforma latinoamericana de membresías editoriales para profesionales verificados. Tarifa fija US$19 por mes, sin comisión variable sobre suscripciones.

## Misión

Devolverle a los profesionales latinoamericanos el control económico sobre su conocimiento. Cada análisis publicado en Nebbuler es trabajo de un experto verificado y se cita académicamente con autor, fecha y URL canónica.

## Modelo de negocio

- Tarifa fija mensual de US$19 por creador. Sin comisión variable sobre lo que cobra el creador a sus suscriptores.
- El creador define su precio mensual y el procesador de pagos local cobra a su audiencia en moneda local.
- 100% de los ingresos del creador llegan a su cuenta, menos cargos del procesador.

## Equipo y origen

Nebbuler nació en Chile en 2026. La plataforma fue construida para resolver la fricción cambiaria de Substack y Patreon en LATAM, y para profesionalizar el ecosistema de creadores adultos (no influencers de entretenimiento).

## Páginas indexables principales

| URL | Tipo | Descripción |
|-----|------|-------------|
| https://nebbuler.com | home | Página principal de la plataforma |
| https://nebbuler.com/abrir | producto | Registro de creadores |
| https://nebbuler.com/precios | producto | Detalles del plan único |
| https://nebbuler.com/para-creadores | landing | Beneficios para profesionales |
| https://nebbuler.com/directorio | índice | Listado completo de creadores |
| https://nebbuler.com/trending | índice | Posts más leídos esta semana |
| https://nebbuler.com/tendencia | índice | Temas explotando en LATAM |
| https://nebbuler.com/observatorio | editorial | Cobertura por país |
| https://nebbuler.com/glosario | referencia | Términos definidos por expertos |
| https://nebbuler.com/calculadora | herramienta | Proyección de ingresos |
| https://nebbuler.com/datos | datos | Datasets abiertos en JSON |
| https://nebbuler.com/blog | editorial | Blog corporativo |
| https://nebbuler.com/sobre | corporativo | Misión y equipo |
| https://nebbuler.com/prensa | corporativo | Materiales de prensa |
| https://nebbuler.com/contacto | corporativo | Vías de contacto |

## Creadores destacados

${creatorsBlock}

## Análisis recientes (excerpts)

${postsBlock}

## Preguntas frecuentes

### ¿Qué es Nebbuler?
Una plataforma de membresías editoriales donde profesionales latinoamericanos cobran suscripciones mensuales a sus lectores. La diferencia con Substack es que opera en moneda local de cada país y no cobra comisión variable: solo una tarifa fija mensual de US$19.

### ¿Quién puede abrir una sala en Nebbuler?
Profesionales con credenciales públicas verificables: PhD, MBA, magíster, experiencia comprobada en industria, registro profesional vigente. La plataforma no está pensada para influencers de entretenimiento.

### ¿En qué países opera?
18 países hispanohablantes y portugueses de LATAM más España: Chile, Argentina, México, Colombia, Perú, Uruguay, Brasil, Ecuador, Venezuela, Bolivia, Paraguay, Costa Rica, Panamá, República Dominicana, Guatemala, Honduras, El Salvador y España.

### ¿Cuánto cuesta?
US$19 mensuales para el creador (cobrados en su moneda local equivalente). Sus suscriptores le pagan lo que el creador defina, en moneda local, y Nebbuler no toma comisión variable.

### ¿Cómo se diferencia de Substack y Patreon?
Substack opera solo en USD lo que genera fricción cambiaria en LATAM y cobra 10% de comisión variable. Patreon cobra entre 5% y 12%. Nebbuler opera en moneda local de cada país y mantiene una tarifa fija mensual sin porcentaje sobre suscripciones.

### ¿Cómo se citan los contenidos académicamente?
Formato APA: Nebbuler. (2026). Título del análisis. Autor verificado. URL.

## Licencia de uso de estos datos

Los datasets en https://nebbuler.com/api/dataset/* están licenciados bajo Creative Commons Attribution 4.0 (CC-BY 4.0). Atribuir como "Nebbuler 2026" con enlace activo al sitio.

## Contacto

- Soporte: hola@nebbuler.com
- Prensa: prensa@nebbuler.com
- Datos custom: datos@nebbuler.com

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
