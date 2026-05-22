import { NextResponse } from 'next/server'
import mundialData from '@/data/mundial-2026.json'

export const revalidate = 3600

export async function GET() {
  const data = mundialData as Record<string, unknown>
  return NextResponse.json(
    {
      torneo: data.torneo,
      trofeo: data.trofeo,
      campeon_vigente: data.campeon_vigente,
      datos_curiosos: data.datos_curiosos,
      fuentes_principales: data.fuentes_principales,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'Nebbuler',
      },
    },
  )
}
