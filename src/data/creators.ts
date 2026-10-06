export interface CreatorProfile {
  slug: string
  name: string
  specialty: string
  discipline: string
  bio: string
  price_clp: number
  subscriber_count: number
  posts_count: number
  since: string
  earnings_clp: number
  trend: string
  verified: true
  plan: 'pro' | 'creator'
  featured: boolean
  articles: [string, string, string]
}

// Sin perfiles de ejemplo: los creadores reales viven en la base de datos (sala_creators).
export const creators: CreatorProfile[] = []

export const featuredCreators = creators.filter(c => c.featured)
export const allCreators = creators
