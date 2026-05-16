export interface ContentTemplate {
  text: string
  imageTone: 'professional' | 'viral'
}

// Templates rediseñados — viral, con datos reales, hooks que paran el scroll
const TEMPLATES: ContentTemplate[] = [

  // === HISTORIAS CON NÚMEROS REALES ===
  {
    text: `Viernes, 11 PM. Un economista publicó su análisis mensual de inflación.

Lo mismo que lleva 6 años regalando en LinkedIn.

Esta vez lo publicó detrás de un paywall.

72 horas después: 87 suscriptores. $2.608.130 CLP recurrentes, todos los meses.

Sin dejar su trabajo. Sin nuevos clientes.

Si llevas años regalando tu criterio, ya sabes qué hacer.

nebbuler.com — 0% comisión.`,
    imageTone: 'viral',
  },
  {
    text: `100 personas pagaron para leer lo que un abogado ya sabe.

Él no hizo nada nuevo. Solo dejó de regalarlo.

$2.999.000 CLP al mes, recurrentes. Sin juicios. Sin reuniones de domingo.

El conocimiento jurídico tiene mercado. Nebbuler te da el canal para cobrarlo.

nebbuler.com/para-creadores`,
    imageTone: 'professional',
  },
  {
    text: `La cuenta que ningún profesional se hace:

Tu expertise → consultoría por hora → ingresos con techo.
Tu expertise → newsletter de pago → ingresos sin techo.

Un médico con 150 suscriptores a $19.990 CLP/mes genera $2.998.500 al mes. Recurrente. Sin ampliar el consultorio.

¿Cuánto tiempo más vas a regalar lo que la gente ya quiere pagar?

nebbuler.com — plataforma para profesionales LATAM`,
    imageTone: 'viral',
  },
  {
    text: `Lo que ningún contador en LATAM te va a contar:

Cada cambio tributario que explicas gratis en WhatsApp vale dinero.
Cada alerta de nueva normativa que envías a clientes "de regalo" vale dinero.
Cada análisis que subes a LinkedIn sin cobrar vale dinero.

El modelo existe. Se llama newsletter de pago.

200 suscriptores × $9.990 CLP = $1.998.000/mes extra.

nebbuler.com — sin comisión`,
    imageTone: 'professional',
  },

  // === PROVOCACIÓN / PREGUNTA ===
  {
    text: `¿Cuánto cuesta una hora de tu tiempo como profesional?

$50.000 CLP. $100.000. $200.000.

¿Cuántas horas tienes disponibles al mes?

Ahora imagina cobrar por lo que sabes sin que te cueste ni una hora adicional.

Un análisis escrito una vez. 300 personas lo pagan. El mismo mes. Todos los meses.

Nebbuler es la plataforma para profesionales LATAM que entienden esta diferencia.

nebbuler.com`,
    imageTone: 'viral',
  },
  {
    text: `Economistas, abogados, médicos de LATAM:

Ustedes tienen algo que Bloomberg, The Economist y Reuters no tienen.

Contexto regional. Idioma local. Criterio sobre lo que realmente importa aquí.

Y lo están regalando.

Nebbuler es la plataforma donde ese criterio tiene precio.

0% comisión. Pagos en tu moneda. nebbuler.com`,
    imageTone: 'professional',
  },
  {
    text: `El error más caro que comete un profesional:

Construir audiencia en LinkedIn, Twitter, YouTube — gratis — y nunca monetizarla directamente.

Las plataformas te usan para vender publicidad. Tú no ves un peso.

El modelo que cambia eso: cobrar suscripción directa a tu audiencia.

Sin intermediario. Sin algoritmo. Sin comisión.

Nebbuler. nebbuler.com/para-creadores`,
    imageTone: 'viral',
  },
  {
    text: `Substack: 10% de tus ingresos.
Patreon: hasta 12%.
Kajabi: $200 USD/mes + porcentaje.

Nebbuler: 0%.

Todo lo que ganas es tuyo.

Para economistas, abogados, médicos y consultores en LATAM que ya tienen criterio para cobrar.

nebbuler.com`,
    imageTone: 'professional',
  },

  // === DATOS DUROS ===
  {
    text: `¿Sabes cuánto genera un profesional LATAM con 100 suscriptores de pago?

A $9.990 CLP/mes → $999.000 recurrentes
A $19.990 CLP/mes → $1.999.000 recurrentes
A $29.990 CLP/mes → $2.999.000 recurrentes

Sin consultores. Sin empleados. Sin infraestructura.

Solo tu expertise + una audiencia que ya quiere pagarte.

Nebbuler — 0% comisión. nebbuler.com`,
    imageTone: 'professional',
  },
  {
    text: `Un economista chileno gana en promedio $3.200.000/mes por su tiempo.

¿Cuánto podría ganar por su conocimiento?

El límite del tiempo: 160 horas al mes.
El límite del conocimiento: no existe.

Un análisis que escribiste en 4 horas puede pagarlo 500 personas. Todos los meses.

Ese es el modelo que Nebbuler habilita. nebbuler.com/para-creadores`,
    imageTone: 'viral',
  },

  // === LATAM ESPECÍFICO ===
  {
    text: `Para profesionales en Chile, Colombia, México, Argentina, Perú:

Hay una razón por la que las plataformas de newsletters más conocidas no funcionan bien acá.

Cobran en dólares. No entienden el mercado local. Se quedan con el 10% de lo que ganas.

Nebbuler fue construido específicamente para LATAM. Pagos en pesos. 0% comisión.

nebbuler.com`,
    imageTone: 'professional',
  },
  {
    text: `La diferencia entre un profesional con $500.000 extra al mes y uno sin ellos no es el talento.

Es que uno decidió cobrar por lo que ya sabe.

En Nebbuler, economistas, abogados y médicos de LATAM publican análisis de pago y generan ingresos recurrentes desde el primer mes.

¿Cuál es tu excusa para no hacerlo?

nebbuler.com/para-creadores`,
    imageTone: 'viral',
  },

  // === PARA PROFESIONES ESPECÍFICAS ===
  {
    text: `Para los abogados que leen esto:

Cada reforma tributaria que explicás en redes vale dinero.
Cada alerta laboral que compartís en grupos vale dinero.
Cada análisis de jurisprudencia que redactás "gratis" vale dinero.

150 empresas suscriptas a $100.000 COP/mes = $15.000.000 mensuales.

Sin nuevos clientes. Sin ampliar el estudio.

nebbuler.com — plataforma para abogados LATAM`,
    imageTone: 'professional',
  },
  {
    text: `Para los médicos que leen esto:

Tu criterio clínico vale fuera del consultorio.

200 pacientes o colegas pagando $9.990 CLP por tu newsletter mensual = $1.998.000 extra al mes.

Sin ampliar horarios. Sin más consultas.

Nebbuler es la plataforma para profesionales de la salud que quieren monetizar su conocimiento.

nebbuler.com`,
    imageTone: 'professional',
  },
  {
    text: `Para los economistas que leen esto:

Tu análisis macro, tus proyecciones, tu lectura del mercado local — tienen un precio que el mercado ya está dispuesto a pagar.

El problema no es la demanda. Es que nunca te enseñaron a cobrar por ella.

Nebbuler es el lugar donde eso cambia.

nebbuler.com/para-creadores — 0% comisión`,
    imageTone: 'viral',
  },

  // === HOOKS EMOCIONALES ===
  {
    text: `Hay algo que nadie te dice sobre monetizar tu conocimiento:

No necesitas ser famoso.
No necesitas mil seguidores.
No necesitas una empresa.

Necesitas 50 personas que paguen por lo que ya sabes.

50 × $19.990 CLP = $999.500/mes recurrentes.

Ese es el punto de partida real. Nebbuler te da la plataforma para llegar ahí.

nebbuler.com`,
    imageTone: 'viral',
  },
  {
    text: `El modelo de negocio más infravalorado para profesionales independientes en LATAM:

Newsletter de pago. Suscripción mensual. 0% intermediario.

No es nuevo. No es complicado. Solo requiere una decisión:

Dejar de regalar lo que la gente ya quiere pagarte.

nebbuler.com — para economistas, abogados, médicos y consultores`,
    imageTone: 'professional',
  },
  {
    text: `Cada semana regalas conocimiento que tiene precio.

Cada análisis que publicas gratis en LinkedIn es ingreso que no cobras.
Cada respuesta experta en WhatsApp es tiempo que no factura.
Cada informe que mandas "de cortesía" es trabajo que no se paga.

El mercado existe. Solo falta el canal.

Nebbuler es ese canal. 0% comisión. nebbuler.com`,
    imageTone: 'viral',
  },

  // === COMPARACIONES ===
  {
    text: `¿Qué tienen en común un economista, un abogado y un médico en Nebbuler?

Los tres generan ingresos recurrentes sin agregar horas de trabajo.
Los tres cobran en pesos, en su moneda local.
Los tres se quedaron con el 100% de lo que ganaron.

La diferencia con las plataformas globales: Nebbuler fue hecho para ellos.

nebbuler.com/para-creadores`,
    imageTone: 'professional',
  },
  {
    text: `No es ingreso pasivo. Es ingreso inteligente.

Pasivo implica que no haces nada. Eso no existe.

Inteligente implica que el esfuerzo que ya estás haciendo — análisis, investigación, criterio — se monetiza directamente, sin intermediario, sin límite de escala.

Eso es exactamente lo que hace Nebbuler para profesionales en LATAM.

nebbuler.com — 0% comisión`,
    imageTone: 'viral',
  },
  {
    text: `La pregunta que todo profesional debería hacerse:

¿Cuánto vale tu conocimiento para alguien que toma decisiones con él?

Para un CFO que lee tu análisis económico: mucho más de lo que cobras.
Para una empresa que sigue tus alertas legales: mucho más de lo que cobras.
Para un paciente que confía en tu criterio médico: mucho más de lo que cobras.

Nebbuler te ayuda a capturar ese valor. nebbuler.com`,
    imageTone: 'professional',
  },

  // === URGENCIA / TIMING ===
  {
    text: `El mercado de newsletters profesionales en LATAM está en sus primeros días.

Los que entran ahora construyen audiencia antes que la competencia.
Los que esperan van a entrar cuando ya sea más difícil.

El momento óptimo para lanzar tu newsletter de pago es ahora.

nebbuler.com/para-creadores — plataforma para profesionales LATAM`,
    imageTone: 'viral',
  },
  {
    text: `¿Qué haría un economista, abogado o médico con $2.000.000 CLP extra al mes?

La pregunta correcta no es si puedes generarlos.
La pregunta es: ¿cuándo vas a empezar?

Nebbuler — donde los profesionales LATAM cobran por su conocimiento.

nebbuler.com`,
    imageTone: 'professional',
  },
  {
    text: `En los próximos 3 años, el mercado de newsletters profesionales en español va a crecer 10 veces.

Los creadores que ya están posicionados cuando eso pase van a dominar.

Los que esperaron van a pagar el precio de haber esperado.

Nebbuler — para profesionales que no esperan. nebbuler.com/para-creadores`,
    imageTone: 'viral',
  },

  // === CASOS LATAM ESPECÍFICOS ===
  {
    text: `Para el contador que explica el SII en Chile:
Para el abogado que analiza la DIAN en Colombia:
Para el economista que sigue Banxico en México:

Su audiencia ya existe. Ya los sigue. Ya confía en su criterio.

Solo falta un paso: que paguen directamente por ese conocimiento.

Nebbuler. 0% comisión. Pagos en pesos. nebbuler.com`,
    imageTone: 'professional',
  },
  {
    text: `Hay miles de profesionales en LATAM con criterio que vale oro.

Y lo regalan todos los días.

En LinkedIn. En Twitter. En grupos de WhatsApp. En reuniones de networking.

Gratis. Sin cobrar. Sin escalar.

Nebbuler existe para cambiar eso.

nebbuler.com/para-creadores`,
    imageTone: 'viral',
  },
  {
    text: `Lo que separa a un profesional con ingresos escalabes de uno sin ellos:

No es el talento. Todos los que se graduaron tienen suficiente.
No son los contactos. Todos tienen una red.
No es el tiempo. Nadie tiene tiempo extra.

Es haber decidido que su conocimiento merece ser pagado directamente.

Nebbuler es la plataforma para esa decisión. nebbuler.com`,
    imageTone: 'viral',
  },
  {
    text: `Substack tiene 3 millones de creadores pagos. Casi todos en inglés.

El mercado en español — para economistas, abogados, médicos de LATAM — está prácticamente vacío.

Esa es la oportunidad.

Nebbuler es la plataforma nativa para ese mercado. 0% comisión.

nebbuler.com`,
    imageTone: 'professional',
  },
]

export function getTodayTemplate(): ContentTemplate {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  const index = dayOfYear % TEMPLATES.length
  return TEMPLATES[index]
}

export { TEMPLATES }
