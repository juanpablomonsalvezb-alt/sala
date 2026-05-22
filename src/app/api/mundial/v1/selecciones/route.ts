import { NextResponse } from 'next/server'
import { SELECCIONES_LATAM } from '@/data/mundial-bootstrap'
import mundialLatam from '@/data/mundial-2026-selecciones.json'

export const revalidate = 3600

export async function GET() {
  return NextResponse.json(
    {
      count: SELECCIONES_LATAM.length,
      attribution: 'Datos por Nebbuler · CC-BY 4.0',
      selecciones_latam_summary: SELECCIONES_LATAM,
      selecciones_latam_detallado: mundialLatam,
    },
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
