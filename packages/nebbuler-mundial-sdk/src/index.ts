/**
 * Nebbuler Mundial SDK
 * Open API client for the FIFA World Cup 2026 (Nebbuler's open data, CC-BY 4.0).
 *
 * Docs: https://nebbuler.com/api/mundial/v1/docs
 */

export const NEBBULER_API_BASE = 'https://nebbuler.com/api/mundial/v1'

export interface Torneo {
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  sedes: string[]
  selecciones: number
  partidos: number
}

export interface Grupo {
  id: string
  cabeza_serie: string
  selecciones: string[]
  nota?: string
}

export interface Sede {
  ciudad: string
  pais: string
  estadio: string
  capacidad: number
  rol?: string
}

export interface Seleccion {
  pais: string
  slug: string
  apodo: string
  bandera: string
  moneda: string
  moneda_simbolo: string
  audiencia_estimada: string
  creadores_potenciales: number
  urls?: {
    landing: string
    widget: string
    og_image: string
  }
}

export interface ProgramaLaSombra {
  nombre: string
  subtitle: string
  comision_periodo: string
  vigencia: string
  beneficios: string[]
}

export interface SdkOptions {
  baseUrl?: string
  fetch?: typeof fetch
  cache?: RequestCache
}

function client(options: SdkOptions = {}) {
  const base = options.baseUrl ?? NEBBULER_API_BASE
  const f = options.fetch ?? fetch
  return async <T>(path: string): Promise<T> => {
    const res = await f(`${base}${path}`, {
      cache: options.cache ?? 'force-cache',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`Nebbuler API ${res.status}: ${res.statusText}`)
    }
    return res.json() as Promise<T>
  }
}

/** Full dataset (meta + endpoints + data + selecciones LATAM + programa). */
export async function getMundialData(opts?: SdkOptions) {
  return client(opts)<{
    meta: Record<string, unknown>
    endpoints: Record<string, string>
    data: { torneo: Torneo; grupos: Grupo[]; sedes: Sede[]; mascotas: unknown[] }
    selecciones_latam_nebbuler: Seleccion[]
    programa_la_sombra: ProgramaLaSombra
  }>('')
}

/** Just the tournament metadata. */
export async function getTorneo(opts?: SdkOptions) {
  return client(opts)<{ torneo: Torneo; trofeo: unknown; campeon_vigente: string }>('/torneo')
}

/** All 12 groups. */
export async function getGrupos(opts?: SdkOptions) {
  const r = await client(opts)<{ count: number; grupos: Grupo[] }>('/grupos')
  return r.grupos
}

/** Single group by ID (a..l, case-insensitive). */
export async function getGrupo(id: string, opts?: SdkOptions) {
  return client(opts)<Grupo>(`/grupos/${id.toLowerCase()}`)
}

/** All 16 host venues. */
export async function getSedes(opts?: SdkOptions) {
  const r = await client(opts)<{ count: number; sedes: Sede[] }>('/sedes')
  return r.sedes
}

/** All Nebbuler-tracked LATAM teams (Argentina, Brasil, Mexico, ...). */
export async function getSelecciones(opts?: SdkOptions) {
  const r = await client(opts)<{
    selecciones_latam_summary: Seleccion[]
    selecciones_latam_detallado: unknown
  }>('/selecciones')
  return r.selecciones_latam_summary
}

/** Single LATAM team by slug (argentina, brasil, mexico, colombia, uruguay, ecuador, chile, peru). */
export async function getSeleccion(slug: string, opts?: SdkOptions) {
  return client(opts)<Seleccion>(`/selecciones/${slug.toLowerCase()}`)
}

/** Programa La Sombra (Nebbuler's World Cup creator program). */
export async function getProgramaLaSombra(opts?: SdkOptions) {
  return client(opts)<{
    programa: ProgramaLaSombra
    mundial: { dias_restantes: number; fecha_inicio: string; fecha_fin: string }
    aplicar: { whatsapp: string; email: string; landing: string }
  }>('/programa-la-sombra')
}
