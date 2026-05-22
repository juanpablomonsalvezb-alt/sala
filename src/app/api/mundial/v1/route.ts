import { NextResponse } from 'next/server'
import mundialData from '@/data/mundial-2026.json'
import { SELECCIONES_LATAM, PROGRAMA_LA_SOMBRA } from '@/data/mundial-bootstrap'

export const revalidate = 3600

const VERSION = '1.0.0'

// API pública abierta (sin auth, CC-BY 4.0)
// Devuelve todos los datos del Mundial 2026 + Programa La Sombra
// Designed para que devs LATAM construyan apps consumiendo Nebbuler como backend
export async function GET() {
  return NextResponse.json(
    {
      meta: {
        api: 'nebbuler-mundial-v1',
        version: VERSION,
        license: 'CC-BY-4.0',
        attribution: 'Datos por Nebbuler · nebbuler.com',
        source: 'https://nebbuler.com/api/mundial/v1',
        updated_at: new Date().toISOString(),
        documentation: 'https://nebbuler.com/api/mundial/v1/docs',
        rate_limit: 'sin límite',
      },
      endpoints: {
        torneo: '/api/mundial/v1/torneo',
        grupos: '/api/mundial/v1/grupos',
        grupo: '/api/mundial/v1/grupos/{id}',
        sedes: '/api/mundial/v1/sedes',
        sede: '/api/mundial/v1/sedes/{slug}',
        selecciones: '/api/mundial/v1/selecciones',
        seleccion: '/api/mundial/v1/selecciones/{slug}',
        mascotas: '/api/mundial/v1/mascotas',
        programa_la_sombra: '/api/mundial/v1/programa-la-sombra',
      },
      data: mundialData,
      selecciones_latam_nebbuler: SELECCIONES_LATAM,
      programa_la_sombra: PROGRAMA_LA_SOMBRA,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-Powered-By': 'Nebbuler',
        'X-API-Version': VERSION,
      },
    },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
