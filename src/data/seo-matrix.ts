export const PROFESSIONS = [
  { slug: 'economista', label: 'Economista', discipline: 'economia', specialty: 'Macroeconomía y análisis económico' },
  { slug: 'abogado-tributario', label: 'Abogado Tributario', discipline: 'derecho', specialty: 'Derecho tributario y fiscal' },
  { slug: 'abogado-laboral', label: 'Abogado Laboral', discipline: 'derecho', specialty: 'Derecho del trabajo' },
  { slug: 'medico', label: 'Médico', discipline: 'medicina', specialty: 'Medicina y salud pública' },
  { slug: 'arquitecto', label: 'Arquitecto', discipline: 'arquitectura', specialty: 'Arquitectura y urbanismo' },
  { slug: 'ingeniero-comercial', label: 'Ingeniero Comercial', discipline: 'finanzas', specialty: 'Finanzas corporativas y estrategia' },
  { slug: 'analista-financiero', label: 'Analista Financiero', discipline: 'finanzas', specialty: 'Análisis financiero y valoración' },
  { slug: 'consultor', label: 'Consultor', discipline: 'negocios', specialty: 'Consultoría de gestión y estrategia' },
  { slug: 'cientista-politico', label: 'Cientista Político', discipline: 'ciencia-politica', specialty: 'Análisis político y policy' },
  { slug: 'nutricionista', label: 'Nutricionista', discipline: 'nutricion', specialty: 'Nutrición y metabolismo' },
] as const

export const MARKETS = [
  { slug: 'chile', label: 'Chile', gentilicio: 'chileno', capital: 'Santiago', currency: 'CLP', flag: '🇨🇱' },
  { slug: 'colombia', label: 'Colombia', gentilicio: 'colombiano', capital: 'Bogotá', currency: 'COP', flag: '🇨🇴' },
  { slug: 'mexico', label: 'México', gentilicio: 'mexicano', capital: 'Ciudad de México', currency: 'MXN', flag: '🇲🇽' },
  { slug: 'argentina', label: 'Argentina', gentilicio: 'argentino', capital: 'Buenos Aires', currency: 'ARS', flag: '🇦🇷' },
  { slug: 'peru', label: 'Perú', gentilicio: 'peruano', capital: 'Lima', currency: 'PEN', flag: '🇵🇪' },
  { slug: 'uruguay', label: 'Uruguay', gentilicio: 'uruguayo', capital: 'Montevideo', currency: 'UYU', flag: '🇺🇾' },
  { slug: 'latam', label: 'Latinoamérica', gentilicio: 'latinoamericano', capital: 'LATAM', currency: 'USD', flag: '🌎' },
] as const

export type ProfessionEntry = typeof PROFESSIONS[number]
export type MarketEntry = typeof MARKETS[number]
