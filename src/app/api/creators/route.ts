import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('subscriber_count', { ascending: false })

    if (error) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
