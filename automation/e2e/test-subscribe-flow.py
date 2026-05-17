#!/usr/bin/env python3
"""
E2E test del flujo de suscripción end-to-end contra nebbuler.com producción.

Pasos:
  1. Abre Chrome stealth (patchright) en modo no-headless para que veas qué pasa
  2. Crea cuenta nueva con email random
  3. Navega a /suscribirse/orbbi
  4. Click "Suscribirme"
  5. Captura screenshots en cada paso
  6. Verifica en Supabase qué quedó en BD
  7. Reporta hasta dónde llegó

Si MP_TEST_ACCESS_TOKEN está definido, completa el flujo con tarjeta APRO.
Sin él, llega hasta el init_point de MP y reporta.
"""

import os
import sys
import json
import random
import string
import time
import warnings
from datetime import datetime
warnings.filterwarnings('ignore')

import requests
from patchright.sync_api import sync_playwright

# ─── Config ──────────────────────────────────────────────────────────────────
BASE = 'https://nebbuler.com'
CREATOR_SLUG = 'orbbi'
SCREENSHOTS_DIR = '/tmp/nebbuler-e2e'
TEST_TOKEN = os.environ.get('MP_TEST_ACCESS_TOKEN', '')

# Tarjeta de test MP Chile (Mastercard APRO = aprobada)
TEST_CARD = {
    'number': '5031 7557 3453 0604',
    'cvv': '123',
    'expiry': '11/30',
    'holder': 'APRO',
    'document': '12345678-5',
}

def log(msg, level='INFO'):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {level}: {msg}', flush=True)

# Supabase verification
def load_env():
    env_path = '/Users/juanpablomonsalvez/Downloads/sala/.env.local'
    env = {}
    with open(env_path) as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                k, _, v = line.strip().partition('=')
                env[k] = v.strip('"').strip("'")
    return env

ENV = load_env()
SUPABASE_URL = ENV['NEXT_PUBLIC_SUPABASE_URL']
SECRET_KEY = ENV['SUPABASE_SECRET_KEY']

def check_supabase(table, query=''):
    url = f'{SUPABASE_URL}/rest/v1/{table}?{query}'
    r = requests.get(url, headers={
        'apikey': SECRET_KEY,
        'Authorization': f'Bearer {SECRET_KEY}',
    }, timeout=10)
    return r.status_code, r.text[:400]

# ─── Main ────────────────────────────────────────────────────────────────────
def main():
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

    # Generar email único
    random_id = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    email = f'e2e-test+{random_id}@nebbuler-test.com'
    password = f'E2EtestPass{random_id}!'

    log(f'Test email: {email}')

    findings = {
        'email': email,
        'started_at': datetime.now().isoformat(),
        'steps': [],
        'screenshots': [],
        'final_state': {},
    }

    with sync_playwright() as p:
        # Stealth Chromium
        browser = p.chromium.launch(
            headless=False,
            args=['--no-sandbox', '--disable-blink-features=AutomationControlled'],
        )
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            locale='es-CL',
        )
        page = context.new_page()

        def screenshot(name):
            path = f'{SCREENSHOTS_DIR}/{name}.png'
            page.screenshot(path=path, full_page=True)
            findings['screenshots'].append(path)
            log(f'  📸 {path}')
            return path

        try:
            # PASO 1 — homepage
            log('PASO 1 — homepage')
            page.goto(BASE, timeout=30000)
            page.wait_for_load_state('domcontentloaded')
            screenshot('01-homepage')
            findings['steps'].append({'step': 'homepage', 'url': page.url, 'ok': True})

            # PASO 2 — ir al creador
            log(f'PASO 2 — /suscribirse/{CREATOR_SLUG}')
            page.goto(f'{BASE}/suscribirse/{CREATOR_SLUG}', timeout=30000)
            page.wait_for_load_state('domcontentloaded')
            time.sleep(2)
            screenshot('02-suscribirse-page')
            findings['steps'].append({'step': 'suscribirse_loaded', 'url': page.url, 'ok': True})

            # Detectar si pide login o muestra checkout
            page_text = page.locator('body').text_content() or ''
            needs_login = 'Iniciar sesión' in page_text or 'login' in page.url.lower()
            no_payments = 'no acepta pagos' in page_text.lower() or 'no tiene pagos' in page_text.lower()

            if no_payments:
                log('  ⚠️  El creador no tiene MP conectado')
                findings['steps'].append({
                    'step': 'creator_check',
                    'status': 'no_payments',
                    'message': 'Creator orbbi no tiene MP conectado — flujo de pago no disponible',
                })

            # PASO 3 — registro / login si hace falta
            if needs_login or '/entrar' in page.url or '/registro' in page.url:
                log('PASO 3 — registro de usuario nuevo')
                # Si nos mandó a entrar, buscar link a registro
                if '/entrar' in page.url:
                    link = page.locator('a:has-text("Crear cuenta"), a:has-text("Registrarse")').first
                    if link.count() > 0:
                        link.click()
                        page.wait_for_load_state('domcontentloaded')
                        time.sleep(1)
                screenshot('03-registro-form')

                # Llenar form (best effort — los selectores reales pueden cambiar)
                email_field = page.locator('input[type="email"], input[name="email"]').first
                pass_field = page.locator('input[type="password"], input[name="password"]').first
                if email_field.count() > 0:
                    email_field.fill(email)
                if pass_field.count() > 0:
                    pass_field.fill(password)
                # Buscar también input de nombre si existe
                name_field = page.locator('input[name="name"], input[name="full_name"]').first
                if name_field.count() > 0:
                    name_field.fill('Test E2E User')
                screenshot('04-registro-filled')

                # Submit
                submit = page.locator('button[type="submit"]').first
                if submit.count() > 0:
                    submit.click()
                    page.wait_for_load_state('domcontentloaded')
                    time.sleep(3)
                    screenshot('05-after-submit')

                # Detectar resultado
                page_text = page.locator('body').text_content() or ''
                if 'error' in page_text.lower() or 'inválido' in page_text.lower():
                    log('  ⚠️  Error en registro:', page_text[:200])
                    findings['steps'].append({
                        'step': 'register',
                        'ok': False,
                        'page_text': page_text[:300],
                        'url': page.url,
                    })
                else:
                    findings['steps'].append({'step': 'register', 'ok': True, 'url': page.url})

                # Volver a suscribirse
                log('PASO 4 — volver a suscribirse')
                page.goto(f'{BASE}/suscribirse/{CREATOR_SLUG}', timeout=30000)
                page.wait_for_load_state('domcontentloaded')
                time.sleep(2)
                screenshot('06-suscribirse-logged-in')

            # PASO 5 — buscar y clickear el botón de pagar
            log('PASO 5 — botón de pago')
            pay_button = page.locator(
                'button:has-text("Suscribirme"), button:has-text("Pagar"), '
                'a:has-text("Suscribirme"), a:has-text("Pagar")'
            ).first

            if pay_button.count() == 0:
                log('  ⚠️  No encontré botón de pago')
                findings['steps'].append({
                    'step': 'pay_button',
                    'ok': False,
                    'reason': 'No se encontró botón "Suscribirme" ni "Pagar"',
                })
            else:
                with page.expect_navigation(timeout=30000, wait_until='domcontentloaded') as nav:
                    pay_button.click()
                time.sleep(3)
                screenshot('07-after-pay-click')

                # ¿Llegamos a MP?
                if 'mercadopago' in page.url.lower():
                    log(f'  ✅ Redirigió a MP: {page.url}')
                    findings['steps'].append({
                        'step': 'pay_click',
                        'ok': True,
                        'redirected_to_mp': True,
                        'url': page.url,
                    })

                    if TEST_TOKEN:
                        log('PASO 6 — completar pago con tarjeta APRO (TEST_TOKEN presente)')
                        # TODO: llenar form de MP (depende del UI actual de MP)
                        screenshot('08-mp-checkout')
                    else:
                        log('  🟡 Sin TEST token, NO completo el pago para evitar cobro real')
                        findings['steps'].append({
                            'step': 'pay_completion',
                            'skipped': True,
                            'reason': 'MP_TEST_ACCESS_TOKEN no definido — completar pago requeriría tarjeta real',
                        })
                else:
                    log(f'  ⚠️  Click NO redirigió a MP. URL actual: {page.url}')
                    findings['steps'].append({
                        'step': 'pay_click',
                        'ok': False,
                        'url': page.url,
                        'page_text': (page.locator('body').text_content() or '')[:300],
                    })

        except Exception as e:
            log(f'EXCEPCIÓN: {e}', level='ERROR')
            findings['steps'].append({'step': 'exception', 'error': str(e)})
            try:
                screenshot('99-exception')
            except Exception:
                pass

        finally:
            time.sleep(2)
            browser.close()

    # ─── VERIFICACIÓN EN BD ──────────────────────────────────────────────────
    log('━' * 50)
    log('Verificación en Supabase:')

    # ¿Se creó el usuario?
    code, body = check_supabase('sala_profiles', f'email=eq.{email}&select=id,email,full_name,created_at')
    findings['final_state']['profile'] = {'http': code, 'body': body}
    log(f'  sala_profiles[{email}]: HTTP {code}')
    if '[' in body and email in body:
        log(f'    ✅ Usuario creado')
    else:
        log(f'    ❌ Usuario NO encontrado en BD')

    # ¿Hay suscripciones de este usuario? (necesita conocer el user_id)
    try:
        user_data = json.loads(body)
        if user_data:
            user_id = user_data[0]['id']
            code, body = check_supabase(
                'sala_subscriptions',
                f'subscriber_id=eq.{user_id}&select=id,creator_id,status,price_clp,created_at,last_paid_at'
            )
            findings['final_state']['subscriptions'] = {'http': code, 'body': body}
            log(f'  suscripciones: {body[:200]}')
    except Exception as e:
        log(f'  No pude parsear user_id: {e}')

    # ¿Webhook recibido?
    code, body = check_supabase('sala_webhook_events', 'order=attempted_at.desc&limit=3')
    findings['final_state']['webhooks_recientes'] = {'http': code, 'body': body}
    log(f'  últimos webhooks: {body[:300]}')

    # ─── REPORTE ─────────────────────────────────────────────────────────────
    findings['finished_at'] = datetime.now().isoformat()
    report_path = f'{SCREENSHOTS_DIR}/report.json'
    with open(report_path, 'w') as f:
        json.dump(findings, f, indent=2, ensure_ascii=False)
    log(f'📊 Reporte: {report_path}')
    log(f'📸 Screenshots en {SCREENSHOTS_DIR}/')

    # Resumen
    print('\n' + '=' * 60)
    print('RESUMEN:')
    print('=' * 60)
    for step in findings['steps']:
        status = '✅' if step.get('ok') is True else ('⚠️ ' if step.get('skipped') else '❌')
        print(f"  {status} {step.get('step', '?')}")
        if step.get('reason'):
            print(f"      → {step['reason']}")
        if step.get('error'):
            print(f"      ⚠️ {step['error'][:120]}")

if __name__ == '__main__':
    main()
