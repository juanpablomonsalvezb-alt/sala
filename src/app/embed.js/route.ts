import type { NextRequest } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400

// JavaScript embebible público para Nebbuler.
// Uso:
//   <script src="https://nebbuler.com/embed.js" data-nebbuler-creator="slug"></script>
// O programático:
//   <script>window.NEBBULER_CREATOR = 'slug'</script>
//   <script src="https://nebbuler.com/embed.js"></script>
//
// El script:
//   1. Localiza su propio <script> tag o un placeholder con data-nebbuler-creator
//   2. Inserta un <iframe> hacia /embed/iframe/<creator>?size=<size>
//   3. Escucha postMessage del iframe para autoajustar la altura
//   4. Degrada a un link estático si JS falla a mitad de camino

const SCRIPT = `(function(){
  if (window.__nebbulerEmbedLoaded) return;
  window.__nebbulerEmbedLoaded = true;
  var ORIGIN = 'https://nebbuler.com';
  function findScripts(){
    var nodes = document.querySelectorAll('script[data-nebbuler-creator]');
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.dataset.nebbulerMounted === '1') continue;
      list.push(n);
    }
    if (list.length === 0 && window.NEBBULER_CREATOR && document.currentScript) {
      var s = document.currentScript;
      s.dataset.nebbulerCreator = String(window.NEBBULER_CREATOR);
      list.push(s);
    }
    return list;
  }
  function mount(scriptEl){
    var slug = (scriptEl.dataset.nebbulerCreator || '').trim();
    if (!slug) return;
    scriptEl.dataset.nebbulerMounted = '1';
    var size = (scriptEl.dataset.nebbulerSize || 'standard').trim();
    if (size !== 'compact' && size !== 'expanded') size = 'standard';
    var defaultHeights = { compact: 400, standard: 600, expanded: 800 };
    var maxWidths = { compact: 320, standard: 480, expanded: 640 };
    var iframe = document.createElement('iframe');
    iframe.src = ORIGIN + '/embed/iframe/' + encodeURIComponent(slug) + '?size=' + size;
    iframe.setAttribute('title', 'Sala de ' + slug + ' en Nebbuler');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.style.cssText = 'width:100%;max-width:' + maxWidths[size] + 'px;height:' + defaultHeights[size] + 'px;border:0;background:transparent;display:block;margin:0;color-scheme:light';
    iframe.dataset.nebbulerCreator = slug;
    // Fallback: si por CSP el iframe no puede cargar, mostramos link
    var fallback = document.createElement('noscript');
    fallback.innerHTML = '<a href="' + ORIGIN + '/' + slug + '" target="_blank" rel="noopener">Ver sala de ' + slug + ' en Nebbuler</a>';
    if (scriptEl.parentNode) {
      scriptEl.parentNode.insertBefore(iframe, scriptEl.nextSibling);
      scriptEl.parentNode.insertBefore(fallback, iframe.nextSibling);
    }
  }
  function onMessage(ev){
    if (!ev || !ev.data || typeof ev.data !== 'object') return;
    if (ev.data.type !== 'nebbuler-embed-height') return;
    var h = parseInt(ev.data.height, 10);
    if (!h || h < 50 || h > 4000) return;
    var slug = ev.data.creator;
    var sel = slug ? 'iframe[data-nebbuler-creator="' + String(slug).replace(/"/g, '') + '"]' : 'iframe[data-nebbuler-creator]';
    var frames = document.querySelectorAll(sel);
    for (var i = 0; i < frames.length; i++) frames[i].style.height = h + 'px';
  }
  function boot(){
    var scripts = findScripts();
    for (var i = 0; i < scripts.length; i++) mount(scripts[i]);
  }
  window.addEventListener('message', onMessage);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  // Re-escanear en SPAs que insertan más placeholders después
  setTimeout(boot, 1500);
  setTimeout(boot, 4000);
})();`

export async function GET(_req: NextRequest): Promise<Response> {
  return new Response(SCRIPT, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  })
}
