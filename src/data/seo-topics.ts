export type TopicEntry = {
  slug: string
  label: string
  description: string
  discipline: string
  questions: string[]
}

export const TOPICS: TopicEntry[] = [
  {
    slug: 'politica-monetaria',
    label: 'Política Monetaria',
    discipline: 'economia',
    description: 'Análisis de tasas de interés, inflación y decisiones de bancos centrales',
    questions: [
      '¿Cómo afecta la tasa de interés a los créditos hipotecarios?',
      '¿Qué es la tasa de política monetaria?',
      '¿Cómo controla el banco central la inflación?',
    ],
  },
  {
    slug: 'reforma-tributaria',
    label: 'Reforma Tributaria',
    discipline: 'derecho',
    description: 'Análisis de cambios en legislación fiscal y su impacto en empresas y personas',
    questions: [
      '¿Cómo afecta la reforma tributaria a las pymes?',
      '¿Qué cambia en el IVA con la reforma?',
      '¿Cómo optimizar la carga tributaria legalmente?',
    ],
  },
  {
    slug: 'mercado-inmobiliario',
    label: 'Mercado Inmobiliario',
    discipline: 'finanzas',
    description: 'Tendencias de precios, inversión y regulación del mercado de vivienda',
    questions: [
      '¿Cuándo es buen momento para comprar departamento?',
      '¿Cómo invertir en bienes raíces con poco capital?',
      '¿Por qué suben los arriendos?',
    ],
  },
  {
    slug: 'sistema-de-salud',
    label: 'Sistema de Salud',
    discipline: 'medicina',
    description: 'Análisis del sistema sanitario, políticas de salud pública y cobertura médica',
    questions: [
      '¿Isapre o Fonasa: cuál conviene?',
      '¿Cómo funciona el sistema de salud?',
      '¿Qué cubre el seguro de salud público?',
    ],
  },
  {
    slug: 'mercado-laboral',
    label: 'Mercado Laboral',
    discipline: 'economia',
    description: 'Análisis del empleo, salarios, desempleo y tendencias del trabajo',
    questions: [
      '¿Cómo está el mercado laboral para profesionales?',
      '¿Cuáles son los sueldos promedio por profesión?',
      '¿Qué derechos laborales tengo como trabajador?',
    ],
  },
  {
    slug: 'finanzas-personales',
    label: 'Finanzas Personales',
    discipline: 'finanzas',
    description: 'Guías de ahorro, inversión, deuda y planificación financiera personal',
    questions: [
      '¿Cómo empezar a invertir desde cero?',
      '¿Cómo salir de deudas rápido?',
      '¿Dónde poner los ahorros para que no pierdan valor?',
    ],
  },
  {
    slug: 'derecho-laboral',
    label: 'Derecho Laboral',
    discipline: 'derecho',
    description: 'Análisis de normativa laboral, contratos, despidos y derechos del trabajador',
    questions: [
      '¿Cuándo es legal el despido?',
      '¿Qué dice la ley sobre teletrabajo?',
      '¿Cómo calcular la indemnización por años de servicio?',
    ],
  },
  {
    slug: 'inversiones',
    label: 'Inversiones',
    discipline: 'finanzas',
    description: 'Análisis de instrumentos de inversión, bolsa, fondos y activos alternativos',
    questions: [
      '¿Cómo funciona la bolsa de valores?',
      '¿Qué son los fondos mutuos?',
      '¿Conviene invertir en dólares?',
    ],
  },
  {
    slug: 'pensiones',
    label: 'Sistema de Pensiones',
    discipline: 'economia',
    description: 'Análisis de AFP, pensiones y reforma previsional',
    questions: [
      '¿Cuánto me llegará de pensión?',
      '¿Conviene APV o AFP?',
      '¿Cómo funciona el sistema de AFP?',
    ],
  },
  {
    slug: 'derecho-corporativo',
    label: 'Derecho Corporativo',
    discipline: 'derecho',
    description: 'Análisis de regulación empresarial, contratos y estructuras societarias',
    questions: [
      '¿Qué tipo de empresa me conviene constituir?',
      '¿Cómo proteger mi empresa legalmente?',
      '¿Qué es una SpA y cuándo usarla?',
    ],
  },
  {
    slug: 'macroeconomia',
    label: 'Macroeconomía',
    discipline: 'economia',
    description: 'Análisis del crecimiento económico, PIB, inflación y ciclos económicos',
    questions: [
      '¿Por qué sube el dólar?',
      '¿Qué significa que el PIB baje?',
      '¿Cómo afecta la inflación a mis ahorros?',
    ],
  },
  {
    slug: 'salud-publica',
    label: 'Salud Pública',
    discipline: 'medicina',
    description: 'Epidemiología, políticas sanitarias y prevención de enfermedades',
    questions: [
      '¿Cuáles son las principales causas de muerte evitable?',
      '¿Cómo funciona la vigilancia epidemiológica?',
      '¿Qué vacunas son obligatorias?',
    ],
  },
  {
    slug: 'emprendimiento',
    label: 'Emprendimiento',
    discipline: 'finanzas',
    description: 'Análisis del ecosistema emprendedor, financiamiento y estrategia de startups',
    questions: [
      '¿Cómo conseguir financiamiento para mi startup?',
      '¿Cuándo buscar inversionistas?',
      '¿Cómo validar una idea de negocio?',
    ],
  },
  {
    slug: 'comercio-exterior',
    label: 'Comercio Exterior',
    discipline: 'economia',
    description: 'Análisis de exportaciones, importaciones, aranceles y tratados comerciales',
    questions: [
      '¿Cómo exportar por primera vez?',
      '¿Qué tratados comerciales tiene mi país?',
      '¿Cómo funciona el tipo de cambio para importadores?',
    ],
  },
  {
    slug: 'nutricion-clinica',
    label: 'Nutrición Clínica',
    discipline: 'medicina',
    description: 'Análisis nutricional basado en evidencia, dietas y salud metabólica',
    questions: [
      '¿Qué dice la evidencia sobre las dietas populares?',
      '¿Cómo leer el etiquetado nutricional?',
      '¿Cuáles son los mitos nutricionales más peligrosos?',
    ],
  },
]
