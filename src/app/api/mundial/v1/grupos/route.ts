import { NextResponse } from 'next/server'
import mundialData from '@/data/mundial-2026.json'

export const revalidate = 3600

export async function GET() {
  const data = mundialData as { grupos: unknown[] }
  return NextResponse.json(
    { count: data.grupos.length, grupos: data.grupos },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'Nebbuler',
      },
    },
  )
}
