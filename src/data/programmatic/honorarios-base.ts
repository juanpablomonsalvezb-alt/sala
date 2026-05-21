// Base de honorarios por especialidad (en USD para cálculo neutral) y multiplicador por país
// Luego se convierte a la moneda local de la ciudad con un factor de tipo de cambio aproximado 2026.
// Fuentes referenciales: colegios profesionales LATAM, INEGI, INE Chile, DANE, INDEC, plataformas freelance.

import type { Especialidad } from './especialidades-honorarios'

// Honorarios base en USD por unidad (junior junior=min, senior=max, top10 = senior * 1.7)
// rango realista 2026 para mercado LATAM tier-1
export const HONORARIOS_BASE_USD: Record<string, { min: number; medio: number; max: number; unidad: Especialidad['unidadCobro'] }> = {
  'economista':            { min: 35,  medio: 70,  max: 140, unidad: 'hora' },
  'abogado':               { min: 40,  medio: 90,  max: 220, unidad: 'hora' },
  'contador':              { min: 120, medio: 280, max: 650, unidad: 'mes' },
  'medico':                { min: 30,  medio: 55,  max: 130, unidad: 'consulta' },
  'arquitecto':            { min: 800, medio: 2200,max: 7500,unidad: 'proyecto' },
  'ingeniero-civil':       { min: 1200,medio: 3500,max: 12000,unidad: 'proyecto' },
  'ingeniero-industrial':  { min: 30,  medio: 60,  max: 130, unidad: 'hora' },
  'ingeniero-informatico': { min: 28,  medio: 55,  max: 140, unidad: 'hora' },
  'dentista':              { min: 35,  medio: 70,  max: 180, unidad: 'consulta' },
  'psicologo':             { min: 25,  medio: 45,  max: 110, unidad: 'consulta' },
  'nutricionista':         { min: 25,  medio: 45,  max: 95,  unidad: 'consulta' },
  'kinesiologo':           { min: 22,  medio: 38,  max: 80,  unidad: 'consulta' },
  'fonoaudiologo':         { min: 22,  medio: 40,  max: 85,  unidad: 'consulta' },
  'agente-inmobiliario':   { min: 500, medio: 1800,max: 8500,unidad: 'proyecto' },
  'consultor-seo':         { min: 350, medio: 900, max: 2800,unidad: 'mes' },
  'copywriter':            { min: 200, medio: 750, max: 3500,unidad: 'proyecto' },
  'disenador-ux':          { min: 25,  medio: 55,  max: 130, unidad: 'hora' },
  'coach-ejecutivo':       { min: 80,  medio: 180, max: 450, unidad: 'consulta' },
  'marketer-digital':      { min: 400, medio: 1100,max: 3800,unidad: 'mes' },
  'traductor':             { min: 120, medio: 380, max: 1500,unidad: 'proyecto' },
  'periodista':            { min: 150, medio: 420, max: 1400,unidad: 'proyecto' },
  'fotografo':             { min: 180, medio: 550, max: 2200,unidad: 'proyecto' },
  'chef-privado':          { min: 220, medio: 600, max: 1800,unidad: 'proyecto' },
  'profesor-universitario':{ min: 30,  medio: 55,  max: 130, unidad: 'hora' },
  'financial-advisor':     { min: 50,  medio: 110, max: 280, unidad: 'hora' },
}

// Tipo de cambio aproximado a mayo 2026 (1 USD = X local)
// Solo referencia para construir cifras plausibles, no es precio en tiempo real
export const TIPO_CAMBIO: Record<string, number> = {
  'chile': 950,
  'argentina': 1180,
  'mexico': 18.5,
  'colombia': 4100,
  'peru': 3.75,
  'uruguay': 39,
  'ecuador': 1,
  'bolivia': 6.96,
  'paraguay': 7350,
  'costa-rica': 520,
  'panama': 1,
  'republica-dominicana': 60,
  'venezuela': 1, // mercado dolarizado de facto
}

// Multiplicador relativo por mercado profesional (qué tan competitivo paga el país)
// 1.0 = USD base, <1 paga menos en términos absolutos USD, >1 paga más
export const MULT_PAIS: Record<string, number> = {
  'chile': 1.05,
  'argentina': 0.72,
  'mexico': 0.95,
  'colombia': 0.78,
  'peru': 0.82,
  'uruguay': 1.0,
  'ecuador': 0.78,
  'bolivia': 0.68,
  'paraguay': 0.72,
  'costa-rica': 0.92,
  'panama': 1.05,
  'republica-dominicana': 0.80,
  'venezuela': 0.65,
}

export interface HonorariosCalculo {
  min: number
  medio: number
  max: number
  top10: number
  unidad: string
  unidadLabel: string
  monedaLocal: string
  simbolo: string
  fuente: string
  paisSlug: string
  ciudadFactor: number
}

const UNIDAD_LABEL: Record<string, string> = {
  hora: 'por hora',
  consulta: 'por consulta',
  proyecto: 'por proyecto',
  mes: 'mensual',
}

/**
 * Calcula honorarios para una especialidad en una ciudad LATAM específica.
 * Aplica multiplicador de país + ajuste por ciudad (capital vs secundaria) + tipo de cambio.
 */
export function calcularHonorarios(
  especialidadSlug: string,
  paisSlug: string,
  ciudadFactor: number,
  moneda: string,
  simbolo: string
): HonorariosCalculo | null {
  const base = HONORARIOS_BASE_USD[especialidadSlug]
  if (!base) return null

  const multPais = MULT_PAIS[paisSlug] ?? 0.85
  const tc = TIPO_CAMBIO[paisSlug] ?? 1

  const ajuste = multPais * ciudadFactor * tc

  // Redondeo a unidades sensatas según la magnitud
  const round = (n: number) => {
    if (n >= 1_000_000) return Math.round(n / 10000) * 10000
    if (n >= 100_000) return Math.round(n / 1000) * 1000
    if (n >= 10_000) return Math.round(n / 100) * 100
    if (n >= 1_000) return Math.round(n / 50) * 50
    if (n >= 100) return Math.round(n / 5) * 5
    return Math.round(n)
  }

  const min = round(base.min * ajuste)
  const medio = round(base.medio * ajuste)
  const max = round(base.max * ajuste)
  const top10 = round(base.max * ajuste * 1.7)

  return {
    min,
    medio,
    max,
    top10,
    unidad: base.unidad,
    unidadLabel: UNIDAD_LABEL[base.unidad],
    monedaLocal: moneda,
    simbolo,
    fuente: 'Estimado de mercado basado en colegios profesionales, plataformas freelance y reportes salariales LATAM 2026',
    paisSlug,
    ciudadFactor,
  }
}
