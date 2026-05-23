// Datos de competidores para páginas /vs/[slug]
// Optimizado para AEO/GEO: queries tipo "nebbuler vs substack", "alternativa a patreon en latam"

export type Competitor = {
  slug: string
  name: string
  tagline: string
  // Comisión variable sobre ingresos del creador (%)
  commission: string
  // Procesador de pagos (fee aparte)
  processingFee: string
  // Acepta pagos en moneda local LATAM
  localCurrency: boolean
  // Idioma principal
  language: string
  // Mercado objetivo
  market: string
  // Año de fundación
  founded: string
  // Para qué es bueno
  bestFor: string
  // Limitaciones para LATAM
  latamLimitations: string[]
  // Por qué migrar a Nebbuler
  migrationReason: string
  // Pricing breakeven (con cuántos suscriptores Nebbuler es más barato)
  breakeven: string
  // Keywords objetivo
  keywords: string[]
}

export const COMPETITORS: Competitor[] = [
  {
    slug: 'substack',
    name: 'Substack',
    tagline: 'Plataforma de newsletters de pago en inglés',
    commission: '10%',
    processingFee: '+2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés (sin localización LATAM)',
    market: 'EE.UU., global anglosajón',
    founded: '2017',
    bestFor: 'Creadores anglosajones con audiencia en USD/EUR/GBP que escriben newsletters largos',
    latamLimitations: [
      'Solo acepta pagos en USD, EUR, GBP — el suscriptor latinoamericano paga conversión de moneda + cargo internacional de su banco',
      'Comisión variable del 10% sobre los ingresos del creador, sin tope',
      'Sin soporte en español, sin atención al cliente en horario LATAM',
      'Diseño y UX optimizado para audiencia anglosajona',
      'Stripe no opera en varios países de LATAM (Venezuela, Bolivia, Cuba, etc.)',
    ],
    migrationReason:
      'Nebbuler acepta pagos directos en pesos colombianos, mexicanos, argentinos y soles peruanos, sin conversión a dólares. La comisión es fija mensual, no variable: cuanto más crece el creador, mayor es el ahorro respecto a Substack.',
    breakeven: 'A partir de 4 suscriptores pagos de $10.000 CLP/mes, Nebbuler ya es más barato que Substack',
    keywords: [
      'nebbuler vs substack',
      'substack en español latam',
      'alternativa substack español',
      'mejor que substack para latinoamerica',
      'substack latam pesos',
    ],
  },
  {
    slug: 'patreon',
    name: 'Patreon',
    tagline: 'Plataforma global de membresías para creadores',
    commission: '5%-12% según el plan',
    processingFee: '+2.9% a 5% (procesador)',
    localCurrency: false,
    language: 'Inglés / español parcial',
    market: 'Global, sesgo anglosajón',
    founded: '2013',
    bestFor: 'YouTubers y podcasters con audiencia global multi-tier (niveles de recompensas)',
    latamLimitations: [
      'Cobros en USD principalmente — el suscriptor latinoamericano paga conversión + recargo internacional',
      'Comisión escalonada del 5% (Lite), 8% (Pro) o 12% (Premium) sobre los ingresos',
      'Retiros en LATAM con altas comisiones bancarias (a veces 3-5% adicional)',
      'Soporte solo en inglés',
      'Diseñado para creadores audiovisuales, no para profesionales que cobran por análisis escrito',
    ],
    migrationReason:
      'Nebbuler cobra una tarifa fija mensual — la comisión variable es 0%. Para profesionales latinoamericanos que cobran por su conocimiento escrito (análisis, opinión, guías), la estructura es óptima y los pagos llegan en moneda local.',
    breakeven: 'Con 10 suscriptores a $5 USD/mes, Patreon te cobra $5-12/mes en comisiones; Nebbuler te cobra una tarifa fija que ya es competitiva',
    keywords: [
      'nebbuler vs patreon',
      'alternativa a patreon latam',
      'patreon en español pesos',
      'mejor que patreon para creadores',
      'patreon comisiones',
    ],
  },
  {
    slug: 'beehiiv',
    name: 'Beehiiv',
    tagline: 'Plataforma moderna de newsletters con foco en growth',
    commission: 'Plan gratuito hasta 2.500 subs; planes pagos desde $39 USD/mes',
    processingFee: '2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés',
    market: 'EE.UU., creadores anglosajones',
    founded: '2021',
    bestFor: 'Newsletters en inglés con foco en growth/referrals (modelo Morning Brew)',
    latamLimitations: [
      'Cobros únicamente en USD vía Stripe — no apto para audiencias LATAM',
      'Plan pago en dólares estadounidenses (a tipo de cambio LATAM resulta caro)',
      'Interfaz y soporte solo en inglés',
      'Funcionalidades de monetización orientadas a sponsorship en USD',
    ],
    migrationReason:
      'Nebbuler está localizado para LATAM en idioma, moneda y experiencia de usuario. Beehiiv es una herramienta excelente para creadores anglosajones, pero su modelo USD-first castiga al creador y al suscriptor latinoamericano.',
    breakeven: 'El plan pago de Beehiiv ya cuesta $39 USD/mes (~$35.000 CLP) sin ninguna funcionalidad de cobro local',
    keywords: [
      'nebbuler vs beehiiv',
      'beehiiv en español',
      'alternativa beehiiv latam',
      'beehiiv pesos pagos',
    ],
  },
  {
    slug: 'gumroad',
    name: 'Gumroad',
    tagline: 'Marketplace de productos digitales',
    commission: '10% + processing fees',
    processingFee: '+3.5% + $0.30 USD',
    localCurrency: false,
    language: 'Inglés',
    market: 'Global, e-commerce digital',
    founded: '2011',
    bestFor: 'Venta de productos digitales únicos (ebooks, plantillas, cursos one-time)',
    latamLimitations: [
      'Comisión total puede llegar al 13-15% incluyendo procesamiento',
      'Cobros en USD, no en moneda local LATAM',
      'No está pensado para suscripciones recurrentes a contenido editorial',
      'Sin soporte en español',
    ],
    migrationReason:
      'Gumroad es un marketplace para ventas únicas. Nebbuler está optimizado para membresías recurrentes a contenido editorial — el modelo natural de un profesional que comparte su análisis mes a mes.',
    breakeven: 'Para suscripciones recurrentes, la diferencia se acumula cada mes: con 50 subs a $5 USD, Gumroad cobra ~$30 USD; Nebbuler cobra una tarifa fija',
    keywords: [
      'nebbuler vs gumroad',
      'alternativa gumroad latam',
      'gumroad comisiones español',
    ],
  },
  {
    slug: 'ko-fi',
    name: 'Ko-fi',
    tagline: 'Plataforma de donaciones y membresías',
    commission: '0% en donaciones (plan free); 5% en Gold',
    processingFee: '+2.9% + $0.30 USD (Stripe/PayPal)',
    localCurrency: false,
    language: 'Inglés',
    market: 'Global, artistas y creadores casual',
    founded: '2012',
    bestFor: 'Recibir propinas/donaciones puntuales, no para construir un negocio recurrente',
    latamLimitations: [
      'Cobros en USD vía Stripe/PayPal — PayPal cobra adicional al retirar en LATAM',
      'Las funcionalidades editoriales son básicas',
      'No tiene un sistema robusto de membresías de contenido profesional',
    ],
    migrationReason:
      'Ko-fi sirve para donaciones simbólicas. Nebbuler está diseñado para que profesionales construyan una membresía real con su audiencia, con herramientas editoriales y pagos directos.',
    breakeven: 'Para más de 20 suscriptores recurrentes, Nebbuler resulta más predecible y profesional que Ko-fi Gold',
    keywords: [
      'nebbuler vs ko-fi',
      'alternativa ko-fi español',
      'ko-fi latam pesos',
    ],
  },
  {
    slug: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    tagline: 'Plataforma de propinas y suscripciones casuales',
    commission: '5% sobre suscripciones',
    processingFee: '+2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés',
    market: 'Global anglosajón',
    founded: '2018',
    bestFor: 'Creadores que reciben donaciones esporádicas en dólares',
    latamLimitations: [
      'Solo USD vía Stripe',
      'Sin localización LATAM',
      'Modelo orientado a propinas, no a membresías profesionales',
    ],
    migrationReason:
      'Nebbuler convierte el modelo "propina" en una membresía real con contenido exclusivo, cobros recurrentes en moneda local y herramientas editoriales serias.',
    breakeven: 'En cualquier escala superior a 15 suscriptores recurrentes, Nebbuler genera más ingresos netos',
    keywords: [
      'nebbuler vs buymeacoffee',
      'alternativa buy me a coffee español',
      'buymeacoffee latam',
    ],
  },
  {
    slug: 'memberful',
    name: 'Memberful',
    tagline: 'Sistema de membresías white-label',
    commission: '4.9% (Starter) o 0% (Pro $100 USD/mes)',
    processingFee: '+2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés',
    market: 'EE.UU., publishers profesionales',
    founded: '2013',
    bestFor: 'Publishers con sitio propio que quieren agregar paywall',
    latamLimitations: [
      'Plan Pro cuesta $100 USD/mes (~$95.000 CLP)',
      'Stripe-only, USD-first',
      'Requiere tener un sitio propio y configurar todo manualmente',
    ],
    migrationReason:
      'Nebbuler es una plataforma completa: el creador no necesita ni sitio propio ni configuración técnica. Todo funciona en moneda local desde el primer día.',
    breakeven: 'El plan Starter de Memberful ya cobra 4.9% + Stripe; Nebbuler ofrece menos comisión total',
    keywords: [
      'nebbuler vs memberful',
      'alternativa memberful latam español',
    ],
  },
  {
    slug: 'hotmart',
    name: 'Hotmart',
    tagline: 'Plataforma de cursos digitales y productos de creadores, líder en Brasil y LATAM',
    commission: '9.99% + comisión de procesamiento por transacción',
    processingFee: '+1.49%–3.5% según método de pago',
    localCurrency: true,
    language: 'Portugués (español como segundo idioma)',
    market: 'Brasil, LATAM — fuerte en cursos masivos y lanzamientos',
    founded: '2011',
    bestFor: 'Lanzamiento de cursos en video y afiliados para audiencias masivas de habla portuguesa y española',
    latamLimitations: [
      'Comisión de casi 10% sobre cada venta — sin importar cuánto vendas',
      'Orientada a cursos y lanzamientos masivos, no a membresías editoriales ni sesiones profesionales',
      'Interfaz y soporte diseñados desde Brasil para el mercado de cursos online, no para profesionales independientes',
      'Estructura pensada para infoproductos y afiliados, no para el experto que quiere cobrar mensualmente por su conocimiento editorial',
      'El modelo de afiliados puede traer competencia interna sobre tus mismos productos',
    ],
    migrationReason:
      'Hotmart está diseñada para vender cursos masivos y lanzamientos. Nebbuler está diseñada para el profesional independiente que cobra mensualmente por su análisis, opinión o consultoría — sin comisión variable, sin modelo de afiliados, sin la complejidad de los lanzamientos.',
    breakeven: 'Con 10 membresías a $30.000 CLP/mes, Hotmart cobra ~$30.000 CLP en comisiones por ciclo; Nebbuler cobra una tarifa fija mensual sin importar cuánto vendas',
    keywords: [
      'nebbuler vs hotmart',
      'alternativa hotmart latam',
      'hotmart comisiones',
      'mejor que hotmart para profesionales',
      'hotmart para consultores',
      'plataforma cobrar conocimiento sin comision',
    ],
  },
  {
    slug: 'kajabi',
    name: 'Kajabi',
    tagline: 'Plataforma premium todo-en-uno para coaches y creadores de cursos',
    commission: '0%',
    processingFee: '+2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés',
    market: 'EE.UU., coaches y formadores de habla inglesa',
    founded: '2010',
    bestFor: 'Coaches y consultores anglosajones con ingresos en USD que ya tienen audiencia',
    latamLimitations: [
      'Precio mínimo: $149 USD/mes (~$141.000 CLP) — sin período de prueba real con funcionalidades completas',
      'Stripe-only: no acepta pagos en moneda local LATAM',
      'Toda la plataforma en inglés — sin localización para creadores hispanohablantes',
      'Los suscriptores latinoamericanos pagan en USD con recargo internacional',
      'El costo mensual para un creador LATAM en etapa temprana es prohibitivo',
    ],
    migrationReason:
      'Kajabi es excelente para coaches anglosajones con ingresos consolidados en USD. Para profesionales hispanohablantes en etapa de crecimiento, la barrera de $149 USD/mes y la ausencia de pagos locales hace que Nebbuler sea la alternativa lógica: tarifa fija mucho menor, 0% comisión y pagos en pesos.',
    breakeven: 'Kajabi cuesta $149 USD/mes mínimo (~$141.000 CLP) — Nebbuler cuesta US$19/mes con las mismas funcionalidades editoriales core',
    keywords: [
      'nebbuler vs kajabi',
      'alternativa kajabi español',
      'kajabi latam precio',
      'kajabi en español pesos',
      'alternativa kajabi barata latam',
    ],
  },
  {
    slug: 'teachable',
    name: 'Teachable',
    tagline: 'Plataforma de cursos online para creadores',
    commission: '5% (Basic) / 0% (Pro $159 USD/mes)',
    processingFee: '+2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés',
    market: 'EE.UU., educadores y creadores de cursos',
    founded: '2014',
    bestFor: 'Creadores de cursos en video con audiencia anglosajona',
    latamLimitations: [
      'Plan Basic cobra 5% de comisión + Stripe; para eliminarla se necesita el plan Pro a $159 USD/mes',
      'Solo acepta pagos en USD — barrera directa para estudiantes latinoamericanos',
      'Sin localización al español; interfaz y soporte en inglés',
      'Orientada a cursos pregrabados, no a membresías de contenido editorial recurrente',
    ],
    migrationReason:
      'Teachable es para cursos en video. Nebbuler es para el profesional que publica su análisis, criterio y conocimiento de forma recurrente — y cobra por ello en pesos, sin comisión, sin límite de suscriptores.',
    breakeven: 'En el plan Basic, con 20 ventas de $30 USD/mes, Teachable te cobra $30 USD en comisiones; Nebbuler cobra tarifa fija mensual independiente del volumen',
    keywords: [
      'nebbuler vs teachable',
      'alternativa teachable español latam',
      'teachable en pesos',
      'teachable comisiones latam',
    ],
  },
  {
    slug: 'ghost',
    name: 'Ghost',
    tagline: 'CMS open-source para publicaciones independientes con membresías',
    commission: '0% (pero requiere hosting propio o Ghost Pro)',
    processingFee: '+2.9% + $0.30 USD (Stripe)',
    localCurrency: false,
    language: 'Inglés',
    market: 'Global — periodistas independientes y escritores técnicos',
    founded: '2013',
    bestFor: 'Periodistas y escritores técnicos con conocimientos de desarrollo que quieren control total del código',
    latamLimitations: [
      'Ghost Pro (hosting administrado) cuesta desde $9 hasta $199 USD/mes según tráfico — en dólares',
      'Stripe-only para membresías de pago — sin soporte nativo para pagos en moneda local LATAM',
      'Requiere conocimientos técnicos para configurar y mantener (especialmente el self-hosted)',
      'No hay soporte en español ni localización para audiencias latinoamericanas',
      'Los suscriptores latinoamericanos siguen pagando en USD con los recargos habituales',
    ],
    migrationReason:
      'Ghost es poderoso si eres desarrollador o tienes equipo técnico. Para el profesional independiente latinoamericano que quiere publicar y cobrar sin configurar servidores, Nebbuler ofrece la misma lógica editorial con pagos en pesos y sin barreras técnicas.',
    breakeven: 'Ghost Pro desde $9 USD/mes + Stripe (USD-only); Nebbuler: US$19/mes todo incluido con pagos en moneda local',
    keywords: [
      'nebbuler vs ghost',
      'alternativa ghost cms español',
      'ghost latam pagos locales',
      'ghost vs substack español',
    ],
  },
  {
    slug: 'lemon-squeezy',
    name: 'Lemon Squeezy',
    tagline: 'Plataforma de pagos y suscripciones para productos digitales',
    commission: '5% + $0.50 USD por transacción',
    processingFee: 'Incluido en la comisión',
    localCurrency: false,
    language: 'Inglés',
    market: 'Global — principalmente software, SaaS indie y productos digitales',
    founded: '2021',
    bestFor: 'Desarrolladores indie que venden software, plugins, plantillas o SaaS',
    latamLimitations: [
      'Comisión del 5% + $0.50 USD fija por transacción — se acumula rápido en suscripciones mensuales',
      'Diseñada para venta de software y SaaS, no para contenido editorial recurrente',
      'Sin pagos en moneda local para suscriptores LATAM',
      'Interfaz y soporte solo en inglés',
    ],
    migrationReason:
      'Lemon Squeezy es ideal para vender software. Nebbuler está diseñada para el profesional del conocimiento — psicólogo, consultor, analista, periodista — que publica y cobra mensualmente en pesos, sin comisión variable.',
    breakeven: 'Con 30 suscriptores a $10 USD/mes, Lemon Squeezy cobra ~$30 USD solo en comisiones fijas; Nebbuler cobra tarifa plana sin importar el volumen',
    keywords: [
      'nebbuler vs lemon squeezy',
      'alternativa lemon squeezy español',
      'lemon squeezy latam',
    ],
  },
]
