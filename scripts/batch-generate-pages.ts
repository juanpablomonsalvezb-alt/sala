#!/usr/bin/env npx ts-node

import { createClient } from '@supabase/supabase-js'
import { Anthropic } from '@anthropic-ai/sdk'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anthropicKey = process.env.ANTHROPIC_API_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)
const anthropic = new Anthropic({ apiKey: anthropicKey })

interface Options {
  count: number
  countries: string[]
  specialties: string[]
  concurrent: number
  test: boolean
}

function parseArgs(): Options {
  const args = process.argv.slice(2)
  const opts: Options = {
    count: 1000,
    countries: ['CL', 'CO', 'MX', 'AR', 'PE'],
    specialties: [
      'Marketing Digital',
      'Derecho',
      'Diseño',
      'Tecnología',
      'Finanzas',
      'Salud',
      'Educación',
      'Recursos Humanos',
    ],
    concurrent: 3,
    test: false,
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      opts.count = parseInt(args[i + 1], 10)
      i++
    } else if (args[i] === '--countries' && args[i + 1]) {
      opts.countries = args[i + 1].split(',')
      i++
    } else if (args[i] === '--specialties' && args[i + 1]) {
      opts.specialties = args[i + 1].split(',')
      i++
    } else if (args[i] === '--concurrent' && args[i + 1]) {
      opts.concurrent = parseInt(args[i + 1], 10)
      i++
    } else if (args[i] === '--test') {
      opts.test = true
      opts.count = 5
    }
  }

  return opts
}

async function generateContent(keyword: string, specialty: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Escribe un artículo breve sobre "${keyword}" en el área de ${specialty}.
        Incluye: título, 2-3 párrafos, conclusión. Formato: HTML limpio.`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

async function processBatch(
  pages: Array<{ keyword: string; specialty: string; country: string }>,
  concurrent: number,
): Promise<number> {
  let processed = 0

  for (let i = 0; i < pages.length; i += concurrent) {
    const batch = pages.slice(i, i + concurrent)
    const promises = batch.map(async page => {
      try {
        const content = await generateContent(page.keyword, page.specialty)
        await supabase.from('generated_pages').insert({
          keyword: page.keyword,
          specialty: page.specialty,
          country_code: page.country,
          content_html: content,
          content_markdown: content,
          seo_score: 72,
          status: 'draft',
        })
        processed++
      } catch (err) {
        console.error(`Error generating ${page.keyword}:`, err)
      }
    })

    await Promise.all(promises)
    const rate = (i + concurrent) / (processed > 0 ? processed : 1)
    const eta = ((pages.length - i) / rate / 60).toFixed(1)
    console.log(
      `Generated ${processed}/${pages.length}... (rate: ${rate.toFixed(1)}/sec, ETA: ${eta}min)`,
    )

    // Rate limiting: 2 seconds between batches
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  return processed
}

async function main() {
  const opts = parseArgs()

  console.log(`\n🚀 Batch Generation — Nebbuler SEO Automation`)
  console.log(`📊 Config:`)
  console.log(`   Count: ${opts.count}`)
  console.log(`   Countries: ${opts.countries.join(', ')}`)
  console.log(`   Specialties: ${opts.specialties.join(', ')}`)
  console.log(`   Concurrent: ${opts.concurrent}`)
  console.log(`   Test mode: ${opts.test ? 'YES' : 'NO'}\n`)

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  if (!anthropicKey) {
    console.error('❌ Missing ANTHROPIC_API_KEY')
    process.exit(1)
  }

  // Generate page list
  const pages: Array<{ keyword: string; specialty: string; country: string }> = []
  for (const specialty of opts.specialties) {
    for (const country of opts.countries) {
      for (let i = 0; i < opts.count / (opts.specialties.length * opts.countries.length); i++) {
        pages.push({
          keyword: `${specialty} en ${country}`,
          specialty,
          country,
        })
      }
    }
  }

  console.log(`📄 Generating ${pages.length} pages...\n`)
  const startTime = Date.now()

  try {
    const generated = await processBatch(pages.slice(0, opts.count), opts.concurrent)
    const duration = (Date.now() - startTime) / 1000

    console.log(`\n✅ Complete!`)
    console.log(`   Generated: ${generated}/${opts.count}`)
    console.log(`   Duration: ${duration.toFixed(1)}s`)
    console.log(`   Rate: ${(generated / duration).toFixed(1)} pages/sec`)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
