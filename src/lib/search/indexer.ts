// Meilisearch indexer — reads from DB, writes to Meilisearch only
// Never modifies the existing database service

import { getSearchClient, INDEXES } from './client'

export interface PostDocument {
  id: string
  title: string
  body: string
  creator_name: string
  creator_slug: string
  slug: string
  published_at: string
  specialty: string
}

export interface CreatorDocument {
  id: string
  name: string
  slug: string
  specialty: string
  bio: string
  subscriber_count: number
  price_clp: number
}

export async function ensureIndexes(): Promise<void> {
  const client = getSearchClient()
  if (!client) return

  try {
    await client.createIndex(INDEXES.POSTS, { primaryKey: 'id' })
    await client.createIndex(INDEXES.CREATORS, { primaryKey: 'id' })

    const postsIndex = client.index(INDEXES.POSTS)
    await postsIndex.updateSettings({
      searchableAttributes: ['title', 'body', 'creator_name', 'specialty'],
      filterableAttributes: ['creator_slug', 'specialty'],
      sortableAttributes: ['published_at'],
      rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
    })

    const creatorsIndex = client.index(INDEXES.CREATORS)
    await creatorsIndex.updateSettings({
      searchableAttributes: ['name', 'specialty', 'bio'],
      filterableAttributes: ['specialty'],
      sortableAttributes: ['subscriber_count'],
    })
  } catch {
    // Indexes may already exist — that's fine
  }
}

export async function indexPost(post: PostDocument): Promise<void> {
  const client = getSearchClient()
  if (!client) return
  try {
    await client.index(INDEXES.POSTS).addDocuments([post])
  } catch {
    // Non-critical: search indexing failure doesn't affect the product
  }
}

export async function indexCreator(creator: CreatorDocument): Promise<void> {
  const client = getSearchClient()
  if (!client) return
  try {
    await client.index(INDEXES.CREATORS).addDocuments([creator])
  } catch {
    // Non-critical
  }
}

export async function deletePostFromIndex(id: string): Promise<void> {
  const client = getSearchClient()
  if (!client) return
  try {
    await client.index(INDEXES.POSTS).deleteDocument(id)
  } catch {
    // Non-critical
  }
}

export async function deleteCreatorFromIndex(id: string): Promise<void> {
  const client = getSearchClient()
  if (!client) return
  try {
    await client.index(INDEXES.CREATORS).deleteDocument(id)
  } catch {
    // Non-critical
  }
}
