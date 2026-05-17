#!/usr/bin/env python3
"""
LinkedIn Engagement Pod — Nebbuler
Estrategia de reciprocidad: likea posts de creadores LATAM target.
Usa búsqueda de contenido para encontrar posts recientes y reaccionar.
Límite: 20 likes/día.

ESTADO: La cuenta LinkedIn es nueva. react_to_post usa /socialActions/{urn}/likes.
Una vez la cuenta tenga >50 conexiones, también comentará.
"""

import browser_cookie3, requests, warnings, random, time, json, os
from datetime import date
warnings.filterwarnings('ignore')
from linkedin_api import Linkedin

MAX_LIKES = 20
LOG_FILE = os.path.join(os.path.dirname(__file__), 'engagement-log.json')

# Perfiles de creadores LATAM con buen contenido para hacer engagement
TARGET_PROFILES = [
    # Colombia
    'juan-pablo-zuluaga-finanzas',
    'dave-rincon-coach',
    # Mexico
    'marcus-dantus',
    'majo-hagerman',
    # Argentina
    'andres-colombo',
    # Finanzas/emprendimiento LATAM general
    'andrés-cardenal-cfa',
]

# Keywords para buscar posts recientes
SEARCH_QUERIES = [
    'monetizar conocimiento LATAM 2025',
    'creador contenido Colombia',
    'coach emprendimiento México',
    'finanzas personales Argentina',
    'emprendimiento digital América Latina',
    'membresías exclusivas creadores',
]

THOUGHTFUL_COMMENTS = [
    "Excelente perspectiva. El mercado de conocimiento en LATAM está en un momento único.",
    "Esto resuena mucho. La monetización directa cambia completamente la ecuación para creadores latinoamericanos.",
    "Muy valioso lo que compartís. Hace falta más voces así en el ecosistema.",
    "Gran punto. En LATAM el contexto es muy distinto al del norte — este tipo de análisis es clave.",
    "Completamente de acuerdo. Gracias por seguir generando este tipo de contenido.",
]


def get_api():
    jar = browser_cookie3.chrome(domain_name='.linkedin.com')
    cookie_jar = requests.cookies.RequestsCookieJar()
    for c in jar:
        cookie_jar.set(c.name, c.value, domain=c.domain, path=c.path or '/')
    return Linkedin('', '', cookies=cookie_jar), cookie_jar


def search_posts(api, query, limit=10):
    """Busca posts por keyword. Retorna lista de URNs."""
    people = api.search_people(query, limit=limit)
    post_urns = []
    for person in people:
        urn_id = person.get('urn_id', '')
        if urn_id:
            try:
                # Intentar obtener posts del perfil
                res = api._fetch(f'/identity/profiles/{urn_id}/posts', params={'count': 3})
                if res.status_code == 200:
                    data = res.json()
                    for elem in data.get('elements', []):
                        post_urn = elem.get('urn', elem.get('entityUrn', ''))
                        if post_urn:
                            post_urns.append({'urn': post_urn, 'author': person.get('name', '')})
            except Exception:
                pass
    return post_urns


def react_to_post(api, urn):
    """Likea un post. Retorna True si tuvo éxito."""
    try:
        result = api.react_to_post(urn, reaction_type='LIKE')
        return result is not False
    except Exception as e:
        # Intentar vía HTTP directo con socialActions
        try:
            session = api.client.session
            encoded_urn = requests.utils.quote(urn, safe='')
            res = session.post(
                f'https://www.linkedin.com/voyager/api/socialActions/{encoded_urn}/likes',
                json={'actor': '', 'reactionType': 'LIKE'},
                headers={'Content-Type': 'application/json'},
                timeout=10,
            )
            return res.status_code in (200, 201)
        except Exception:
            return False


def load_log():
    if os.path.exists(LOG_FILE):
        try:
            return json.load(open(LOG_FILE))
        except Exception:
            pass
    return {'interactions': [], 'date': str(date.today())}


def save_log(log):
    with open(LOG_FILE, 'w') as f:
        json.dump(log, f, indent=2, ensure_ascii=False)


def main():
    log = load_log()
    today = str(date.today())
    if log.get('date') != today:
        log = {'interactions': [], 'date': today}

    done_today = len([x for x in log['interactions'] if x.get('date') == today])
    if done_today >= MAX_LIKES:
        print(f"Límite diario alcanzado ({done_today}/{MAX_LIKES}). Volvé mañana.")
        return

    print(f"Engagement pod iniciado. Likes hoy: {done_today}/{MAX_LIKES}")

    api, cookie_jar = get_api()
    csrf = cookie_jar.get('JSESSIONID', '""').strip('"')
    if not csrf:
        print("ERROR: No se encontró JSESSIONID — abrí LinkedIn en Chrome primero.")
        return

    interactions = done_today
    seen_urns = {x.get('urn') for x in log['interactions']}

    # Buscar posts recientes de creadores target
    for query in SEARCH_QUERIES:
        if interactions >= MAX_LIKES:
            break

        print(f"\nBuscando creadores: \"{query}\"")
        people = api.search_people(query, limit=5)
        print(f"  Personas encontradas: {len(people)}")

        for person in people:
            if interactions >= MAX_LIKES:
                break

            urn_id = person.get('urn_id', '')
            name = person.get('name', 'desconocido')

            if not urn_id:
                continue

            # Intentar obtener posts del perfil
            try:
                posts = api.get_profile_updates(urn_id=urn_id, max_results=3)
                if not posts:
                    continue

                for post in posts[:2]:
                    if interactions >= MAX_LIKES:
                        break
                    urn = post.get('urn', post.get('entityUrn', ''))
                    if not urn or urn in seen_urns:
                        continue

                    ok = react_to_post(api, urn)
                    if ok:
                        print(f"  ✅ like → {name}")
                        interactions += 1
                        log['interactions'].append({
                            'urn': urn, 'action': 'like',
                            'actor': name, 'date': today,
                        })
                        seen_urns.add(urn)
                        save_log(log)
                        time.sleep(15 + random.randint(0, 20))
                    else:
                        time.sleep(3)
            except Exception:
                time.sleep(2)

        time.sleep(5)

    realizadas = interactions - done_today
    print(f"\n{'='*50}")
    print(f"RESUMEN: {realizadas} likes en esta sesión")
    print(f"Total hoy: {interactions}/{MAX_LIKES}")

    if realizadas == 0:
        print("\nNOTA: Los endpoints de posts/reacciones de LinkedIn están")
        print("restringidos en cuentas nuevas. Volvé a intentar en 2-4 semanas")
        print("cuando la cuenta tenga más conexiones y actividad orgánica.")


if __name__ == '__main__':
    main()
