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

  {
    slug: 'convertkit',
    source: 'ConvertKit',
    sourceDomain: 'convertkit.com',
    sourceTagline: 'plataforma de email marketing para creadores independientes anglosajones',
    steps: [
      {
        title: 'Exportá tu lista de suscriptores desde ConvertKit',
        detail: 'En ConvertKit: Subscribers → Export CSV. Te da email, fecha de suscripción, tags y segmentos. Si tienes commerce activo, también exporta customers desde Earn → Export.',
        estimatedMinutes: 5,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Regístrate en nebbuler.com/abrir. Define tu precio en moneda local. ConvertKit cobraba en USD — te recomendamos ajustar el precio 15-20% a la baja para compensar la desaparición de la fricción FX y aumentar conversión.',
        estimatedMinutes: 10,
      },
      {
        title: 'Importá tu lista vía Settings → Subscribers → Import CSV',
        detail: 'Nebbuler mapea automáticamente las columnas de email y estado. Los tags de ConvertKit no migran 1:1 pero los suscriptores sí. Los que tenían commerce activo necesitan re-suscripción en Nebbuler.',
        estimatedMinutes: 5,
      },
      {
        title: 'Recrea tus automatizaciones esenciales',
        detail: 'ConvertKit destaca por sus sequences y automations. En Nebbuler, configura tu email de bienvenida y secuencia básica. No necesitas replicar toda la complejidad — el modelo de membresía editorial es más simple que el de email marketing.',
        estimatedMinutes: 30,
      },
      {
        title: 'Avisá a tus suscriptores',
        detail: 'Envía un último broadcast desde ConvertKit explicando la migración. Enfatizá: pagos en pesos sin recargo internacional, misma calidad de contenido, soporte en español.',
        estimatedMinutes: 20,
      },
    ],
    faqs: [
      {
        q: '¿Pierdo mis automatizaciones de ConvertKit al migrar?',
        a: 'Sí, las sequences y visual automations de ConvertKit no migran. Pero el modelo de Nebbuler es más simple: publicas contenido, cobras membresía. No necesitas funnels complejos para cobrar por tu conocimiento.',
      },
      {
        q: '¿ConvertKit o Nebbuler para email marketing puro?',
        a: 'Si tu modelo es email marketing con funnels complejos y audiencia en USD, ConvertKit es mejor. Si tu modelo es membresía editorial para LATAM con cobros recurrentes en pesos, Nebbuler es la opción.',
      },
      {
        q: '¿Puedo usar ambos?',
        a: 'Sí. Muchos creadores usan ConvertKit para su lista gratuita en inglés y Nebbuler para su membresía paga en español. Modelo híbrido válido.',
      },
    ],
    preserves: [
      'Tu lista completa de emails (importable)',
      'Tu identidad visual',
      'Tu dominio personalizado',
    ],
    losesIfYouDont: [
      '$29+ USD/mes de ConvertKit en planes de monetización',
      '3.5% de comisión sobre ventas',
      'Pagos en USD que castigan audiencia LATAM',
    ],
    pricingExample: {
      subscribers: 200,
      monthlyPriceUSD: 7,
      sourceNet: 200 * 7 * 0.965 - 29 - (200 * 7 * 0.029 + 200 * 0.30),
      nebbulerNet: 200 * 7 - 30,
    },
    keywords: [
      'migrar de convertkit',
      'convertkit alternativa español',
      'exportar convertkit suscriptores',
      'convertkit latam',
    ],
  },

  {
    slug: 'kajabi',
    source: 'Kajabi',
    sourceDomain: 'kajabi.com',
    sourceTagline: 'plataforma premium todo-en-uno para coaches y creadores de cursos en USD',
    steps: [
      {
        title: 'Exportá tu lista de contactos desde Kajabi',
        detail: 'En Kajabi: People → Contacts → Export. Te da CSV con email, nombre, ofertas compradas y tags. Exporta también tus productos/ofertas activas para mapearlas en Nebbuler.',
        estimatedMinutes: 10,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Pasas de $149 USD/mes mínimo en Kajabi a US$19/mes en Nebbuler. Define tu precio de membresía en moneda local. Si vendías cursos, puedes publicarlos como contenido exclusivo dentro de tu sala.',
        estimatedMinutes: 15,
      },
      {
        title: 'Migra tu contenido principal',
        detail: 'Los cursos de Kajabi (videos, PDFs, quizzes) se publican como posts exclusivos en Nebbuler. No migres todo — migra los 10-15 contenidos top y crea contenido nuevo directamente en Nebbuler.',
        estimatedMinutes: 60,
      },
      {
        title: 'Importá tu lista y avisá a tu comunidad',
        detail: 'Sube el CSV en Settings → Subscribers → Import. Envía un email de transición desde Kajabi explicando: precio más accesible, pagos en pesos, mismo contenido de calidad.',
        estimatedMinutes: 30,
      },
    ],
    faqs: [
      {
        q: '¿Kajabi tiene funcionalidades que Nebbuler no tiene?',
        a: 'Sí. Kajabi tiene pipeline builder, landing pages avanzadas, webinars y quizzes nativos. Si dependes de esas funcionalidades, Kajabi puede seguir siendo tu opción. Nebbuler se enfoca en membresía editorial: publicar, cobrar, distribuir — simple y en moneda local.',
      },
      {
        q: '¿Vale la pena migrar si ya pago $149 USD/mes en Kajabi?',
        a: 'Si tu audiencia es mayoritariamente LATAM y tu modelo es contenido escrito/editorial, sí. Pasas de $149 a US$19/mes y tus suscriptores pagan en pesos. Si tu modelo depende de los funnels de Kajabi, evalúa si puedes simplificarlo.',
      },
      {
        q: '¿Mis videos de Kajabi se pueden migrar?',
        a: 'Puedes descargar tus videos y subirlos como contenido embebido en Nebbuler (vía YouTube/Vimeo privado). Nebbuler no hostea video directamente — está optimizado para contenido editorial escrito.',
      },
    ],
    preserves: [
      'Tu lista de contactos (importable)',
      'Tu identidad visual',
      'Tu contenido escrito (importable)',
      'Tus videos (descargables, re-hosteables)',
    ],
    losesIfYouDont: [
      '$149+ USD/mes de plan Kajabi (~$141.000 CLP)',
      'Pagos en USD con barrera para audiencia LATAM',
      'Plataforma en inglés sin localización',
    ],
    pricingExample: {
      subscribers: 100,
      monthlyPriceUSD: 15,
      sourceNet: 100 * 15 - 149 - (100 * 15 * 0.029 + 100 * 0.30),
      nebbulerNet: 100 * 15 - 30,
    },
    keywords: [
      'migrar de kajabi',
      'kajabi alternativa barata',
      'kajabi en español latam',
      'kajabi comisiones',
    ],
  },

  {
    slug: 'ghost',
    source: 'Ghost',
    sourceDomain: 'ghost.org',
    sourceTagline: 'CMS open-source para publicaciones independientes con membresías en USD',
    steps: [
      {
        title: 'Exportá tu contenido y lista desde Ghost',
        detail: 'En Ghost Admin: Settings → Labs → Export content (JSON). Para la lista de miembros: Members → Export CSV. El JSON incluye todos tus posts con HTML que puede importarse.',
        estimatedMinutes: 10,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Si estabas en Ghost Pro ($9-$199 USD/mes) o self-hosted, pasas a US$19/mes en Nebbuler sin necesidad de administrar servidor. Define tu precio en moneda local.',
        estimatedMinutes: 10,
      },
      {
        title: 'Importá tu lista de miembros',
        detail: 'El CSV de Ghost tiene email, status (free/paid) y created_at. Subelo en Settings → Subscribers → Import. Los miembros pagos necesitan re-suscripción con tarjeta local.',
        estimatedMinutes: 5,
      },
      {
        title: 'Migra tus posts principales',
        detail: 'Ghost exporta posts en JSON/HTML. Copia el contenido de tus 10-20 posts más importantes al editor de Nebbuler (Tiptap). El formato se conserva bien.',
        estimatedMinutes: 45,
      },
      {
        title: 'Redirigí tu dominio',
        detail: 'Si usabas dominio personalizado en Ghost, configura el CNAME para que apunte a Nebbuler. Configura redirects 301 para no perder SEO.',
        estimatedMinutes: 15,
      },
    ],
    faqs: [
      {
        q: '¿Ghost self-hosted o Nebbuler?',
        a: 'Si eres desarrollador y quieres control total del código, Ghost self-hosted es imbatible. Si eres un profesional que quiere publicar y cobrar sin administrar servidores, Nebbuler es la opción más simple.',
      },
      {
        q: '¿Ghost Pro vs Nebbuler — cuál es más barato?',
        a: 'Ghost Pro desde $9 USD/mes (100 miembros) hasta $199 USD/mes. Nebbuler: US$19/mes fijo sin límite de suscriptores. Ghost Pro + Stripe cobra en USD; Nebbuler cobra en moneda local.',
      },
      {
        q: '¿El editor de Nebbuler es tan bueno como el de Ghost?',
        a: 'Ambos usan editores modernos. Ghost usa su propio Koenig editor; Nebbuler usa Tiptap. Las capacidades son similares: embeds, imágenes, código, citas. Ghost tiene cards nativos más avanzados.',
      },
    ],
    preserves: [
      'Tu lista de miembros (importable)',
      'Tu contenido editorial (importable)',
      'Tu dominio personalizado',
      'Tu SEO (con redirects 301)',
    ],
    losesIfYouDont: [
      'Pagos en USD que castigan audiencia LATAM',
      'Costo de Ghost Pro o mantenimiento de self-hosted',
      'Stripe-only sin procesadores locales',
    ],
    pricingExample: {
      subscribers: 150,
      monthlyPriceUSD: 8,
      sourceNet: 150 * 8 - 25 - (150 * 8 * 0.029 + 150 * 0.30),
      nebbulerNet: 150 * 8 - 30,
    },
    keywords: [
      'migrar de ghost',
      'ghost alternativa español',
      'ghost cms latam',
      'ghost pro vs nebbuler',
    ],
  },

  {
    slug: 'ko-fi',
    source: 'Ko-fi',
    sourceDomain: 'ko-fi.com',
    sourceTagline: 'plataforma de donaciones y propinas para creadores casuales',
    steps: [
      {
        title: 'Exportá tu lista de supporters desde Ko-fi',
        detail: 'En Ko-fi: Settings → Supporters → Export. Te da CSV con email y tipo de soporte (one-time, membership). La lista puede ser pequeña ya que Ko-fi es más casual.',
        estimatedMinutes: 5,
      },
      {
        title: 'Transiciona de propinas a membresía',
        detail: 'Ko-fi es un modelo de donación. En Nebbuler, defines un precio mensual claro por tu contenido exclusivo. La transición es de "¿puedes invitarme un café?" a "esto vale $X/mes por mi análisis profesional".',
        estimatedMinutes: 15,
      },
      {
        title: 'Importá tu lista y crea tu primera publicación',
        detail: 'Sube el CSV, publica tu primer post exclusivo y anuncia a tus supporters que ahora tienes un sistema profesional de membresía con pagos en su moneda local.',
        estimatedMinutes: 20,
      },
    ],
    faqs: [
      {
        q: '¿Ko-fi Gold vs Nebbuler?',
        a: 'Ko-fi Gold ($6 USD/mes) te permite membresías pero cobra 0% solo en donaciones — las membresías Gold tienen funcionalidades limitadas. Nebbuler está 100% diseñado para membresías profesionales con editor completo y pagos locales.',
      },
      {
        q: '¿Vale la pena migrar si tengo pocos supporters?',
        a: 'Sí, especialmente si tu audiencia es LATAM. Ko-fi en USD crea fricción para donantes latinos. En Nebbuler, pueden pagar en pesos, lo cual típicamente duplica o triplica la conversión.',
      },
    ],
    preserves: [
      'Tu lista de supporters (importable)',
      'Tu identidad visual',
    ],
    losesIfYouDont: [
      'Modelo de propina que devalúa tu trabajo profesional',
      'Pagos en USD con fricción para LATAM',
      'Plataforma casual sin herramientas editoriales serias',
    ],
    pricingExample: {
      subscribers: 50,
      monthlyPriceUSD: 5,
      sourceNet: 50 * 5 - 6 - (50 * 5 * 0.029 + 50 * 0.30),
      nebbulerNet: 50 * 5 - 30,
    },
    keywords: [
      'migrar de ko-fi',
      'ko-fi alternativa membresía',
      'ko-fi latam',
    ],
  },

  {
    slug: 'hotmart',
    source: 'Hotmart',
    sourceDomain: 'hotmart.com',
    sourceTagline: 'plataforma de cursos digitales y productos de creadores, líder en Brasil y LATAM',
    steps: [
      {
        title: 'Identifica tus productos y alumnos activos en Hotmart',
        detail: 'En Hotmart: Mis Productos → cada producto → Alumnos. Exporta la lista de compradores con email y producto. Hotmart no tiene un export CSV fácil — puede que necesites copiar manualmente o usar la API.',
        estimatedMinutes: 15,
      },
      {
        title: 'Decide tu modelo en Nebbuler',
        detail: 'Hotmart vende cursos one-time. Nebbuler vende membresías recurrentes. La transición ideal: convierte tu base de alumnos en suscriptores de una membresía mensual donde publicas contenido nuevo regularmente.',
        estimatedMinutes: 20,
      },
      {
        title: 'Abre tu sala y sube tu lista',
        detail: 'Regístrate en nebbuler.com/abrir. Importa tu lista. Define un precio mensual en moneda local que refleje el valor de tu contenido recurrente.',
        estimatedMinutes: 10,
      },
      {
        title: 'Anuncia la transición a tus alumnos',
        detail: 'Envía email desde Hotmart o tu lista propia explicando que ahora tu contenido está disponible como membresía mensual, con pagos en moneda local y contenido nuevo cada semana/mes.',
        estimatedMinutes: 20,
      },
    ],
    faqs: [
      {
        q: '¿Hotmart no sirve para membresías?',
        a: 'Hotmart tiene un modelo de suscripción pero está diseñado para cursos, no para contenido editorial recurrente. Además cobra ~10% de comisión sobre cada cobro. Nebbuler cobra tarifa fija con 0% comisión.',
      },
      {
        q: '¿Puedo seguir vendiendo cursos en Hotmart y tener membresía en Nebbuler?',
        a: 'Sí. Modelo híbrido: Hotmart para cursos completos one-time, Nebbuler para tu membresía recurrente con contenido nuevo. Muchos creadores LATAM usan este esquema.',
      },
      {
        q: '¿Y los afiliados de Hotmart?',
        a: 'Nebbuler no tiene sistema de afiliados. Si tu modelo depende fuertemente de afiliados, Hotmart puede seguir siendo parte de tu stack. Nebbuler es para venta directa a tu audiencia.',
      },
    ],
    preserves: [
      'Tu lista de alumnos/compradores (importable)',
      'Tu contenido (descargable y re-publicable)',
      'Tu identidad como creador',
    ],
    losesIfYouDont: [
      '~10% de comisión sobre cada venta en Hotmart',
      'Modelo de lanzamiento que genera ingreso esporádico, no recurrente',
      'Dependencia del sistema de afiliados',
    ],
    pricingExample: {
      subscribers: 100,
      monthlyPriceUSD: 10,
      sourceNet: 100 * 10 * 0.90 - (100 * 10 * 0.025),
      nebbulerNet: 100 * 10 - 30,
    },
    keywords: [
      'migrar de hotmart',
      'hotmart alternativa',
      'hotmart comisiones',
      'hotmart vs membresía propia',
    ],
  },

  {
    slug: 'teachable',
    source: 'Teachable',
    sourceDomain: 'teachable.com',
    sourceTagline: 'plataforma de cursos online orientada al mercado anglosajón',
    steps: [
      {
        title: 'Exportá tu lista de estudiantes desde Teachable',
        detail: 'En Teachable: Users → Students → Export CSV. Te da email, nombre, cursos inscritos y fecha. También exporta desde Sales → Transactions para ver ingresos por estudiante.',
        estimatedMinutes: 10,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Pasas del plan Basic ($59 USD/mes con 5% comisión) o Pro ($159 USD/mes) a US$19/mes en Nebbuler con 0% comisión. Define tu precio de membresía en moneda local.',
        estimatedMinutes: 10,
      },
      {
        title: 'Migra tu contenido editorial',
        detail: 'Los cursos de Teachable son modulares (secciones + lecciones). En Nebbuler, publica tu contenido como posts exclusivos. Los videos puedes hostearlos en YouTube/Vimeo privado y embeber.',
        estimatedMinutes: 45,
      },
      {
        title: 'Importá tu lista y comunica el cambio',
        detail: 'Sube el CSV, crea tu primer contenido en Nebbuler, y envía un email a tus estudiantes explicando que ahora tu contenido está en un formato de membresía más accesible y en moneda local.',
        estimatedMinutes: 25,
      },
    ],
    faqs: [
      {
        q: '¿Teachable vs Nebbuler para cursos?',
        a: 'Teachable es mejor para cursos modulares con quizzes y certificaciones. Nebbuler es mejor para contenido editorial recurrente (análisis, guías, opinión). Si tu modelo es más editorial que académico, Nebbuler gana.',
      },
      {
        q: '¿Cuánto ahorro al migrar de Teachable?',
        a: 'En el plan Basic: $59 USD/mes + 5% comisión. Con 50 suscriptores a $10 USD, pagas $59 + $25 = $84 USD/mes. En Nebbuler: $19 USD/mes. Ahorro: $65 USD/mes.',
      },
    ],
    preserves: [
      'Tu lista de estudiantes (importable)',
      'Tu contenido escrito (copiable)',
      'Tus videos (descargables)',
    ],
    losesIfYouDont: [
      '$59-159 USD/mes de plan Teachable',
      '5% comisión en plan Basic',
      'Pagos en USD sin moneda local',
    ],
    pricingExample: {
      subscribers: 100,
      monthlyPriceUSD: 10,
      sourceNet: 100 * 10 * 0.95 - 59 - (100 * 10 * 0.029 + 100 * 0.30),
      nebbulerNet: 100 * 10 - 30,
    },
    keywords: [
      'migrar de teachable',
      'teachable alternativa español',
      'teachable latam',
      'teachable comisiones',
    ],
  },

  {
    slug: 'medium',
    source: 'Medium',
    sourceDomain: 'medium.com',
    sourceTagline: 'plataforma de publicación abierta con Partner Program que paga por lectura',
    steps: [
      {
        title: 'Exportá tu contenido desde Medium',
        detail: 'En Medium: Settings → Account → Download your information. Recibes un archivo .zip con todos tus posts en HTML. También puedes exportar desde cada post individualmente.',
        estimatedMinutes: 10,
      },
      {
        title: 'Construí tu lista de lectores',
        detail: 'Medium no te da acceso a los emails de tus seguidores. Si tienes newsletter activo en Medium, puedes ver la lista de suscriptores. Esta es la parte más difícil: necesitas reconstruir tu audiencia comunicando activamente tu nueva plataforma.',
        estimatedMinutes: 30,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Regístrate y define tu precio mensual. En Medium ganabas centavos por lectura; en Nebbuler defines tú cuánto vale tu trabajo. Te recomendamos empezar con un precio accesible (ej: $5.000-10.000 CLP/mes) y subir.',
        estimatedMinutes: 10,
      },
      {
        title: 'Publica tus mejores artículos y anuncia el cambio',
        detail: 'Republica tus 5-10 mejores artículos en Nebbuler como contenido público (para SEO). Crea contenido exclusivo nuevo para la membresía. Anuncia en Medium, Twitter/X y redes que ahora tu contenido premium está en Nebbuler.',
        estimatedMinutes: 45,
      },
    ],
    faqs: [
      {
        q: '¿Cuánto paga Medium a escritores en español?',
        a: 'La mediana es US$10-50/mes. El algoritmo prioriza contenido en inglés. Con solo 2-3 suscriptores en Nebbuler a $10.000 CLP/mes, ya superas el ingreso típico de Medium en español.',
      },
      {
        q: '¿Pierdo mis seguidores de Medium?',
        a: 'Medium no te da acceso a los emails de tus seguidores, así que técnicamente no son "tuyos". En Nebbuler, tu lista de suscriptores es tuya con acceso completo a los datos.',
      },
      {
        q: '¿Puedo mantener Medium para distribución?',
        a: 'Sí. Publica versiones resumidas o gratuitas en Medium con link a tu sala de Nebbuler para el contenido completo. Modelo funnel: Medium gratis → Nebbuler pago.',
      },
    ],
    preserves: [
      'Tu contenido escrito (exportable)',
      'Tu perfil público en Medium (como archivo)',
    ],
    losesIfYouDont: [
      'Ingresos mínimos del Partner Program (US$10-50/mes típico)',
      'Dependencia del algoritmo de Medium para distribución',
      'Falta de acceso a los datos de tu audiencia',
    ],
    pricingExample: {
      subscribers: 50,
      monthlyPriceUSD: 7,
      sourceNet: 35,
      nebbulerNet: 50 * 7 - 30,
    },
    keywords: [
      'migrar de medium',
      'medium alternativa cobrar',
      'medium partner program español',
      'medium latam ingresos',
    ],
  },

  {
    slug: 'mailchimp',
    source: 'Mailchimp',
    sourceDomain: 'mailchimp.com',
    sourceTagline: 'plataforma de email marketing empresarial — no diseñada para membresías de contenido',
    steps: [
      {
        title: 'Exportá tu lista de contactos desde Mailchimp',
        detail: 'En Mailchimp: Audience → All contacts → Export Audience. Te da CSV con email, nombre, tags, fecha de suscripción y engagement data. Es la parte más limpia de la migración.',
        estimatedMinutes: 5,
      },
      {
        title: 'Limpia tu lista',
        detail: 'Mailchimp incluye contactos desenganchados. Antes de importar en Nebbuler, filtra solo los activos (opens > 0 últimos 90 días). Una lista limpia convierte mejor.',
        estimatedMinutes: 15,
      },
      {
        title: 'Abre tu sala en Nebbuler',
        detail: 'Mailchimp no es para membresías de contenido — migrar es realmente empezar a monetizar tu lista existente. Define tu precio en moneda local.',
        estimatedMinutes: 10,
      },
      {
        title: 'Importá y lanza tu membresía',
        detail: 'Sube el CSV limpio. Envía tu primer email desde Nebbuler anunciando que ahora tienes contenido exclusivo. Los suscriptores free ven un preview; para el contenido completo necesitan suscribirse.',
        estimatedMinutes: 20,
      },
    ],
    faqs: [
      {
        q: '¿Mailchimp sirve para membresías de contenido?',
        a: 'No realmente. Mailchimp es email marketing empresarial: automatizaciones, segmentación, reporting. No tiene paywall, membresías ni sistema de cobro por contenido. Para eso está Nebbuler.',
      },
      {
        q: '¿Cuánto pago en Mailchimp vs Nebbuler?',
        a: 'Mailchimp Standard desde $20 USD/mes para 500 contactos, escalando rápido. Nebbuler: US$19/mes fijo sin límite de suscriptores, con membresías incluidas.',
      },
    ],
    preserves: [
      'Tu lista de contactos completa (importable)',
      'Tus datos de engagement (para filtrar)',
    ],
    losesIfYouDont: [
      '$20+ USD/mes de Mailchimp sin capacidad de monetizar directamente',
      'Una lista que no genera ingresos directos por contenido',
    ],
    pricingExample: {
      subscribers: 500,
      monthlyPriceUSD: 5,
      sourceNet: 0,
      nebbulerNet: 500 * 5 - 30,
    },
    keywords: [
      'migrar de mailchimp',
      'mailchimp a membresía paga',
      'mailchimp alternativa creadores',
      'monetizar lista mailchimp',
    ],
  },
]
