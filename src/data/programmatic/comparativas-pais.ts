// 30 profesiones y 9 países para páginas /comparar-[profesion]/[pais-a]-vs-[pais-b]
// Genera C(9,2) = 36 pares × 30 profesiones = 1080 páginas
// Costo de vida y carga tributaria 2026 — referencia Numbeo / KPMG / Trading Economics

export interface PaisComp {
  slug: string
  nombre: string
  paisEmoji: string
  moneda: string
  simbolo: string
  // Salario mensual promedio profesional cualificado en USD
  salarioMedioUsd: number
  // Costo de vida mensual estimado profesional clase media en USD (vivienda + servicios + comida)
  costoVidaUsd: number
  // Carga tributaria efectiva % sobre ingresos profesionales medios
  impuestoEfectivo: number
  // Regulación de trabajo independiente (texto corto)
  regulacionTrabajo: string
}

export const PAISES_COMP: PaisComp[] = [
  { slug: 'chile',     nombre: 'Chile',     paisEmoji: '🇨🇱', moneda: 'CLP', simbolo: '$',  salarioMedioUsd: 1850, costoVidaUsd: 1100, impuestoEfectivo: 18, regulacionTrabajo: 'Boleta de honorarios + 17% retención mensual' },
  { slug: 'argentina', nombre: 'Argentina', paisEmoji: '🇦🇷', moneda: 'ARS', simbolo: '$',  salarioMedioUsd: 1150, costoVidaUsd: 850,  impuestoEfectivo: 27, regulacionTrabajo: 'Monotributo o autónomo según escala' },
  { slug: 'mexico',    nombre: 'México',    paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$',  salarioMedioUsd: 1450, costoVidaUsd: 900,  impuestoEfectivo: 22, regulacionTrabajo: 'RESICO / actividad profesional con CFDI' },
  { slug: 'colombia',  nombre: 'Colombia',  paisEmoji: '🇨🇴', moneda: 'COP', simbolo: '$',  salarioMedioUsd: 1100, costoVidaUsd: 800,  impuestoEfectivo: 19, regulacionTrabajo: 'Régimen simple + facturación electrónica DIAN' },
  { slug: 'peru',      nombre: 'Perú',      paisEmoji: '🇵🇪', moneda: 'PEN', simbolo: 'S/', salarioMedioUsd: 1200, costoVidaUsd: 780,  impuestoEfectivo: 8,  regulacionTrabajo: 'Recibo por honorarios 4ta categoría — 8% retención' },
  { slug: 'uruguay',   nombre: 'Uruguay',   paisEmoji: '🇺🇾', moneda: 'UYU', simbolo: '$',  salarioMedioUsd: 1900, costoVidaUsd: 1200, impuestoEfectivo: 21, regulacionTrabajo: 'Monotributo BPS o IRPF' },
  { slug: 'ecuador',   nombre: 'Ecuador',   paisEmoji: '🇪🇨', moneda: 'USD', simbolo: '$',  salarioMedioUsd: 1300, costoVidaUsd: 800,  impuestoEfectivo: 15, regulacionTrabajo: 'RIMPE o régimen general SRI' },
  { slug: 'bolivia',   nombre: 'Bolivia',   paisEmoji: '🇧🇴', moneda: 'BOB', simbolo: 'Bs', salarioMedioUsd: 950,  costoVidaUsd: 650,  impuestoEfectivo: 13, regulacionTrabajo: 'NIT + facturación electrónica' },
  { slug: 'paraguay',  nombre: 'Paraguay',  paisEmoji: '🇵🇾', moneda: 'PYG', simbolo: '₲',  salarioMedioUsd: 1050, costoVidaUsd: 700,  impuestoEfectivo: 10, regulacionTrabajo: 'IRP-RSP régimen profesional simplificado' },
  { slug: 'panama',           nombre: 'Panamá',              paisEmoji: '🇵🇦', moneda: 'USD', simbolo: '$',  salarioMedioUsd: 1600, costoVidaUsd: 950,  impuestoEfectivo: 15, regulacionTrabajo: 'Aviso de operaciones + RUC, sin IVA sobre servicios profesionales' },
  { slug: 'costa-rica',       nombre: 'Costa Rica',          paisEmoji: '🇨🇷', moneda: 'CRC', simbolo: '₡', salarioMedioUsd: 1400, costoVidaUsd: 900,  impuestoEfectivo: 17, regulacionTrabajo: 'Régimen tradicional o simplificado Hacienda' },
  { slug: 'republica-dominicana', nombre: 'República Dominicana', paisEmoji: '🇩🇴', moneda: 'DOP', simbolo: 'RD$', salarioMedioUsd: 1100, costoVidaUsd: 750, impuestoEfectivo: 14, regulacionTrabajo: 'Régimen PST simplificado DGII' },
]

// Factor por profesión sobre salario medio nacional
// 1.0 = igual al promedio nacional, 1.5 = 50% más
export const FACTOR_PROFESION: Record<string, { nombre: string; nombreMayus: string; area: string; factor: number }> = {
  'economista':            { nombre: 'economista', nombreMayus: 'Economista', area: 'Economía', factor: 1.7 },
  'abogado':               { nombre: 'abogado', nombreMayus: 'Abogado', area: 'Derecho', factor: 1.6 },
  'contador':              { nombre: 'contador', nombreMayus: 'Contador', area: 'Finanzas', factor: 1.3 },
  'medico':                { nombre: 'médico', nombreMayus: 'Médico', area: 'Salud', factor: 2.2 },
  'arquitecto':            { nombre: 'arquitecto', nombreMayus: 'Arquitecto', area: 'Arquitectura', factor: 1.4 },
  'ingeniero-civil':       { nombre: 'ingeniero civil', nombreMayus: 'Ingeniero Civil', area: 'Ingeniería', factor: 1.7 },
  'ingeniero-industrial':  { nombre: 'ingeniero industrial', nombreMayus: 'Ingeniero Industrial', area: 'Ingeniería', factor: 1.6 },
  'ingeniero-informatico': { nombre: 'ingeniero informático', nombreMayus: 'Ingeniero Informático', area: 'Tecnología', factor: 2.0 },
  'desarrollador':         { nombre: 'desarrollador', nombreMayus: 'Desarrollador', area: 'Tecnología', factor: 1.9 },
  'dentista':              { nombre: 'dentista', nombreMayus: 'Dentista', area: 'Salud', factor: 1.8 },
  'psicologo':             { nombre: 'psicólogo', nombreMayus: 'Psicólogo', area: 'Salud Mental', factor: 1.2 },
  'nutricionista':         { nombre: 'nutricionista', nombreMayus: 'Nutricionista', area: 'Salud', factor: 1.05 },
  'kinesiologo':           { nombre: 'kinesiólogo', nombreMayus: 'Kinesiólogo', area: 'Salud', factor: 1.0 },
  'fonoaudiologo':         { nombre: 'fonoaudiólogo', nombreMayus: 'Fonoaudiólogo', area: 'Salud', factor: 1.0 },
  'consultor-seo':         { nombre: 'consultor SEO', nombreMayus: 'Consultor SEO', area: 'Marketing Digital', factor: 1.5 },
  'copywriter':            { nombre: 'copywriter', nombreMayus: 'Copywriter', area: 'Marketing', factor: 1.2 },
  'disenador-ux':          { nombre: 'diseñador UX', nombreMayus: 'Diseñador UX', area: 'Diseño', factor: 1.5 },
  'coach-ejecutivo':       { nombre: 'coach ejecutivo', nombreMayus: 'Coach Ejecutivo', area: 'Liderazgo', factor: 1.8 },
  'marketer-digital':      { nombre: 'marketer digital', nombreMayus: 'Marketer Digital', area: 'Marketing Digital', factor: 1.4 },
  'traductor':             { nombre: 'traductor', nombreMayus: 'Traductor', area: 'Idiomas', factor: 0.9 },
  'periodista':            { nombre: 'periodista', nombreMayus: 'Periodista', area: 'Medios', factor: 0.95 },
  'fotografo':             { nombre: 'fotógrafo', nombreMayus: 'Fotógrafo', area: 'Creativo', factor: 1.0 },
  'profesor-universitario':{ nombre: 'profesor universitario', nombreMayus: 'Profesor Universitario', area: 'Educación', factor: 1.3 },
  'financial-advisor':     { nombre: 'asesor financiero', nombreMayus: 'Asesor Financiero', area: 'Finanzas', factor: 1.9 },
  'agente-inmobiliario':   { nombre: 'agente inmobiliario', nombreMayus: 'Agente Inmobiliario', area: 'Bienes Raíces', factor: 1.3 },
  'consultor-negocios':    { nombre: 'consultor de negocios', nombreMayus: 'Consultor de Negocios', area: 'Estrategia', factor: 1.8 },
  'product-manager':       { nombre: 'product manager', nombreMayus: 'Product Manager', area: 'Producto', factor: 2.0 },
  'data-scientist':        { nombre: 'data scientist', nombreMayus: 'Data Scientist', area: 'Tecnología', factor: 2.1 },
  'auditor':               { nombre: 'auditor', nombreMayus: 'Auditor', area: 'Finanzas', factor: 1.4 },
  'farmaceutico':          { nombre: 'farmacéutico', nombreMayus: 'Farmacéutico', area: 'Salud', factor: 1.3 },
  'programador':           { nombre: 'programador', nombreMayus: 'Programador', area: 'Tecnología', factor: 1.8 },
  'desarrollador-web':     { nombre: 'desarrollador web', nombreMayus: 'Desarrollador Web', area: 'Tecnología', factor: 1.7 },
  'desarrollador-mobile':  { nombre: 'desarrollador mobile', nombreMayus: 'Desarrollador Mobile', area: 'Tecnología', factor: 1.9 },
  'data-engineer':         { nombre: 'data engineer', nombreMayus: 'Data Engineer', area: 'Tecnología', factor: 2.0 },
  'ux-designer':           { nombre: 'diseñador UX', nombreMayus: 'Diseñador UX', area: 'Diseño', factor: 1.5 },
  'ui-designer':           { nombre: 'diseñador UI', nombreMayus: 'Diseñador UI', area: 'Diseño', factor: 1.4 },
  'scrum-master':          { nombre: 'scrum master', nombreMayus: 'Scrum Master', area: 'Gestión', factor: 1.7 },
  'community-manager':     { nombre: 'community manager', nombreMayus: 'Community Manager', area: 'Marketing Digital', factor: 0.9 },
  'publicista':            { nombre: 'publicista', nombreMayus: 'Publicista', area: 'Publicidad', factor: 1.2 },
  'comunicador':           { nombre: 'comunicador', nombreMayus: 'Comunicador', area: 'Comunicación', factor: 1.1 },
  'investigador':          { nombre: 'investigador', nombreMayus: 'Investigador', area: 'Ciencia', factor: 1.3 },
  'academico':             { nombre: 'académico', nombreMayus: 'Académico', area: 'Educación', factor: 1.2 },
  'ingeniero-mecanico':    { nombre: 'ingeniero mecánico', nombreMayus: 'Ingeniero Mecánico', area: 'Ingeniería', factor: 1.6 },
  'trader':                { nombre: 'trader', nombreMayus: 'Trader', area: 'Finanzas', factor: 2.3 },
  'analista-financiero':   { nombre: 'analista financiero', nombreMayus: 'Analista Financiero', area: 'Finanzas', factor: 1.7 },
  'actuario':              { nombre: 'actuario', nombreMayus: 'Actuario', area: 'Seguros', factor: 1.9 },
  'biologo':               { nombre: 'biólogo', nombreMayus: 'Biólogo', area: 'Ciencia', factor: 1.0 },
  'quimico':               { nombre: 'químico', nombreMayus: 'Químico', area: 'Ciencia', factor: 1.1 },
  'veterinario':           { nombre: 'veterinario', nombreMayus: 'Veterinario', area: 'Salud Animal', factor: 1.2 },
  'fisioterapeuta':        { nombre: 'fisioterapeuta', nombreMayus: 'Fisioterapeuta', area: 'Salud', factor: 1.0 },
}

export const PROFESIONES_COMP_SLUGS = Object.keys(FACTOR_PROFESION)
