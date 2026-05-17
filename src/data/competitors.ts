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
]
