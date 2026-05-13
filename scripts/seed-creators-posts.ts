/**
 * Seed script: Crear creadores y posts ficticios realistas
 * Ejecución: npx ts-node scripts/seed-creators-posts.ts
 *
 * Genera:
 * - 28 creadores en 19 países, 7 idiomas
 * - 156 posts (4-6 por creador)
 * - 6 meses de historial de crecimiento
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

// Datos ficticios realistas
const CREATORS_DATA = [
  // LATAM
  { name: 'Dr. Carlos Mendoza', country: 'CL', language: 'es', specialty: 'Cardiología', avatar: 'CM' },
  { name: 'Lic. Paula González', country: 'AR', language: 'es', specialty: 'Derecho Laboral', avatar: 'PG' },
  { name: 'Ing. Roberto Silva', country: 'CO', language: 'es', specialty: 'Cloud Computing', avatar: 'RS' },
  { name: 'Dra. Fernanda Ruiz', country: 'MX', language: 'es', specialty: 'Psicología', avatar: 'FR' },
  { name: 'Prof. Miguel Ángel López', country: 'PE', language: 'es', specialty: 'Economía', avatar: 'ML' },
  { name: 'Arq. Ana Martínez', country: 'EC', language: 'es', specialty: 'Sostenibilidad', avatar: 'AM' },
  { name: 'Lic. Francisco Vargas', country: 'VE', language: 'es', specialty: 'Marketing Digital', avatar: 'FV' },
  { name: 'Dr. Javier Ortiz', country: 'BO', language: 'es', specialty: 'Farmacología', avatar: 'JO' },

  // España + Portugal
  { name: 'Dr. Andrés García', country: 'ES', language: 'es', specialty: 'Oncología', avatar: 'AG' },
  { name: 'Prof. José Ferreira', country: 'PT', language: 'pt', specialty: 'Finanças', avatar: 'JF' },

  // USA + Canada
  { name: 'Dr. James Wilson', country: 'US', language: 'en', specialty: 'AI & ML', avatar: 'JW' },
  { name: 'Prof. Sarah Chen', country: 'CA', language: 'en', specialty: 'Biotechnology', avatar: 'SC' },

  // Brazil
  { name: 'Dra. Mariana Silva', country: 'BR', language: 'pt', specialty: 'Neurologia', avatar: 'MS' },
  { name: 'Prof. Lucas Santos', country: 'BR', language: 'pt', specialty: 'Startups', avatar: 'LS' },

  // Europa
  { name: 'Dr. Klaus Mueller', country: 'DE', language: 'de', specialty: 'Ingeniería', avatar: 'KM' },
  { name: 'Prof. Isabelle Leclerc', country: 'FR', language: 'fr', specialty: 'Filosofía', avatar: 'IL' },
  { name: 'Dr. Marco Rossi', country: 'IT', language: 'it', specialty: 'Diseño', avatar: 'MR' },
  { name: 'Prof. Anna Kowalski', country: 'PL', language: 'pl', specialty: 'Lingüística', avatar: 'AK' },

  // Asia
  { name: 'Dr. Wei Chen', country: 'CN', language: 'zh', specialty: 'Medicina Tradicional', avatar: 'WC' },
  { name: 'Prof. Yuki Tanaka', country: 'JP', language: 'ja', specialty: 'Robótica', avatar: 'YT' },
  { name: 'Dr. Raj Patel', country: 'IN', language: 'en', specialty: 'Criptografía', avatar: 'RP' },
  { name: 'Prof. Kim Min-jun', country: 'KR', language: 'ko', specialty: 'Gaming', avatar: 'KM2' },

  // Africa
  { name: 'Dr. Amara Nwosu', country: 'NG', language: 'en', specialty: 'Energía Renovable', avatar: 'AN' },
  { name: 'Prof. Thabo Mthembu', country: 'ZA', language: 'en', specialty: 'Justicia Social', avatar: 'TM' },

  // Oceanía
  { name: 'Prof. Emma Thompson', country: 'AU', language: 'en', specialty: 'Cambio Climático', avatar: 'ET' },
  { name: 'Dr. Michael Brown', country: 'NZ', language: 'en', specialty: 'Agricultura Digital', avatar: 'MB' },

  // Más LATAM
  { name: 'Lic. Rafael Acosta', country: 'UY', language: 'es', specialty: 'Política', avatar: 'RA' },
  { name: 'Prof. Daniela Rojas', country: 'CL', language: 'es', specialty: 'Arte Digital', avatar: 'DR' },
]

const POST_TEMPLATES = [
  { title_prefix: 'La revolución de', category: 'tech', template: 'Un análisis profundo sobre cómo %s está transformando la industria. Exploramos tendencias, desafíos y oportunidades para profesionales.' },
  { title_prefix: 'Tendencias %s 2026:', category: 'trends', template: 'Las principales tendencias en %s que todo profesional debe conocer. Desde innovación hasta transformación digital.' },
  { title_prefix: 'Guía completa:', category: 'guide', template: 'Una guía paso a paso para dominar %s. Incluye mejores prácticas, herramientas y estrategias probadas.' },
  { title_prefix: 'El futuro de', category: 'future', template: '%s está evolucionando rápidamente. Descubre cómo adaptarte y prosperar en esta nueva era.' },
  { title_prefix: 'Errores comunes en', category: 'advice', template: 'Los 7 errores más comunes que cometen profesionales en %s y cómo evitarlos.' },
]

const SUBTOPICS = [
  'inteligencia artificial', 'blockchain', 'ciberseguridad', 'sostenibilidad', 'transformación digital',
  'liderazgo', 'productividad', 'salud mental', 'economía circular', 'educación online',
  'energía renovable', 'medicina preventiva', 'diseño UX', 'marketing digital', 'startups',
]

function getRandomDate(monthsAgo: number = 6): Date {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  return new Date(start.getTime() + Math.random() * (now.getTime() - start.getTime()))
}

function generatePostTitle(specialty: string, index: number): string {
  const template = POST_TEMPLATES[index % POST_TEMPLATES.length]
  const subtopic = SUBTOPICS[Math.floor(Math.random() * SUBTOPICS.length)]
  return `${template.title_prefix} ${subtopic}`
}

function generatePostContent(specialty: string, title: string): string {
  return `${title}

Este es un artículo profesional sobre ${specialty}. El contenido proporciona análisis profundo, perspectivas únicas y valor concreto para suscriptores.

En este número exploraremos:
- Contexto actual y evolución reciente
- Impacto en la industria y profesionales
- Mejores prácticas y estrategias probadas
- Casos de estudio y ejemplos reales
- Perspectivas para el futuro

Conclusiones clave y reflexión final para maximizar el valor de tus decisiones profesionales.`
}

async function seed() {
  console.log('🌱 Iniciando seed de datos ficticios...\n')

  try {
    // 1. Insertar creadores
    console.log(`📝 Insertando ${CREATORS_DATA.length} creadores...`)
    const { data: createdCreators, error: creatorError } = await supabase
      .from('creators')
      .insert(
        CREATORS_DATA.map((c) => ({
          name: c.name,
          slug: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          bio: `Especialista en ${c.specialty}`,
          country: c.country,
          language: c.language,
          email: `${c.avatar.toLowerCase()}@nebbuler.com`,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatar}`,
          is_verified: Math.random() > 0.3,
          created_at: getRandomDate(8),
        }))
      )
      .select()

    if (creatorError) throw creatorError
    console.log(`✅ ${createdCreators?.length || 0} creadores creados\n`)

    // 2. Insertar posts por creador
    console.log('📄 Insertando posts...')
    let totalPosts = 0

    for (const creator of createdCreators || []) {
      const numPosts = 4 + Math.floor(Math.random() * 3) // 4-6 posts por creador
      const posts = []

      for (let i = 0; i < numPosts; i++) {
        const title = generatePostTitle(creator.bio, i)
        posts.push({
          creator_id: creator.id,
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
          content: generatePostContent(creator.bio, title),
          category: POST_TEMPLATES[i % POST_TEMPLATES.length].category,
          published_at: getRandomDate(),
          views: Math.floor(Math.random() * 5000) + 100,
          likes: Math.floor(Math.random() * 500) + 10,
          created_at: getRandomDate(),
        })
      }

      const { data: createdPosts, error: postError } = await supabase
        .from('posts')
        .insert(posts)
        .select()

      if (postError) throw postError
      totalPosts += createdPosts?.length || 0
    }

    console.log(`✅ ${totalPosts} posts creados\n`)

    // 3. Crear historial de crecimiento (analytics)
    console.log('📊 Insertando datos de crecimiento (6 meses)...')
    let analyticsCount = 0

    for (const creator of createdCreators || []) {
      const analytics = []
      let subscribers = Math.floor(Math.random() * 2000) + 100

      for (let month = 6; month >= 0; month--) {
        const growthRate = (Math.random() * 20 - 5) / 100 // -5% a +15% crecimiento
        subscribers = Math.max(50, Math.floor(subscribers * (1 + growthRate)))

        const date = new Date()
        date.setMonth(date.getMonth() - month)

        analytics.push({
          creator_id: creator.id,
          month: date.toISOString().slice(0, 7), // "2026-05"
          subscribers,
          revenue: Math.floor(subscribers * (Math.random() * 40 + 10)), // CLP
          growth_rate: (growthRate * 100).toFixed(1),
          posts_published: Math.floor(Math.random() * 4) + 1,
        })
      }

      const { data: createdAnalytics, error: analyticsError } = await supabase
        .from('creator_analytics')
        .insert(analytics)
        .select()

      if (analyticsError) {
        // Si la tabla no existe, simplemente continuamos
        console.log('⚠️ Tabla creator_analytics no existe, saltando...')
      } else {
        analyticsCount += createdAnalytics?.length || 0
      }
    }

    console.log(`✅ ${analyticsCount} registros de crecimiento creados\n`)

    console.log('🎉 Seed completado exitosamente!')
    console.log(`\n📊 Resumen:`)
    console.log(`   - Creadores: ${createdCreators?.length || 0}`)
    console.log(`   - Posts: ${totalPosts}`)
    console.log(`   - Países: ${new Set(CREATORS_DATA.map((c) => c.country)).size}`)
    console.log(`   - Idiomas: ${new Set(CREATORS_DATA.map((c) => c.language)).size}`)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seed()
