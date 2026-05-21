// 25 especialidades para /honorarios/[especialidad]/[ciudad]
// Datos plausibles 2026, referencia: INE Chile, INEGI México, DANE Colombia, INDEC Argentina

export interface Especialidad {
  slug: string
  nombre: string
  nombreMayus: string
  area: string
  unidadCobro: 'hora' | 'consulta' | 'proyecto' | 'mes'
  descripcionCorta: string
}

export const ESPECIALIDADES: Especialidad[] = [
  { slug: 'economista', nombre: 'economista', nombreMayus: 'Economista', area: 'Economía', unidadCobro: 'hora', descripcionCorta: 'Análisis macroeconómico, asesoría financiera y consultoría estratégica.' },
  { slug: 'abogado', nombre: 'abogado', nombreMayus: 'Abogado', area: 'Derecho', unidadCobro: 'hora', descripcionCorta: 'Honorarios por hora, retainer mensual o porcentaje sobre el caso.' },
  { slug: 'contador', nombre: 'contador', nombreMayus: 'Contador', area: 'Finanzas', unidadCobro: 'mes', descripcionCorta: 'Contabilidad mensual, declaración de impuestos y auditoría.' },
  { slug: 'medico', nombre: 'médico', nombreMayus: 'Médico', area: 'Salud', unidadCobro: 'consulta', descripcionCorta: 'Consulta privada, telemedicina y especialidad.' },
  { slug: 'arquitecto', nombre: 'arquitecto', nombreMayus: 'Arquitecto', area: 'Arquitectura', unidadCobro: 'proyecto', descripcionCorta: 'Proyecto residencial, comercial o remodelación.' },
  { slug: 'ingeniero-civil', nombre: 'ingeniero civil', nombreMayus: 'Ingeniero Civil', area: 'Ingeniería', unidadCobro: 'proyecto', descripcionCorta: 'Cálculo estructural, dirección de obra y consultoría técnica.' },
  { slug: 'ingeniero-industrial', nombre: 'ingeniero industrial', nombreMayus: 'Ingeniero Industrial', area: 'Ingeniería', unidadCobro: 'hora', descripcionCorta: 'Optimización de procesos, gestión de operaciones y cadena de suministro.' },
  { slug: 'ingeniero-informatico', nombre: 'ingeniero informático', nombreMayus: 'Ingeniero Informático', area: 'Tecnología', unidadCobro: 'hora', descripcionCorta: 'Desarrollo de software, arquitectura cloud y consultoría tech.' },
  { slug: 'dentista', nombre: 'dentista', nombreMayus: 'Dentista', area: 'Salud Dental', unidadCobro: 'consulta', descripcionCorta: 'Consulta general, ortodoncia, implantes y endodoncia.' },
  { slug: 'psicologo', nombre: 'psicólogo', nombreMayus: 'Psicólogo', area: 'Salud Mental', unidadCobro: 'consulta', descripcionCorta: 'Sesión individual presencial u online de 45–60 minutos.' },
  { slug: 'nutricionista', nombre: 'nutricionista', nombreMayus: 'Nutricionista', area: 'Salud', unidadCobro: 'consulta', descripcionCorta: 'Plan alimenticio, seguimiento y consulta deportiva.' },
  { slug: 'kinesiologo', nombre: 'kinesiólogo', nombreMayus: 'Kinesiólogo', area: 'Salud', unidadCobro: 'consulta', descripcionCorta: 'Rehabilitación, terapia manual y kinesiología deportiva.' },
  { slug: 'fonoaudiologo', nombre: 'fonoaudiólogo', nombreMayus: 'Fonoaudiólogo', area: 'Salud', unidadCobro: 'consulta', descripcionCorta: 'Terapia del lenguaje, voz, audición y deglución.' },
  { slug: 'agente-inmobiliario', nombre: 'agente inmobiliario', nombreMayus: 'Agente Inmobiliario', area: 'Bienes Raíces', unidadCobro: 'proyecto', descripcionCorta: 'Comisión sobre venta, arriendo o tasación de propiedades.' },
  { slug: 'consultor-seo', nombre: 'consultor SEO', nombreMayus: 'Consultor SEO', area: 'Marketing Digital', unidadCobro: 'mes', descripcionCorta: 'Auditoría técnica, link building y posicionamiento orgánico.' },
  { slug: 'copywriter', nombre: 'copywriter', nombreMayus: 'Copywriter', area: 'Marketing', unidadCobro: 'proyecto', descripcionCorta: 'Páginas web, secuencias de email, anuncios y guiones.' },
  { slug: 'disenador-ux', nombre: 'diseñador UX', nombreMayus: 'Diseñador UX', area: 'Diseño', unidadCobro: 'hora', descripcionCorta: 'Investigación, wireframes, prototipos y design systems.' },
  { slug: 'coach-ejecutivo', nombre: 'coach ejecutivo', nombreMayus: 'Coach Ejecutivo', area: 'Liderazgo', unidadCobro: 'consulta', descripcionCorta: 'Sesiones de coaching para C-level, fundadores y mandos medios.' },
  { slug: 'marketer-digital', nombre: 'marketer digital', nombreMayus: 'Marketer Digital', area: 'Marketing Digital', unidadCobro: 'mes', descripcionCorta: 'Estrategia, paid media, contenidos y growth.' },
  { slug: 'traductor', nombre: 'traductor', nombreMayus: 'Traductor', area: 'Idiomas', unidadCobro: 'proyecto', descripcionCorta: 'Tarifa por palabra, hora o proyecto. Especialidad jurídica/técnica suma 30–60%.' },
  { slug: 'periodista', nombre: 'periodista', nombreMayus: 'Periodista', area: 'Medios', unidadCobro: 'proyecto', descripcionCorta: 'Notas freelance, investigación, edición y producción.' },
  { slug: 'fotografo', nombre: 'fotógrafo', nombreMayus: 'Fotógrafo', area: 'Creativo', unidadCobro: 'proyecto', descripcionCorta: 'Sesión de retrato, producto, evento o boda.' },
  { slug: 'chef-privado', nombre: 'chef privado', nombreMayus: 'Chef Privado', area: 'Gastronomía', unidadCobro: 'proyecto', descripcionCorta: 'Cena privada, catering corporativo y meal prep semanal.' },
  { slug: 'profesor-universitario', nombre: 'profesor universitario', nombreMayus: 'Profesor Universitario', area: 'Educación', unidadCobro: 'hora', descripcionCorta: 'Cátedra, dirección de tesis, consultoría académica.' },
  { slug: 'financial-advisor', nombre: 'asesor financiero', nombreMayus: 'Asesor Financiero', area: 'Finanzas', unidadCobro: 'hora', descripcionCorta: 'Planificación financiera personal, gestión patrimonial y portafolios.' },
]
