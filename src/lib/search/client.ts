// Meilisearch client — SEARCH_ENABLED=true/false
// If not configured, all functions return empty results gracefully

import { Meilisearch } from 'meilisearch'

const SEARCH_ENABLED = process.env.SEARCH_ENABLED === 'true'
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST ?? 'http://localhost:7700'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY ?? ''

let _client: Meilisearch | null = null

export function getSearchClient(): Meilisearch | null {
  if (!SEARCH_ENABLED) return null
  if (!MEILISEARCH_HOST) return null
  if (!_client) {
    _client = new Meilisearch({ host: MEILISEARCH_HOST, apiKey: MEILISEARCH_API_KEY })
  }
  return _client
}

export const INDEXES = {
  POSTS: 'sala_posts',
  CREATORS: 'sala_creators',
} as const

export interface SearchResult {
  id: string
  type: 'post' | 'creator'
  title?: string
  name?: string
  body?: string
  specialty?: string
  creatorName?: string
  slug?: string
  url: string
}

export async function searchAll(query: string, limit = 10): Promise<SearchResult[]> {
  const client = getSearchClient()
  if (!client || !query.trim()) return []

  try {
    const results = await client.multiSearch({
      queries: [
        { indexUid: INDEXES.POSTS, q: query, limit, attributesToHighlight: ['title', 'body'] },
        { indexUid: INDEXES.CREATORS, q: query, limit: 5 },
      ],
    })

    const posts: SearchResult[] = (results.results[0]?.hits ?? []).map((h: Record<string, unknown>) => ({
      id: String(h.id),
      type: 'post' as const,
      title: h.title as string | undefined,
      body: h.body as string | undefined,
      creatorName: h.creator_name as string | undefined,
      slug: h.slug as string | undefined,
      url: `/suscribirse/${h.creator_slug ?? ''}`,
    }))

    const creators: SearchResult[] = (results.results[1]?.hits ?? []).map((h: Record<string, unknown>) => ({
      id: String(h.id),
      type: 'creator' as const,
      name: h.name as string | undefined,
      specialty: h.specialty as string | undefined,
      slug: h.slug as string | undefined,
      url: `/suscribirse/${h.slug ?? ''}`,
    }))

    return [...posts, ...creators]
  } catch {
    return []
  }
}
