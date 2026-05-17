#!/usr/bin/env python3
"""
LinkedIn Engagement Pod — Nebbuler
Estrategia de reciprocidad: likea y comenta posts de creadores LATAM target
para que noten el perfil, vean Nebbuler, y retribuyan engagement.

El algoritmo de LinkedIn amplifica posts que reciben likes/comentarios
en los primeros 60-90 minutos. Este script también likea los posts propios
de otras cuentas conectadas para hacer el mismo efecto.

Límite: 30 interacciones/día (likes + comentarios).
"""

import browser_cookie3, requests, json, os, time, warnings, random
from datetime import date, datetime
warnings.filterwarnings('ignore')

BASE = 'https://www.linkedin.com'
MAX_INTERACTIONS = 30
LOG_FILE = os.path.join(os.path.dirname(__file__), 'engagement-log.json')

# Perfiles a seguir y con quienes hacer engagement (misma audiencia objetivo)
TARGET_QUERIES = [
    'monetizar conocimiento LATAM',
    'creador contenido Colombia',
    'emprendedor digital Mexico',
    'finanzas personales Argentina',
    'coach profesional latinoamerica',
    'experticia digital peru colombia',
]

# Comentarios genuinos para distintos tipos de contenido
COMMENTS_FINANZAS = [
    "Excelente punto. En LATAM el acceso a educación financiera de calidad es clave para cerrar la brecha.",
    "Totalmente de acuerdo. La cultura de inversión en nuestra región está creciendo fuerte.",
    "Esto es exactamente lo que necesita más gente entender. Gracias por compartirlo.",
    "Gran perspectiva. El contexto latinoamericano hace que estas decisiones sean muy distintas al norte.",
]

COMMENTS_EMPRENDIMIENTO = [
    "Clave para el ecosistema latinoamericano. Cada vez más creadores están encontrando la forma de vivir de lo que saben.",
    "Esto resuena mucho. El mercado de conocimiento en LATAM está en un momento de inflexión.",
    "Gran contenido. Hacer sostenible el trabajo del creador es el desafío central de la próxima década.",
    "Muy valioso lo que compartís. La monetización directa cambia completamente la ecuación.",
]

COMMENTS_COACH = [
    "Perspectiva muy necesaria. El liderazgo en contextos latinoamericanos tiene sus propias dinámicas.",
    "Excelente reflexión. El desarrollo profesional con foco en nuestra región es diferencial.",
    "Muy aplicable. Gracias por llevar este tipo de contenido al español.",
]

COMMENTS_GENERAL = [
    "Muy valioso, gracias por compartirlo.",
    "Esto aporta mucho al debate. Seguí así.",
    "Gran perspectiva. Necesitamos más voces como esta en LATAM.",
    "Exactamente lo que pensaba leer hoy. Gracias.",
]

ALL_COMMENTS = COMMENTS_FINANZAS + COMMENTS_EMPRENDIMIENTO + COMMENTS_COACH + COMMENTS_GENERAL


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
        'Accept-Language': 'es-419,es;q=0.9',
        'Referer': 'https://www.linkedin.com/feed/',
        'Origin': 'https://www.linkedin.com',
    })
    return s, csrf


def get_feed_posts(session, limit=20):
    """Obtiene posts recientes del feed."""
    url = f'{BASE}/voyager/api/feed/updatesV2'
    params = {
        'count': limit,
        'start': 0,
        'q': 'chronological',
        'updateType': 'CHRONOLOGICAL_PERSONAL_FEED',
        'decorationId': 'com.linkedin.voyager.dash.deco.feed.FullFeedUpdate-149',
    }
    try:
        res = session.get(url, params=params, timeout=15)
        if res.status_code != 200:
            return []
        data = res.json()
        posts = []
        for element in data.get('elements', []):
            urn = element.get('updateMetadata', {}).get('urn', '')
            entity_urn = element.get('socialContent', {}).get('shareUrn', urn)
            actor = element.get('actor', {})
            actor_name = actor.get('name', {}).get('text', '')
            actor_urn = actor.get('urn', '')

            if entity_urn and actor_urn:
                posts.append({
                    'urn': entity_urn,
                    'actor_name': actor_name,
                    'actor_urn': actor_urn,
                })
        return posts
    except Exception as e:
        print(f"  [feed error] {e}")
        return []


def search_recent_posts(session, query):
    """Busca posts recientes por keyword."""
    url = f'{BASE}/voyager/api/search/dash/clusters'
    params = {
        'decorationId': 'com.linkedin.voyager.dash.deco.search.SearchClusterCollection-175',
        'count': 10,
        'filters': 'List(resultType->CONTENT)',
        'keywords': query,
        'origin': 'SWITCH_SEARCH_VERTICAL',
        'q': 'all',
        'start': 0,
    }
    try:
        res = session.get(url, params=params, timeout=15)
        if res.status_code != 200:
            return []
        data = res.json()
        posts = []
        for cluster in data.get('elements', []):
            for item in cluster.get('items', []):
                entity = item.get('item', {}).get('entityResult', {})
                urn = entity.get('entityUrn', '')
                name = entity.get('title', {}).get('text', '')
                if urn and name:
                    posts.append({'urn': urn, 'actor_name': name, 'actor_urn': ''})
        return posts
    except Exception as e:
        print(f"  [search posts error] {e}")
        return []


def like_post(session, csrf, activity_urn):
    """Da like a un post usando el URN del activity."""
    # Normalizar URN al formato activity
    urn = activity_urn
    if 'activity:' not in urn and 'ugcPost:' not in urn:
        return False

    url = f'{BASE}/voyager/api/reactions'
    payload = {
        'reactionType': 'LIKE',
        'entityUrn': urn,
    }
    headers = {
        'Content-Type': 'application/json',
        'accept': 'application/vnd.linkedin.normalized+json+2.1',
        'csrf-token': csrf,
    }
    try:
        res = session.post(url, json=payload, headers=headers, timeout=10)
        return res.status_code in (200, 201)
    except Exception:
        return False


def comment_post(session, csrf, activity_urn, comment_text):
    """Comenta en un post."""
    url = f'{BASE}/voyager/api/socialActions/{requests.utils.quote(activity_urn, safe="")}/comments'
    payload = {
        'actor': '',
        'message': {
            'text': comment_text,
            'attributes': [],
        },
    }
    headers = {
        'Content-Type': 'application/json',
        'accept': 'application/vnd.linkedin.normalized+json+2.1',
        'csrf-token': csrf,
    }
    try:
        res = session.post(url, json=payload, headers=headers, timeout=10)
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
    if done_today >= MAX_INTERACTIONS:
        print(f"Límite diario alcanzado ({done_today}/{MAX_INTERACTIONS}). Volvé mañana.")
        return

    print(f"Engagement pod iniciado. Interacciones hoy: {done_today}/{MAX_INTERACTIONS}")

    session, csrf = get_session()
    if not csrf:
        print("ERROR: No se encontró JSESSIONID — abrí LinkedIn en Chrome primero.")
        return

    interactions = done_today
    seen_urns = {x.get('urn') for x in log['interactions']}

    # Fase 1: interactuar con posts del feed propio
    print("\n[FASE 1] Posts del feed personal...")
    feed_posts = get_feed_posts(session, limit=20)
    print(f"  Posts en feed: {len(feed_posts)}")

    for post in feed_posts:
        if interactions >= MAX_INTERACTIONS:
            break
        urn = post['urn']
        if urn in seen_urns:
            continue

        actor = post['actor_name']
        ok = like_post(session, csrf, urn)
        action = 'like'

        # 1 de cada 4 posts: comentar además de likear
        if ok and random.random() < 0.25 and interactions + 1 < MAX_INTERACTIONS:
            comment = random.choice(ALL_COMMENTS)
            c_ok = comment_post(session, csrf, urn, comment)
            if c_ok:
                interactions += 1
                log['interactions'].append({'urn': urn, 'action': 'comment', 'actor': actor, 'date': today})
                seen_urns.add(urn + '_comment')
                action = 'like+comment'

        if ok:
            print(f"  ✅ {action} → {actor[:40]}")
            interactions += 1
            log['interactions'].append({'urn': urn, 'action': 'like', 'actor': actor, 'date': today})
            seen_urns.add(urn)
            save_log(log)
            time.sleep(8 + random.randint(0, 12))
        else:
            time.sleep(3)

    # Fase 2: buscar posts por keywords LATAM y hacer engagement
    print("\n[FASE 2] Posts por keywords LATAM...")
    for query in TARGET_QUERIES:
        if interactions >= MAX_INTERACTIONS:
            break

        print(f"  Buscando: \"{query}\"")
        posts = search_recent_posts(session, query)

        for post in posts:
            if interactions >= MAX_INTERACTIONS:
                break
            urn = post['urn']
            if urn in seen_urns:
                continue

            actor = post['actor_name']
            ok = like_post(session, csrf, urn)
            if ok:
                print(f"  ✅ like → {actor[:40]}")
                interactions += 1
                log['interactions'].append({'urn': urn, 'action': 'like', 'actor': actor, 'query': query, 'date': today})
                seen_urns.add(urn)
                save_log(log)
                time.sleep(10 + random.randint(0, 15))
            else:
                time.sleep(3)

        time.sleep(5)

    realizadas = interactions - done_today
    print(f"\n{'='*50}")
    print(f"RESUMEN: {realizadas} interacciones en esta sesión")
    print(f"Total hoy: {interactions}/{MAX_INTERACTIONS}")


if __name__ == '__main__':
    main()
