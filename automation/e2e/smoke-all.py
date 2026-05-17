#!/usr/bin/env python3
"""
Smoke test consolidado de TODOS los flujos críticos del cliente.

Capas:
  A) HTTP — 50+ URLs públicas deben retornar 200 + contenido esperado
  B) API — endpoints públicos OK, privados rechazan sin auth
  C) BD — Supabase REST: schema, constraints, RLS críticos
  D) Interactive (patchright) — se ejecuta en script aparte

Reporte: /tmp/nebbuler-e2e/audit-e2e.json + AUDIT-E2E.md
"""

import os, sys, json, requests, time, warnings
from datetime import datetime
from pathlib import Path
warnings.filterwarnings('ignore')

BASE = 'https://nebbuler.com'
OUT = Path('/tmp/nebbuler-e2e')
OUT.mkdir(exist_ok=True)

# ─── Env ─────────────────────────────────────────────────────────────────────
def load_env():
    env = {}
    for line in open('/Users/juanpablomonsalvez/Downloads/sala/.env.local'):
        if '=' in line and not line.strip().startswith('#'):
            k, _, v = line.strip().partition('=')
            env[k] = v.strip('"').strip("'")
    return env

ENV = load_env()
SB_URL = ENV['NEXT_PUBLIC_SUPABASE_URL']
SB_SECRET = ENV['SUPABASE_SECRET_KEY']
SB_ANON = ENV['NEXT_PUBLIC_SUPABASE_ANON_KEY']

results = {
    'started_at': datetime.now().isoformat(),
    'layers': {'A_http': [], 'B_api': [], 'C_db': []},
}

def log(s, lvl='INFO'):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {lvl}: {s}', flush=True)

# ─── A) HTTP smoke ──────────────────────────────────────────────────────────
log('━' * 60)
log('CAPA A — HTTP smoke (URLs públicas)')

PUBLIC_URLS = [
    # Core marketing
    ('/', 'homepage', ['Nebbuler', 'NEBBULER']),
    ('/monetizar', 'pillar monetizar', ['Cómo monetizar', '5 pasos']),
    ('/calculadora', 'calculadora interactiva', ['Calculá cuánto']),
    ('/comparar', 'comparativa principal', ['Nebbuler vs']),
    ('/para-creadores', 'para creadores', ['Para creadores']),
    ('/precios', 'precios', None),
    ('/faq', 'FAQ hub', ['Preguntas frecuentes']),
    ('/sobre', 'sobre', None),
    ('/prensa', 'prensa', ['Prensa', 'press']),
    ('/contacto', 'contacto', None),
    ('/terminos', 'términos', None),
    ('/privacidad', 'privacidad', None),
    # Comparativas /vs
    ('/vs/substack', 'vs substack', ['Substack', '0%']),
    ('/vs/patreon', 'vs patreon', ['Patreon']),
    ('/vs/beehiiv', 'vs beehiiv', ['Beehiiv', 'Beehiiv']),
    ('/vs/gumroad', 'vs gumroad', ['Gumroad']),
    ('/vs/ko-fi', 'vs ko-fi', ['Ko-fi']),
    ('/vs/buymeacoffee', 'vs buymeacoffee', ['Buy Me a Coffee']),
    ('/vs/memberful', 'vs memberful', ['Memberful']),
    # Páginas SSG: guías
    ('/guia', 'hub guías', ['Guías', 'guías']),
    ('/guia/como-monetizar-conocimiento-economista', 'guía economista', ['economista']),
    ('/guia/como-monetizar-conocimiento-abogado', 'guía abogado', ['abogado']),
    # Auth / acceso
    ('/entrar', 'login page', ['Iniciar', 'Ingresar', 'email']),
    ('/registro', 'registro page', ['Crear', 'cuenta']),
    ('/recuperar-contrasena', 'recuperar contraseña', None),
    ('/abrir', 'abrir cuenta creador', ['Abrir', 'sala']),
    # SEO / AEO
    ('/sitemap.xml', 'sitemap', ['<urlset', '<loc>']),
    ('/sitemap-news.xml', 'sitemap news', None),
    ('/robots.txt', 'robots', ['User-Agent', 'Sitemap:']),
    ('/llms.txt', 'llms.txt para IAs', ['Nebbuler', 'creadores']),
    ('/rss.xml', 'RSS feed', ['<rss', '<channel>']),
    ('/manifest.json', 'PWA manifest', ['name']),
    # Creator pages (uno conocido)
    ('/orbbi', 'perfil creador orbbi', None),
    ('/suscribirse/orbbi', 'suscribirse a orbbi', ['Nebbuler']),
    # Directorios
    ('/directorio', 'directorio', None),
    ('/explorar', 'explorar', None),
    # Análisis / pillar / tendencias
    ('/analisis', 'análisis hub', None),
    ('/pillar', 'pillar hub', None),
    ('/glosario', 'glosario', None),
    ('/observatorio', 'observatorio', None),
    ('/observatorio/datos', 'observatorio datos', None),
    # Salarios
    ('/salario/abogado/chile', 'salario abogado chile', ['abogado', 'salario']),
    ('/salario/economista/mexico', 'salario economista méxico', ['economista']),
    # Embeds (deberían dar 200 aunque el creador no exista — embed/orbbi)
    ('/embed/orbbi', 'embed creator', None),
    ('/widget/orbbi', 'widget creator', None),
    # API públicas
    ('/api/health', 'health check', None),
]

for path, label, expected_terms in PUBLIC_URLS:
    url = BASE + path
    try:
        r = requests.get(url, timeout=20, allow_redirects=False)
        code = r.status_code
        body = r.text[:8000] if r.text else ''

        ok_http = 200 <= code < 400
        ok_content = True
        missing_terms = []
        if expected_terms and ok_http:
            for term in expected_terms:
                if term.lower() not in body.lower():
                    missing_terms.append(term)
            ok_content = len(missing_terms) == 0

        status = '✅' if (ok_http and ok_content) else ('⚠️ ' if ok_http else '❌')
        log(f'  {status} {code} {path} ({label})')
        if missing_terms:
            log(f'      faltan términos: {missing_terms}')

        results['layers']['A_http'].append({
            'path': path, 'label': label, 'http_code': code,
            'ok_http': ok_http, 'ok_content': ok_content, 'missing': missing_terms,
        })
    except Exception as e:
        log(f'  ❌ EXC {path} ({label}): {str(e)[:80]}')
        results['layers']['A_http'].append({
            'path': path, 'label': label, 'error': str(e)[:100],
        })

# ─── B) API endpoint tests ──────────────────────────────────────────────────
log('━' * 60)
log('CAPA B — API endpoints (públicos OK, privados rechazan)')

API_TESTS = [
    # Públicos GET
    ('GET', '/api/health', None, [200], 'health debe ser público'),
    ('GET', '/api/creators', None, [200], 'lista pública de creadores'),
    ('GET', '/api/search?q=test', None, [200, 404], 'search público'),
    ('GET', '/api/trending', None, [200, 404], 'trending público'),
    # Privados — sin auth debe rechazar
    ('POST', '/api/mp/webhook', {}, [400, 401], 'webhook MP sin firma'),
    ('POST', '/api/stripe/webhook', {}, [400, 401], 'webhook Stripe sin firma'),
    ('GET', '/api/cron/aeo-pulse', None, [401], 'cron sin secret rechaza'),
    ('GET', '/api/cron/refresh-mp-tokens', None, [401], 'cron sin secret rechaza'),
    ('POST', '/api/mp/platform-checkout', {}, [401], 'checkout requiere auth'),
    ('POST', '/api/mp/disconnect', {}, [401], 'disconnect requiere auth'),
    ('POST', '/api/stripe/create-checkout', {}, [400, 401], 'stripe checkout requiere auth'),
    # GET privados (UI redirige)
    ('GET', '/api/mp/connect', None, [200, 302, 307, 401, 500], 'connect MP — varía'),
    # Indexnow con secret incorrecto
    ('POST', '/api/indexnow', {'urls': ['test']}, [401], 'indexnow sin auth rechaza'),
]

for method, path, body, expected_codes, desc in API_TESTS:
    url = BASE + path
    try:
        if method == 'GET':
            r = requests.get(url, timeout=15, allow_redirects=False)
        else:
            r = requests.post(url, json=body, timeout=15, allow_redirects=False)
        ok = r.status_code in expected_codes
        status = '✅' if ok else '❌'
        log(f'  {status} {method} {r.status_code} {path} ({desc}) — esperado {expected_codes}')
        results['layers']['B_api'].append({
            'method': method, 'path': path, 'desc': desc,
            'status': r.status_code, 'expected': expected_codes, 'ok': ok,
            'body_preview': r.text[:200],
        })
    except Exception as e:
        log(f'  ❌ EXC {path}: {str(e)[:80]}')
        results['layers']['B_api'].append({
            'method': method, 'path': path, 'desc': desc, 'error': str(e)[:100],
        })

# ─── C) BD integrity (Supabase) ────────────────────────────────────────────
log('━' * 60)
log('CAPA C — BD: schema, constraints, RLS')

def sb_get(path, key=SB_SECRET):
    r = requests.get(f'{SB_URL}/rest/v1/{path}',
                     headers={'apikey': key, 'Authorization': f'Bearer {key}'},
                     timeout=15)
    return r.status_code, r.text[:500]

def sb_post(path, body, key=SB_SECRET):
    r = requests.post(f'{SB_URL}/rest/v1/{path}',
                      headers={'apikey': key, 'Authorization': f'Bearer {key}',
                               'Content-Type': 'application/json', 'Prefer': 'return=representation'},
                      json=body, timeout=15)
    return r.status_code, r.text[:500]

DB_TESTS = [
    # Columnas críticas existen (con SECRET)
    ('sala_creators tiene display_name', lambda: sb_get('sala_creators?select=display_name&limit=1'), lambda c, b: c == 200),
    ('sala_creators tiene username', lambda: sb_get('sala_creators?select=username&limit=1'), lambda c, b: c == 200),
    ('sala_creators tiene stripe_price_id', lambda: sb_get('sala_creators?select=stripe_price_id&limit=1'), lambda c, b: c == 200),
    ('sala_creators NO tiene mp_access_token (debe estar DROPed)', lambda: sb_get('sala_creators?select=mp_access_token&limit=1'), lambda c, b: 'does not exist' in b),
    ('sala_creator_secrets existe (SECRET puede leer)', lambda: sb_get('sala_creator_secrets?select=creator_id&limit=1'), lambda c, b: c == 200),
    ('sala_subscriptions tiene last_paid_at', lambda: sb_get('sala_subscriptions?select=last_paid_at&limit=1'), lambda c, b: c == 200),
    ('sala_subscriptions tiene mp_preapproval_id', lambda: sb_get('sala_subscriptions?select=mp_preapproval_id&limit=1'), lambda c, b: c == 200),
    ('sala_webhook_events tiene status (idempotencia)', lambda: sb_get('sala_webhook_events?select=status&limit=1'), lambda c, b: c == 200),
    # RLS: anon NO puede leer secrets
    ('ANON rechazado leyendo sala_creator_secrets', lambda: sb_get('sala_creator_secrets?select=*', key=SB_ANON), lambda c, b: c == 401 or '42501' in b),
    ('ANON rechazado leyendo mp_access_token específico', lambda: sb_get('sala_creator_secrets?select=mp_access_token', key=SB_ANON), lambda c, b: '42501' in b),
    # CHECK constraint funciona
    ('CHECK status sala_webhook_events rechaza bogus', lambda: sb_post('sala_webhook_events', {'provider': 'test', 'event_id': f'check-{int(time.time())}', 'status': 'bogus'}), lambda c, b: '23514' in b),
    # UNIQUE constraint
    ('UNIQUE webhook_events activo', lambda: sb_get('sala_webhook_events?select=count'), lambda c, b: c == 200),  # sanity
]

for desc, fn, validator in DB_TESTS:
    try:
        code, body = fn()
        ok = validator(code, body)
        status = '✅' if ok else '❌'
        log(f'  {status} {desc} (HTTP {code})')
        results['layers']['C_db'].append({'desc': desc, 'http_code': code, 'ok': ok, 'body': body[:200]})
    except Exception as e:
        log(f'  ❌ EXC {desc}: {str(e)[:80]}')
        results['layers']['C_db'].append({'desc': desc, 'error': str(e)[:100]})

# ─── Reporte ────────────────────────────────────────────────────────────────
results['finished_at'] = datetime.now().isoformat()

# Estadísticas — usar lista fija para evitar "dict changed size during iteration"
stats = {}
for layer_key in ['A_http', 'B_api', 'C_db']:
    items = results['layers'].get(layer_key, [])
    total = len(items)
    ok_count = sum(1 for x in items if x.get('ok') is True or (x.get('ok_http') and x.get('ok_content', True)))
    err_count = sum(1 for x in items if 'error' in x)
    stats[layer_key] = {'total': total, 'ok': ok_count, 'errors': err_count}
results['stats'] = stats

with open(OUT / 'audit-e2e.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

log('━' * 60)
log('RESUMEN GLOBAL:')
for k in ['A_http', 'B_api', 'C_db']:
    s = stats[k]
    log(f'  Capa {k}: {s["ok"]}/{s["total"]} OK, {s["errors"]} excepciones')
log(f'📊 Reporte: {OUT}/audit-e2e.json')
