import { NextResponse } from 'next/server'
import mundialData from '@/data/mundial-2026.json'

export const revalidate = 3600

export async function GET() {
  const data = mundialData as { sedes: unknown[] }
  return NextResponse.json(
    { count: data.sedes.length, sedes: data.sedes },
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
