export interface ContentTemplate {
  text: string
  imageTone: 'professional' | 'viral'
}

// 30 templates rotativos — 3 por ángulo, 10 ángulos
const TEMPLATES: ContentTemplate[] = [
  // 0% comisión
  {
    text: 'Substack se queda con el 10% de tus ingresos. Patreon, hasta el 12%. Nebbuler: 0% de comisión. Lo que ganas es tuyo. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Plataformas que cobran comisión sobre tu conocimiento: Substack, Patreon, Kajabi. Nebbuler cobra cero. Cada peso que generas te pertenece. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Tu expertise vale. Las comisiones, no. Publica, cobra y quédate con el 100% en Nebbuler. nebbuler.com',
    imageTone: 'viral',
  },

  // Para economistas
  {
    text: 'Tienes análisis macro que vale oro. ¿Por qué regalarlo en hilos de Twitter? Monetiza tu visión económica en Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Economistas en LATAM: su criterio sobre inflación, tipo de cambio y política fiscal tiene precio. Nebbuler es el lugar para cobrarlo. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Un informe mensual de coyuntura económica puede generar ingresos recurrentes. Nebbuler te da la plataforma y el 100% de lo recaudado. nebbuler.com',
    imageTone: 'viral',
  },

  // Para abogados
  {
    text: 'Abogado: tu interpretación jurídica es un activo. Publica análisis, cobras por acceso, 0% de comisión. Así funciona Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'El conocimiento legal que acumulas en años de práctica puede generar ingresos pasivos. Nebbuler te conecta con quienes lo necesitan. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Guías legales, alertas regulatorias, análisis de jurisprudencia. Tu expertise jurídico tiene mercado. Véndelo en Nebbuler. nebbuler.com',
    imageTone: 'viral',
  },

  // Para médicos
  {
    text: 'Médico: tu conocimiento clínico va más allá del consultorio. Publica contenido especializado y cobra por suscripción en Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Pacientes, colegas y empresas buscan criterio médico de calidad. Tú lo tienes. Nebbuler te permite monetizarlo sin intermediarios. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Un newsletter médico mensual, una guía clínica, un curso de formación continua. Todo eso es ingreso real con Nebbuler. nebbuler.com',
    imageTone: 'viral',
  },

  // Para arquitectos
  {
    text: 'Arquitecto: tu visión de ciudad, tus análisis urbanos, tu criterio de diseño tienen valor de mercado. Nebbuler te da el canal para cobrarlo. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Proyectos, tendencias, materiales, normativa. El conocimiento arquitectónico especializado genera ingresos en Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Tu portafolio impresiona. Tu análisis sectorial vale dinero. Monetiza tu expertise en arquitectura con Nebbuler. nebbuler.com',
    imageTone: 'viral',
  },

  // Para psicólogos
  {
    text: 'Psicólogo: tu metodología es un activo que puede escalar. Publica tu método, crea programas digitales, cobra en Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'El conocimiento en salud mental nunca fue tan demandado. Tu expertise psicológico tiene mercado. Nebbuler te da la plataforma. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'De la sala de espera a ingresos escalables. Psicólogos que publican en Nebbuler cobran sin límite de agenda. nebbuler.com',
    imageTone: 'viral',
  },

  // Para contadores
  {
    text: 'Contador: tu criterio tributario vale mucho más de lo que cobras por declaración. Monetiza tu conocimiento en Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Alertas tributarias, guías fiscales, análisis contable. Tu expertise puede generar ingresos recurrentes en Nebbuler. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Cada cambio tributario es una oportunidad. Publícalo en Nebbuler y cobra por el análisis que solo tú puedes dar. nebbuler.com',
    imageTone: 'viral',
  },

  // Para coaches
  {
    text: 'Coach: tu método merece ser pagado más allá de las sesiones individuales. Nebbuler te permite venderlo a escala. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Si tu método funciona en sesiones 1:1, funciona en digital. Nebbuler te da la plataforma para venderlo sin intermediarios. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Deja de intercambiar horas por dinero. Publica tu metodología en Nebbuler y cobra mientras duermes. nebbuler.com',
    imageTone: 'viral',
  },

  // Propuesta de valor general
  {
    text: 'Tu conocimiento es tuyo. La plataforma es tuya. Los ingresos son tuyos. Nebbuler: 0% comisión, 100% control. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'Profesionales que publican en Nebbuler no necesitan un jefe, un cliente único ni un horario fijo. Solo necesitan su expertise. nebbuler.com',
    imageTone: 'viral',
  },
  {
    text: 'Sin intermediarios. Sin comisiones. Sin límites de escala. Así funciona Nebbuler para profesionales que monetizan conocimiento. nebbuler.com',
    imageTone: 'professional',
  },

  // LATAM
  {
    text: 'Nebbuler es la plataforma para profesionales latinoamericanos que quieren monetizar su conocimiento sin depender de plataformas gringas. nebbuler.com',
    imageTone: 'viral',
  },
  {
    text: 'Desde Chile hasta México, profesionales LATAM publican su expertise en Nebbuler y cobran en su moneda local. nebbuler.com',
    imageTone: 'professional',
  },
  {
    text: 'El conocimiento profesional latinoamericano vale tanto como el de cualquier parte del mundo. Nebbuler te da la plataforma para demostrarlo. nebbuler.com',
    imageTone: 'viral',
  },
]

/**
 * Devuelve el template del día usando el día del año como índice.
 * Determinista: el mismo día siempre retorna el mismo template.
 */
export function getTodayTemplate(): ContentTemplate {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  const index = dayOfYear % TEMPLATES.length
  return TEMPLATES[index]
}

export { TEMPLATES }
