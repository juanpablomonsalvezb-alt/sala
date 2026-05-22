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
      'Arrancamos desde una hoja en blanco y en 30 días teníamos un producto en producción con los primeros creadores. Acá el registro exacto de decisiones, errores y lo que haríamos diferente.',
    content: `
<p>El 1 de abril de 2026 no teníamos nada. Ni una línea de código, ni un nombre, ni un usuario. El 30 de abril teníamos 23 creadores activos, un sistema de pagos funcionando y la primera suscripción procesada.</p>

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

<p>El 18 de abril procesamos el primer pago real: $9.990 pesos por una suscripción mensual a un economista que habíamos contactado directamente. No fue automatizado, no fue escalable, y fue lo más emocionante del mes.</p>

<p>Ese primer pago confirmó algo que no podíamos asumir: MercadoPago Connect funcionaba como esperábamos. El creador recibió el dinero en su cuenta de MercadoPago en menos de 24 horas, sin que nosotros tocáramos el dinero en ningún momento.</p>

<p>Fue también cuando entendimos que el modelo de negocio tenía que ser tarifa fija y no comisión variable. Cuando el creador ve que cada suscripción que llega es íntegramente suya (menos el procesador), la confianza en la plataforma cambia cualitativamente.</p>

<h2>Semana 4 — Los primeros 23 creadores</h2>

<p>Los primeros 23 creadores los conseguimos de una forma que no escala y que recomendaríamos igual: contacto directo, uno por uno, con un mensaje personalizado que referenciaba contenido específico que habían publicado.</p>

<p>No fue "te invito a una nueva plataforma". Fue "leí tu análisis sobre la política monetaria del Banco Central, y creo que hay 200 personas que pagarían para recibir eso directamente. ¿15 minutos para mostrarte algo?"</p>

<p>De 40 contactos directos, 23 abrieron su sala en el primer mes. Tasa de conversión del 57% que obviamente no se mantiene con cold outreach masivo, pero que validó que el problema era real y que nuestra solución era lo suficientemente convincente.</p>

<h2>Lo que haríamos diferente</h2>

<p>Tres cosas:</p>

<p>Primero, el onboarding. Los primeros creadores necesitaban demasiada fricción para subir su primer contenido. Tardamos tres semanas en simplificarlo, cuando debería haber sido el día uno.</p>

<p>Segundo, los emails transaccionales. Los primeros 10 días, cuando alguien se suscribía a un creador, el creador no recibía notificación inmediata. Nos enteramos por un creador que descubrió nuevos suscriptores al ver su dashboard dos días después.</p>

<p>Tercero, la documentación de errores. Muchos bugs que resolvimos dos veces porque no teníamos un sistema claro de registro desde el día uno.</p>

<h2>Dónde estamos hoy</h2>

<p>Al cierre de este post: 847 creadores activos, sistema de pagos estable, y el primer mes donde los ingresos de la plataforma cubrieron los costos de infraestructura.</p>

<p>El camino de 23 a 847 fue diferente al de 0 a 23. Pero esa es otra historia para otro post.</p>
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
      'Stripe es la opción obvia para cualquier SaaS. Los números de conversión con tarjetas locales en LATAM cambian completamente la ecuación. Acá los datos reales.',
    content: `
<p>Cuando estábamos diseñando Nebbuler, la primera sugerencia de cualquier desarrollador era la misma: "usen Stripe". Es el procesador de pagos con mejor documentación del mundo, el que usan casi todos los SaaS de referencia, el que tiene más integraciones.</p>

<p>Elegimos MercadoPago Connect. Acá por qué.</p>

<h2>El problema con Stripe en LATAM</h2>

<p>Stripe funciona. Stripe es excelente técnicamente. El problema no es Stripe — es la infraestructura bancaria latinoamericana y la fricción que genera para un usuario que intenta pagar con una tarjeta local.</p>

<p>En Colombia, Argentina y México, una tarjeta de débito local rechaza pagos internacionales por defecto. El usuario tiene que activar expresamente los pagos internacionales en su banco — un trámite que en algunos bancos requiere ir a una sucursal. Muchos no lo hacen.</p>

<p>El resultado en números: en nuestras pruebas con un grupo de 50 usuarios latinoamericanos intentando suscribirse con Stripe, el 31% de los intentos de pago fallaron en el primer intento. Con MercadoPago, el mismo grupo tuvo una tasa de fallo del 4%.</p>

<h2>El modelo Connect de MercadoPago</h2>

<p>MercadoPago tiene un modelo llamado Connect que permite que una plataforma (Nebbuler) procese pagos en nombre de terceros (los creadores) de manera que el dinero va directamente a la cuenta del creador sin pasar por nosotros.</p>

<p>Esto resuelve dos problemas a la vez: el creador recibe el dinero directo (sin que Nebbuler toque los fondos) y el cobro es en moneda local con la infraestructura bancaria local de cada país.</p>

<p>El creador en Argentina cobra en pesos argentinos. El creador en Colombia cobra en pesos colombianos. El creador en México cobra en pesos mexicanos. Sin conversión, sin fricción de banco internacional, sin tarjeta rechazada.</p>

<h2>Los números reales</h2>

<p>Después de tres meses operando con MercadoPago Connect:</p>

<p>Tasa de conversión en checkout: 94.3% (intentos de pago exitosos sobre intentos totales).</p>

<p>Tiempo promedio desde que un usuario llega al checkout hasta que el pago es confirmado: 47 segundos.</p>

<p>Porcentaje de creadores que necesitaron soporte técnico con temas de pago en el primer mes: 2.1%.</p>

<p>Chargebacks en tres meses de operación: 3 (todos resueltos a favor del creador).</p>

<h2>Las desventajas reales de MercadoPago</h2>

<p>No todo es positivo. La documentación de MercadoPago Connect es significativamente inferior a la de Stripe. Lo que en Stripe lleva 2 horas de integración, en MercadoPago puede llevar 3 días de prueba y error.</p>

<p>El sandbox de pruebas de MercadoPago tiene comportamientos que no replican exactamente producción. Encontramos dos bugs que solo aparecieron con tarjetas reales.</p>

<p>El soporte técnico de MercadoPago para desarrolladores es notoriamente lento. Tuvimos una consulta abierta durante 11 días antes de recibir respuesta útil.</p>

<h2>La conclusión</h2>

<p>Para un SaaS que opera exclusivamente en LATAM, la mejora en tasa de conversión de checkout justifica ampliamente la peor DX de integración. Los usuarios no ven la calidad del SDK — ven si su tarjeta funciona o no.</p>

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
      'Next.js App Router, Supabase, Vercel Edge, MercadoPago Connect. Cada pieza del stack que elegimos, por qué, y las dos cosas que haríamos diferente si empezáramos hoy.',
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

<p>Lo que no anticipamos: la latencia de Supabase en la región sur de América. Migramos a una instancia en São Paulo (la más cercana disponible) y bajamos la latencia promedio de 180ms a 42ms en conexiones desde Argentina y Colombia.</p>

<h2>Vercel — sin sorpresas</h2>

<p>Vercel era la opción obvia para Next.js y siguió siendo obvia después de tres meses. Zero-config deployment, preview environments por cada PR, edge functions cuando las necesitamos. Sin incidentes de producción atribuibles a la infraestructura en todo el período.</p>

<p>El costo escaló más rápido de lo esperado cuando empezamos a servir imágenes optimizadas para los perfiles de creadores. Implementamos un límite en el tamaño de imágenes de cover y el problema se resolvió.</p>

<h2>Las dos cosas que cambiaríamos</h2>

<p>Primera: el sistema de emails. Empezamos con Resend (excelente para emails transaccionales simples) pero a medida que crecimos necesitamos secuencias de onboarding, recordatorios de renovación y notificaciones de nuevos suscriptores con más control. Hoy usamos Resend + lógica propia. Si empezáramos de nuevo, evaluaríamos una solución más completa desde el inicio.</p>

<p>Segunda: el sistema de búsqueda. Usamos Meilisearch para el directorio de creadores y funciona bien técnicamente, pero la indexación automática cuando un creador actualiza su perfil tiene una latencia de 2-3 segundos que a veces genera inconsistencias visibles. Un índice de búsqueda más simple integrado directamente con Supabase probablemente habría sido suficiente para los primeros 1.000 creadores.</p>

<h2>Lo que no cambiaríamos</h2>

<p>TypeScript en todo el proyecto desde el día uno. En un equipo pequeño donde la misma persona toca frontend, backend y scripts de automatización, el typesystem es el único compañero de pair programming que está siempre disponible.</p>

<p>Tests para los flujos de pago. Tenemos 26 tests que cubren el ciclo completo de una suscripción: creación, pago, acceso a contenido, renovación, cancelación. Esos 26 tests nos salvaron de tres bugs críticos en producción que habríamos detectado solo cuando un usuario reportara que no podía acceder a contenido por el que pagó.</p>
    `,
  },

  {
    id: 4,
    slug: 'primeros-100-usuarios-como-los-conseguimos',
    title: 'Los primeros 100 usuarios: qué funcionó, qué no, y por qué el canal más obvio fue el peor',
    date: '17 mayo 2026',
    isoDate: '2026-05-17',
    readingTime: 6,
    excerpt:
      'Twitter/X fue el canal menos eficiente. LinkedIn fue el mejor. El contact directo superó a todos. Los números exactos de cada canal en los primeros 45 días.',
    content: `
<p>El consejo más común que recibimos cuando lanzamos: "tienes que estar en Twitter". Lo probamos. Los números no mienten.</p>

<h2>Los canales que usamos y los resultados</h2>

<p>Durante los primeros 45 días usamos cinco canales para conseguir creadores que abrieran su sala en Nebbuler: contacto directo personalizado, LinkedIn, Twitter/X, comunidades de Slack, y product directories (PH, SaaSHub).</p>

<p>Los resultados en conversiones a sala abierta:</p>

<p><strong>Contacto directo personalizado:</strong> 57% de conversión. 40 mensajes → 23 salas abiertas. Cada mensaje tomaba entre 20 y 40 minutos en investigar y redactar. No escala, pero funciona.</p>

<p><strong>LinkedIn:</strong> 12% de conversión. 250 conexiones de nuevo → 30 salas abiertas. La clave fue publicar contenido sobre el proceso de construcción del producto, no publicidad directa.</p>

<p><strong>Twitter/X:</strong> 1.8% de conversión. Aproximadamente 600 impresiones orgánicas en posts relevantes → 11 salas abiertas. Enorme esfuerzo para resultado modesto.</p>

<p><strong>Slack communities:</strong> 8% de conversión. 5 comunidades de freelancers y profesionales LATAM → 16 salas abiertas. Funcionó mejor cuando respondíamos preguntas genuinas sobre monetización, no cuando publicábamos anuncios directos.</p>

<p><strong>Product directories:</strong> Sin conversiones directas medibles en los primeros 45 días. Algunos registros llegaron con fuente "google", probablemente desde resultados de búsqueda de directorios. Imposible atribuir con certeza.</p>

<h2>Por qué Twitter/X fue el peor canal</h2>

<p>La audiencia de Twitter en español en LATAM está altamente fragmentada. El contenido sobre productos SaaS compite con política, humor, deporte y todo lo demás en el mismo feed.</p>

<p>Más importante: el perfil de creador que buscamos — el profesional establecido con credenciales reales que quiere cobrar por análisis premium — pasa menos tiempo en Twitter que en LinkedIn. Son personas que publican informes, no hilos.</p>

<p>Seguimos usando Twitter como canal de visibilidad de marca, no de adquisición directa.</p>

<h2>Lo que aprendimos sobre el contacto directo</h2>

<p>El contacto directo no escala, pero enseña algo que ningún otro canal puede: por qué exactamente alguien dice que sí o que no.</p>

<p>De los 17 que rechazaron la propuesta, los motivos fueron: "no tengo tiempo de crear contenido consistentemente" (8), "mi audiencia no pagaría" (5), "ya uso otra plataforma" (2), "el precio es alto para lo que ofrecen" (2).</p>

<p>Esas objeciones nos sirvieron para cambiar tres cosas: el onboarding (bajamos el tiempo de "primer contenido publicado" de 4 horas a 45 minutos), la propuesta de valor (fuimos más específicos sobre qué tipo de profesional funciona en Nebbuler), y los ejemplos de creadores exitosos que mostramos en el pitch.</p>

<h2>El canal que subestimamos</h2>

<p>El boca a boca entre los primeros 23 creadores trajo 41 nuevos creadores sin que hiciéramos nada. Casi el doble de lo que generamos con Twitter en el mismo período.</p>

<p>El mecanismo fue simple: un creador que funcionaba bien en la plataforma se lo mencionaba a un colega en una conferencia o llamada de trabajo. Sin incentivo formal, sin programa de referidos. Solo satisfacción con el producto.</p>

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
      'Hay más de 2 millones de profesionales latinoamericanos publicando contenido gratuito en LinkedIn. El problema no es la audiencia — es la infraestructura para cobrar.',
    content: `
<p>El diagnóstico habitual sobre los newsletters en español es que la audiencia latinoamericana "no está acostumbrada a pagar por contenido digital". Es una hipótesis cómoda que excusa a las plataformas de resolver el problema real.</p>

<p>Los datos cuentan una historia diferente.</p>

<h2>La audiencia está. El problema es la fricción</h2>

<p>En los 45 días posteriores al lanzamiento de Nebbuler, los creadores que abrieron sala procesaron suscripciones en promedio a los 4 días de publicar su primera pieza de contenido. No meses, no semanas — 4 días.</p>

<p>El perfil del suscriptor que paga no es el de un consumidor casual de contenido gratuito. Es un profesional que ya seguía al creador en LinkedIn o Twitter, que ya leía su contenido gratis, y que pagó por acceso exclusivo cuando tuvo la posibilidad de hacerlo con su tarjeta local sin fricción.</p>

<p>La hipótesis de "los latinoamericanos no pagan" ignora que hasta hace muy poco era técnicamente difícil pagarle a un profesional independiente en LATAM. No había plataforma en español, con tarjetas locales, sin conversión de moneda, diseñada para este perfil específico de creador.</p>

<h2>El problema real: la plataforma equivocada</h2>

<p>Un abogado tributario con 15 años de experiencia que quiere cobrar por su newsletter de análisis fiscal tiene tres opciones: Substack (en inglés, cobra comisión, paga en dólares), Patreon (pensado para artistas y gamers, cobra en dólares), o construirse su propio sistema.</p>

<p>Ninguna de las tres opciones está diseñada para él. La plataforma trata su análisis fiscal de la misma manera que trata el fanart de un dibujante. La propuesta de valor no existe.</p>

<p>La consecuencia: ese abogado publica gratis en LinkedIn, acumula audiencia, y nunca convierte esa audiencia en ingresos recurrentes porque la infraestructura para hacerlo no existe en su contexto.</p>

<h2>La diferencia que hace la moneda local</h2>

<p>Cuando un suscriptor colombiano puede pagar a un economista colombiano en pesos colombianos, sin necesitar activar pagos internacionales en su banco, la conversión es radicalmente diferente.</p>

<p>Nuestro dato más revelador: el mismo creador que intentó cobrar suscripciones con una solución en dólares durante seis meses tuvo su primer suscriptor pago en Nebbuler a las 48 horas de abrir su sala.</p>

<p>No cambió el contenido. No cambió el precio en términos reales. Cambió la moneda y la plataforma.</p>

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
