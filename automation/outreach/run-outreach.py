#!/usr/bin/env python3
"""
LinkedIn Outreach — Nebbuler
Usa cookies de Chrome directamente, sin linkedin-api.
Extrae publicIdentifier del navigationUrl en resultados de búsqueda.
Límite: 20 solicitudes/día para evitar restricciones de LinkedIn.
"""

import browser_cookie3, requests, json, os, time, warnings, base64
from datetime import date
warnings.filterwarnings('ignore')

BASE = 'https://www.linkedin.com'
MAX_PER_DAY = 20
LOG_FILE = os.path.join(os.path.dirname(__file__), 'outreach-log.json')

SEARCHES = [
    # COLOMBIA
    {'query': 'finanzas personales Colombia creador', 'msg': 'FINANZAS'},
    {'query': 'coach ejecutivo liderazgo Colombia', 'msg': 'COACH'},
    {'query': 'derecho laboral Colombia divulgador', 'msg': 'LEGAL'},
    {'query': 'DIAN tributario Colombia contenido', 'msg': 'LEGAL'},
    {'query': 'emprendimiento Colombia fundador LinkedIn', 'msg': 'EMPRENDIMIENTO'},
    # MEXICO
    {'query': 'finanzas personales Mexico educador', 'msg': 'FINANZAS'},
    {'query': 'SAT impuestos Mexico divulgador', 'msg': 'LEGAL'},
    {'query': 'coach carrera Mexico LinkedIn', 'msg': 'COACH'},
    {'query': 'startup emprendimiento Mexico fundador', 'msg': 'EMPRENDIMIENTO'},
    # ARGENTINA
    {'query': 'finanzas inversión Argentina economista', 'msg': 'FINANZAS'},
    {'query': 'coach Argentina LinkedIn creador', 'msg': 'COACH'},
    {'query': 'emprendimiento startup Argentina', 'msg': 'EMPRENDIMIENTO'},
    # PERU / URUGUAY
    {'query': 'finanzas personales Peru creador LinkedIn', 'msg': 'FINANZAS'},
    {'query': 'emprendimiento Uruguay LinkedIn', 'msg': 'EMPRENDIMIENTO'},
    # GENERAL LATAM
    {'query': 'monetización conocimiento LATAM creador', 'msg': 'EMPRENDIMIENTO'},
    {'query': 'membresía contenido exclusivo creador español', 'msg': 'EMPRENDIMIENTO'},
    {'query': 'psicólogo coach salud mental LATAM LinkedIn', 'msg': 'SALUD'},
]

MESSAGES = {
    'FINANZAS': (
        "Hola {nombre}, sigo tu contenido de finanzas. Fundé Nebbuler, "
        "plataforma de membresías para creadores LATAM. 0% comisión los primeros 6 meses, "
        "pagos en tu moneda. ¿Te muestro cómo se vería tu sala?"
    ),
    'COACH': (
        "Hola {nombre}, vi tu trabajo en liderazgo y desarrollo profesional. "
        "Fundé Nebbuler para que creadores como tú cobren membresías en su moneda, "
        "sin comisión 6 meses. ¿15 min para mostrarte?"
    ),
    'LEGAL': (
        "Hola {nombre}, tu divulgación legal/tributaria tiene exactamente la audiencia "
        "que paga por acceso exclusivo. Fundé Nebbuler: membresías en tu moneda, "
        "0% comisión 6 meses. ¿Conversamos?"
    ),
    'SALUD': (
        "Hola {nombre}, tu contenido de salud genera confianza real — ideal para una membresía. "
        "Fundé Nebbuler para creadores LATAM: pagos en tu moneda, sin comisión primeros 6 meses. "
        "¿Te interesa?"
    ),
    'EMPRENDIMIENTO': (
        "Hola {nombre}, tu contenido sobre emprendimiento encaja perfecto con Nebbuler: "
        "membresías pagas en tu moneda local, 0% comisión 6 meses. "
        "Fundé la plataforma para creadores LATAM como vos. ¿Charlamos?"
    ),
}


def get_session():
    jar = browser_cookie3.chrome(domain_name='.linkedin.com')
    s = requests.Session()
    for c in jar:
        s.cookies.set(c.name, c.value, domain=c.domain, path=c.path or '/')

    csrf = s.cookies.get('JSESSIONID', '""').strip('"')
    s.headers.update({
        'csrf-token': csrf,
        'X-RestLi-Protocol-Version': '2.0.0',
        'X-Li-Lang': 'en_US',
        'User-Agent': (
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/124.0.0.0 Safari/537.36'
        ),
        'Accept': 'application/vnd.linkedin.normalized+json+2.1',
        'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
        'Referer': 'https://www.linkedin.com/',
        'Origin': 'https://www.linkedin.com',
    })
    return s, csrf


def search_people(session, query, limit=10):
    """Busca perfiles y retorna list con public_id, name, jobtitle, location, urn."""
    url = f'{BASE}/voyager/api/search/dash/clusters'
    params = {
        'decorationId': 'com.linkedin.voyager.dash.deco.search.SearchClusterCollection-175',
        'count': limit,
        'filters': 'List(resultType->PEOPLE)',
        'keywords': query,
        'origin': 'SWITCH_SEARCH_VERTICAL',
        'q': 'all',
        'start': 0,
    }
    try:
        res = session.get(url, params=params, timeout=15)
        if res.status_code != 200:
            print(f"  [search error] status={res.status_code}")
            return []
        data = res.json()
    except Exception as e:
        print(f"  [search exception] {e}")
        return []

    results = []
    for cluster in data.get('elements', []):
        for item in cluster.get('items', []):
            entity = item.get('item', {}).get('entityResult', {})
            if not entity:
                continue

            urn = entity.get('entityUrn', '')
            name = entity.get('title', {}).get('text', '').strip()
            jobtitle = entity.get('primarySubtitle', {}).get('text', '').strip()[:60]
            location = entity.get('secondarySubtitle', {}).get('text', '').strip()

            # Extraer slug de /in/username del navigationUrl
            nav_url = entity.get('navigationUrl', '')
            public_id = ''
            if '/in/' in nav_url:
                public_id = nav_url.split('/in/')[1].split('/')[0].split('?')[0]

            # urn_id: última parte del URN (member ID)
            urn_id = urn.split(':')[-1] if urn else ''

            if name and public_id:
                results.append({
                    'urn_id': urn_id,
                    'public_id': public_id,
                    'name': name,
                    'jobtitle': jobtitle,
                    'location': location,
                })

    return results


def send_connection(session, csrf, public_id, message=''):
    """Envía solicitud de conexión con mensaje opcional."""
    tracking_id = base64.b64encode(os.urandom(16)).decode()

    payload = {
        'trackingId': tracking_id,
        'message': message,
        'invitations': [],
        'excludeInvitations': [],
        'invitee': {
            'com.linkedin.voyager.growth.invitation.InviteeProfile': {
                'profileId': public_id,
            }
        },
    }

    headers = {
        'Content-Type': 'application/json',
        'accept': 'application/vnd.linkedin.normalized+json+2.1',
        'csrf-token': csrf,
    }

    url = f'{BASE}/voyager/api/growth/normInvitations'
    try:
        res = session.post(url, json=payload, headers=headers, timeout=15)
        return res.status_code in (200, 201)
    except Exception as e:
        print(f"    [conn error] {e}")
        return False


def load_log():
    if os.path.exists(LOG_FILE):
        try:
            return json.load(open(LOG_FILE))
        except Exception:
            pass
    return {'sent': [], 'date': str(date.today())}


def save_log(log):
    with open(LOG_FILE, 'w') as f:
        json.dump(log, f, indent=2, ensure_ascii=False)


def main():
    log = load_log()
    today = str(date.today())
    if log.get('date') != today:
        log = {'sent': [], 'date': today}

    sent_today = len([s for s in log['sent'] if s.get('date') == today])
    if sent_today >= MAX_PER_DAY:
        print(f"Límite diario alcanzado ({sent_today}/{MAX_PER_DAY}). Volvé mañana.")
        return

    print(f"Iniciando outreach. Enviados hoy: {sent_today}/{MAX_PER_DAY}")

    session, csrf = get_session()
    if not csrf:
        print("ERROR: No se encontró JSESSIONID — abrí LinkedIn en Chrome primero.")
        return

    sent = sent_today
    results_log = []
    seen_ids = {r.get('urn_id') for r in log['sent']}

    day_offset = hash(today) % len(SEARCHES)

    for i in range(len(SEARCHES)):
        if sent >= MAX_PER_DAY:
            break

        idx = (day_offset + i) % len(SEARCHES)
        s = SEARCHES[idx]

        print(f"\n[{sent}/{MAX_PER_DAY}] Buscando: \"{s['query']}\"")
        people = search_people(session, s['query'], limit=10)
        print(f"  Encontrados: {len(people)}")

        for person in people:
            if sent >= MAX_PER_DAY:
                break

            urn_id = person['urn_id']
            public_id = person['public_id']
            name = person['name']
            first_name = name.split()[0] if name else 'creador/a'

            if urn_id in seen_ids or public_id in seen_ids:
                print(f"  [skip] {name} — ya contactado")
                continue

            msg = MESSAGES[s['msg']].format(nombre=first_name)
            ok = send_connection(session, csrf, public_id, message=msg)

            if ok:
                print(f"  ✅ {name} | {person['jobtitle']} | {person['location']}")
                entry = {
                    'urn_id': urn_id,
                    'public_id': public_id,
                    'name': name,
                    'jobtitle': person['jobtitle'],
                    'location': person['location'],
                    'msg_type': s['msg'],
                    'query': s['query'],
                    'date': today,
                }
                log['sent'].append(entry)
                results_log.append(entry)
                seen_ids.add(urn_id)
                seen_ids.add(public_id)
                sent += 1
                save_log(log)
                # Pausa humana (20-40 seg)
                time.sleep(20 + (hash(urn_id) % 20))
            else:
                print(f"  [fail] {name} ({public_id})")
                time.sleep(5)

        time.sleep(8)

    enviados = sent - sent_today
    print(f"\n{'='*50}")
    print(f"RESUMEN: {enviados} solicitudes enviadas en esta sesión")
    print(f"Total hoy: {sent}/{MAX_PER_DAY}")
    if results_log:
        print("\nPerfiles contactados:")
        for r in results_log:
            print(f"  - {r['name']} ({r['location']}) — {r['msg_type']}")


if __name__ == '__main__':
    main()
