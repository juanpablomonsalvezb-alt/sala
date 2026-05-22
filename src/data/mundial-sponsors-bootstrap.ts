// Bootstrap data sponsors — enriquecido cuando el agente entregue mundial-sponsors.json
// Datos basados en filtraciones públicas de prensa (Bloomberg, FT, SportBusiness, Forbes)
// FIFA NO publica montos oficiales — todos son estimaciones de mercado.

export interface Sponsor {
  nombre: string
  categoria: 'FIFA Partner' | 'FIFA World Cup Sponsor' | 'Regional Supporter Americas'
  sector: string
  pais_origen: string
  monto_estimado_usd: number | null // null si no es público
  desde: number | null
  notas?: string
}

export const SPONSORS: Sponsor[] = [
  // FIFA Partners (top tier global, ~8 slots) — estimaciones $100-200M/ciclo de 4 años
  { nombre: 'Adidas', categoria: 'FIFA Partner', sector: 'Indumentaria deportiva', pais_origen: 'Alemania', monto_estimado_usd: 150_000_000, desde: 1970, notas: 'Proveedor oficial del balón histórico.' },
  { nombre: 'Coca-Cola', categoria: 'FIFA Partner', sector: 'Bebidas', pais_origen: 'EE.UU.', monto_estimado_usd: 100_000_000, desde: 1978 },
  { nombre: 'Visa', categoria: 'FIFA Partner', sector: 'Servicios financieros', pais_origen: 'EE.UU.', monto_estimado_usd: 100_000_000, desde: 2007 },
  { nombre: 'Hyundai-Kia', categoria: 'FIFA Partner', sector: 'Automotriz', pais_origen: 'Corea del Sur', monto_estimado_usd: 120_000_000, desde: 1999 },
  { nombre: 'Wanda Group', categoria: 'FIFA Partner', sector: 'Conglomerado / inmobiliario', pais_origen: 'China', monto_estimado_usd: 150_000_000, desde: 2016 },
  { nombre: 'Qatar Airways', categoria: 'FIFA Partner', sector: 'Aerolíneas', pais_origen: 'Qatar', monto_estimado_usd: 100_000_000, desde: 2017 },
  { nombre: 'Aramco', categoria: 'FIFA Partner', sector: 'Petróleo y gas', pais_origen: 'Arabia Saudita', monto_estimado_usd: 100_000_000, desde: 2024, notas: 'Deal anunciado 2024 hasta 2027.' },
  { nombre: 'Lenovo', categoria: 'FIFA Partner', sector: 'Tecnología', pais_origen: 'China', monto_estimado_usd: 80_000_000, desde: 2024 },

  // FIFA World Cup Sponsors (tier de torneo, ~6 slots) — estimaciones $50-100M
  { nombre: 'AB InBev (Budweiser)', categoria: 'FIFA World Cup Sponsor', sector: 'Cervecería', pais_origen: 'Bélgica', monto_estimado_usd: 75_000_000, desde: 1986 },
  { nombre: 'McDonald\'s', categoria: 'FIFA World Cup Sponsor', sector: 'Restauración rápida', pais_origen: 'EE.UU.', monto_estimado_usd: 50_000_000, desde: 1994 },
  { nombre: 'Hisense', categoria: 'FIFA World Cup Sponsor', sector: 'Electrónica', pais_origen: 'China', monto_estimado_usd: 60_000_000, desde: 2017 },
  { nombre: 'Mengniu Dairy', categoria: 'FIFA World Cup Sponsor', sector: 'Lácteos', pais_origen: 'China', monto_estimado_usd: 50_000_000, desde: 2018 },
  { nombre: 'Lay\'s (PepsiCo)', categoria: 'FIFA World Cup Sponsor', sector: 'Snacks', pais_origen: 'EE.UU.', monto_estimado_usd: 50_000_000, desde: 2021 },
  { nombre: 'Frito-Lay (PepsiCo)', categoria: 'FIFA World Cup Sponsor', sector: 'Snacks', pais_origen: 'EE.UU.', monto_estimado_usd: 50_000_000, desde: 2022 },

  // Regional Supporters Americas (~6 slots) — $20-50M
  { nombre: 'Mercado Libre', categoria: 'Regional Supporter Americas', sector: 'E-commerce / fintech', pais_origen: 'Argentina', monto_estimado_usd: 35_000_000, desde: 2024, notas: 'Único sponsor latinoamericano top.' },
  { nombre: 'Anheuser-Busch Bavaria', categoria: 'Regional Supporter Americas', sector: 'Cervecería', pais_origen: 'EE.UU./LATAM', monto_estimado_usd: 30_000_000, desde: 2025 },
]

export const TOTALES = {
  sponsors_total: SPONSORS.length,
  monto_total_estimado_usd: SPONSORS.reduce((s, p) => s + (p.monto_estimado_usd ?? 0), 0),
  fifa_partners_count: SPONSORS.filter((s) => s.categoria === 'FIFA Partner').length,
  fifa_world_cup_sponsors_count: SPONSORS.filter((s) => s.categoria === 'FIFA World Cup Sponsor').length,
  regional_supporters_count: SPONSORS.filter((s) => s.categoria === 'Regional Supporter Americas').length,
}

export const COMPARATIVA = {
  // Para igualar lo que paga UN sponsor FIFA Partner promedio (~$100M)
  un_partner_substack_creadores_necesarios: () => {
    const partnerMontoPromedio = 100_000_000
    const ingresoSubstackPorCreadorAnual = 200 * 5 * 12 * 0.1 // 200 subs · $5/mes · 10% comisión
    return Math.round(partnerMontoPromedio / ingresoSubstackPorCreadorAnual)
  },
}
