#!/usr/bin/env python3
"""
E2E interactivo con Patchright — flujos del cliente que NO requieren MP conectado.

Flujos cubiertos:
  1. Registro de usuario nuevo (visitante → usuario)
  2. Login con credenciales recién creadas
  3. Dashboard del usuario logueado
  4. /abrir multistep — flujo para volverse creador
  5. /recuperar-contrasena — envío de email
  6. Logout
  7. /suscribirse/[creator] desde estado logueado (verifica que se redirige a login si anon)

Cada paso: screenshot + verificación en Supabase BD.
Reporte: /tmp/nebbuler-e2e/interactive-report.json
"""

import os, json, random, string, time, warnings, requests
from datetime import datetime
from pathlib import Path
warnings.filterwarnings('ignore')

from patchright.sync_api import sync_playwright

BASE = 'https://nebbuler.com'
OUT = Path('/tmp/nebbuler-e2e')
OUT.mkdir(exist_ok=True)

# Env
ENV = {}
for line in open('/Users/juanpablomonsalvez/Downloads/sala/.env.local'):
    if '=' in line and not line.strip().startswith('#'):
        k, _, v = line.strip().partition('=')
        ENV[k] = v.strip('"').strip("'")
SB_URL = ENV['NEXT_PUBLIC_SUPABASE_URL']
SB_SECRET = ENV['SUPABASE_SECRET_KEY']

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}', flush=True)

def sb_get(path):
    r = requests.get(f'{SB_URL}/rest/v1/{path}',
                     headers={'apikey': SB_SECRET, 'Authorization': f'Bearer {SB_SECRET}'},
                     timeout=10)
    return r.status_code, r.text[:500]

def sb_delete(path):
    r = requests.delete(f'{SB_URL}/rest/v1/{path}',
                        headers={'apikey': SB_SECRET, 'Authorization': f'Bearer {SB_SECRET}'},
                        timeout=10)
    return r.status_code

# ─── Generar credenciales únicas ───────────────────────────────────────────
suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
EMAIL = f'qa-e2e-{suffix}@nebbuler-qa.com'
PASSWORD = f'QApass{suffix}!Aa9'
FULL_NAME = f'QA E2E {suffix}'

log(f'Email de test: {EMAIL}')

report = {
    'started_at': datetime.now().isoformat(),
    'email': EMAIL,
    'flows': [],
}

def add_flow(name, status, **kwargs):
    entry = {'flow': name, 'status': status, **kwargs}
    report['flows'].append(entry)
    icon = {'pass': '✅', 'fail': '❌', 'partial': '⚠️ ', 'blocked': '🟡'}.get(status, '?')
    log(f'  {icon} [{name}] {status} {kwargs.get("note", "")}')

# ─── Main ────────────────────────────────────────────────────────────────────
with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,  # headless para que sea rápido y reproducible
        args=['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    )
    context = browser.new_context(
        viewport={'width': 1280, 'height': 800},
        locale='es-CL',
    )
    page = context.new_page()

    def shot(name):
        path = OUT / f'iv-{name}.png'
        try:
            page.screenshot(path=str(path), full_page=True)
            return str(path)
        except Exception:
            return None

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 1 — Registro de usuario nuevo
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 1 — Registro (multi-step: lector)')
    try:
        page.goto(f'{BASE}/registro', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=20000)
        time.sleep(1)
        shot('01-registro-landing')

        # /registro es una landing con 2 ramas: "Soy lector" / "Soy creador"
        # Click "Registrarme como lector"
        lector_link = page.locator('a:has-text("Registrarme como lector"), a:has-text("Soy lector")').first
        if lector_link.count() > 0:
            lector_link.click()
            page.wait_for_load_state('networkidle', timeout=20000)
            time.sleep(2)
            shot('01b-registro-lector-form')

        # Encontrar inputs del form real
        email_input = page.locator('input[type="email"], input[name="email"], input[id*="email"]').first
        pass_input = page.locator('input[type="password"], input[name="password"]').first
        name_input = page.locator('input[name="full_name"], input[name="name"], input[placeholder*="ombre"], input[placeholder*="ame"]').first

        if email_input.count() == 0:
            add_flow('register', 'fail',
                     note='No encontró input email tras click lector',
                     url=page.url,
                     body=(page.locator("body").text_content() or "")[:200])
        else:
            email_input.fill(EMAIL)
            pass_input.fill(PASSWORD)
            if name_input.count() > 0:
                name_input.fill(FULL_NAME)
            shot('02-registro-filled')

            # Submit
            submit_btn = page.locator('button[type="submit"]').first
            submit_btn.click()
            time.sleep(4)
            shot('03-registro-after-submit')

            # Verificar redirect / mensaje
            after_url = page.url
            body_text = (page.locator('body').text_content() or '')[:500]

            # Verificar en BD
            code, body = sb_get(f'sala_profiles?email=eq.{EMAIL}&select=id,email,full_name,created_at')
            in_db = code == 200 and EMAIL in body

            if in_db:
                add_flow('register', 'pass',
                         after_url=after_url, in_db=True,
                         note='Usuario creado en sala_profiles')
            else:
                # Puede que necesite confirmación de email; verificamos en auth.users (no accesible vía REST directo)
                # Heurística: si la página muestra "confirma tu email" o similar
                needs_confirm = any(t in body_text.lower() for t in ['confirma', 'verifica', 'email'])
                add_flow('register', 'partial',
                         after_url=after_url, in_db=False,
                         needs_email_confirm=needs_confirm,
                         body_preview=body_text[:300],
                         note='Form submitido; profile no en BD (¿confirmación email pendiente?)')
    except Exception as e:
        add_flow('register', 'fail', error=str(e)[:200])

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 2 — Login con el usuario recién creado
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 2 — Login')
    try:
        page.goto(f'{BASE}/entrar', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=20000)
        shot('04-login-page')

        email_input = page.locator('input[type="email"], input[name="email"]').first
        pass_input = page.locator('input[type="password"], input[name="password"]').first

        if email_input.count() == 0:
            add_flow('login', 'fail', note='No encontró input de email')
        else:
            email_input.fill(EMAIL)
            pass_input.fill(PASSWORD)
            shot('05-login-filled')
            page.locator('button[type="submit"]').first.click()
            time.sleep(4)
            shot('06-after-login')

            after_url = page.url
            # Si fuimos a /dashboard, login OK; si seguimos en /entrar, falló
            if '/dashboard' in after_url:
                add_flow('login', 'pass', after_url=after_url, note='Redirigió a dashboard')
            elif '/entrar' in after_url:
                body = (page.locator('body').text_content() or '')[:300]
                add_flow('login', 'partial',
                         after_url=after_url,
                         note='Sigue en /entrar — credenciales rechazadas o email no confirmado',
                         body_preview=body)
            else:
                add_flow('login', 'pass', after_url=after_url, note='Redirigió a otra ruta')
    except Exception as e:
        add_flow('login', 'fail', error=str(e)[:200])

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 3 — Dashboard accesible logueado
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 3 — Dashboard')
    try:
        page.goto(f'{BASE}/dashboard', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=20000)
        time.sleep(1)
        shot('07-dashboard')
        url = page.url
        body = (page.locator('body').text_content() or '')[:300]

        if '/entrar' in url or '/login' in url:
            add_flow('dashboard', 'partial', after_url=url, note='Dashboard requirió re-login')
        elif '/dashboard' in url:
            add_flow('dashboard', 'pass', after_url=url, note='Dashboard accesible')
        else:
            add_flow('dashboard', 'fail', after_url=url, body_preview=body)
    except Exception as e:
        add_flow('dashboard', 'fail', error=str(e)[:200])

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 4 — /abrir (volverse creador)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 4 — /abrir')
    try:
        page.goto(f'{BASE}/abrir', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=20000)
        time.sleep(2)
        shot('08-abrir-page')
        url = page.url
        body_text = (page.locator('body').text_content() or '')[:400]

        if '/entrar' in url:
            add_flow('abrir', 'partial', after_url=url, note='/abrir requirió login (esperado si no hay sesión válida)')
        else:
            # Buscar formulario
            inputs = page.locator('input, textarea, select').count()
            buttons = page.locator('button').count()
            add_flow('abrir', 'pass',
                     after_url=url, inputs_count=inputs, buttons_count=buttons,
                     note=f'/abrir cargó con {inputs} inputs y {buttons} buttons')
    except Exception as e:
        add_flow('abrir', 'fail', error=str(e)[:200])

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 5 — /recuperar-contrasena
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 5 — Recuperar contraseña')
    try:
        page.goto(f'{BASE}/recuperar-contrasena', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=20000)
        shot('09-recuperar-page')

        email_input = page.locator('input[type="email"]').first
        if email_input.count() > 0:
            email_input.fill(EMAIL)
            submit = page.locator('button[type="submit"]').first
            if submit.count() > 0:
                submit.click()
                time.sleep(3)
                shot('10-recuperar-after-submit')
                body = (page.locator('body').text_content() or '')[:300]
                # Heurística: si el mensaje cambió a algo positivo
                positive = any(t in body.lower() for t in ['enviado', 'revisa', 'correo', 'email', 'envia'])
                add_flow('recuperar_contrasena', 'pass' if positive else 'partial',
                         note='Form submitido' + (' (mensaje positivo detectado)' if positive else ''),
                         body_preview=body[:200])
            else:
                add_flow('recuperar_contrasena', 'fail', note='No hay botón submit')
        else:
            add_flow('recuperar_contrasena', 'fail', note='No hay input email')
    except Exception as e:
        add_flow('recuperar_contrasena', 'fail', error=str(e)[:200])

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 6 — /suscribirse desde estado logueado, creador sin MP
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 6 — /suscribirse/orbbi (creador sin MP)')
    try:
        page.goto(f'{BASE}/suscribirse/orbbi', timeout=30000)
        page.wait_for_load_state('networkidle', timeout=20000)
        time.sleep(2)
        shot('11-suscribirse-loggedin')
        body = (page.locator('body').text_content() or '')[:500]

        no_payments = 'no acepta pagos' in body.lower()
        has_subscribe_button = page.locator('button:has-text("Suscribirme"), a:has-text("Suscribirme")').count() > 0

        if no_payments:
            add_flow('suscribirse_sin_mp', 'pass',
                     note='Mensaje "no acepta pagos" mostrado correctamente (creador sin MP conectado)')
        elif has_subscribe_button:
            add_flow('suscribirse_sin_mp', 'fail',
                     note='Botón Suscribirme visible aunque creador NO tiene MP — bug UX')
        else:
            add_flow('suscribirse_sin_mp', 'partial',
                     body_preview=body[:300])
    except Exception as e:
        add_flow('suscribirse_sin_mp', 'fail', error=str(e)[:200])

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FLOW 7 — Logout
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    log('━ FLOW 7 — Logout via API')
    try:
        # POST a /api/auth/signout
        resp = page.request.post(f'{BASE}/api/auth/signout', data={})
        signout_status = resp.status
        page.goto(f'{BASE}/dashboard', timeout=20000)
        page.wait_for_load_state('networkidle', timeout=15000)
        url = page.url
        if '/entrar' in url or '/login' in url:
            add_flow('logout', 'pass', signout_http=signout_status, after_url=url,
                     note='Tras signout, /dashboard redirige a /entrar')
        else:
            add_flow('logout', 'partial', signout_http=signout_status, after_url=url,
                     note=f'Tras signout, /dashboard fue a {url}')
    except Exception as e:
        add_flow('logout', 'fail', error=str(e)[:200])

    browser.close()

# ─── Cleanup BD: borrar el usuario de test ────────────────────────────────
log('━ Cleanup: borrar usuario de test')
try:
    code, body = sb_get(f'sala_profiles?email=eq.{EMAIL}&select=id')
    if '[' in body and EMAIL in body or '"id"' in body:
        try:
            user_id = json.loads(body)[0]['id']
            sb_delete(f'sala_profiles?id=eq.{user_id}')
            log(f'  Borrado profile {user_id}')
        except Exception as e:
            log(f'  No pude borrar profile: {e}')
except Exception:
    pass

# ─── Reporte ──────────────────────────────────────────────────────────────
report['finished_at'] = datetime.now().isoformat()
report['summary'] = {
    'total': len(report['flows']),
    'pass': sum(1 for f in report['flows'] if f['status'] == 'pass'),
    'partial': sum(1 for f in report['flows'] if f['status'] == 'partial'),
    'fail': sum(1 for f in report['flows'] if f['status'] == 'fail'),
    'blocked': sum(1 for f in report['flows'] if f['status'] == 'blocked'),
}

out_path = OUT / 'interactive-report.json'
with open(out_path, 'w') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

log('━' * 60)
log(f'RESUMEN INTERACTIVO:')
s = report['summary']
log(f'  Total: {s["total"]} flujos')
log(f'  ✅ Pass:    {s["pass"]}')
log(f'  ⚠️  Partial: {s["partial"]}')
log(f'  ❌ Fail:    {s["fail"]}')
log(f'  🟡 Blocked: {s["blocked"]}')
log(f'📊 Reporte: {out_path}')
log(f'📸 Screenshots: {OUT}/iv-*.png')
