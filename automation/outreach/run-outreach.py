#!/usr/bin/env python3
"""
LinkedIn Outreach — Nebbuler
- Usa linkedin_api para búsqueda (Voyager /search/blended — funciona con cookies)
- Extrae publicIdentifier del raw response (sin llamar a get_profile que falla)
- Usa HTTP directo con cookies Chrome para enviar solicitudes (sin la bug de KeyError)
Límite: 20 solicitudes/día.
"""

import browser_cookie3, requests, json, os, time, warnings, base64
from datetime import date
warnings.filterwarnings('ignore')
from linkedin_api import Linkedin

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


def get_session_and_api():
    """Retorna (requests.Session, csrf_token, Linkedin API)."""
    jar = browser_cookie3.chrome(domain_name='.linkedin.com')
    cookie_jar = requests.cookies.RequestsCookieJar()
    for c in jar:
        cookie_jar.set(c.name, c.value, domain=c.domain, path=c.path or '/')

    session = requests.Session()
    session.cookies = cookie_jar
    csrf = cookie_jar.get('JSESSIONID', '""').strip('"')

    session.headers.update({
        'csrf-token': csrf,
        'X-RestLi-Protocol-Version': '2.0.0',
        'X-Li-Lang': 'en_US',
        'User-Agent': (
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/124.0.0.0 Safari/537.36'
        ),
        'Accept': 'application/vnd.linkedin.normalized+json+2.1',
        'Accept-Language': 'es-419,es;q=0.9',
        'Referer': 'https://www.linkedin.com/',
        'Origin': 'https://www.linkedin.com',
    })

    api = Linkedin('', '', cookies=cookie_jar)
    return session, csrf, api


def search_people_with_public_id(api, query, limit=10):
    """
    Usa la API interna de linkedin_api para buscar, pero extrae publicIdentifier
    del raw response en lugar de hacer get_profile por separado.
    """
    params = {
        'filters': 'List(resultType->PEOPLE)',
        'keywords': query,
        'queryContext': 'List(spellCorrectionEnabled->true)',
        'origin': 'GLOBAL_SEARCH_HEADER',
        'start': 0,
        'count': limit,
        'q': 'people',
    }
    try:
        res = api._fetch('/search/blended', params=params)
        if res.status_code != 200:
            return []
        data = res.json()
    except Exception as e:
        print(f"  [search error] {e}")
        return []

    results = []
    for element in data.get('elements', []):
        for item in element.get('elements', []):
            # Extraer el miniProfile del hit
            hit = item.get('hitInfo', {})
            search_profile = (
                hit.get('com.linkedin.voyager.search.SearchProfile', {})
                or hit.get('com.linkedin.voyager.search.SearchHitV2', {})
            )
            mini = search_profile.get('miniProfile', {})
            if not mini:
                continue

            public_id = mini.get('publicIdentifier', '')
            first_name = mini.get('firstName', '')
            last_name = mini.get('lastName', '')
            name = f"{first_name} {last_name}".strip()
            occupation = mini.get('occupation', '')[:60]
            urn = mini.get('entityUrn', '')
            urn_id = urn.split(':')[-1] if urn else ''

            if public_id and name:
                results.append({
                    'urn_id': urn_id,
                    'public_id': public_id,
                    'name': name,
                    'jobtitle': occupation,
                    'location': '',
                })

    return results


def send_connection(session, csrf, public_id, message=''):
    """Envía solicitud de conexión con mensaje vía HTTP directo."""
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
        return res.status_code in (200, 201), res.status_code
    except Exception as e:
        return False, str(e)


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

    session, csrf, api = get_session_and_api()
    if not csrf:
        print("ERROR: No se encontró JSESSIONID — abrí LinkedIn en Chrome primero.")
        return

    sent = sent_today
    results_log = []
    seen_ids = {r.get('urn_id') for r in log['sent']} | {r.get('public_id') for r in log['sent']}

    day_offset = hash(today) % len(SEARCHES)

    for i in range(len(SEARCHES)):
        if sent >= MAX_PER_DAY:
            break

        idx = (day_offset + i) % len(SEARCHES)
        s = SEARCHES[idx]

        print(f"\n[{sent}/{MAX_PER_DAY}] Buscando: \"{s['query']}\"")
        people = search_people_with_public_id(api, s['query'], limit=10)
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
            ok, status = send_connection(session, csrf, public_id, message=msg)

            if ok:
                print(f"  ✅ {name} | {person['jobtitle']} ({public_id})")
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
                print(f"  [fail] {name} — status {status}")
                time.sleep(5)

        time.sleep(8)

    enviados = sent - sent_today
    print(f"\n{'='*50}")
    print(f"RESUMEN: {enviados} solicitudes enviadas en esta sesión")
    print(f"Total hoy: {sent}/{MAX_PER_DAY}")
    if results_log:
        print("\nPerfiles contactados:")
        for r in results_log:
            print(f"  - {r['name']} ({r['location'] or r['public_id']}) — {r['msg_type']}")


if __name__ == '__main__':
    main()
