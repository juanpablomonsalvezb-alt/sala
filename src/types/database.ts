// ─── Tipos de dominio ────────────────────────────────────────────────────────

export type Creator = {
  id: string
  user_id: string
  name: string
  slug: string // URL única: sala.lat/[slug]
  specialty: string
  bio: string
  bio_long: string | null
  linkedin_url: string | null
  price_clp: number // precio mensual en CLP
  plan: 'free' | 'creator' | 'pro'
  publish_frequency: string
  created_at: string
  subscriber_count: number // campo calculado/cacheado
  stripe_account_id: string | null
}

export type Post = {
  id: string
  creator_id: string
  title: string
  excerpt: string | null
  content: string // markdown
  is_free: boolean
  published_at: string | null
  created_at: string
  read_time_minutes: number
  slug: string
}

export type Subscription = {
  id: string
  subscriber_id: string // = auth.users.id del suscriptor
  creator_id: string
  status: 'active' | 'cancelled' | 'past_due'
  stripe_subscription_id: string | null
  price_clp: number
  created_at: string
  cancelled_at: string | null
}

export type Profile = {
  id: string // = auth.users.id
  email: string
  full_name: string | null
  avatar_url: string | null
  is_creator: boolean
  created_at: string
}

// ─── Tipos de base de datos (para @supabase/ssr generics) ────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<Profile, 'id'>>
      }
      creators: {
        Row: Creator
        Insert: Omit<Creator, 'id' | 'created_at' | 'subscriber_count'> & {
          id?: string
          created_at?: string
          subscriber_count?: number
        }
        Update: Partial<Omit<Creator, 'id' | 'created_at'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Subscription, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      creator_plan: 'free' | 'creator' | 'pro'
      subscription_status: 'active' | 'cancelled' | 'past_due'
    }
  }
}
