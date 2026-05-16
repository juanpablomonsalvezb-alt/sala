// Search API — SEARCH_ENABLED=true/false
// Returns empty results gracefully when Meilisearch is not configured

import { NextRequest, NextResponse } from 'next/server'
import { searchAll } from '@/lib/search/client'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') ?? '10', 10), 20)

  if (!q.trim()) {
    return NextResponse.json({ results: [], query: '' })
  }

  const results = await searchAll(q, limit)
  return NextResponse.json({ results, query: q })
}
