// Dataset público de honorarios profesionales en LATAM.
// Licencia: CC-BY 4.0. Atribuir como "Nebbuler 2026".
//
// Fuente: dataset estático mantenido manualmente con referencias a Bumeran,
// Trabajando.com, INE Chile, INEGI México, DANE Colombia, INDEC Argentina.
// Datos en moneda local de cada país.

import { NextResponse } from 'next/server'
import { SALARIOS, PAISES, PROFESIONES } from '@/data/salarios'

export const revalidate = 3600

interface HonorarioRecord {
  profession_slug: string
  profession_name: string
  area: string
  country_slug: string
  country_name: string
  currency: string
  monthly_min: number
  monthly_avg: number
  monthly_max: number
  source: string
  url: string
}

function buildRecords(): HonorarioRecord[] {
  const out: HonorarioRecord[] = []
  for (const prof of PROFESIONES) {
    const byCountry = SALARIOS[prof.slug]
    if (!byCountry) continue
    for (const country of PAISES) {
      const data = byCountry[country.slug]
      if (!data) continue
      out.push({
        profession_slug: prof.slug,
        profession_name: prof.nombreMayus,
        area: prof.area,
        country_slug: country.slug,
        country_name: country.nombre,
        currency: country.moneda,
        monthly_min: data.min,
        monthly_avg: data.promedio,
        monthly_max: data.max,
        source: data.fuente,
        url: `https://nebbuler.com/salario/${prof.slug}/${country.slug}`,
      })
    }
  }
  return out
}

export async function GET() {
  const records = buildRecords()

  const aggregatesByProfession: Record<string, { country_count: number; areas: string }> = {}
  for (const r of records) {
    const key = r.profession_slug
    if (!aggregatesByProfession[key]) {
      aggregatesByProfession[key] = { country_count: 0, areas: r.area }
    }
    aggregatesByProfession[key].country_count += 1
  }

  const payload = {
    dataset: 'nebbuler-honorarios-latam',
    version: '1.0',
    license: 'CC-BY-4.0',
    attribution: 'Nebbuler 2026 — https://nebbuler.com',
    description:
      'Honorarios mensuales agregados (rango min, promedio y max) por profesión y país en América Latina. Cifras en moneda local. Año de referencia 2026.',
    methodology:
      'Compilación de datos de Bumeran, Trabajando.com, INE Chile, INEGI México, DANE Colombia, INDEC Argentina, ajustados por factor de ciudad para extrapolación a /honorarios/[especialidad]/[ciudad].',
    generated_at: new Date().toISOString(),
    cache_ttl_seconds: 3600,
    docs_url: 'https://nebbuler.com/datos',
    record_count: records.length,
    professions_indexed: Object.keys(aggregatesByProfession).length,
    countries_indexed: PAISES.length,
    aggregates_by_profession: aggregatesByProfession,
    honorarios: records,
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'all',
      'X-Dataset-License': 'CC-BY-4.0',
    },
  })
}
