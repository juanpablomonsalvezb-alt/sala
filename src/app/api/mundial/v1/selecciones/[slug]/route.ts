import { NextResponse } from 'next/server'
import { SELECCIONES_LATAM } from '@/data/mundial-bootstrap'

export const revalidate = 3600

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const seleccion = SELECCIONES_LATAM.find((s) => s.slug === slug.toLowerCase())
  if (!seleccion) {
    return NextResponse.json(
      { error: 'seleccion_not_found', valid_slugs: SELECCIONES_LATAM.map((s) => s.slug) },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }
  return NextResponse.json(
    {
      ...seleccion,
      urls: {
        landing: `https://nebbuler.com/mundial/${seleccion.slug}`,
        widget: `https://nebbuler.com/widget/mundial/${seleccion.slug}`,
        og_image: `https://nebbuler.com/api/og/mundial-pais?slug=${seleccion.slug}`,
      },
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
