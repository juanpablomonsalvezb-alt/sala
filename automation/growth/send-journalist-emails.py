#!/usr/bin/env python3
"""
Envío masivo de outreach a journalists LATAM via Resend.

Pasos:
  1. Parsea automation/growth/journalists-latam.md
  2. Infiere email con 1 patrón por journalist (nombre.apellido@dominio)
  3. Valida MX del dominio (rápido, sin enviar)
  4. Genera email personalizado (Tier 1 / 2 / 3)
  5. Envía via Resend en lote conservador de 10
  6. Espera 60s
  7. Consulta bounces, reporta

SAFEGUARDS:
  - Frena si bounce > 30% en primer lote
  - From: prensa@nebbuler.com (separado del welcome email)
  - Reply-To: juanpablo.monsalvezb@gmail.com (donde sí podés ver respuestas)
"""

import os, re, json, time, smtplib, socket, sys, warnings
from datetime import datetime
from pathlib import Path
warnings.filterwarnings('ignore')

try:
    import requests
    import dns.resolver
except ImportError:
    print('Instalando deps...')
    os.system('pip3 install requests dnspython 2>&1 | tail -3')
    import requests
    import dns.resolver

OUT = Path('/tmp/nebbuler-outreach')
OUT.mkdir(exist_ok=True)

# ── Env ──────────────────────────────────────────────────────────────────────
ENV = {}
for line in open('/Users/juanpablomonsalvez/Downloads/sala/.env.local'):
    if '=' in line and not line.strip().startswith('#'):
        k, _, v = line.strip().partition('=')
        ENV[k] = v.strip('"').strip("'")
RESEND_KEY = ENV['RESEND_API_KEY']

FROM_EMAIL = 'Juan Pablo Monsalvez <prensa@nebbuler.com>'
REPLY_TO = 'juanpablo.monsalvezb@gmail.com'

# ── Mapeo medio → dominio ────────────────────────────────────────────────────
MEDIO_DOMAINS = {
    'rest of world': 'restofworld.org',
    'techcrunch': 'techcrunch.com',
    'fortune': 'fortune.com',
    'bloomberg línea': 'bloomberglinea.com',
    'bloomberg linea': 'bloomberglinea.com',
    'el cronista': 'cronista.com',
    'cronista': 'cronista.com',
    'iprofesional': 'iprofesional.com',
    'forbes argentina': 'forbesargentina.com',
    'forbes colombia': 'forbes.co',
    'forbes méxico': 'forbes.com.mx',
    'forbes mexico': 'forbes.com.mx',
    'forbes': 'forbes.com',
    'infobae': 'infobae.com',
    'clarín': 'clarin.com',
    'clarin': 'clarin.com',
    'xataka': 'xataka.com',
    'la tercera': 'latercera.com',
    'pulso': 'latercera.com',
    'diario financiero': 'df.cl',
    'df': 'df.cl',
    'la república': 'larepublica.co',
    'la republica': 'larepublica.co',
    'el espectador': 'elespectador.com',
    'enter.co': 'enter.co',
    'semana': 'semana.com',
    'tecnívoro': 'tecnivoro.co',
    'excélsior': 'excelsior.com.mx',
    'excelsior': 'excelsior.com.mx',
    'whitepaper': 'whitepaper.mx',
    'expansión': 'expansion.mx',
    'expansion': 'expansion.mx',
    'tecscience': 'tecscience.com',
    'el financiero': 'elfinanciero.com.mx',
    'el universal': 'eluniversal.com.mx',
    'milenio': 'milenio.com',
    'el economista': 'eleconomista.com.mx',
    'entrepreneur': 'entrepreneur.com',
    'contxto': 'contxto.com',
    'latamlist': 'latamlist.com',
    'pulzo': 'pulzo.com',
    'caracol': 'caracol.com.co',
    'el tiempo': 'eltiempo.com',
    'rpp': 'rpp.pe',
    'gestión': 'gestion.pe',
    'gestion': 'gestion.pe',
    'el comercio': 'elcomercio.pe',
}

# ── Parsear lista ────────────────────────────────────────────────────────────
def slugify_name(name: str) -> str:
    """Convierte 'Daniel Fajardo' → 'daniel.fajardo'"""
    name = name.lower()
    # Remover títulos y caracteres especiales
    for prefix in ['lic.', 'mtro.', 'dr.', 'dra.', 'ing.']:
        name = name.replace(prefix, '')
    # Remover paréntesis y contenido
    name = re.sub(r'\([^)]*\)', '', name)
    # Normalizar
    repl = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n','ü':'u'}
    for k, v in repl.items():
        name = name.replace(k, v)
    parts = [p for p in re.split(r'[\s,]+', name.strip()) if p and len(p) > 1]
    # Tomar primer nombre + último apellido
    if len(parts) >= 2:
        return f'{parts[0]}.{parts[-1]}'
    return parts[0] if parts else ''


def infer_email(name: str, medio_raw: str):
    """Devuelve (email, dominio) o (None, None)"""
    if not name or not medio_raw:
        return None, None
    medio_lower = medio_raw.lower().strip()

    # Match domain
    domain = None
    for k, v in MEDIO_DOMAINS.items():
        if k in medio_lower:
            domain = v
            break
    if not domain:
        return None, None

    slug = slugify_name(name)
    if not slug:
        return None, None
    return f'{slug}@{domain}', domain


# ── Validación MX ────────────────────────────────────────────────────────────
def has_mx(domain: str) -> bool:
    try:
        ans = dns.resolver.resolve(domain, 'MX', lifetime=4)
        return len(list(ans)) > 0
    except Exception:
        return False


# ── Generación de email personalizado ────────────────────────────────────────
TIER1_TEMPLATE = """Hola {first_name},

Soy Juan Pablo Monsalvez, fundador de Nebbuler — la primera plataforma de membresías diseñada específicamente para creadores hispanohablantes de América Latina.

Te escribo porque sigo tu cobertura sobre {beat_short}. Tenemos una historia que cabe en eso: el modelo "newsletter de pago" que en EE.UU. construyó Substack está virtualmente vacío en español, no por falta de demanda sino por fricción de pago.

Algunos datos que tenemos:
- El lector LATAM pagando en USD vía Substack/Patreon paga 8-15% extra por FX + recargos internacionales.
- La conversión gratis→paga en español es 2-3× menor que en inglés por esa fricción.
- Mercado LATAM creator economy: US$38B (2022) → US$112B (2030), 19,7% CAGR.

Nebbuler resuelve esto con tarifa fija (US$30/mes), 0% comisión variable, y cobros directos en COP/MXN/ARS/PEN/CLP.

Si te interesa explorarlo como ángulo, tengo data abierta (publicada bajo CC BY 4.0 en https://nebbuler.com/informe-2026), acceso al producto y conversaciones con los primeros 50 creadores.

Sin agenda. Solo creo que es una historia que merece estar contada.

Saludos,
Juan Pablo
Fundador, Nebbuler
https://nebbuler.com
"""

TIER2_TEMPLATE = """Hola {first_name},

Soy Juan Pablo Monsalvez, fundador de Nebbuler — plataforma de membresías para creadores hispanohablantes de LATAM. Cobramos en pesos colombianos, mexicanos, argentinos, soles peruanos y otras monedas locales, en lugar de forzar al lector a pagar en dólares como hacen Substack o Patreon.

Te escribo porque vi que cubres {beat_short} en {medio}. Este tema podría tocar a tus lectores: hay un mercado emergente de profesionales (economistas, abogados, coaches) que ya no quieren depender de algoritmos para llegar a su audiencia y están migrando a modelos de membresía pagada. En EE.UU. Substack lo capturó; en LATAM nadie todavía.

Datos rápidos:
- Mercado LATAM creator economy: US$38B (2022) → US$112B (2030).
- 73% de las cancelaciones en plataformas USD citan fricción de pago como motivo principal.
- En Nebbuler el break-even llega con 4 suscriptores pagos vs 20+ en Substack.

¿Te mando más data o un walkthrough del producto? Sin compromiso — solo creo que merece ser cubierto por alguien que entienda el contexto LATAM.

Acceso al producto: https://nebbuler.com
Informe abierto 2026: https://nebbuler.com/informe-2026

Saludos,
Juan Pablo Monsalvez
Fundador, Nebbuler
"""


def make_email(person: dict) -> dict:
    """Devuelve {to, subject, html, text}"""
    first_name = person['name'].split()[0]
    is_tier1 = person.get('tier') == 1
    medio = person.get('medio', '')
    beat = person.get('beat', 'startups y emprendimiento')
    beat_short = beat.split(',')[0].strip() if beat else 'startups en LATAM'

    template = TIER1_TEMPLATE if is_tier1 else TIER2_TEMPLATE
    body = template.format(first_name=first_name, beat_short=beat_short, medio=medio)

    if is_tier1:
        subject = f'{first_name}, hay una historia que cabe en tu beat sobre creator economy LATAM'
    else:
        subject = f'{first_name}, ¿cubren la economía del creador en LATAM?'

    html = body.replace('\n\n', '</p><p>').replace('\n', '<br>')
    html = f'<p style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6;">{html}</p>'

    return {'to': person['email'], 'subject': subject, 'html': html, 'text': body}


# ── Envío via Resend ─────────────────────────────────────────────────────────
def send_email(email: dict, person: dict) -> tuple:
    """Devuelve (ok, resend_id_or_error)"""
    try:
        res = requests.post(
            'https://api.resend.com/emails',
            headers={'Authorization': f'Bearer {RESEND_KEY}', 'Content-Type': 'application/json'},
            json={
                'from': FROM_EMAIL,
                'to': [email['to']],
                'reply_to': REPLY_TO,
                'subject': email['subject'],
                'html': email['html'],
                'text': email['text'],
                'tags': [
                    {'name': 'campaign', 'value': 'launch-2026-05'},
                    {'name': 'tier', 'value': f"tier-{person.get('tier', 'unknown')}"},
                ],
            },
            timeout=15,
        )
        if res.status_code in (200, 201):
            data = res.json()
            return True, data.get('id', 'unknown')
        return False, f'HTTP {res.status_code}: {res.text[:200]}'
    except Exception as e:
        return False, str(e)[:200]


def check_bounces(email_ids: list) -> dict:
    """Consulta estado de cada email. Devuelve {email_id: status}"""
    results = {}
    for eid in email_ids:
        try:
            res = requests.get(
                f'https://api.resend.com/emails/{eid}',
                headers={'Authorization': f'Bearer {RESEND_KEY}'},
                timeout=10,
            )
            if res.status_code == 200:
                results[eid] = res.json().get('last_event', 'unknown')
            else:
                results[eid] = f'http_{res.status_code}'
        except Exception as e:
            results[eid] = f'exc_{str(e)[:50]}'
    return results


# ── Parsear journalists del markdown ─────────────────────────────────────────
def parse_journalists():
    md = open('/Users/juanpablomonsalvez/Downloads/sala/automation/growth/journalists-latam.md').read()
    rows = []
    for line in md.split('\n'):
        if not line.startswith('|'):
            continue
        cols = [c.strip() for c in line.split('|')[1:-1]]
        if len(cols) < 6:
            continue
        if cols[0] in ('#', '---', ':-:', '-') or not cols[0].strip().isdigit():
            continue
        idx, name, medio, cargo, contact, beat = cols[:6]
        angulo = cols[6] if len(cols) > 6 else ''
        rows.append({
            'idx': int(idx),
            'name': name.strip(),
            'medio': medio.strip(),
            'cargo': cargo.strip(),
            'contact_raw': contact.strip(),
            'beat': beat.strip(),
            'angulo': angulo.strip(),
        })
    return rows


# ── Pipeline ─────────────────────────────────────────────────────────────────
def main():
    print('━' * 60)
    print('Outreach a journalists LATAM — Nebbuler')
    print('━' * 60)
    print(f'From: {FROM_EMAIL}')
    print(f'Reply-To: {REPLY_TO}')
    print()

    people = parse_journalists()
    print(f'Total en lista: {len(people)}')

    # Inferir emails + validar MX
    print('\n[1/4] Inferiendo emails + validando MX...')
    valid = []
    skipped = []
    seen_emails = set()
    for p in people:
        email, domain = infer_email(p['name'], p['medio'])
        if not email:
            p['skip_reason'] = f'no domain match para "{p["medio"]}"'
            skipped.append(p)
            continue
        if email in seen_emails:
            p['skip_reason'] = 'email duplicado'
            skipped.append(p)
            continue
        if not has_mx(domain):
            p['skip_reason'] = f'MX inválido para {domain}'
            skipped.append(p)
            continue
        # Tier asignado por nombre conocido
        p['email'] = email
        p['domain'] = domain
        p['tier'] = 1 if p['name'] in ('Daniela Dib', 'Daniel Fajardo', 'René Lankenau') else 2
        valid.append(p)
        seen_emails.add(email)

    print(f'  ✅ Validados: {len(valid)}')
    print(f'  ⚠️  Skipped: {len(skipped)}')
    if skipped:
        print('\n  Razones skip:')
        for s in skipped[:5]:
            print(f'    - {s["name"]} ({s["medio"]}): {s["skip_reason"]}')
        if len(skipped) > 5:
            print(f'    ... y {len(skipped) - 5} más')

    # Generar emails
    print(f'\n[2/4] Generando {len(valid)} emails personalizados...')

    # ── PRIMER LOTE — 10 emails de prueba ─────────────────────────────────
    BATCH_SIZE = 10
    first_batch = valid[:BATCH_SIZE]
    print(f'\n[3/4] Enviando lote 1 ({len(first_batch)} emails)...')

    sent_log = []
    for i, p in enumerate(first_batch):
        email = make_email(p)
        ok, resp = send_email(email, p)
        status_icon = '✅' if ok else '❌'
        print(f'  {status_icon} [{i+1}/{len(first_batch)}] {p["name"]} <{p["email"]}> → {resp[:80]}')
        sent_log.append({
            'name': p['name'],
            'email': p['email'],
            'tier': p['tier'],
            'sent': ok,
            'resend_id': resp if ok else None,
            'error': resp if not ok else None,
            'timestamp': datetime.now().isoformat(),
        })
        time.sleep(2)  # rate limit: 2 req/s

    # Esperar y consultar bounces
    print('\nEsperando 90s para que Resend procese bounces...')
    time.sleep(90)

    print('\n[4/4] Consultando estados de delivery...')
    email_ids = [s['resend_id'] for s in sent_log if s['resend_id']]
    statuses = check_bounces(email_ids)
    for s in sent_log:
        if s['resend_id']:
            s['delivery_status'] = statuses.get(s['resend_id'], 'unknown')

    # Stats
    sent_count = sum(1 for s in sent_log if s['sent'])
    bounced = sum(1 for s in sent_log if s.get('delivery_status') in ('bounced', 'rejected'))
    delivered = sum(1 for s in sent_log if s.get('delivery_status') == 'delivered')
    bounce_rate = (bounced / sent_count) * 100 if sent_count else 0

    print(f'\n━' * 30)
    print(f'LOTE 1 RESULTADOS:')
    print(f'  Enviados (API OK): {sent_count}/{len(first_batch)}')
    print(f'  Delivered: {delivered}')
    print(f'  Bounced/Rejected: {bounced}')
    print(f'  Bounce rate: {bounce_rate:.1f}%')

    # Decisión: continuar o frenar
    proceed = bounce_rate < 30

    if proceed and len(valid) > BATCH_SIZE:
        rest = valid[BATCH_SIZE:]
        print(f'\n✅ Bounce rate aceptable. Procediendo con los {len(rest)} restantes...')
        for i, p in enumerate(rest):
            email = make_email(p)
            ok, resp = send_email(email, p)
            status_icon = '✅' if ok else '❌'
            print(f'  {status_icon} [{i+1}/{len(rest)}] {p["name"]} → {resp[:60]}')
            sent_log.append({
                'name': p['name'], 'email': p['email'], 'tier': p['tier'],
                'sent': ok, 'resend_id': resp if ok else None,
                'error': resp if not ok else None, 'timestamp': datetime.now().isoformat(),
            })
            time.sleep(2)
    elif not proceed:
        print(f'\n🛑 Bounce rate {bounce_rate:.1f}% > 30%. FRENADO para proteger reputación nebbuler.com.')
        print(f'   No se enviaron los {len(valid) - BATCH_SIZE} restantes.')

    # Reporte
    report = {
        'campaign': 'launch-2026-05',
        'started_at': datetime.now().isoformat(),
        'total_in_list': len(people),
        'valid_to_send': len(valid),
        'skipped': len(skipped),
        'batch_1_sent': len(first_batch),
        'batch_1_bounce_rate_pct': bounce_rate,
        'continued_to_full': proceed,
        'total_sent': sum(1 for s in sent_log if s['sent']),
        'sent_log': sent_log,
        'skipped_detail': [{'name': s['name'], 'medio': s['medio'], 'reason': s['skip_reason']} for s in skipped],
    }
    report_path = OUT / 'outreach-report.json'
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f'\n📊 Reporte: {report_path}')
    print(f'\nPróximo paso: revisar respuestas en {REPLY_TO} en los próximos 3-7 días.')


if __name__ == '__main__':
    main()
