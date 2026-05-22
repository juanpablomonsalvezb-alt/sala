import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import partidos from '@/data/mundial-partidos.json'

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fase = searchParams.get('fase')
  const grupo = searchParams.get('grupo')?.toUpperCase()
  const equipo = searchParams.get('equipo')

  let result = partidos as {
    id: number; slug: string; equipo1: string; equipo2: string;
    grupo: string | null; jornada: number; fase: string;
    fecha: string; hora_ref: string; placeholder?: boolean
  }[]

  if (fase) result = result.filter((p) => p.fase === fase)
  if (grupo) result = result.filter((p) => p.grupo === grupo)
  if (equipo) {
    const q = equipo.toLowerCase()
    result = result.filter(
      (p) => p.equipo1.toLowerCase().includes(q) || p.equipo2.toLowerCase().includes(q),
    )
  }

  return NextResponse.json({
    meta: {
      api: 'nebbuler-mundial-v1',
      endpoint: '/api/mundial/v1/partidos',
      total: result.length,
      filters: { fase: fase ?? null, grupo: grupo ?? null, equipo: equipo ?? null },
    },
    partidos: result.map((p) => ({
      ...p,
      url: `https://nebbuler.com/mundial/partido/${p.slug}`,
    })),
  })
}
