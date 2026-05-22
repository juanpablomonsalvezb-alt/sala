import { NextResponse } from 'next/server'
import partidos from '@/data/mundial-partidos.json'

export const revalidate = 3600

type Partido = {
  id: number; slug: string; equipo1: string; equipo2: string;
  grupo: string | null; jornada: number; fase: string;
  fecha: string; hora_ref: string; placeholder?: boolean
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const partido = (partidos as Partido[]).find((p) => p.slug === slug)

  if (!partido) {
    return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    ...partido,
    url: `https://nebbuler.com/mundial/partido/${partido.slug}`,
  })
}
