/**
 * IndexNow — Notifica a Bing, Yandex y Seznam de nuevas URLs en Nebbuler.
 * Protocolo: https://www.indexnow.org/
 *
 * Uso:
 *   npx ts-node automation/indexnow/indexnow.ts --all    # Todas las URLs del sitemap
 *   npx ts-node automation/indexnow/indexnow.ts --url https://nebbuler.com/rodrigo-fuentes-marin/nuevo-post
 */

import { createClient } from '@supabase/supabase-js'

// ─── Configuración ───────────────────────────────────────────────────────────

const CONFIG = {
  host: 'nebbuler.com',
  keyLocation: 'https://nebbuler.com/indexnow-key.txt',
  // Genera una key única en https://www.indexnow.org/documentation
  // Pon la misma key en /public/indexnow-key.txt
  key: process.env.INDEXNOW_KEY ?? 'nebbuler-indexnow-key-REEMPLAZAR',

  // Endpoints de los motores
  engines: [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ],
}

// ─── Función de envío ────────────────────────────────────────────────────────

async function submitUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) {
    console.log('No hay URLs para enviar.')
    return
  }

  const payload = JSON.stringify({
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: CONFIG.keyLocation,
    urlList: urls,
  })

  console.log(`\nEnviando ${urls.length} URLs a IndexNow...`)

  for (const engine of CONFIG.engines) {
    try {
      const result = await fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: payload,
      })

      if (result.ok || result.status === 202) {
        console.log(`  ✓ ${new URL(engine).hostname} — ${result.status}`)
      } else {
        const text = await result.text()
        console.warn(`  ✗ ${new URL(engine).hostname} — ${result.status}: ${text.slice(0, 100)}`)
      }
    } catch (err) {
      console.error(`  ✗ ${new URL(engine).hostname} — Error de red:`, err)
    }
  }
}

// ─── Obtener URLs desde Supabase ─────────────────────────────────────────────

async function getUrlsFromSupabase(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.warn('Variables de Supabase no configuradas. Usando URLs estáticas.')
    return getStaticUrls()
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const urls: string[] = []

  // Perfiles de creadores publicados
  const { data: profiles } = await supabase
    .from('sala_profiles')
    .select('slug')
    .eq('published', true)

  if (profiles) {
    urls.push(...profiles.map((p: { slug: string }) => `https://nebbuler.com/${p.slug}`))
  }

  // Posts publicados
  const { data: posts } = await supabase
    .from('sala_posts')
    .select('slug, creator:sala_profiles(slug)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(50) // Solo los 50 más recientes

  if (posts) {
    for (const post of posts) {
      const creator = Array.isArray(post.creator) ? post.creator[0] : post.creator
      if (creator?.slug && post.slug) {
        urls.push(`https://nebbuler.com/${creator.slug}/${post.slug}`)
      }
    }
  }

  return [...getStaticUrls(), ...urls]
}

function getStaticUrls(): string[] {
  return [
    'https://nebbuler.com/',
    'https://nebbuler.com/directorio',
    'https://nebbuler.com/para-creadores',
    'https://nebbuler.com/precios',
    'https://nebbuler.com/sobre',
    'https://nebbuler.com/observatorio',
    'https://nebbuler.com/observatorio/substack-en-espanol-2026',
    'https://nebbuler.com/observatorio/economistas-chile-2026',
    'https://nebbuler.com/observatorio/derecho-tributario-latam',
    'https://nebbuler.com/observatorio/think-tanks-individuales-chile',
    'https://nebbuler.com/observatorio/macroeconomia-latam',
    'https://nebbuler.com/glosario',
    'https://nebbuler.com/trending',
    'https://nebbuler.com/pregunta',
  ]
}

// ─── Entrypoint ──────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url')
    const url = args[urlIndex + 1]
    if (!url) { console.error('Uso: --url <https://nebbuler.com/...>'); process.exit(1) }
    await submitUrls([url])
  } else if (args.includes('--all')) {
    const urls = await getUrlsFromSupabase()
    console.log(`\nURLs encontradas: ${urls.length}`)
    urls.forEach(u => console.log('  ', u))
    await submitUrls(urls)
  } else {
    console.log(`
IndexNow para Nebbuler
─────────────────────
Uso:
  npx ts-node automation/indexnow/indexnow.ts --all
  npx ts-node automation/indexnow/indexnow.ts --url https://nebbuler.com/[slug]/[post]

Variables de entorno requeridas:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  INDEXNOW_KEY

Generar key: https://www.indexnow.org/documentation
Colocar la key en: /public/indexnow-key.txt (mismo valor que INDEXNOW_KEY)
    `)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
