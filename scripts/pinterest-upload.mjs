/**
 * Nebbuler Pinterest Auto-Upload
 *
 * Sube los 20 posters a Pinterest automáticamente.
 * Requiere: npm install playwright (una vez)
 * Uso: node scripts/pinterest-upload.mjs
 *
 * El browser se abre visible. Logueate en Pinterest, luego el script continúa.
 */

import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTERS_DIR = path.join(__dirname, '../public/social-images/posters')

const PINS = [
  {
    file: 'nebbuler_v2_1.png',
    title: 'Meta lleva años cobrando por lo que tú sabes',
    description: 'Si publicás gratis en redes sociales, estás financiando la plataforma de otro. Nebbuler te permite cobrar directamente por tu conocimiento en LATAM — sin comisión variable. Cobrá en tu moneda local. nebbuler.com',
    link: 'https://nebbuler.com/para-creadores',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_2.png',
    title: 'Cada vez que publicas gratis, alguien más gana dinero con tu conocimiento',
    description: 'Los expertos de LATAM publican gratis en LinkedIn, Twitter y YouTube. La plataforma cobra. Nebbuler invierte esa ecuación: 0% de comisión variable, cobro en pesos, plata directamente a vos. nebbuler.com',
    link: 'https://nebbuler.com/calculadora',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_3.png',
    title: 'Eres el producto. O eres el dueño. Tú eliges.',
    description: 'En las grandes plataformas sos el producto. En Nebbuler sos el dueño. Membresías directas, sin intermediarios, sin algoritmos que decidan quién te ve. Solo vos y tu audiencia. nebbuler.com',
    link: 'https://nebbuler.com/abrir',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_4.png',
    title: 'Miles de profesionales en LATAM publican gratis cada día',
    description: 'Economistas, abogados, médicos, analistas financieros. Publican gratis. Su conocimiento vale miles de dólares. Con Nebbuler, ese valor se convierte en ingreso mensual predecible. Sé la excepción. nebbuler.com',
    link: 'https://nebbuler.com/directorio',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_5.png',
    title: 'No eres un creador de contenido. Eres un experto. Cobra como tal.',
    description: 'La diferencia entre un creador de contenido y un experto que cobra: Nebbuler. CRM, facturación multi-moneda, seguimientos automáticos con IA. Para el profesional independiente de LATAM. nebbuler.com',
    link: 'https://nebbuler.com/para-creadores',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_6.png',
    title: 'Años de contenido de excelencia regalado. Ya es hora de que alguien te pague.',
    description: 'Si llev&aacute;s años produciendo análisis de alto valor, tu audiencia ya te debe algo. Nebbuler te da las herramientas para cobrar: membresías en pesos, facturas automáticas, CRM para clientes. nebbuler.com',
    link: 'https://nebbuler.com/abrir',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_7.png',
    title: '0% de comisión. 100% tuyo. Sin algoritmos. Sin intermediarios.',
    description: 'Substack cobra 10%. Patreon cobra 8%. Nebbuler: US$19 fijos al mes, 0% de comisión sobre tus ingresos. Con 200 suscriptores pagando $10/mes, te quedás $1.900 más por año. nebbuler.com',
    link: 'https://nebbuler.com/calculadora',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_8.png',
    title: 'Solo profesionales verificados. Solo LATAM. Solo en español.',
    description: 'Nebbuler no es para cualquier creador de contenido. Es para el profesional con credenciales reales que quiere cobrar por lo que sabe. Economistas, abogados, médicos, consultores. Verificados. nebbuler.com',
    link: 'https://nebbuler.com/directorio',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_9.png',
    title: 'Tu conocimiento tiene precio. Es hora de monetizarlo.',
    description: 'El conocimiento especializado es el activo más valioso de LATAM. Nebbuler te da el sistema para convertirlo en ingreso: CRM, facturación, cobro en moneda local, IA para seguimientos. nebbuler.com',
    link: 'https://nebbuler.com/abrir',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
  {
    file: 'nebbuler_v2_10.png',
    title: 'Lo que se piensa bien, dura. Cobra por ello.',
    description: 'El análisis profundo no envejece. Los mejores profesionales de LATAM cobran membresías por acceso a su pensamiento. Nebbuler es la plataforma que lo hace posible sin comisiones abusivas. nebbuler.com',
    link: 'https://nebbuler.com/para-creadores',
    board: 'Nebbuler — Monetizá tu Conocimiento en LATAM',
  },
]

// Hashtags globales para todos los pins
const HASHTAGS = '#freelanceLATAM #monetizarconocimiento #creadordecontenido #independiente #newsletter #membresías #Nebbuler #cobraronline #latinoamerica #experto'

async function main() {
  console.log('🚀 Iniciando Pinterest auto-upload...')
  console.log('📁 Posters dir:', POSTERS_DIR)
  console.log('')

  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Ir a Pinterest
  await page.goto('https://pinterest.com')

  console.log('⏳ Esperando que inicies sesión en Pinterest...')
  console.log('   (Si ya estás logueado, el script continúa automáticamente)')

  // Esperar hasta que aparezca el botón de crear pin (señal de estar logueado)
  await page.waitForSelector('[data-test-id="header-create-button"], [aria-label="Crear"], a[href="/pin-builder/"]', {
    timeout: 120000
  })

  console.log('✅ Logueado. Empezando uploads...')

  for (let i = 0; i < PINS.length; i++) {
    const pin = PINS[i]
    const imgPath = path.join(POSTERS_DIR, pin.file)
    console.log(`\n[${i + 1}/${PINS.length}] Subiendo: ${pin.title.slice(0, 50)}...`)

    try {
      // Ir al pin builder
      await page.goto('https://pinterest.com/pin-builder/')
      await page.waitForLoadState('networkidle')

      // Upload imagen
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(imgPath)
      await page.waitForTimeout(2000)

      // Título
      const titleField = page.locator('[data-test-id="pin-draft-title"], [placeholder*="título"], [placeholder*="title"]').first()
      if (await titleField.isVisible({ timeout: 3000 })) {
        await titleField.fill(pin.title)
      }

      // Descripción + hashtags
      const descField = page.locator('[data-test-id="pin-draft-description"], [placeholder*="descripción"], [placeholder*="description"]').first()
      if (await descField.isVisible({ timeout: 3000 })) {
        await descField.fill(`${pin.description}\n\n${HASHTAGS}`)
      }

      // Link destino
      const linkField = page.locator('[data-test-id="pin-draft-link"], [placeholder*="Añadir"], [placeholder*="link"]').first()
      if (await linkField.isVisible({ timeout: 3000 })) {
        await linkField.fill(pin.link)
      }

      await page.waitForTimeout(1000)

      // Publicar
      const publishBtn = page.locator('[data-test-id="board-dropdown-save-button"], button:has-text("Publicar"), button:has-text("Guardar"), button:has-text("Save")').first()
      if (await publishBtn.isVisible({ timeout: 3000 })) {
        await publishBtn.click()
        console.log(`   ✅ Pin publicado`)
      } else {
        console.log(`   ⚠️  No encontré botón de publicar — revisar manualmente`)
      }

      await page.waitForTimeout(2000)

    } catch (err) {
      console.error(`   ❌ Error en pin ${i + 1}:`, err.message)
    }
  }

  console.log('\n🎉 Upload completado. Revisá tu perfil de Pinterest.')
  await browser.close()
}

main().catch(console.error)
