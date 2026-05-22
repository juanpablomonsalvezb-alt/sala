import { NextResponse } from 'next/server'
import { PROGRAMA_LA_SOMBRA, MUNDIAL } from '@/data/mundial-bootstrap'

export const revalidate = 3600

export async function GET() {
  return NextResponse.json(
    {
      programa: PROGRAMA_LA_SOMBRA,
      mundial: {
        nombre: MUNDIAL.nombre,
        fecha_inicio: MUNDIAL.fecha_inicio,
        fecha_fin: MUNDIAL.fecha_fin,
        dias_restantes: MUNDIAL.dias_para_inicio(),
        sedes: MUNDIAL.sedes,
      },
      aplicar: {
        whatsapp: 'https://wa.me/56992551416',
        email: 'juanpablo@nebbuler.com',
        landing: 'https://nebbuler.com/mundial',
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
