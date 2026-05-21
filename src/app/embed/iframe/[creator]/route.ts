import type { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// ─── Tipos internos ───────────────────────────────────────────────────────────

type Size = 'compact' | 'standard' | 'expanded'

type EmbedCreator = {
  id: string
  slug: string
  name: string
  display_name: string | null
  bio: string | null
  price_clp: number
  cover_image_url: string | null
  plan: 'free' | 'creator' | 'pro'
}

type EmbedPost = {
  title: string
  slug: string
  published_at: string | null
  excerpt: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickSize(raw: string | null): Size {
  if (raw === 'compact' || raw === 'expanded') return raw
  return 'standard'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function truncate(s: string | null | undefined, max: number): string {
  if (!s) return ''
  const trimmed = s.trim()
  if (trimmed.length <= max) return trimmed
  return trimmed.slice(0, max - 1).trimEnd() + '…'
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function formatCLP(n: number): string {
  return n.toLocaleString('es-CL')
}

// ─── Render: no encontrado ────────────────────────────────────────────────────

function renderNotFound(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Sala no encontrada · Nebbuler</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;min-height:100%;background:#FAFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}
  .wrap{padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center}
  .brand{font-family:'Playfair Display',Georgia,serif;font-size:11px;letter-spacing:.18em;color:#999;text-transform:uppercase;margin-bottom:14px}
  h1{font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#121212;font-weight:700;margin-bottom:8px;line-height:1.25}
  p{font-size:13px;color:#666;margin-bottom:18px;max-width:280px;line-height:1.5}
  a{display:inline-block;background:#C41C1C;color:#fff;text-decoration:none;font-size:12px;font-weight:600;padding:10px 18px;letter-spacing:.04em;text-transform:uppercase}
  a:hover{background:#a01515}
</style>
</head>
<body>
<div class="wrap">
  <div class="brand">Nebbuler</div>
  <h1>Esta sala aún no existe</h1>
  <p>El creador que buscas no tiene una sala activa en Nebbuler.</p>
  <a href="https://nebbuler.com/directorio" target="_top" rel="noopener">Explorar el directorio</a>
</div>
</body>
</html>`
}

// ─── Render: tarjeta editorial ────────────────────────────────────────────────

function renderCard(
  creator: EmbedCreator,
  posts: EmbedPost[],
  size: Size,
): string {
  const displayName = creator.display_name?.trim() || creator.name
  const bio = truncate(creator.bio, 100)
  const initial = displayName.charAt(0).toUpperCase()
  const price = formatCLP(creator.price_clp)
  const profileUrl = `https://nebbuler.com/${creator.slug}`
  const subscribeUrl = `https://nebbuler.com/suscribirse/${creator.slug}`
  const hasPosts = posts.length > 0

  // Schema.org Person
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: displayName,
    description: bio || undefined,
    url: profileUrl,
    image: creator.cover_image_url || undefined,
  }

  // Tamaños CSS variables
  const sizeVars: Record<Size, { pad: string; gap: string; avatar: string; nameSize: string; bioSize: string; postSize: string }> = {
    compact:  { pad: '16px', gap: '10px', avatar: '56px', nameSize: '17px', bioSize: '12px', postSize: '12px' },
    standard: { pad: '22px', gap: '14px', avatar: '72px', nameSize: '21px', bioSize: '13px', postSize: '13px' },
    expanded: { pad: '28px', gap: '18px', avatar: '88px', nameSize: '26px', bioSize: '14px', postSize: '14px' },
  }
  const sv = sizeVars[size]

  const avatarBlock = creator.cover_image_url
    ? `<img src="${escapeHtml(creator.cover_image_url)}" alt="${escapeHtml(displayName)}" loading="lazy" decoding="async" style="width:${sv.avatar};height:${sv.avatar};border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid #ECECE6" />`
    : `<div aria-hidden="true" style="width:${sv.avatar};height:${sv.avatar};border-radius:50%;background:#C41C1C;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:'Playfair Display',Georgia,serif;font-size:calc(${sv.avatar} / 2.4);font-weight:700;color:#fff;line-height:1">${escapeHtml(initial)}</span></div>`

  const postsBlock = hasPosts
    ? posts
        .slice(0, 3)
        .map((p) => {
          const date = formatDate(p.published_at)
          return `<a href="${escapeHtml(`https://nebbuler.com/${creator.slug}/${p.slug}`)}" target="_top" rel="noopener" style="display:flex;flex-direction:column;gap:2px;text-decoration:none;padding:8px 0;border-top:1px solid #ECECE6">
  <span style="font-family:'Playfair Display',Georgia,serif;font-size:${sv.postSize};font-weight:600;color:#121212;line-height:1.35">${escapeHtml(p.title)}</span>
  ${date ? `<span style="font-size:10px;color:#999;letter-spacing:.04em;text-transform:uppercase">${escapeHtml(date)}</span>` : ''}
</a>`
        })
        .join('\n')
    : `<div style="padding:10px 0;border-top:1px solid #ECECE6;font-size:12px;color:#888;font-style:italic">Sin publicaciones aún.</div>`

  const ctaBlock = hasPosts || creator.price_clp > 0
    ? `<a href="${escapeHtml(subscribeUrl)}" target="_top" rel="noopener" data-nbb-cta="subscribe" style="display:block;background:#C41C1C;color:#fff;text-align:center;padding:12px 14px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border-radius:2px;transition:background .15s">Suscribirme · $${escapeHtml(price)} CLP/mes</a>`
    : `<a href="${escapeHtml(profileUrl)}" target="_top" rel="noopener" data-nbb-cta="profile" style="display:block;background:#121212;color:#fff;text-align:center;padding:12px 14px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border-radius:2px">Visitar la sala</a>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${escapeHtml(displayName)} · Nebbuler</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;background:transparent;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;color:#121212}
  body{padding:0;margin:0;display:block}
  .nbb-card{background:#FAFAF7;border:1px solid #ECECE6;border-radius:4px;padding:${sv.pad};display:flex;flex-direction:column;gap:${sv.gap};font-family:'Inter',sans-serif}
  .nbb-brand{font-family:'Playfair Display',Georgia,serif;font-size:11px;letter-spacing:.22em;color:#999;text-transform:uppercase;font-weight:400}
  .nbb-head{display:flex;align-items:center;gap:14px}
  .nbb-name{font-family:'Playfair Display',Georgia,serif;font-size:${sv.nameSize};font-weight:700;color:#121212;line-height:1.15}
  .nbb-bio{font-size:${sv.bioSize};color:#555;line-height:1.55;margin-top:4px}
  .nbb-posts{display:flex;flex-direction:column}
  .nbb-posts a:hover .nbb-post-title{color:#C41C1C}
  .nbb-footer{display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#999;padding-top:6px;border-top:1px solid #ECECE6;letter-spacing:.04em}
  .nbb-footer a{color:#666;text-decoration:none;font-weight:500}
  .nbb-footer a:hover{color:#C41C1C}
  a[data-nbb-cta="subscribe"]:hover{background:#a01515 !important}
  a[data-nbb-cta="profile"]:hover{background:#2a2a2a !important}
  noscript{display:block;font-size:11px;color:#888;text-align:center;padding:6px}
</style>
</head>
<body>
<script type="application/ld+json">${JSON.stringify(personJsonLd)}</script>
<div class="nbb-card" id="nbb-card">
  <div style="display:flex;align-items:center;justify-content:space-between">
    <span class="nbb-brand">Nebbuler</span>
    <a href="${escapeHtml(profileUrl)}" target="_top" rel="noopener" style="font-size:10px;color:#999;text-decoration:none;letter-spacing:.06em;text-transform:uppercase">Ver sala →</a>
  </div>
  <div class="nbb-head">
    ${avatarBlock}
    <div style="min-width:0;flex:1">
      <div class="nbb-name">${escapeHtml(displayName)}</div>
      ${bio ? `<div class="nbb-bio">${escapeHtml(bio)}</div>` : ''}
    </div>
  </div>
  <div class="nbb-posts">
    ${postsBlock}
  </div>
  ${ctaBlock}
  <div class="nbb-footer">
    <a href="https://nebbuler.com" target="_top" rel="noopener">Powered by Nebbuler</a>
    <a href="https://nebbuler.com/abrir" target="_top" rel="noopener">Abrí tu sala →</a>
  </div>
</div>
<script>
(function(){
  // ── Auto-resize vía postMessage ──
  function sendHeight(){
    try {
      var el = document.getElementById('nbb-card');
      if (!el) return;
      var h = Math.ceil(el.getBoundingClientRect().height) + 2;
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'nebbuler-embed-height', height: h, creator: ${JSON.stringify(creator.slug)} }, '*');
      }
    } catch(e){}
  }
  if (document.readyState === 'complete') sendHeight();
  else window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);
  if (typeof ResizeObserver !== 'undefined') {
    try {
      var ro = new ResizeObserver(sendHeight);
      var el = document.getElementById('nbb-card');
      if (el) ro.observe(el);
    } catch(e){}
  }

  // ── Tracking discreto (PostHog opcional) ──
  function hostFromReferrer(){
    try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch(e){ return ''; }
  }
  var trackProps = {
    creator_slug: ${JSON.stringify(creator.slug)},
    host_domain: hostFromReferrer(),
    size: ${JSON.stringify(size)}
  };
  function safeCapture(event, props){
    try { if (window.posthog && typeof window.posthog.capture === 'function') window.posthog.capture(event, props); } catch(e){}
    try {
      if (navigator.sendBeacon) {
        var payload = JSON.stringify({ event: event, props: props, ts: Date.now() });
        navigator.sendBeacon('https://nebbuler.com/api/embed-track', payload);
      }
    } catch(e){}
  }
  safeCapture('embed_view', trackProps);

  document.querySelectorAll('a[data-nbb-cta]').forEach(function(a){
    a.addEventListener('click', function(){
      var t = a.getAttribute('data-nbb-cta');
      safeCapture(t === 'subscribe' ? 'embed_subscribe_click' : 'embed_profile_click', trackProps);
    });
  });
})();
</script>
<noscript>Embed estático · <a href="${escapeHtml(profileUrl)}" target="_top">Ver sala completa de ${escapeHtml(displayName)} en Nebbuler</a></noscript>
</body>
</html>`
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ creator: string }> },
): Promise<Response> {
  const { creator: slug } = await ctx.params
  const sizeParam = req.nextUrl.searchParams.get('size')
  const size = pickSize(sizeParam)

  // Headers comunes — permiten embed cross-origin
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': "frame-ancestors *; default-src 'self' 'unsafe-inline' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' https://app.posthog.com https://us.i.posthog.com; connect-src 'self' https:",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
  })

  if (!slug || slug.length > 80) {
    return new Response(renderNotFound(), { status: 200, headers })
  }

  let supabase
  try {
    supabase = createServiceClient()
  } catch {
    return new Response(renderNotFound(), { status: 200, headers })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: creatorRaw } = await db
    .from('sala_creators')
    .select('id, slug, name, display_name, bio, price_clp, cover_image_url, plan')
    .eq('slug', slug)
    .maybeSingle()

  const creator = creatorRaw as EmbedCreator | null
  if (!creator) {
    return new Response(renderNotFound(), { status: 200, headers })
  }

  const { data: postsRaw } = await db
    .from('sala_posts')
    .select('title, slug, published_at, excerpt')
    .eq('creator_id', creator.id)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(3)

  const posts: EmbedPost[] = (postsRaw as EmbedPost[] | null) ?? []

  return new Response(renderCard(creator, posts, size), { status: 200, headers })
}
