import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { postOriginalTweet } from '@/lib/x-client'
import { publishLinkedInPost } from '@/lib/linkedin-client'
import { canPublish, incrementRateLimit, getNextImage, markImageUsed } from '@/lib/social'
import { getTodayTemplate } from '@/lib/content-posts'
import { isAuthorizedCron } from '@/lib/cron-auth'

function adminClient() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = adminClient()
  const today = new Date().toISOString().split('T')[0]

  // Obtener template del día
  const template = getTodayTemplate()

  // Obtener imagen
  let pngBuffer: Buffer | undefined
  let imageUrl: string | undefined

  try {
    const { readdir, readFile } = await import('fs/promises')
    const { join } = await import('path')
    const postersDir = join(process.cwd(), 'public/social-images/posters')
    const posterFiles = (await readdir(postersDir).catch(() => []))
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .sort()

    if (posterFiles.length > 0) {
      const file = posterFiles[Math.floor(Math.random() * posterFiles.length)]
      const filePath = join(postersDir, file)
      const rawBuffer = await readFile(filePath)
      pngBuffer = await sharp(rawBuffer).resize(1200, 675).png().toBuffer()
      imageUrl = `https://nebbuler.com/social-images/posters/${file}`
    } else {
      const imageRecord = await getNextImage(template.imageTone)
      if (imageRecord?.storage_url) {
        imageUrl = imageRecord.storage_url
        const svgBuffer = await fetch(imageRecord.storage_url)
          .then(r => r.arrayBuffer())
          .then(b => Buffer.from(b))
        pngBuffer = await sharp(svgBuffer).resize(1200, 675).png().toBuffer()
        await markImageUsed(imageRecord.id)
      }
    }
  } catch (imgErr) {
    console.error('[post-content] Error procesando imagen:', imgErr)
  }

  const results: { platform: string; ok: boolean; error?: string }[] = []

  // X pausado hasta junio 2026 — cuenta nueva bloqueada
  const xEnabled = process.env.X_ENABLED !== 'false'
  const xLimit = await canPublish('x')
  if (xEnabled && xLimit.ok) {
    try {
      await postOriginalTweet(template.text, pngBuffer)
      await incrementRateLimit('x')
      await supabase.from('social_posted_content').insert({
        platform: 'x', text: template.text, image_url: imageUrl ?? null,
        posted_at: new Date().toISOString(), success: true,
      })
      results.push({ platform: 'x', ok: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await supabase.from('social_posted_content').insert({
        platform: 'x', text: template.text, image_url: imageUrl ?? null,
        posted_at: new Date().toISOString(), success: false, error_message: msg,
      })
      results.push({ platform: 'x', ok: false, error: msg })
    }
  }

  // Publicar en LinkedIn — solo poster, sin texto de template
  const liLimit = await canPublish('linkedin')
  if (liLimit.ok) {
    try {
      await publishLinkedInPost('nebbuler.com', imageUrl?.startsWith('http') ? imageUrl : undefined)
      await incrementRateLimit('linkedin')
      await supabase.from('social_posted_content').insert({
        platform: 'linkedin', text: template.text, image_url: imageUrl ?? null,
        posted_at: new Date().toISOString(), success: true,
      })
      results.push({ platform: 'linkedin', ok: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ platform: 'linkedin', ok: false, error: msg })
    }
  }

  const anyOk = results.some(r => r.ok)

  return NextResponse.json({
    ok: anyOk,
    text: template.text,
    imageUrl: imageUrl ?? null,
    results,
    postedAt: new Date().toISOString(),
  }, { status: anyOk ? 200 : 500 })
}
