import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { postOriginalTweet } from '@/lib/x-client'
import { canPublish, incrementRateLimit, getNextImage, markImageUsed } from '@/lib/social'
import { getTodayTemplate } from '@/lib/content-posts'

function adminClient() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = adminClient()

  // 1. Verificar rate limit diario en X
  const { ok, reason } = await canPublish('x')
  if (!ok) {
    return NextResponse.json({ skipped: true, reason }, { status: 200 })
  }

  // 2. Verificar que no se haya posteado contenido propio hoy
  const today = new Date().toISOString().split('T')[0]
  const { data: existingPost } = await supabase
    .from('social_posted_content')
    .select('id')
    .eq('platform', 'x')
    .gte('posted_at', `${today}T00:00:00Z`)
    .lt('posted_at', `${today}T23:59:59Z`)
    .limit(1)
    .single()

  if (existingPost) {
    return NextResponse.json({ skipped: true, reason: 'Ya se publicó contenido hoy' }, { status: 200 })
  }

  // 3. Obtener template del día
  const template = getTodayTemplate()

  // 4. Obtener imagen — primero busca en /public/social-images/posters/, luego SVG automáticos
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
      // Rota por día del año
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
      const file = posterFiles[dayOfYear % posterFiles.length]
      const filePath = join(postersDir, file)
      const rawBuffer = await readFile(filePath)
      pngBuffer = await sharp(rawBuffer).resize(1200, 675).png().toBuffer()
      imageUrl = `/social-images/posters/${file}`
    } else {
      // Fallback: SVG automáticos de Supabase
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

  // 5. Publicar en X
  let success = false
  let errorMessage: string | undefined

  try {
    await postOriginalTweet(template.text, pngBuffer)
    success = true
    await incrementRateLimit('x')
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err)
    console.error('[post-content] Error publicando tweet:', err)
  }

  // 6. Registrar en tabla social_posted_content
  const { error: insertError } = await supabase.from('social_posted_content').insert({
    platform: 'x',
    text: template.text,
    image_url: imageUrl ?? null,
    posted_at: new Date().toISOString(),
    success,
    error_message: errorMessage ?? null,
  })

  if (insertError) {
    console.error('[post-content] Error insertando registro:', insertError)
  }

  if (!success) {
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    text: template.text,
    imageTone: template.imageTone,
    imageUrl: imageUrl ?? null,
    postedAt: new Date().toISOString(),
  })
}
