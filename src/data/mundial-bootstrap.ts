// Bootstrap data del Mundial 2026 — se enriquece luego con /src/data/mundial-2026.json
// generado por el pipeline de investigación. Esto permite que la página /mundial
// funcione mientras el dataset completo se compila.

export interface Seleccion {
  pais: string
  slug: string
  apodo: string
  bandera: string // emoji
  moneda: string
  moneda_simbolo: string
  audiencia_estimada: string // descripción cualitativa de hinchada
  creadores_potenciales: number // estimación de periodistas/podcasters/analistas
}

export const SELECCIONES_LATAM: Seleccion[] = [
  {
    pais: 'Argentina',
    slug: 'argentina',
    apodo: 'La Albiceleste',
    bandera: '🇦🇷',
    moneda: 'ARS',
    moneda_simbolo: '$',
    audiencia_estimada: 'Campeón vigente · 47M hinchas activos',
    creadores_potenciales: 850,
  },
  {
    pais: 'Brasil',
    slug: 'brasil',
    apodo: 'A Seleção',
    bandera: '🇧🇷',
    moneda: 'BRL',
    moneda_simbolo: 'R$',
    audiencia_estimada: 'Pentacampeón · 215M habitantes',
    creadores_potenciales: 1200,
  },
  {
    pais: 'México',
    slug: 'mexico',
    apodo: 'El Tri',
    bandera: '🇲🇽',
    moneda: 'MXN',
    moneda_simbolo: '$',
    audiencia_estimada: 'País anfitrión · 130M hinchas',
    creadores_potenciales: 950,
  },
  {
    pais: 'Colombia',
    slug: 'colombia',
    apodo: 'La Tricolor',
    bandera: '🇨🇴',
    moneda: 'COP',
    moneda_simbolo: '$',
    audiencia_estimada: 'Generación dorada 2026 · 52M hinchas',
    creadores_potenciales: 480,
  },
  {
    pais: 'Uruguay',
    slug: 'uruguay',
    apodo: 'La Celeste',
    bandera: '🇺🇾',
    moneda: 'UYU',
    moneda_simbolo: '$',
    audiencia_estimada: 'Bicampeón histórico · 3.5M hinchas',
    creadores_potenciales: 120,
  },
  {
    pais: 'Ecuador',
    slug: 'ecuador',
    apodo: 'La Tri',
    bandera: '🇪🇨',
    moneda: 'USD',
    moneda_simbolo: 'US$',
    audiencia_estimada: 'Cuarta clasificación seguida · 18M hinchas',
    creadores_potenciales: 95,
  },
  {
    pais: 'Chile',
    slug: 'chile',
    apodo: 'La Roja',
    bandera: '🇨🇱',
    moneda: 'CLP',
    moneda_simbolo: '$',
    audiencia_estimada: 'Generación post-Bicampeonato · 20M hinchas',
    creadores_potenciales: 180,
  },
  {
    pais: 'Perú',
    slug: 'peru',
    apodo: 'La Bicolor',
    bandera: '🇵🇪',
    moneda: 'PEN',
    moneda_simbolo: 'S/',
    audiencia_estimada: 'Hinchada más leal de LATAM · 34M habitantes',
    creadores_potenciales: 220,
  },
]

export const MUNDIAL = {
  nombre: 'Mundial 2026',
  fecha_inicio: '2026-06-11',
  fecha_fin: '2026-07-19',
  selecciones_totales: 48,
  partidos_totales: 104,
  sedes: ['Estados Unidos', 'México', 'Canadá'],
  dias_para_inicio: () => {
    const ms = new Date('2026-06-11T00:00:00Z').getTime() - Date.now()
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
  },
}

// Tasas aproximadas de conversión a USD (mayo 2026, actualizar mensualmente)
export const TASAS_USD: Record<string, number> = {
  USD: 1,
  ARS: 1180,
  BRL: 5.2,
  MXN: 19.5,
  COP: 4200,
  UYU: 41,
  PEN: 3.78,
  CLP: 970,
}

// Programa La Sombra — condiciones
export const PROGRAMA_LA_SOMBRA = {
  nombre: 'La Sombra',
  subtitle: 'Programa Mundial Nebbuler 2026',
  comision_periodo: '0% comisión variable',
  vigencia: 'hasta el 31 de julio de 2026',
  setup_fee: 0,
  onboarding: 'personalizado 1-a-1 vía WhatsApp',
  beneficios: [
    'Setup completo de tu sala en 24 horas',
    '0% comisión variable durante todo el Mundial',
    'Onboarding personalizado vía WhatsApp con el fundador',
    'Cobro en moneda local de tu audiencia (CLP, COP, ARS, MXN, PEN, UYU, BRL)',
    'OG images dinámicas con tu marca para cada análisis',
    'Acceso a dataset de salarios de periodistas deportivos LATAM',
    'Aparición destacada en el directorio mundial.nebbuler.com',
  ],
}
