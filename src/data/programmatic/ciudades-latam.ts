// 40 ciudades LATAM para programmatic SEO
// Codigo país + factor económico relativo (1.0 = ciudad capital base, <1 menor poder adquisitivo)

export interface Ciudad {
  slug: string
  nombre: string
  pais: string
  paisSlug: string
  paisEmoji: string
  moneda: string
  simbolo: string
  // Factor de ajuste respecto a la capital del país (1.0 = capital, 0.7 = ciudad secundaria)
  factor: number
  poblacion: string // texto descriptivo aprox.
  esCapital: boolean
}

export const CIUDADES: Ciudad[] = [
  // Chile
  { slug: 'santiago', nombre: 'Santiago', pais: 'Chile', paisSlug: 'chile', paisEmoji: '🇨🇱', moneda: 'CLP', simbolo: '$', factor: 1.0, poblacion: '7,1 millones área metropolitana', esCapital: true },
  { slug: 'valparaiso', nombre: 'Valparaíso', pais: 'Chile', paisSlug: 'chile', paisEmoji: '🇨🇱', moneda: 'CLP', simbolo: '$', factor: 0.78, poblacion: '300 mil', esCapital: false },
  { slug: 'concepcion', nombre: 'Concepción', pais: 'Chile', paisSlug: 'chile', paisEmoji: '🇨🇱', moneda: 'CLP', simbolo: '$', factor: 0.75, poblacion: '230 mil', esCapital: false },
  { slug: 'la-serena', nombre: 'La Serena', pais: 'Chile', paisSlug: 'chile', paisEmoji: '🇨🇱', moneda: 'CLP', simbolo: '$', factor: 0.72, poblacion: '230 mil', esCapital: false },
  { slug: 'antofagasta', nombre: 'Antofagasta', pais: 'Chile', paisSlug: 'chile', paisEmoji: '🇨🇱', moneda: 'CLP', simbolo: '$', factor: 0.92, poblacion: '380 mil', esCapital: false },

  // Argentina
  { slug: 'buenos-aires', nombre: 'Buenos Aires', pais: 'Argentina', paisSlug: 'argentina', paisEmoji: '🇦🇷', moneda: 'ARS', simbolo: '$', factor: 1.0, poblacion: '15 millones área metropolitana', esCapital: true },
  { slug: 'cordoba', nombre: 'Córdoba', pais: 'Argentina', paisSlug: 'argentina', paisEmoji: '🇦🇷', moneda: 'ARS', simbolo: '$', factor: 0.78, poblacion: '1,5 millones', esCapital: false },
  { slug: 'rosario', nombre: 'Rosario', pais: 'Argentina', paisSlug: 'argentina', paisEmoji: '🇦🇷', moneda: 'ARS', simbolo: '$', factor: 0.76, poblacion: '1,3 millones', esCapital: false },
  { slug: 'mendoza', nombre: 'Mendoza', pais: 'Argentina', paisSlug: 'argentina', paisEmoji: '🇦🇷', moneda: 'ARS', simbolo: '$', factor: 0.74, poblacion: '1,1 millones', esCapital: false },

  // México
  { slug: 'cdmx', nombre: 'Ciudad de México', pais: 'México', paisSlug: 'mexico', paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$', factor: 1.0, poblacion: '22 millones área metropolitana', esCapital: true },
  { slug: 'guadalajara', nombre: 'Guadalajara', pais: 'México', paisSlug: 'mexico', paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$', factor: 0.85, poblacion: '5,3 millones', esCapital: false },
  { slug: 'monterrey', nombre: 'Monterrey', pais: 'México', paisSlug: 'mexico', paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$', factor: 0.96, poblacion: '5,3 millones', esCapital: false },
  { slug: 'puebla', nombre: 'Puebla', pais: 'México', paisSlug: 'mexico', paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$', factor: 0.72, poblacion: '3 millones', esCapital: false },
  { slug: 'queretaro', nombre: 'Querétaro', pais: 'México', paisSlug: 'mexico', paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$', factor: 0.88, poblacion: '1,5 millones', esCapital: false },
  { slug: 'tijuana', nombre: 'Tijuana', pais: 'México', paisSlug: 'mexico', paisEmoji: '🇲🇽', moneda: 'MXN', simbolo: '$', factor: 0.90, poblacion: '2,2 millones', esCapital: false },

  // Colombia
  { slug: 'bogota', nombre: 'Bogotá', pais: 'Colombia', paisSlug: 'colombia', paisEmoji: '🇨🇴', moneda: 'COP', simbolo: '$', factor: 1.0, poblacion: '11 millones área metropolitana', esCapital: true },
  { slug: 'medellin', nombre: 'Medellín', pais: 'Colombia', paisSlug: 'colombia', paisEmoji: '🇨🇴', moneda: 'COP', simbolo: '$', factor: 0.85, poblacion: '4 millones', esCapital: false },
  { slug: 'cali', nombre: 'Cali', pais: 'Colombia', paisSlug: 'colombia', paisEmoji: '🇨🇴', moneda: 'COP', simbolo: '$', factor: 0.78, poblacion: '2,9 millones', esCapital: false },
  { slug: 'barranquilla', nombre: 'Barranquilla', pais: 'Colombia', paisSlug: 'colombia', paisEmoji: '🇨🇴', moneda: 'COP', simbolo: '$', factor: 0.74, poblacion: '2,3 millones', esCapital: false },
  { slug: 'cartagena', nombre: 'Cartagena', pais: 'Colombia', paisSlug: 'colombia', paisEmoji: '🇨🇴', moneda: 'COP', simbolo: '$', factor: 0.72, poblacion: '1,1 millones', esCapital: false },

  // Perú
  { slug: 'lima', nombre: 'Lima', pais: 'Perú', paisSlug: 'peru', paisEmoji: '🇵🇪', moneda: 'PEN', simbolo: 'S/', factor: 1.0, poblacion: '11 millones área metropolitana', esCapital: true },
  { slug: 'arequipa', nombre: 'Arequipa', pais: 'Perú', paisSlug: 'peru', paisEmoji: '🇵🇪', moneda: 'PEN', simbolo: 'S/', factor: 0.76, poblacion: '1,1 millones', esCapital: false },
  { slug: 'trujillo', nombre: 'Trujillo', pais: 'Perú', paisSlug: 'peru', paisEmoji: '🇵🇪', moneda: 'PEN', simbolo: 'S/', factor: 0.72, poblacion: '1 millón', esCapital: false },
  { slug: 'cusco', nombre: 'Cusco', pais: 'Perú', paisSlug: 'peru', paisEmoji: '🇵🇪', moneda: 'PEN', simbolo: 'S/', factor: 0.70, poblacion: '450 mil', esCapital: false },

  // Uruguay
  { slug: 'montevideo', nombre: 'Montevideo', pais: 'Uruguay', paisSlug: 'uruguay', paisEmoji: '🇺🇾', moneda: 'UYU', simbolo: '$', factor: 1.0, poblacion: '1,9 millones área metropolitana', esCapital: true },
  { slug: 'punta-del-este', nombre: 'Punta del Este', pais: 'Uruguay', paisSlug: 'uruguay', paisEmoji: '🇺🇾', moneda: 'UYU', simbolo: '$', factor: 0.95, poblacion: '40 mil', esCapital: false },

  // Ecuador
  { slug: 'quito', nombre: 'Quito', pais: 'Ecuador', paisSlug: 'ecuador', paisEmoji: '🇪🇨', moneda: 'USD', simbolo: '$', factor: 1.0, poblacion: '2,8 millones', esCapital: true },
  { slug: 'guayaquil', nombre: 'Guayaquil', pais: 'Ecuador', paisSlug: 'ecuador', paisEmoji: '🇪🇨', moneda: 'USD', simbolo: '$', factor: 0.94, poblacion: '3 millones', esCapital: false },
  { slug: 'cuenca', nombre: 'Cuenca', pais: 'Ecuador', paisSlug: 'ecuador', paisEmoji: '🇪🇨', moneda: 'USD', simbolo: '$', factor: 0.80, poblacion: '600 mil', esCapital: false },

  // Bolivia
  { slug: 'la-paz', nombre: 'La Paz', pais: 'Bolivia', paisSlug: 'bolivia', paisEmoji: '🇧🇴', moneda: 'BOB', simbolo: 'Bs', factor: 1.0, poblacion: '2,3 millones área metropolitana', esCapital: true },
  { slug: 'santa-cruz', nombre: 'Santa Cruz', pais: 'Bolivia', paisSlug: 'bolivia', paisEmoji: '🇧🇴', moneda: 'BOB', simbolo: 'Bs', factor: 0.95, poblacion: '1,8 millones', esCapital: false },
  { slug: 'cochabamba', nombre: 'Cochabamba', pais: 'Bolivia', paisSlug: 'bolivia', paisEmoji: '🇧🇴', moneda: 'BOB', simbolo: 'Bs', factor: 0.78, poblacion: '650 mil', esCapital: false },

  // Paraguay
  { slug: 'asuncion', nombre: 'Asunción', pais: 'Paraguay', paisSlug: 'paraguay', paisEmoji: '🇵🇾', moneda: 'PYG', simbolo: '₲', factor: 1.0, poblacion: '2,3 millones área metropolitana', esCapital: true },
  { slug: 'ciudad-del-este', nombre: 'Ciudad del Este', pais: 'Paraguay', paisSlug: 'paraguay', paisEmoji: '🇵🇾', moneda: 'PYG', simbolo: '₲', factor: 0.82, poblacion: '300 mil', esCapital: false },

  // Costa Rica
  { slug: 'san-jose', nombre: 'San José', pais: 'Costa Rica', paisSlug: 'costa-rica', paisEmoji: '🇨🇷', moneda: 'CRC', simbolo: '₡', factor: 1.0, poblacion: '1,5 millones área metropolitana', esCapital: true },

  // Panamá
  { slug: 'panama', nombre: 'Panamá', pais: 'Panamá', paisSlug: 'panama', paisEmoji: '🇵🇦', moneda: 'USD', simbolo: '$', factor: 1.0, poblacion: '1,5 millones área metropolitana', esCapital: true },

  // República Dominicana
  { slug: 'santo-domingo', nombre: 'Santo Domingo', pais: 'República Dominicana', paisSlug: 'republica-dominicana', paisEmoji: '🇩🇴', moneda: 'DOP', simbolo: 'RD$', factor: 1.0, poblacion: '3,5 millones área metropolitana', esCapital: true },
  { slug: 'santiago-dr', nombre: 'Santiago de los Caballeros', pais: 'República Dominicana', paisSlug: 'republica-dominicana', paisEmoji: '🇩🇴', moneda: 'DOP', simbolo: 'RD$', factor: 0.78, poblacion: '700 mil', esCapital: false },

  // Venezuela
  { slug: 'caracas', nombre: 'Caracas', pais: 'Venezuela', paisSlug: 'venezuela', paisEmoji: '🇻🇪', moneda: 'USD', simbolo: '$', factor: 1.0, poblacion: '3 millones área metropolitana', esCapital: true },
  { slug: 'maracaibo', nombre: 'Maracaibo', pais: 'Venezuela', paisSlug: 'venezuela', paisEmoji: '🇻🇪', moneda: 'USD', simbolo: '$', factor: 0.74, poblacion: '1,7 millones', esCapital: false },
]
