export type NebbulerPost = {
  id: number
  slug: string
  title: string
  date: string
  isoDate: string
  excerpt: string
  readingTime: number
  content: string // markdown-like HTML
}

export const NEBBULER_POSTS: NebbulerPost[] = [
  {
    id: 1,
    slug: 'cero-a-lanzamiento-30-dias',
    title: 'Cero a lanzamiento: los primeros 30 días construyendo Nebbuler',
    date: '8 mayo 2026',
    isoDate: '2026-05-08',
    readingTime: 7,
    excerpt:
      'Arrancamos desde una hoja en blanco y en 30 días teníamos un producto en producción con los primeros creadores. Acá el registro de decisiones, errores y lo que haríamos diferente.',
    content: `
<p>El 1 de abril de 2026 no teníamos nada. Ni una línea de código, ni un nombre, ni un usuario. Cuatro semanas después teníamos un producto en producción, un sistema de pagos funcionando y las primeras suscripciones procesadas.</p>

<p>Acá va el registro de cómo fue ese mes, sin editar para bien.</p>

<h2>Semana 1 — El problema que nadie estaba resolviendo bien</h2>

<p>La pregunta de partida no fue "¿qué producto hacemos?" sino "¿por qué un economista, abogado o médico con conocimiento valioso sigue publicando gratis en LinkedIn?"</p>

<p>La respuesta que encontramos: las plataformas existentes están diseñadas para el modelo americano. Substack cobra en dólares y toma 10%. Patreon toma hasta 12% y sus pagos no funcionan bien con tarjetas locales latinoamericanas. Gumroad cobra en dólares con una UX pensada para vender cursos, no análisis profesionales recurrentes.</p>

<p>En LATAM, el profesional que quiere cobrar por su conocimiento enfrenta tres fricciones simultáneas: conversión de moneda, porcentaje de comisión, y plataformas que no entienden el contexto cultural de "análisis profesional" vs "contenido de creador".</p>

<p>Decidimos atacar las tres al mismo tiempo.</p>

<h2>Semana 2 — Stack y primer prototipo</h2>

<p>El stack que elegimos en 48 horas: Next.js App Router, Supabase, Vercel, MercadoPago Connect. No fue una decisión académica — fue la intersección de lo que el equipo conocía bien y lo que resolvía el problema más rápido.</p>

<p>El primer prototipo tenía exactamente cuatro páginas: registro de creador, página pública del creador, formulario de suscripción, y dashboard básico. Nada más.</p>

<p>Error número uno de esa semana: perdimos dos días discutiendo el editor de contenido. Implementamos un editor rich text completo cuando lo que necesitábamos era validar si alguien pagaba. Retrocedimos y dejamos el editor para después.</p>

<h2>Semana 3 — El primer pago real</h2>

<p>A mitad del mes procesamos el primer pago real: una suscripción mensual a un economista que habíamos contactado directamente. No fue automatizado, no fue escalable, y fue lo más emocionante del mes.</p>

<p>Ese primer pago confirmó algo que no podíamos asumir: MercadoPago Connect funcionaba como esperábamos. El creador recibió el dinero en su cuenta de MercadoPago en menos de 24 horas, sin que nosotros tocáramos el dinero en ningún momento.</p>

<p>Fue también cuando entendimos que el modelo de negocio tenía que ser tarifa fija y no comisión variable. Cuando el creador ve que cada suscripción que llega es íntegramente suya (menos el procesador), la confianza en la plataforma cambia cualitativamente.</p>

<h2>Semana 4 — Los primeros creadores</h2>

<p>Los primeros creadores los conseguimos de una forma que no escala y que recomendaríamos igual: contacto directo, uno por uno, con un mensaje personalizado que referenciaba contenido específico que habían publicado.</p>

<p>No fue "te invito a una nueva plataforma". Fue "leí tu análisis sobre la política monetaria del Banco Central, y creo que hay personas que pagarían para recibir eso directamente. ¿15 minutos para mostrarte algo?"</p>

<p>La tasa de respuesta positiva fue alta. Lo atribuimos al mensaje personalizado, no al producto. La gente responde cuando alguien claramente leyó su trabajo.</p>

<h2>Lo que haríamos diferente</h2>

<p>Tres cosas:</p>

<p>Primero, el onboarding. Los primeros creadores necesitaban demasiada fricción para subir su primer contenido. Tardamos semanas en simplificarlo, cuando debería haber sido el día uno.</p>

<p>Segundo, los emails transaccionales. Los primeros días, cuando alguien se suscribía a un creador, el creador no recibía notificación inmediata. Nos enteramos por un creador que descubrió nuevos suscriptores al ver su dashboard días después.</p>

<p>Tercero, la documentación de errores. Resolvimos varios bugs dos veces porque no teníamos un sistema claro de registro desde el día uno.</p>
    `,
  },

  {
    id: 2,
    slug: 'mercadopago-vs-stripe-latam',
    title: 'Por qué elegimos MercadoPago y no Stripe para LATAM',
    date: '12 mayo 2026',
    isoDate: '2026-05-12',
    readingTime: 5,
    excerpt:
      'Stripe es la opción obvia para cualquier SaaS. El comportamiento de las tarjetas locales en LATAM cambia completamente la ecuación. Acá el razonamiento.',
    content: `
<p>Cuando estábamos diseñando Nebbuler, la primera sugerencia de cualquier desarrollador era la misma: "usen Stripe". Es el procesador de pagos con mejor documentación del mundo, el que usan casi todos los SaaS de referencia, el que tiene más integraciones.</p>

<p>Elegimos MercadoPago Connect. Acá por qué.</p>

<h2>El problema con Stripe en LATAM</h2>

<p>Stripe funciona. Stripe es excelente técnicamente. El problema no es Stripe — es la infraestructura bancaria latinoamericana y la fricción que genera para un usuario que intenta pagar con una tarjeta local.</p>

<p>En Colombia, Argentina y México, una tarjeta de débito local rechaza pagos internacionales por defecto. El usuario tiene que activar expresamente los pagos internacionales en su banco — un trámite que en algunos bancos requiere ir a una sucursal. Muchos no lo hacen.</p>

<p>El resultado: una fracción significativa de los intentos de pago con tarjeta local fallan cuando el procesador es extranjero. No es un problema de precio, no es un problema de intención — es un problema de infraestructura bancaria. MercadoPago, al operar con la infraestructura local de cada país, reduce drásticamente esos rechazos.</p>

<h2>El modelo Connect de MercadoPago</h2>

<p>MercadoPago tiene un modelo llamado Connect que permite que una plataforma (Nebbuler) procese pagos en nombre de terceros (los creadores) de manera que el dinero va directamente a la cuenta del creador sin pasar por nosotros.</p>

<p>Esto resuelve dos problemas a la vez: el creador recibe el dinero directo (sin que Nebbuler toque los fondos) y el cobro es en moneda local con la infraestructura bancaria local de cada país.</p>

<p>El creador en Argentina cobra en pesos argentinos. El creador en Colombia cobra en pesos colombianos. El creador en México cobra en pesos mexicanos. Sin conversión, sin fricción de banco internacional, sin tarjeta rechazada.</p>

<h2>Las desventajas reales de MercadoPago</h2>

<p>No todo es positivo. La documentación de MercadoPago Connect es significativamente inferior a la de Stripe. Lo que en Stripe lleva horas de integración, en MercadoPago puede llevar días de prueba y error.</p>

<p>El sandbox de pruebas de MercadoPago tiene comportamientos que no replican exactamente producción. Encontramos bugs que solo aparecieron con tarjetas reales.</p>

<p>El soporte técnico de MercadoPago para desarrolladores es notoriamente lento. Tuvimos consultas sin respuesta útil por más de una semana.</p>

<h2>La conclusión</h2>

<p>Para un SaaS que opera exclusivamente en LATAM, la mejora en conversión de checkout que provee un procesador local justifica ampliamente la peor DX de integración. Los usuarios no ven la calidad del SDK — ven si su tarjeta funciona o no.</p>

<p>Si Nebbuler alguna vez expande a mercados donde Stripe tiene penetración real (España, Estados Unidos), la ecuación cambia. Por ahora, MercadoPago es la decisión correcta para el problema que resolvemos.</p>
    `,
  },

  {
    id: 3,
    slug: 'stack-tecnico-nebbuler',
    title: 'El stack técnico de Nebbuler: decisiones, trade-offs y lo que cambiaríamos',
    date: '15 mayo 2026',
    isoDate: '2026-05-15',
    readingTime: 8,
    excerpt:
      'Next.js App Router, Supabase, Vercel Edge, MercadoPago Connect. Cada pieza del stack que elegimos, por qué, y las cosas que haríamos diferente si empezáramos hoy.',
    content: `
<p>No existe un stack perfecto. Existe el stack que mejor resuelve tus constraints específicos. Acá están los nuestros y cómo los resolvimos.</p>

<h2>Next.js App Router — sí, a pesar de todo</h2>

<p>El App Router de Next.js tiene mala fama en ciertos círculos de desarrolladores. Curva de aprendizaje pronunciada, Server Components con comportamientos contraintuitivos, documentación que a veces asume que ya sabes lo que te está explicando.</p>

<p>Lo elegimos igual, por tres razones:</p>

<p>Primero, el SEO es crítico para Nebbuler. Cada sala de creador necesita ser indexable, con metadata dinámica correcta y tiempos de carga que Google premie. El App Router con Server Components resuelve esto sin configuración adicional.</p>

<p>Segundo, el modelo de rendering híbrido nos permite tener páginas estáticas (landing, directorio) y dinámicas (dashboard, sala de creador con contenido actualizado) sin cambiar de framework.</p>

<p>Tercero, el equipo ya conocía React. El costo de aprendizaje del App Router fue real pero amortizable.</p>

<h2>Supabase — la decisión que más reivindicamos</h2>

<p>Supabase fue la decisión más rápida y la que menos dudas generó. PostgreSQL como base de datos principal, autenticación incluida, Row Level Security para políticas de acceso por usuario, y una API automática que redujo drásticamente el tiempo de desarrollo del backend.</p>

<p>La RLS (Row Level Security) de Supabase merece un párrafo aparte. Definir políticas de acceso a nivel de base de datos — no en el application layer — cambió la arquitectura de seguridad del producto. Un creador solo puede ver sus propios suscriptores. Un suscriptor solo puede ver el contenido al que está suscrito. Todo esto en reglas SQL, no en código de aplicación que alguien puede olvidar poner.</p>

<p>Lo que no anticipamos: la latencia desde el sur de América. Migramos a una instancia en São Paulo (la más cercana disponible) y la mejora fue notable en conexiones desde Argentina y Colombia.</p>

<h2>Vercel — sin sorpresas</h2>

<p>Vercel era la opción obvia para Next.js y siguió siendo obvia. Zero-config deployment, preview environments por cada PR, edge functions cuando las necesitamos. Sin incidentes de producción atribuibles a la infraestructura en todo el período inicial.</p>

<p>El costo escaló más rápido de lo esperado cuando empezamos a servir imágenes optimizadas para los perfiles de creadores. Implementamos un límite en el tamaño de imágenes de cover y el problema se resolvió.</p>

<h2>Las cosas que cambiaríamos</h2>

<p>Primera: el sistema de emails. Empezamos con Resend (excelente para emails transaccionales simples) pero a medida que crecimos necesitamos secuencias de onboarding, recordatorios de renovación y notificaciones de nuevos suscriptores con más control. Hoy usamos Resend con lógica propia. Si empezáramos de nuevo, evaluaríamos una solución más completa desde el inicio.</p>

<p>Segunda: el sistema de búsqueda. Usamos Meilisearch para el directorio de creadores y funciona bien técnicamente, pero la indexación automática cuando un creador actualiza su perfil tiene una latencia que a veces genera inconsistencias visibles. Un índice de búsqueda más simple integrado directamente con Supabase probablemente habría sido suficiente para los primeros meses.</p>

<h2>Lo que no cambiaríamos</h2>

<p>TypeScript en todo el proyecto desde el día uno. En un equipo pequeño donde la misma persona toca frontend, backend y scripts de automatización, el typesystem es el único compañero de pair programming que está siempre disponible.</p>

<p>Tests para los flujos de pago desde el principio. Tener cobertura del ciclo completo de una suscripción — creación, pago, acceso a contenido, renovación, cancelación — nos salvó de bugs críticos en producción que habríamos detectado solo cuando un usuario reportara que no podía acceder a contenido por el que pagó.</p>
    `,
  },

  {
    id: 4,
    slug: 'primeros-usuarios-como-los-conseguimos',
    title: 'Los primeros usuarios: qué funcionó, qué no, y por qué el canal más obvio fue el peor',
    date: '17 mayo 2026',
    isoDate: '2026-05-17',
    readingTime: 6,
    excerpt:
      'Twitter/X fue el canal menos eficiente. LinkedIn fue el mejor. El contacto directo superó a todos. Lo que aprendimos de cada canal en los primeros 45 días.',
    content: `
<p>El consejo más común que recibimos cuando lanzamos: "tienes que estar en Twitter". Lo probamos. Los números no mienten.</p>

<h2>Los canales que usamos</h2>

<p>Durante los primeros 45 días usamos cinco canales para conseguir creadores que abrieran su sala en Nebbuler: contacto directo personalizado, LinkedIn, Twitter/X, comunidades de Slack, y product directories.</p>

<p>El contacto directo personalizado fue el canal con mayor conversión por lejos. Cada mensaje tardaba entre 20 y 40 minutos en investigar y redactar — referenciábamos contenido específico que el profesional había publicado. No escala, pero funciona. Y más importante: enseña.</p>

<p>LinkedIn fue el segundo canal más eficiente. Publicar contenido sobre el proceso de construcción del producto — no publicidad directa — generó conversaciones con profesionales que se identificaban con el problema que resolvemos.</p>

<p>Twitter/X fue el canal con peor relación esfuerzo-resultado. Mucho tiempo, pocas conversiones.</p>

<p>Las comunidades de Slack de freelancers y profesionales LATAM funcionaron mejor cuando respondíamos preguntas genuinas sobre monetización, no cuando publicábamos anuncios directos.</p>

<p>Los product directories no generaron conversiones directas medibles en los primeros 45 días. Su valor es a largo plazo, en búsquedas orgánicas.</p>

<h2>Por qué Twitter/X fue el peor canal</h2>

<p>La audiencia de Twitter en español en LATAM está altamente fragmentada. El contenido sobre productos SaaS compite con política, humor, deporte y todo lo demás en el mismo feed.</p>

<p>Más importante: el perfil de creador que buscamos — el profesional establecido con credenciales reales que quiere cobrar por análisis premium — pasa menos tiempo en Twitter que en LinkedIn. Son personas que publican informes, no hilos.</p>

<p>Seguimos usando Twitter como canal de visibilidad de marca, no de adquisición directa.</p>

<h2>Lo que aprendimos sobre el contacto directo</h2>

<p>El contacto directo no escala, pero enseña algo que ningún otro canal puede: por qué exactamente alguien dice que sí o que no.</p>

<p>De los que rechazaron la propuesta, los motivos principales fueron: "no tengo tiempo de crear contenido consistentemente", "mi audiencia no pagaría", "ya uso otra plataforma", "el precio es alto para lo que ofrecen".</p>

<p>Esas objeciones nos sirvieron para cambiar tres cosas: el onboarding (bajamos el tiempo de primer contenido publicado), la propuesta de valor (fuimos más específicos sobre qué tipo de profesional funciona en Nebbuler), y los ejemplos de creadores exitosos que mostramos en el pitch.</p>

<h2>El canal que subestimamos</h2>

<p>El boca a boca entre los primeros creadores trajo nuevos creadores sin que hiciéramos nada. El mecanismo fue simple: un creador que funcionaba bien en la plataforma se lo mencionaba a un colega en una conferencia o llamada de trabajo. Sin incentivo formal, sin programa de referidos. Solo satisfacción con el producto.</p>

<p>A partir de ese descubrimiento, formalizamos el programa de invitaciones y el crecimiento por referido pasó de ser accidental a ser sistemático.</p>
    `,
  },

  {
    id: 5,
    slug: 'por-que-newsletters-espanol-fracasan',
    title: 'Por qué la mayoría de newsletters en español fracasan (y no es falta de audiencia)',
    date: '20 mayo 2026',
    isoDate: '2026-05-20',
    readingTime: 5,
    excerpt:
      'Hay millones de profesionales latinoamericanos publicando contenido gratis en LinkedIn. El problema no es la audiencia — es la infraestructura para cobrar.',
    content: `
<p>El diagnóstico habitual sobre los newsletters en español es que la audiencia latinoamericana "no está acostumbrada a pagar por contenido digital". Es una hipótesis cómoda que excusa a las plataformas de resolver el problema real.</p>

<h2>La audiencia está. El problema es la fricción</h2>

<p>El perfil del suscriptor que paga no es el de un consumidor casual de contenido gratuito. Es un profesional que ya seguía al creador en LinkedIn o Twitter, que ya leía su contenido gratis, y que pagó por acceso exclusivo cuando tuvo la posibilidad de hacerlo con su tarjeta local sin fricción.</p>

<p>La hipótesis de "los latinoamericanos no pagan" ignora que hasta hace muy poco era técnicamente difícil pagarle a un profesional independiente en LATAM. No había plataforma en español, con tarjetas locales, sin conversión de moneda, diseñada para este perfil específico de creador.</p>

<p>Cuando eliminamos la fricción del pago, los creadores que abrieron sala en Nebbuler procesaron sus primeras suscripciones mucho antes de lo que esperaban. No meses — días. La demanda existía. Lo que faltaba era la infraestructura para recibirla.</p>

<h2>El problema real: la plataforma equivocada</h2>

<p>Un abogado tributario con 15 años de experiencia que quiere cobrar por su newsletter de análisis fiscal tiene tres opciones: Substack (en inglés, cobra comisión, paga en dólares), Patreon (pensado para artistas y gamers, cobra en dólares), o construirse su propio sistema.</p>

<p>Ninguna de las tres opciones está diseñada para él. La plataforma trata su análisis fiscal de la misma manera que trata el fanart de un dibujante. La propuesta de valor no existe.</p>

<p>La consecuencia: ese abogado publica gratis en LinkedIn, acumula audiencia, y nunca convierte esa audiencia en ingresos recurrentes porque la infraestructura para hacerlo no existe en su contexto.</p>

<h2>La diferencia que hace la moneda local</h2>

<p>Cuando un suscriptor colombiano puede pagar a un economista colombiano en pesos colombianos, sin necesitar activar pagos internacionales en su banco, la conversión es radicalmente diferente.</p>

<p>Hemos visto el mismo patrón repetidamente: creadores que intentaron cobrar suscripciones con soluciones en dólares durante meses sin éxito, y que procesaron su primera suscripción en Nebbuler en los primeros días. No cambió el contenido. No cambió el precio en términos reales. Cambió la moneda y la plataforma.</p>

<h2>Lo que sí es un problema real</h2>

<p>La consistencia. El mayor fracaso de newsletters en español no es técnico ni monetario — es la dificultad de publicar con regularidad durante meses sin ver resultados inmediatos.</p>

<p>Los creadores que funcionan en Nebbuler tienen en común una cosa: publican sin importar si alguien está leyendo. La audiencia y los suscriptores llegan después, no antes.</p>

<p>El ciclo de feedback positivo en newsletters de pago es más lento que en redes sociales. No hay likes ni comentarios instantáneos. Hay suscriptores que pagan en silencio y leen sin necesariamente interactuar. Muchos creadores interpretan ese silencio como falta de interés y se rinden antes de que el volante empiece a girar.</p>

<p>La infraestructura resolvemos nosotros. La consistencia la tiene que traer el creador.</p>
    `,
  },

  {
    id: 6,
    slug: 'mundial-2026-programa-la-sombra',
    title: 'Por qué construimos algo para el Mundial 2026: la lógica detrás del Programa La Sombra',
    date: '21 mayo 2026',
    isoDate: '2026-05-21',
    readingTime: 4,
    excerpt:
      'El Mundial genera el mayor tráfico de búsquedas en español de los últimos cuatro años. Diseñamos el Programa La Sombra para que los periodistas deportivos de LATAM cobren durante ese pico.',
    content: `
<p>El Mundial de Fútbol 2026 empieza el 11 de junio. Para los periodistas deportivos de América Latina, ese día marca el inicio de 40 días de cobertura intensa, audiencias masivas, y en la mayoría de los casos, cero ingresos directos de esa audiencia.</p>

<p>El Programa La Sombra nació de una pregunta simple: ¿qué le impide a un periodista deportivo cobrar membresías durante el Mundial?</p>

<h2>El periodista deportivo en LATAM</h2>

<p>El perfil es conocido: tiene años de trayectoria, tiene una audiencia real que lo sigue con fidelidad, y produce análisis que los medios tradicionales no pueden o no quieren publicar por restricciones editoriales, de espacio o de formato.</p>

<p>Ese periodista publica en Twitter, en Instagram, en YouTube. Genera engagement real. Y no cobra nada de esa audiencia porque las herramientas para hacerlo no están diseñadas para su contexto: análisis deportivo en español, audiencia latinoamericana, moneda local.</p>

<h2>La oportunidad del Mundial</h2>

<p>El Mundial 2026 es el evento de mayor tráfico de búsqueda en español en cuatro años. Cada partido de Argentina, México, Brasil, Colombia, Uruguay genera millones de búsquedas en Google en las horas previas y posteriores.</p>

<p>Un periodista que cubra ese partido con análisis de calidad tiene frente a sí una audiencia capturada por el evento, buscando activamente más información. Si tiene la infraestructura para ofrecer membresías en ese momento, puede convertir parte de esa audiencia en suscriptores que seguirán pagando después del Mundial.</p>

<h2>Cómo funciona La Sombra</h2>

<p>Simple: 0% de comisión variable durante todo el Mundial. La tarifa fija de Nebbuler cubre la operación; el periodista se queda con el 100% de cada suscripción, menos los cargos del procesador de pagos.</p>

<p>Setup en 24 horas. Cobro en pesos — la moneda de su audiencia. Sin conversión, sin fricciones.</p>

<p>El nombre viene de la cobertura "en la sombra": el análisis que el periodista no puede publicar en su medio principal pero que su audiencia más comprometida quiere leer.</p>

<h2>La estrategia parasitaria que no nos da vergüenza</h2>

<p>Construimos 104 páginas — una por cada partido del Mundial — que rankean en Google con las búsquedas de cada partido. Cada página enlaza al Programa La Sombra.</p>

<p>Sí, es SEO parasitario sobre el tráfico del Mundial. Lo hacemos explícitamente porque el beneficio es legítimo: conectar a un periodista deportivo con la audiencia que ya lo busca en Google y que hoy no tiene forma de pagarle.</p>

<p>El Mundial genera visibilidad. Nosotros ofrecemos la infraestructura para convertir esa visibilidad en ingresos. No parece un trato injusto para nadie.</p>
    `,
  },
]
