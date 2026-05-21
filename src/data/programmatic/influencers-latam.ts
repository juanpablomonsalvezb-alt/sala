// 15 nichos × 9 países = 135 páginas /influencers-[nicho]-[pais]
// Directorio de creadores y referentes públicos de cada nicho/país.
// Datos referenciales — perfiles públicos en LinkedIn/X/Instagram.

export interface Nicho {
  slug: string
  nombre: string
  nombreMayus: string
  descripcion: string
}

export const NICHOS: Nicho[] = [
  { slug: 'economia',            nombre: 'economía',            nombreMayus: 'Economía',            descripcion: 'Análisis macro, política monetaria y tipo de cambio.' },
  { slug: 'finanzas-personales', nombre: 'finanzas personales', nombreMayus: 'Finanzas Personales', descripcion: 'Ahorro, inversión y educación financiera para particulares.' },
  { slug: 'derecho-tributario',  nombre: 'derecho tributario',  nombreMayus: 'Derecho Tributario',  descripcion: 'Impuestos, reformas fiscales y planificación tributaria.' },
  { slug: 'derecho-laboral',     nombre: 'derecho laboral',     nombreMayus: 'Derecho Laboral',     descripcion: 'Contratos, indemnizaciones y relaciones laborales.' },
  { slug: 'startups',            nombre: 'startups',            nombreMayus: 'Startups',            descripcion: 'Founders, fundraising y casos LATAM.' },
  { slug: 'marketing',           nombre: 'marketing',           nombreMayus: 'Marketing',           descripcion: 'Estrategia, growth, branding y paid media.' },
  { slug: 'real-estate',         nombre: 'real estate',         nombreMayus: 'Real Estate',         descripcion: 'Inversión inmobiliaria, arriendos y desarrollo de proyectos.' },
  { slug: 'salud-mental',        nombre: 'salud mental',        nombreMayus: 'Salud Mental',        descripcion: 'Psicología clínica, divulgación y bienestar.' },
  { slug: 'nutricion',           nombre: 'nutrición',           nombreMayus: 'Nutrición',           descripcion: 'Alimentación basada en evidencia y nutrición deportiva.' },
  { slug: 'fitness',             nombre: 'fitness',             nombreMayus: 'Fitness',             descripcion: 'Entrenamiento, fuerza y hábitos físicos.' },
  { slug: 'parenting',           nombre: 'parenting',           nombreMayus: 'Parenting',           descripcion: 'Crianza, educación temprana y familia.' },
  { slug: 'educacion',           nombre: 'educación',           nombreMayus: 'Educación',           descripcion: 'Innovación educativa, docencia y aprendizaje.' },
  { slug: 'tech',                nombre: 'tech',                nombreMayus: 'Tech',                descripcion: 'Software, IA, ciberseguridad y producto.' },
  { slug: 'sostenibilidad',      nombre: 'sostenibilidad',      nombreMayus: 'Sostenibilidad',      descripcion: 'ESG, energía y cambio climático.' },
  { slug: 'lifestyle',           nombre: 'lifestyle',           nombreMayus: 'Lifestyle',           descripcion: 'Cultura, hábitos y vida profesional.' },
]

export interface PaisInf {
  slug: string
  nombre: string
  emoji: string
}

export const PAISES_INF: PaisInf[] = [
  { slug: 'chile',     nombre: 'Chile',     emoji: '🇨🇱' },
  { slug: 'argentina', nombre: 'Argentina', emoji: '🇦🇷' },
  { slug: 'mexico',    nombre: 'México',    emoji: '🇲🇽' },
  { slug: 'colombia',  nombre: 'Colombia',  emoji: '🇨🇴' },
  { slug: 'peru',      nombre: 'Perú',      emoji: '🇵🇪' },
  { slug: 'uruguay',   nombre: 'Uruguay',   emoji: '🇺🇾' },
  { slug: 'ecuador',   nombre: 'Ecuador',   emoji: '🇪🇨' },
  { slug: 'paraguay',  nombre: 'Paraguay',  emoji: '🇵🇾' },
  { slug: 'bolivia',   nombre: 'Bolivia',   emoji: '🇧🇴' },
]

export interface PerfilPublico {
  nombre: string
  handle: string
  red: 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'tiktok'
  bio: string
  url: string
}

// Generador determinístico de perfiles de muestra por (nicho, país) para SEO/directorio
// Estos son arquetipos profesionales LATAM; el destacado real viene de la tabla sala_creators
export function generarPerfilesArquetipo(nichoSlug: string, paisSlug: string): PerfilPublico[] {
  const seed = nichoSlug + paisSlug
  const archetypes: Record<string, PerfilPublico[]> = {
    'economia': [
      { nombre: 'Economista Senior Sector Bancario', handle: 'economia-' + paisSlug, red: 'linkedin', bio: 'Analista económico con foco en política monetaria y banca central.', url: 'https://www.linkedin.com/search/results/people/?keywords=economista%20' + paisSlug },
      { nombre: 'Columnista de Macroeconomía', handle: 'macro-' + paisSlug, red: 'twitter', bio: 'Columnista financiero y profesor universitario.', url: 'https://twitter.com/search?q=macroeconomia%20' + paisSlug },
      { nombre: 'Director de Estudios', handle: 'estudios-' + paisSlug, red: 'linkedin', bio: 'Investigador económico, ex banca central.', url: 'https://www.linkedin.com/search/results/people/?keywords=director%20estudios%20' + paisSlug },
    ],
    'finanzas-personales': [
      { nombre: 'Educador en Finanzas Personales', handle: 'finanzas-' + paisSlug, red: 'instagram', bio: 'Divulgador de inversión y ahorro para hogares.', url: 'https://www.instagram.com/explore/tags/finanzaspersonales' + paisSlug },
      { nombre: 'Coach Financiero', handle: 'coach-' + paisSlug, red: 'youtube', bio: 'YouTuber de planificación financiera familiar.', url: 'https://www.youtube.com/results?search_query=finanzas+personales+' + paisSlug },
      { nombre: 'Asesor de Inversiones', handle: 'asesor-' + paisSlug, red: 'linkedin', bio: 'Planificador financiero certificado.', url: 'https://www.linkedin.com/search/results/people/?keywords=asesor%20financiero%20' + paisSlug },
    ],
    'derecho-tributario': [
      { nombre: 'Abogado Tributarista', handle: 'tributario-' + paisSlug, red: 'linkedin', bio: 'Socio fiscal en firma de abogados, profesor universitario.', url: 'https://www.linkedin.com/search/results/people/?keywords=tributario%20' + paisSlug },
      { nombre: 'Asesor Fiscal', handle: 'fiscal-' + paisSlug, red: 'twitter', bio: 'Consultor de planificación tributaria internacional.', url: 'https://twitter.com/search?q=tributario%20' + paisSlug },
      { nombre: 'Profesor de Derecho Fiscal', handle: 'derecho-' + paisSlug, red: 'linkedin', bio: 'Académico, autor de manuales de impuestos.', url: 'https://www.linkedin.com/search/results/people/?keywords=derecho%20fiscal%20' + paisSlug },
    ],
    'derecho-laboral': [
      { nombre: 'Abogado Laboralista', handle: 'laboral-' + paisSlug, red: 'linkedin', bio: 'Defensa de trabajadores y litigios sindicales.', url: 'https://www.linkedin.com/search/results/people/?keywords=abogado%20laboral%20' + paisSlug },
      { nombre: 'Consultor en Relaciones Laborales', handle: 'rrll-' + paisSlug, red: 'twitter', bio: 'Asesor RRHH con foco compliance laboral.', url: 'https://twitter.com/search?q=derecho%20laboral%20' + paisSlug },
    ],
    'startups': [
      { nombre: 'Fundador Tech', handle: 'founder-' + paisSlug, red: 'twitter', bio: 'CEO de startup SaaS regional, inversionista ángel.', url: 'https://twitter.com/search?q=founder%20startup%20' + paisSlug },
      { nombre: 'Venture Capitalist', handle: 'vc-' + paisSlug, red: 'linkedin', bio: 'Partner en fondo VC regional.', url: 'https://www.linkedin.com/search/results/people/?keywords=venture%20capital%20' + paisSlug },
      { nombre: 'Periodista de Startups', handle: 'tech-news-' + paisSlug, red: 'twitter', bio: 'Cubre ecosistema startup local.', url: 'https://twitter.com/search?q=startups%20' + paisSlug },
    ],
    'marketing': [
      { nombre: 'CMO Reconocido', handle: 'cmo-' + paisSlug, red: 'linkedin', bio: 'Director de marketing de marca regional, conferencista.', url: 'https://www.linkedin.com/search/results/people/?keywords=cmo%20' + paisSlug },
      { nombre: 'Growth Marketer', handle: 'growth-' + paisSlug, red: 'twitter', bio: 'Especialista paid media y growth para SaaS.', url: 'https://twitter.com/search?q=growth%20marketing%20' + paisSlug },
    ],
    'real-estate': [
      { nombre: 'Inversionista Inmobiliario', handle: 'rentas-' + paisSlug, red: 'instagram', bio: 'Comparte estrategia de rentabilidad inmobiliaria.', url: 'https://www.instagram.com/explore/tags/inversioninmobiliaria' + paisSlug },
      { nombre: 'Broker Inmobiliario', handle: 'broker-' + paisSlug, red: 'linkedin', bio: 'Corredor con foco residencial premium.', url: 'https://www.linkedin.com/search/results/people/?keywords=broker%20inmobiliario%20' + paisSlug },
    ],
    'salud-mental': [
      { nombre: 'Psicólogo Clínico Divulgador', handle: 'psico-' + paisSlug, red: 'instagram', bio: 'Cuenta de divulgación en bienestar y terapia.', url: 'https://www.instagram.com/explore/tags/saludmental' + paisSlug },
      { nombre: 'Psiquiatra Investigador', handle: 'psiq-' + paisSlug, red: 'twitter', bio: 'Académico de psiquiatría y autor.', url: 'https://twitter.com/search?q=psiquiatria%20' + paisSlug },
    ],
    'nutricion': [
      { nombre: 'Nutricionista Deportivo', handle: 'nutri-' + paisSlug, red: 'instagram', bio: 'Foco rendimiento, evidencia y prep meal.', url: 'https://www.instagram.com/explore/tags/nutricion' + paisSlug },
      { nombre: 'Educador en Alimentación', handle: 'alimenta-' + paisSlug, red: 'tiktok', bio: 'TikTok de mitos nutricionales.', url: 'https://www.tiktok.com/search?q=nutricion+' + paisSlug },
    ],
    'fitness': [
      { nombre: 'Entrenador Personal', handle: 'fit-' + paisSlug, red: 'instagram', bio: 'Personal trainer con foco fuerza.', url: 'https://www.instagram.com/explore/tags/fitness' + paisSlug },
      { nombre: 'Coach de Crossfit', handle: 'cf-' + paisSlug, red: 'youtube', bio: 'Box owner, atleta amateur.', url: 'https://www.youtube.com/results?search_query=crossfit+' + paisSlug },
    ],
    'parenting': [
      { nombre: 'Educadora Parental', handle: 'crianza-' + paisSlug, red: 'instagram', bio: 'Crianza respetuosa basada en evidencia.', url: 'https://www.instagram.com/explore/tags/crianza' + paisSlug },
      { nombre: 'Pediatra Divulgador', handle: 'pediatra-' + paisSlug, red: 'tiktok', bio: 'Pediatra de hospital público, divulgación.', url: 'https://www.tiktok.com/search?q=pediatra+' + paisSlug },
    ],
    'educacion': [
      { nombre: 'Docente Innovador', handle: 'profe-' + paisSlug, red: 'twitter', bio: 'Profesor con foco aprendizaje activo.', url: 'https://twitter.com/search?q=educacion%20' + paisSlug },
      { nombre: 'Director de EdTech', handle: 'edtech-' + paisSlug, red: 'linkedin', bio: 'Founder edtech regional.', url: 'https://www.linkedin.com/search/results/people/?keywords=edtech%20' + paisSlug },
    ],
    'tech': [
      { nombre: 'CTO Reconocido', handle: 'cto-' + paisSlug, red: 'twitter', bio: 'CTO de scaleup, charlas técnicas.', url: 'https://twitter.com/search?q=cto%20' + paisSlug },
      { nombre: 'Ingeniera de Software Senior', handle: 'eng-' + paisSlug, red: 'linkedin', bio: 'Staff engineer en producto global.', url: 'https://www.linkedin.com/search/results/people/?keywords=software%20engineer%20' + paisSlug },
      { nombre: 'Divulgadora de IA', handle: 'ia-' + paisSlug, red: 'twitter', bio: 'Investigadora y comunicadora de IA aplicada.', url: 'https://twitter.com/search?q=inteligencia%20artificial%20' + paisSlug },
    ],
    'sostenibilidad': [
      { nombre: 'Consultor ESG', handle: 'esg-' + paisSlug, red: 'linkedin', bio: 'Consultor en reporting ESG corporativo.', url: 'https://www.linkedin.com/search/results/people/?keywords=esg%20' + paisSlug },
      { nombre: 'Investigadora Climática', handle: 'clima-' + paisSlug, red: 'twitter', bio: 'Académica en cambio climático y política pública.', url: 'https://twitter.com/search?q=cambio%20climatico%20' + paisSlug },
    ],
    'lifestyle': [
      { nombre: 'Periodista Cultural', handle: 'cultura-' + paisSlug, red: 'twitter', bio: 'Columnista de cultura y tendencias urbanas.', url: 'https://twitter.com/search?q=cultura%20' + paisSlug },
      { nombre: 'Diseñador de Contenido', handle: 'lifestyle-' + paisSlug, red: 'instagram', bio: 'Creador con foco en diseño y hábitos.', url: 'https://www.instagram.com/explore/tags/lifestyle' + paisSlug },
    ],
  }

  void seed
  const lista = archetypes[nichoSlug] ?? []
  return lista
}
