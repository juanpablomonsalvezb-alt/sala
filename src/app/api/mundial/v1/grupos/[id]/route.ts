import { NextResponse } from 'next/server'
import mundialData from '@/data/mundial-2026.json'

export const revalidate = 3600

type Grupo = { id: string; selecciones: string[]; cabeza_serie: string; nota?: string }
const GRUPOS: Grupo[] = (mundialData as { grupos: Grupo[] }).grupos

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const grupo = GRUPOS.find((g) => g.id.toLowerCase() === id.toLowerCase())
  if (!grupo) {
    return NextResponse.json(
      { error: 'group_not_found', valid_ids: GRUPOS.map((g) => g.id) },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }
  return NextResponse.json(grupo, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'X-Powered-By': 'Nebbuler',
    },
  })
}
