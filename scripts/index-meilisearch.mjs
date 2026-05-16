// Script de indexación completa en Meilisearch
// Ejecutar: node scripts/index-meilisearch.mjs

import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { Meilisearch as MeiliSearch } from 'meilisearch'
import { readFileSync } from 'fs'

// Leer .env.local
const envLines = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8').split('\n')
const env = {}
for (const line of envLines) {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '')
}

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SUPABASE_KEY = env['SUPABASE_SECRET_KEY'] || env['SUPABASE_SERVICE_ROLE_KEY']
const MEILI_HOST = 'https://ms-ee7516776aeb-47999.sao.meilisearch.io'
const MEILI_KEY  = 'fb22095fa42a9bcc0fa1fefbfc151fab26c21b09'

console.log('🔍 Conectando a Supabase:', SUPABASE_URL)
console.log('🔍 Conectando a Meilisearch:', MEILI_HOST)

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { transport: ws }
})
const meili = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_KEY })

// — Crear/configurar índices —
async function setupIndexes() {
  console.log('\n📦 Configurando índices...')
  try { await meili.createIndex('posts', { primaryKey: 'id' }) } catch {}
  try { await meili.createIndex('creators', { primaryKey: 'id' }) } catch {}

  await meili.index('posts').updateSettings({
    searchableAttributes: ['title', 'body', 'creator_name', 'specialty'],
    filterableAttributes: ['creator_slug', 'specialty'],
    sortableAttributes: ['published_at'],
  })
  await meili.index('creators').updateSettings({
    searchableAttributes: ['name', 'specialty', 'bio'],
    filterableAttributes: ['specialty'],
    sortableAttributes: ['subscriber_count'],
  })
  console.log('✅ Índices configurados')
}

// — Indexar creadores —
async function indexCreators() {
  console.log('\n👤 Indexando creadores...')
  const { data, error } = await supabase
    .from('sala_creators')
    .select('id, name, slug, specialty, bio, price_clp, subscriber_count')
    .not('slug', 'is', null)

  if (error) { console.error('❌ Error leyendo creadores:', error.message); return 0 }
  if (!data?.length) { console.log('⚠️  No hay creadores en DB'); return 0 }

  const docs = data.map(c => ({
    id: c.id,
    name: c.name ?? '',
    slug: c.slug ?? '',
    specialty: c.specialty ?? '',
    bio: c.bio ?? '',
    subscriber_count: c.subscriber_count ?? 0,
    price_clp: c.price_clp ?? 0,
  }))

  const task = await meili.index('creators').addDocuments(docs)
  console.log(`✅ ${docs.length} creadores enviados (task ${task.taskUid})`)
  return docs.length
}

// — Indexar posts —
async function indexPosts() {
  console.log('\n📄 Indexando posts...')
  let total = 0
  let from = 0
  const pageSize = 200

  while (true) {
    const { data, error } = await supabase
      .from('sala_posts')
      .select('id, title, content, excerpt, slug, published_at, creator_id, sala_creators(name, slug, specialty)')
      .not('slug', 'is', null)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .range(from, from + pageSize - 1)

    if (error) { console.error('❌ Error leyendo posts:', error.message); break }
    if (!data?.length) break

    const docs = data.map(p => ({
      id: p.id,
      title: p.title ?? '',
      body: ((p.content ?? p.excerpt ?? '')).replace(/<[^>]+>/g, '').slice(0, 5000),
      slug: p.slug ?? '',
      published_at: p.published_at ?? '',
      specialty: p.sala_creators?.specialty ?? '',
      creator_name: p.sala_creators?.name ?? '',
      creator_slug: p.sala_creators?.slug ?? '',
    }))

    const task = await meili.index('posts').addDocuments(docs)
    total += docs.length
    console.log(`  → Lote ${from}-${from + docs.length}: ${docs.length} posts (task ${task.taskUid})`)

    if (data.length < pageSize) break
    from += pageSize
  }

  console.log(`✅ Total posts indexados: ${total}`)
  return total
}

// — Main —
try {
  await setupIndexes()
  const creators = await indexCreators()
  const posts = await indexPosts()
  console.log(`\n🎉 Indexación completa: ${creators} creadores + ${posts} posts`)
} catch (e) {
  console.error('❌ Error fatal:', e.message)
  process.exit(1)
}
