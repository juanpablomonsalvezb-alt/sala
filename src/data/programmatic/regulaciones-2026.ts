// 12 industrias × 9 países = 108 páginas /regulaciones/[industria]/[pais]/2026
// Marco regulatorio real referenciado a normativa pública 2024–2026.
// IMPORTANTE: no es asesoría legal, es un resumen periodístico para SEO y orientación.

export interface Industria {
  slug: string
  nombre: string
  nombreMayus: string
  descripcion: string
}

export const INDUSTRIAS: Industria[] = [
  { slug: 'legal-tributaria',   nombre: 'legal y tributaria', nombreMayus: 'Legal y Tributaria',   descripcion: 'Cambios fiscales, factura electrónica, reformas tributarias.' },
  { slug: 'salud',              nombre: 'salud',              nombreMayus: 'Salud',                descripcion: 'Habilitación profesional, telemedicina y dispositivos médicos.' },
  { slug: 'fintech',            nombre: 'fintech',            nombreMayus: 'Fintech',              descripcion: 'Open banking, criptoactivos, licencias de pago y crowdfunding.' },
  { slug: 'ed-tech',            nombre: 'ed-tech',            nombreMayus: 'Ed-Tech',              descripcion: 'Educación digital, certificaciones y datos de menores.' },
  { slug: 'real-estate',        nombre: 'real estate',        nombreMayus: 'Real Estate',          descripcion: 'Compraventa, arriendos turísticos, propiedad horizontal.' },
  { slug: 'comercio-digital',   nombre: 'comercio digital',   nombreMayus: 'Comercio Digital',     descripcion: 'E-commerce transfronterizo, defensa del consumidor digital, IVA digital.' },
  { slug: 'marketing-publicidad', nombre: 'marketing y publicidad', nombreMayus: 'Marketing y Publicidad', descripcion: 'Influencers, datos personales y publicidad engañosa.' },
  { slug: 'consultoria',        nombre: 'consultoría',        nombreMayus: 'Consultoría',          descripcion: 'Contratos profesionales, retenciones y honorarios cross-border.' },
  { slug: 'alimentos',          nombre: 'alimentos',          nombreMayus: 'Alimentos',            descripcion: 'Etiquetado, rotulado y normativas sanitarias 2026.' },
  { slug: 'transporte',         nombre: 'transporte',         nombreMayus: 'Transporte',           descripcion: 'Apps de movilidad, transporte de carga y emisiones.' },
  { slug: 'energia',            nombre: 'energía',            nombreMayus: 'Energía',              descripcion: 'Generación distribuida, almacenamiento y tarifas reguladas.' },
  { slug: 'agricultura',        nombre: 'agricultura',        nombreMayus: 'Agricultura',          descripcion: 'Etiquetado, exportación y normas agroambientales.' },
]

export interface PaisRegSimple {
  slug: string
  nombre: string
  emoji: string
}

export const PAISES_REG: PaisRegSimple[] = [
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

// Marco legal por (industria, país) — máx 5 normas reales referenciables
export interface Norma {
  nombre: string
  ano: string
  resumen: string
}

interface RegEntry {
  contexto: string
  normas: Norma[]
  impacto: string[]
}

type RegMap = Record<string, Record<string, RegEntry>>

export const REGULACIONES: RegMap = {
  // Compactamos por país una entrada que sirve a varias industrias con ligeros ajustes
}

// Plantilla por país para industrias generales (válida para SEO + correcta para profesionales)
export const REG_PAIS_BASE: Record<string, { contextoBase: string; normasGenerales: Norma[] }> = {
  chile: {
    contextoBase: 'Chile mantiene en 2026 un marco normativo en transición tras la reforma tributaria de Boric y las nuevas exigencias del SII en facturación electrónica.',
    normasGenerales: [
      { nombre: 'Ley 21.713 (Cumplimiento Tributario)', ano: '2024', resumen: 'Refuerza facultades del SII, modifica norma general antielusiva y establece nuevos deberes de información.' },
      { nombre: 'Ley 21.719 (Protección Datos Personales)', ano: '2024', resumen: 'Crea la Agencia de Protección de Datos. Multas de hasta 20.000 UTM. Entrada plena en 2026.' },
      { nombre: 'Ley 21.453 (Plataformas Digitales)', ano: '2022', resumen: 'Marco laboral para trabajadores de apps. Genera obligaciones de cotización.' },
    ],
  },
  argentina: {
    contextoBase: 'Argentina vive un proceso de desregulación profunda con el DNU 70/2023 y la Ley Bases (27.742), que reescriben buena parte del marco económico y laboral.',
    normasGenerales: [
      { nombre: 'Ley 27.742 (Bases y Puntos de Partida)', ano: '2024', resumen: 'Ley Bases. Reforma del Estado, régimen de inversiones (RIGI) y derogación de regulaciones sectoriales.' },
      { nombre: 'DNU 70/2023 (Desregulación)', ano: '2023', resumen: 'Decreto de Necesidad y Urgencia que desregula alquileres, prepagas, aerocomercial y más.' },
      { nombre: 'Régimen RIGI', ano: '2024', resumen: 'Régimen de Incentivo a Grandes Inversiones (mínimo USD 200M) con beneficios fiscales por 30 años.' },
    ],
  },
  mexico: {
    contextoBase: 'México opera bajo el Plan México de Sheinbaum, con foco en nearshoring, transición energética y un nuevo paquete económico 2026.',
    normasGenerales: [
      { nombre: 'Paquete Económico 2026', ano: '2025', resumen: 'Sin nuevos impuestos, pero refuerzo de fiscalización SAT y aumento de IEPS en bebidas saborizadas y tabaco.' },
      { nombre: 'Ley Federal de Protección a la Propiedad Industrial (reforma)', ano: '2025', resumen: 'Refuerzo de combate a piratería digital y plataformas.' },
      { nombre: 'NOM-035-STPS', ano: '2019/vigente', resumen: 'Obligación de identificar y prevenir factores de riesgo psicosocial en centros de trabajo.' },
    ],
  },
  colombia: {
    contextoBase: 'Colombia avanza la reforma tributaria de Petro junto a normas de inteligencia artificial y un nuevo régimen para plataformas digitales.',
    normasGenerales: [
      { nombre: 'Ley 2277 de 2022 (Reforma Tributaria)', ano: '2022', resumen: 'Sobretasa al sector financiero, impuesto saludable y nuevas reglas para personas naturales.' },
      { nombre: 'Proyecto de Ley IA', ano: '2025', resumen: 'Marco regulatorio para sistemas de inteligencia artificial, en debate en el Congreso.' },
      { nombre: 'Régimen Simple de Tributación', ano: 'vigente', resumen: 'Régimen unificado para personas naturales y jurídicas con ingresos hasta 100.000 UVT.' },
    ],
  },
  peru: {
    contextoBase: 'Perú mantiene un marco institucional volátil, con reformas tributarias acotadas y empuje en cumplimiento OCDE (BEPS, transparencia).',
    normasGenerales: [
      { nombre: 'Decreto Legislativo 1623', ano: '2024', resumen: 'Modifica el Impuesto a la Renta para servicios digitales no domiciliados (IGV digital).' },
      { nombre: 'Ley 31814 (Promoción IA)', ano: '2023', resumen: 'Marco para uso ético de inteligencia artificial en el Estado y privados.' },
      { nombre: 'Reglamento Comprobantes Electrónicos', ano: '2024', resumen: 'Universalización de la factura electrónica SUNAT en todos los regímenes.' },
    ],
  },
  uruguay: {
    contextoBase: 'Uruguay consolida su rol como hub regional con marco estable, certificaciones de servicios globales y nueva ley de IA en discusión.',
    normasGenerales: [
      { nombre: 'Ley 19.973 (Promoción Servicios Globales)', ano: 'vigente', resumen: 'Beneficios fiscales para empresas de servicios globales en zonas francas.' },
      { nombre: 'Ley 18.331 (Datos Personales)', ano: 'vigente', resumen: 'Régimen GDPR-like supervisado por la URCDP.' },
      { nombre: 'Decreto IRPF 2026', ano: '2025', resumen: 'Ajustes a franjas del Impuesto a la Renta de Personas Físicas.' },
    ],
  },
  ecuador: {
    contextoBase: 'Ecuador, bajo Noboa, impulsa la dolarización digital y un paquete de seguridad económica con cambios al SRI.',
    normasGenerales: [
      { nombre: 'Ley Orgánica de Eficiencia Económica', ano: '2024', resumen: 'Aumento temporal del IVA a 15% y nuevos incentivos a la inversión.' },
      { nombre: 'Reglamento RIMPE', ano: 'vigente', resumen: 'Régimen Simplificado para Emprendedores y Negocios Populares.' },
      { nombre: 'Ley de Protección de Datos Personales', ano: '2021', resumen: 'Vigente con Autoridad de Protección de Datos en operación.' },
    ],
  },
  paraguay: {
    contextoBase: 'Paraguay mantiene su estatus de baja presión tributaria con apertura a inversión extranjera y nuevo paquete de zonas francas.',
    normasGenerales: [
      { nombre: 'Ley 6380 (Modernización Tributaria)', ano: 'vigente', resumen: 'Marco unificado de IRE, IRP e IVA con tasa general 10%.' },
      { nombre: 'Ley 7079 (Maquila)', ano: '2023', resumen: 'Régimen de maquila exportadora con beneficios fiscales.' },
      { nombre: 'Resolución SET 5/2024', ano: '2024', resumen: 'Obligación facturación electrónica generalizada.' },
    ],
  },
  bolivia: {
    contextoBase: 'Bolivia transita un escenario de tensión cambiaria con paquete de medidas económicas y reformas tributarias acotadas.',
    normasGenerales: [
      { nombre: 'Ley 1448 (Modificaciones SIN)', ano: '2022', resumen: 'Actualiza el sistema de facturación electrónica obligatorio.' },
      { nombre: 'Decreto 4732 (Cobro Electrónico)', ano: '2022', resumen: 'Régimen de medios de pago electrónicos y obligaciones tributarias.' },
      { nombre: 'Ley 393 (Servicios Financieros)', ano: 'vigente', resumen: 'Marco para servicios financieros y cuotas de cartera.' },
    ],
  },
}
