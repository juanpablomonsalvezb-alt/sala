// ─── Tipos de dominio ────────────────────────────────────────────────────────

export type Creator = {
  id: string
  user_id: string
  name: string
  slug: string
  specialty: string
  bio: string
  bio_long: string | null
  linkedin_url: string | null
  price_clp: number
  plan: 'free' | 'creator' | 'pro'
  publish_frequency: string
  created_at: string
  subscriber_count: number
  stripe_account_id: string | null
}

export type Post = {
  id: string
  creator_id: string
  title: string
  excerpt: string | null
  content: string
  is_free: boolean
  published_at: string | null
  created_at: string
  read_time_minutes: number
  slug: string
}

export type Subscription = {
  id: string
  subscriber_id: string
  creator_id: string
  status: 'active' | 'cancelled' | 'past_due'
  stripe_subscription_id: string | null
  price_clp: number
  created_at: string
  cancelled_at: string | null
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_creator: boolean
  created_at: string
}

// ─── Database type para @supabase/ssr ────────────────────────────────────────

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      sala_profiles: TableDef<
        Profile,
        Omit<Profile, 'created_at'> & { created_at?: string },
        Partial<Omit<Profile, 'id'>>
      >
      sala_creators: TableDef<
        Creator,
        Omit<Creator, 'id' | 'created_at' | 'subscriber_count'> & { id?: string; created_at?: string; subscriber_count?: number },
        Partial<Omit<Creator, 'id'>>
      >
      sala_posts: TableDef<
        Post,
        Omit<Post, 'id' | 'created_at'> & { id?: string; created_at?: string },
        Partial<Omit<Post, 'id'>>
      >
      sala_subscriptions: TableDef<
        Subscription,
        Omit<Subscription, 'id' | 'created_at'> & { id?: string; created_at?: string },
        Partial<Omit<Subscription, 'id'>>
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      sala_creator_plan: 'free' | 'creator' | 'pro'
      sala_subscription_status: 'active' | 'cancelled' | 'past_due'
    }
    CompositeTypes: Record<string, never>
  }
}
