// Datos para páginas /migrar-desde-[competidor]
// Optimizado para queries de alta intención: "migrar de substack a", "exportar de patreon", etc.

export type Migration = {
  slug: string
  source: string
  sourceDomain: string
  sourceTagline: string
  // Pasos concretos
  steps: Array<{ title: string; detail: string; estimatedMinutes: number }>
  // Cosas técnicas que tu audiencia preguntará
  faqs: Array<{ q: string; a: string }>
  // ¿Qué se conserva y qué no?
  preserves: string[]
  losesIfYouDont: string[]
  // Pricing comparison con números reales
  pricingExample: {
    subscribers: number
    monthlyPriceUSD: number
    sourceNet: number
    nebbulerNet: number
  }
  keywords: string[]
}

export const MIGRATIONS: Migration[] = [
  {
    slug: 'substack',
    source: 'Substack',
    sourceDomain: 'substack.com',
    sourceTagline: 'plataforma de newsletters de pago en USD con audiencia anglosajona',
    steps: [
      {
        title: 'Exportá tu lista de suscriptores desde Substack',
        detail: 'En Substack: Settings → Exports → Email list. Recibís un CSV con email, fecha de suscripción y estado (paid/free). Si tenés muchos pagos activos, también exportá Settings → Subscriptions → Export.',
        estimatedMinutes: 5,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Regístrate en nebbuler.com/abrir como creador. Define tu precio mensual en moneda local (CLP, COP, MXN, ARS, PEN). Para mantener el mismo precio que en Substack, puedes usar el tipo de cambio del día — pero te recomendamos bajarlo 15-20% porque al desaparecer la fricción FX, el creador típico ve un aumento de conversión que compensa el menor precio nominal.',
        estimatedMinutes: 10,
      },
      {
        title: 'Importá tu lista vía Settings → Subscribers → Import CSV',
        detail: 'Nebbuler mapea automáticamente las columnas email/status/created_at. Los suscriptores gratuitos quedan como "free subscribers" — pueden recibir tus posts gratuitos. Los pagos activos requieren re-suscripción manual con tarjeta local (no podemos cobrar a tarjeta extranjera de Substack sin su autorización).',
        estimatedMinutes: 5,
      },
      {
        title: 'Avisá a tus suscriptores',
        detail: 'Envía un último post desde Substack explicando la migración. Plantilla que funciona: explicá que (a) la audiencia LATAM ahora puede pagar en pesos sin cargo internacional, (b) si están fuera de LATAM siguen suscritos via Substack, (c) los pagos que tenían en Substack siguen activos hasta el siguiente ciclo — después se cancelan en Substack y migran.',
        estimatedMinutes: 30,
      },
      {
        title: 'Migra los posts más importantes',
        detail: 'No migres todo. Migra los 10-20 posts top (los que más fueron compartidos / vistos). Nebbuler permite imports masivos pero la calidad > cantidad. Los demás los puedes dejar en Substack como archivo público linkeado desde tu nuevo perfil.',
        estimatedMinutes: 60,
      },
    ],
    faqs: [
      {
        q: '¿Pierdo mis suscriptores pagos al migrar?',
        a: 'No. Los pagos activos en Substack siguen vigentes hasta su próxima renovación. Vos cancelás tu cuenta de Substack cuando ya re-suscribiste manualmente a la mayoría. La práctica común: dar 30-60 días de overlap entre ambas plataformas.',
      },
      {
        q: '¿Cuándo conviene migrar realmente?',
        a: 'Si más del 30% de tu audiencia está en LATAM, la conversión a paga en Nebbuler suele ser 2-3x mayor que en Substack porque desaparece la fricción de pago en USD. A partir de 4 suscriptores pagos a $10.000 CLP/mes, Nebbuler es más barato que Substack en términos absolutos (tarifa fija vs 10% comisión).',
      },
      {
        q: '¿Substack me deja exportar la lista de pagos?',
        a: 'Sí, pero solo te da emails y estado de suscripción — no transfiere las tarjetas. Por eso la re-suscripción es manual: cada lector tiene que ingresar su tarjeta local nuevamente en Nebbuler. Esta fricción inicial suele reducir la lista paga 30-50%, pero los que se re-suscriben son los más comprometidos.',
      },
      {
        q: '¿Mantengo mi diseño / branding?',
        a: 'Sí. Nebbuler permite logo, color principal, fondo personalizado y tipografía. No es tan flexible como Substack en CSS custom pero cubre 95% de los casos. Para branding 100% custom existe la opción de embed en tu propio dominio.',
      },
      {
        q: '¿Mi SEO se ve afectado?',
        a: 'Solo si migras todos los posts y rompes URLs. Si dejas Substack como archivo público de los posts viejos + redirects 301 a Nebbuler para los nuevos, no pierdes ranking. Nebbuler genera schema.org Article + Author + Person automático en cada post, lo cual ayuda a recuperar ranking rápido.',
      },
    ],
    preserves: [
      'Tu lista de emails (suscriptores gratuitos pasan directo)',
      'El histórico de posts (importable)',
      'Tu identidad visual (logo, colores, tipografía)',
      'Tu dominio personalizado si tenías uno en Substack (DNS apunta a Nebbuler)',
    ],
    losesIfYouDont: [
      'Cobros recurrentes en USD que castigan a tu audiencia LATAM (-30% conversión típica)',
      '10% de comisión variable sobre todos tus ingresos para siempre',
      'Funcionalidades técnicas pensadas para audiencia anglosajona (Stripe-only, soporte solo en inglés)',
    ],
    pricingExample: {
      subscribers: 100,
      monthlyPriceUSD: 7,
      sourceNet: 100 * 7 * 0.9 - (100 * 7 * 0.029 + 100 * 0.30), // ~580
      nebbulerNet: 100 * 7 - 30, // ~670
    },
    keywords: [
      'migrar de substack',
      'exportar substack csv',
      'substack alternativa español',
      'cancelar substack mantener suscriptores',
      'mejor que substack latinoamerica',
    ],
  },

  {
    slug: 'patreon',
    source: 'Patreon',
    sourceDomain: 'patreon.com',
    sourceTagline: 'plataforma global de membresías con foco en creadores audiovisuales',
    steps: [
      {
        title: 'Exportá tu lista de patrons desde Patreon',
        detail: 'En Patreon Creator Dashboard: Members → Active → Export CSV. Te da nombres, emails, tier asignado y monto mensual.',
        estimatedMinutes: 5,
      },
      {
        title: 'Mapeá tus tiers a Nebbuler',
        detail: 'Patreon usa tiers con recompensas distintas. Nebbuler tiene un sistema más simple (1 precio por sala) pero soporta múltiples salas por creador. Si tenías 3 tiers en Patreon ($5/$10/$20), creá 3 salas en Nebbuler con esos precios. Tus patrons eligen a cuál suscribirse.',
        estimatedMinutes: 30,
      },
      {
        title: 'Importá tu lista a Nebbuler',
        detail: 'Subí el CSV en Settings → Subscribers → Import. Los patrons quedan en "free" hasta que se re-suscriban con tarjeta local. La diferencia con Patreon: tus patrons LATAM pagan en pesos, no en dólares con conversión.',
        estimatedMinutes: 5,
      },
      {
        title: 'Aviso a tus patrons',
        detail: 'Patreon te permite mandar mensaje masivo a todos los patrons. Plantilla: agradecé el apoyo histórico, explicá que migrás a Nebbuler para audiencia LATAM, dejá link y plazo. Patreon sigue cobrando hasta que cada uno cancele su pledge.',
        estimatedMinutes: 30,
      },
    ],
    faqs: [
      {
        q: 'Mis recompensas físicas / packs de Patreon, ¿cómo se manejan?',
        a: 'Nebbuler no maneja envíos físicos. Si tu modelo dependía de mandar productos por correo, podés seguir usando Patreon para esos tiers específicos y usar Nebbuler para los tiers digitales (acceso a contenido). Pocos creadores LATAM tienen modelo físico — la mayoría es 100% digital.',
      },
      {
        q: '¿Patreon me deja exportar la lista de tarjetas?',
        a: 'No. Por seguridad PCI, ninguna plataforma transfiere tarjetas almacenadas. La re-suscripción manual es estándar de la industria.',
      },
      {
        q: '¿Vale la pena migrar si el 100% de mi audiencia es de EE.UU.?',
        a: 'Si tu audiencia es 100% USD, Patreon te sirve. Nebbuler tiene sentido cuando >30% de tu audiencia está en LATAM o cuando quieres que la audiencia LATAM crezca y no puedes captarla en Patreon por la fricción de pago.',
      },
    ],
    preserves: [
      'Tu lista de patrons (importable como gratuitos)',
      'Tu identidad visual',
      'Acceso al contenido histórico (importable)',
      'Múltiples tiers (vía múltiples salas en Nebbuler)',
    ],
    losesIfYouDont: [
      '8-12% de comisión variable sobre todos tus ingresos',
      'Pagos en USD con conversión cara para tu audiencia LATAM',
      'Dependencia de Stripe que no opera en varios países LATAM',
    ],
    pricingExample: {
      subscribers: 100,
      monthlyPriceUSD: 5,
      sourceNet: 100 * 5 * 0.88 - 100 * 5 * 0.05, // ~415
      nebbulerNet: 100 * 5 - 30, // ~470
    },
    keywords: [
      'migrar de patreon a nebbuler',
      'patreon alternativa español',
      'exportar patrons csv',
      'patreon comisiones latam',
    ],
  },

  {
    slug: 'beehiiv',
    source: 'Beehiiv',
    sourceDomain: 'beehiiv.com',
    sourceTagline: 'plataforma moderna de newsletters con foco en growth y referrals',
    steps: [
      {
        title: 'Exportá tu lista desde Beehiiv',
        detail: 'En Beehiiv: Audience → Subscribers → Export. Te da CSV con email, status, segmento y signup source.',
        estimatedMinutes: 5,
      },
      {
        title: 'Configurá tu sala en Nebbuler',
        detail: 'Beehiiv es excelente para growth (referrals, A/B testing). Si tu prioridad es monetización LATAM, Nebbuler es mejor. Si tu prioridad es lista en USD, Beehiiv sigue siendo opción válida — incluso puedes usar ambas.',
        estimatedMinutes: 15,
      },
      {
        title: 'Importá la lista',
        detail: 'CSV directo en Settings → Subscribers → Import. Los segmentos de Beehiiv no migran 1:1 (Nebbuler usa tags simples) pero el comportamiento de envío sí se conserva.',
        estimatedMinutes: 10,
      },
      {
        title: 'Configurá tu sistema de referidos',
        detail: 'Si usabas el referral program de Beehiiv, en Nebbuler puedes replicarlo con el sistema de invitaciones. No es tan visual pero cumple la misma función: cada suscriptor tiene un link único para invitar amigos.',
        estimatedMinutes: 20,
      },
    ],
    faqs: [
      {
        q: '¿Pierdo mis A/B tests si migro?',
        a: 'Sí. Beehiiv tiene A/B testing nativo de subject lines y send times que Nebbuler no replica 1:1. Si tu growth depende fuertemente de eso, mantené Beehiiv para tu lista gratis y usá Nebbuler solo para el segmento pago LATAM.',
      },
      {
        q: '¿Cuándo conviene migrar todo vs hacer híbrido?',
        a: 'Híbrido si tu lista es mayormente USD y solo el 20-30% es LATAM. Migración total si el >50% es LATAM o si te molesta cobrar $39 USD/mes a Beehiiv por funcionalidades que no usás.',
      },
    ],
    preserves: [
      'Tu lista de emails',
      'Tu identidad visual',
      'Posts pasados (importables)',
      'Tu dominio personalizado',
    ],
    losesIfYouDont: [
      '$39 USD/mes fijo de Beehiiv (sin moneda local)',
      'Pagos en USD que castigan audiencia LATAM',
      'Soporte solo en inglés',
    ],
    pricingExample: {
      subscribers: 200,
      monthlyPriceUSD: 7,
      sourceNet: 200 * 7 - 39 - (200 * 7 * 0.029 + 200 * 0.30), // ~1280
      nebbulerNet: 200 * 7 - 30, // ~1370
    },
    keywords: [
      'beehiiv vs nebbuler',
      'migrar de beehiiv',
      'beehiiv en español',
      'beehiiv latam',
    ],
  },

  {
    slug: 'gumroad',
    source: 'Gumroad',
    sourceDomain: 'gumroad.com',
    sourceTagline: 'marketplace de productos digitales únicos (ebooks, cursos, plantillas)',
    steps: [
      {
        title: 'Identificá qué productos quieres migrar',
        detail: 'Gumroad sirve para ventas únicas (ebook, plantilla, curso one-time). Si tu modelo es 100% productos únicos, Nebbuler no es directo reemplazo — Nebbuler es para suscripciones recurrentes. La migración tiene sentido si querés crear una membresía RECURRENTE además de tus ventas únicas.',
        estimatedMinutes: 15,
      },
      {
        title: 'Exportá tu lista de customers desde Gumroad',
        detail: 'En Gumroad: Customers → Export CSV. Te da emails, productos comprados, monto pagado.',
        estimatedMinutes: 5,
      },
      {
        title: 'Decidí: ¿membresía nueva o producto único?',
        detail: 'Opción A: convertí tu base de customers en suscriptores de tu sala (te recomiendan tu próximo lanzamiento). Opción B: usá Gumroad para productos únicos + Nebbuler para membresía mensual recurrente — modelo híbrido más completo.',
        estimatedMinutes: 30,
      },
    ],
    faqs: [
      {
        q: 'Mis productos únicos, ¿van a Nebbuler también?',
        a: 'No directamente. Nebbuler está optimizado para membresía recurrente. Si vendés solo productos únicos, te recomiendo el modelo híbrido (Gumroad o LemonSqueezy para productos únicos + Nebbuler para membresía).',
      },
      {
        q: '¿Gumroad cobra moneda local LATAM?',
        a: 'No. Gumroad opera en USD via Stripe. La comisión total con processing fees puede llegar al 13-15%. Para creadores LATAM con audiencia local, esto es prohibitivo.',
      },
    ],
    preserves: [
      'Tu lista de customers (importable)',
      'Tu marca / identidad visual',
    ],
    losesIfYouDont: [
      '10% comisión + ~3.5% processing fees',
      'Pagos solo en USD',
      'Modelo de venta única (sin recurrencia natural)',
    ],
    pricingExample: {
      subscribers: 100,
      monthlyPriceUSD: 7,
      sourceNet: 100 * 7 * 0.87 - 100 * 0.30, // ~580
      nebbulerNet: 100 * 7 - 30, // ~670
    },
    keywords: [
      'migrar de gumroad',
      'gumroad alternativa membresía',
      'gumroad latam español',
    ],
  },
]
