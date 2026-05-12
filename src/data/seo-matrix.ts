export type ProfessionEntry = {
  slug: string
  label: string
  discipline: string
  description: string
  specialty?: string
  gentilicio?: string
}

export type MarketEntry = {
  slug: string
  label: string
  currency: string
  currencySymbol: string
  gentilicio?: string
  capital?: string
  flag?: string
}

export const PROFESSIONS: ProfessionEntry[] = [
  { slug: 'economista', label: 'Economista', discipline: 'economia', description: 'análisis macroeconómico y política monetaria', specialty: 'Macroeconomía y análisis económico' },
  { slug: 'abogado-tributario', label: 'Abogado Tributario', discipline: 'derecho', description: 'planificación fiscal y derecho tributario', specialty: 'Derecho tributario y fiscal' },
  { slug: 'abogado-laboral', label: 'Abogado Laboral', discipline: 'derecho', description: 'derecho del trabajo y relaciones laborales', specialty: 'Derecho del trabajo' },
  { slug: 'abogado-comercial', label: 'Abogado Comercial', discipline: 'derecho', description: 'derecho corporativo y contratos comerciales', specialty: 'Derecho corporativo y contratos' },
  { slug: 'medico', label: 'Médico', discipline: 'medicina', description: 'salud pública y medicina clínica', specialty: 'Medicina y salud pública' },
  { slug: 'medico-especialista', label: 'Médico Especialista', discipline: 'medicina', description: 'análisis de especialidades médicas', specialty: 'Especialidades médicas' },
  { slug: 'analista-financiero', label: 'Analista Financiero', discipline: 'finanzas', description: 'mercados financieros y valoración de activos', specialty: 'Análisis financiero y valoración' },
  { slug: 'contador', label: 'Contador', discipline: 'finanzas', description: 'contabilidad, auditoría y gestión financiera', specialty: 'Contabilidad y auditoría' },
  { slug: 'ingeniero-comercial', label: 'Ingeniero Comercial', discipline: 'finanzas', description: 'estrategia empresarial y análisis de negocios', specialty: 'Finanzas corporativas y estrategia' },
  { slug: 'arquitecto', label: 'Arquitecto', discipline: 'arquitectura', description: 'diseño urbano y mercado inmobiliario', specialty: 'Arquitectura y urbanismo' },
  { slug: 'nutricionista', label: 'Nutricionista', discipline: 'medicina', description: 'nutrición clínica y salud preventiva', specialty: 'Nutrición y metabolismo' },
  { slug: 'psicologo', label: 'Psicólogo', discipline: 'medicina', description: 'salud mental y psicología clínica', specialty: 'Salud mental y psicología' },
  { slug: 'cientista-politico', label: 'Cientista Político', discipline: 'ciencias-sociales', description: 'análisis político e institucional', specialty: 'Análisis político e institucional' },
  { slug: 'sociologo', label: 'Sociólogo', discipline: 'ciencias-sociales', description: 'análisis social y tendencias culturales', specialty: 'Sociología y análisis social' },
  { slug: 'ingeniero-industrial', label: 'Ingeniero Industrial', discipline: 'ingenieria', description: 'operaciones, logística y gestión de procesos', specialty: 'Operaciones y logística' },
  { slug: 'consultor-empresarial', label: 'Consultor Empresarial', discipline: 'finanzas', description: 'estrategia y transformación organizacional', specialty: 'Consultoría de gestión y estrategia' },
  { slug: 'experto-mercado-inmobiliario', label: 'Experto Inmobiliario', discipline: 'finanzas', description: 'mercado de bienes raíces e inversión inmobiliaria', specialty: 'Mercado inmobiliario e inversión' },
  { slug: 'epidemiologo', label: 'Epidemiólogo', discipline: 'medicina', description: 'vigilancia epidemiológica y salud pública', specialty: 'Epidemiología y salud pública' },
  { slug: 'historiador', label: 'Historiador', discipline: 'ciencias-sociales', description: 'historia económica y análisis histórico', specialty: 'Historia económica y social' },
  { slug: 'experto-finanzas-personales', label: 'Experto en Finanzas Personales', discipline: 'finanzas', description: 'planificación financiera personal e inversiones', specialty: 'Finanzas personales e inversiones' },
]

export const MARKETS: MarketEntry[] = [
  { slug: 'chile', label: 'Chile', currency: 'CLP', currencySymbol: '$', gentilicio: 'chileno', capital: 'Santiago', flag: '🇨🇱' },
  { slug: 'mexico', label: 'México', currency: 'MXN', currencySymbol: '$', gentilicio: 'mexicano', capital: 'Ciudad de México', flag: '🇲🇽' },
  { slug: 'colombia', label: 'Colombia', currency: 'COP', currencySymbol: '$', gentilicio: 'colombiano', capital: 'Bogotá', flag: '🇨🇴' },
  { slug: 'argentina', label: 'Argentina', currency: 'ARS', currencySymbol: '$', gentilicio: 'argentino', capital: 'Buenos Aires', flag: '🇦🇷' },
  { slug: 'peru', label: 'Perú', currency: 'PEN', currencySymbol: 'S/', gentilicio: 'peruano', capital: 'Lima', flag: '🇵🇪' },
  { slug: 'uruguay', label: 'Uruguay', currency: 'UYU', currencySymbol: '$', gentilicio: 'uruguayo', capital: 'Montevideo', flag: '🇺🇾' },
  { slug: 'ecuador', label: 'Ecuador', currency: 'USD', currencySymbol: '$', gentilicio: 'ecuatoriano', capital: 'Quito', flag: '🇪🇨' },
  { slug: 'bolivia', label: 'Bolivia', currency: 'BOB', currencySymbol: 'Bs.', gentilicio: 'boliviano', capital: 'La Paz', flag: '🇧🇴' },
  { slug: 'paraguay', label: 'Paraguay', currency: 'PYG', currencySymbol: '₲', gentilicio: 'paraguayo', capital: 'Asunción', flag: '🇵🇾' },
  { slug: 'venezuela', label: 'Venezuela', currency: 'USD', currencySymbol: '$', gentilicio: 'venezolano', capital: 'Caracas', flag: '🇻🇪' },
  { slug: 'costa-rica', label: 'Costa Rica', currency: 'CRC', currencySymbol: '₡', gentilicio: 'costarricense', capital: 'San José', flag: '🇨🇷' },
  { slug: 'panama', label: 'Panamá', currency: 'USD', currencySymbol: '$', gentilicio: 'panameño', capital: 'Ciudad de Panamá', flag: '🇵🇦' },
  { slug: 'guatemala', label: 'Guatemala', currency: 'GTQ', currencySymbol: 'Q', gentilicio: 'guatemalteco', capital: 'Ciudad de Guatemala', flag: '🇬🇹' },
  { slug: 'republica-dominicana', label: 'Rep. Dominicana', currency: 'DOP', currencySymbol: '$', gentilicio: 'dominicano', capital: 'Santo Domingo', flag: '🇩🇴' },
  { slug: 'latam', label: 'América Latina', currency: 'USD', currencySymbol: '$', gentilicio: 'latinoamericano', capital: 'LATAM', flag: '🌎' },
]
