#!/usr/bin/env python3
"""
Genera un HTML local con botones mailto: pre-armados para los 50 journalists.
El usuario hace click → su cliente de email se abre con todo pre-llenado.

Para los que tienen Twitter handle: genera también botón "Abrir DM en X".
"""

import re, os, json
from pathlib import Path
from urllib.parse import quote

OUT = Path('/tmp/nebbuler-outreach/inbox-action.html')
OUT.parent.mkdir(exist_ok=True)

MD = '/Users/juanpablomonsalvez/Downloads/sala/automation/growth/journalists-latam.md'

# Mapping medio → dominio (mismo que el script anterior)
MEDIO_DOMAINS = {
    'rest of world': 'restofworld.org', 'techcrunch': 'techcrunch.com',
    'fortune': 'fortune.com', 'bloomberg línea': 'bloomberglinea.com',
    'bloomberg linea': 'bloomberglinea.com', 'el cronista': 'cronista.com',
    'cronista': 'cronista.com', 'iprofesional': 'iprofesional.com',
    'forbes argentina': 'forbesargentina.com', 'forbes colombia': 'forbes.co',
    'forbes méxico': 'forbes.com.mx', 'forbes mexico': 'forbes.com.mx',
    'forbes': 'forbes.com', 'infobae': 'infobae.com',
    'clarín': 'clarin.com', 'clarin': 'clarin.com', 'xataka': 'xataka.com',
    'la tercera': 'latercera.com', 'pulso': 'latercera.com',
    'diario financiero': 'df.cl', 'df': 'df.cl',
    'la república': 'larepublica.co', 'la republica': 'larepublica.co',
    'el espectador': 'elespectador.com', 'enter.co': 'enter.co',
    'semana': 'semana.com', 'tecnívoro': 'tecnivoro.co',
    'excélsior': 'excelsior.com.mx', 'excelsior': 'excelsior.com.mx',
    'whitepaper': 'whitepaper.mx', 'expansión': 'expansion.mx',
    'expansion': 'expansion.mx', 'tecscience': 'tecscience.com',
    'el financiero': 'elfinanciero.com.mx', 'el universal': 'eluniversal.com.mx',
    'milenio': 'milenio.com', 'el economista': 'eleconomista.com.mx',
    'entrepreneur': 'entrepreneur.com', 'contxto': 'contxto.com',
    'latamlist': 'latamlist.com', 'pulzo': 'pulzo.com',
    'caracol': 'caracol.com.co', 'el tiempo': 'eltiempo.com',
    'rpp': 'rpp.pe', 'gestión': 'gestion.pe', 'gestion': 'gestion.pe',
    'el comercio': 'elcomercio.pe', 'geektime': 'geektime.es',
    'folou': 'folou.co',
}

def slugify_name(name):
    name = name.lower()
    for prefix in ['lic.', 'mtro.', 'dr.', 'dra.', 'ing.']:
        name = name.replace(prefix, '')
    name = re.sub(r'\([^)]*\)', '', name)
    repl = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n','ü':'u'}
    for k, v in repl.items():
        name = name.replace(k, v)
    parts = [p for p in re.split(r'[\s,]+', name.strip()) if p and len(p) > 1]
    if len(parts) >= 2:
        return f'{parts[0]}.{parts[-1]}'
    return parts[0] if parts else ''

def infer_email(name, medio_raw):
    if not name or not medio_raw:
        return None
    ml = medio_raw.lower().strip()
    domain = next((v for k, v in MEDIO_DOMAINS.items() if k in ml), None)
    if not domain:
        return None
    slug = slugify_name(name)
    return f'{slug}@{domain}' if slug else None

def extract_twitter(contact_raw):
    """Devuelve handle (sin @) o None"""
    m = re.search(r'X:\s*\[?@([a-zA-Z0-9_]+)', contact_raw)
    if m:
        return m.group(1)
    m = re.search(r'@([a-zA-Z0-9_]+)\)', contact_raw)
    if m:
        return m.group(1)
    return None

# Parsear
people = []
for line in open(MD):
    if not line.startswith('|'):
        continue
    cols = [c.strip() for c in line.split('|')[1:-1]]
    if len(cols) < 6 or not cols[0].strip().isdigit():
        continue
    idx, name, medio, cargo, contact, beat = cols[:6]
    angulo = cols[6] if len(cols) > 6 else ''
    email = infer_email(name, medio)
    twitter = extract_twitter(contact)
    people.append({
        'idx': int(idx), 'name': name, 'medio': medio,
        'cargo': cargo, 'beat': beat, 'angulo': angulo,
        'email': email, 'twitter': twitter,
    })

# Tier 1 — los 3 más importantes
TIER1_NAMES = {'Daniela Dib', 'Daniel Fajardo', 'René Lankenau'}

def build_body(p):
    first = p['name'].split()[0]
    beat = p['beat'].split(',')[0].strip() if p['beat'] else 'startups LATAM'
    medio = p['medio']

    if p['name'] in TIER1_NAMES:
        return f"""Hola {first},

Soy Juan Pablo Monsalvez, fundador de Nebbuler — primera plataforma de membresías para creadores hispanohablantes de LATAM.

Te escribo porque sigo tu cobertura sobre {beat}. Tenemos una historia que cabe en eso: el modelo "newsletter de pago" que en EE.UU. construyó Substack está virtualmente vacío en español, no por falta de demanda sino por fricción de pago.

Algunos datos:
- El lector LATAM pagando en USD vía Substack/Patreon paga 8-15% extra por FX + recargos.
- La conversión gratis→paga en español es 2-3x menor que en inglés por esa fricción.
- Mercado LATAM creator economy: US$38B (2022) → US$112B (2030).

Nebbuler resuelve esto: tarifa fija US$30/mes, 0% comisión variable, cobros directos en COP/MXN/ARS/PEN/CLP.

Tengo data abierta (CC BY 4.0 en nebbuler.com/informe-2026), acceso al producto, y conversaciones con los primeros 50 creadores.

Sin agenda — solo creo que es una historia que merece estar contada.

Saludos,
Juan Pablo
Fundador, Nebbuler
https://nebbuler.com"""
    else:
        return f"""Hola {first},

Soy Juan Pablo Monsalvez, fundador de Nebbuler — plataforma de membresías para creadores hispanohablantes de LATAM. Cobramos en pesos colombianos, mexicanos, argentinos, soles peruanos y otras monedas locales, en lugar de forzar a la audiencia a pagar en dólares como hacen Substack o Patreon.

Te escribo porque vi que cubrís {beat} en {medio}. Este tema podría tocar a tus lectores: hay un mercado emergente de profesionales (economistas, abogados, coaches) que ya no quieren depender de algoritmos y están migrando a modelos de membresía pagada. En EE.UU. Substack lo capturó; en LATAM nadie todavía.

Datos rápidos:
- Mercado LATAM creator economy: US$38B → US$112B (2030).
- 73% de las cancelaciones en plataformas USD citan fricción de pago.
- En Nebbuler el break-even llega con 4 suscriptores pagos vs 20+ en Substack.

¿Te mando más data o un walkthrough? Sin compromiso.

Acceso al producto: https://nebbuler.com
Informe abierto 2026: https://nebbuler.com/informe-2026

Saludos,
Juan Pablo Monsalvez
Fundador, Nebbuler"""

def build_subject(p):
    first = p['name'].split()[0]
    if p['name'] in TIER1_NAMES:
        return f'{first}, hay una historia que cabe en tu beat sobre creator economy LATAM'
    return f'{first}, ¿cubren la economía del creador en LATAM?'

def build_dm_text(p):
    """Mensaje cortito para DM de Twitter"""
    first = p['name'].split()[0]
    return f"""Hola {first}, soy Juan Pablo, fundador de Nebbuler (alternativa a Substack para creadores LATAM, pagos en moneda local 0% comisión variable).

Tenemos una historia que puede interesarle a tus lectores — mercado de US$38B con casi cero competencia localizada. Te dejo el informe abierto: nebbuler.com/informe-2026

¿Tenés 10 min para conversar la próxima semana?"""

# Marcar emails que ya bouncearon en el primer envío
BOUNCED_EMAILS = {
    'daniela.dib@restofworld.org', 'leo.schwartz@restofworld.org',
    'anna.heim@techcrunch.com', 'marina.temkin@techcrunch.com',
    'jimena.tolama@bloomberglinea.com', 'andres.engler@bloomberglinea.com',
    'lucila.lopardo@forbesargentina.com', 'martina.veneziani@forbesargentina.com',
}
DELIVERED_EMAILS = {
    'cesar.dergarabedian@iprofesional.com',
    'laura.mafud@forbesargentina.com',
}

# Generar HTML
html_parts = []
html_parts.append("""<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<title>Outreach Inbox — Nebbuler</title>
<style>
  body { font: 14px -apple-system, BlinkMacSystemFont, sans-serif; max-width: 980px; margin: 20px auto; padding: 0 16px; color: #222; }
  h1 { font: 700 28px serif; margin-bottom: 8px; }
  .sub { color: #666; margin-bottom: 24px; }
  .item { border-left: 3px solid #ddd; padding: 16px 0 16px 16px; margin-bottom: 14px; }
  .item.bounced { border-left-color: #c41c1c; background: #fff5f5; padding-right: 16px; }
  .item.delivered { border-left-color: #15803d; background: #f0fdf4; padding-right: 16px; }
  .item.tier1 { border-left-color: #d97706; background: #fffbeb; padding-right: 16px; }
  .item h3 { margin: 0 0 4px; font: 700 16px serif; }
  .item .meta { color: #666; font-size: 12px; margin-bottom: 8px; }
  .item .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .btn { display: inline-block; padding: 8px 14px; background: #c41c1c; color: #fff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500; }
  .btn.tw { background: #1da1f2; }
  .btn.li { background: #0a66c2; }
  .btn:hover { opacity: 0.85; }
  .status { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
  .status.bounced { background: #fee; color: #c41c1c; }
  .status.delivered { background: #dcfce7; color: #15803d; }
  .status.tier1 { background: #fef3c7; color: #92400e; }
  .legend { background: #f7f7f7; padding: 12px 16px; border-radius: 6px; font-size: 12px; margin-bottom: 20px; }
  .legend span { display: inline-block; margin-right: 16px; }
  .summary { background: #fffbe6; padding: 16px; border-left: 4px solid #c41c1c; margin-bottom: 24px; }
</style></head><body>""")

stats = {'total': len(people), 'with_email': sum(1 for p in people if p['email']), 'with_twitter': sum(1 for p in people if p['twitter']), 'bounced': len(BOUNCED_EMAILS), 'delivered': len(DELIVERED_EMAILS)}

html_parts.append(f"""
<h1>Outreach Inbox — 50 journalists LATAM</h1>
<p class="sub">Click en cada botón abre tu cliente de email (Gmail/Mail) con todo pre-llenado.<br>
Tu trabajo: revisar, ajustar si querés, apretar enviar.</p>

<div class="summary">
<strong>📊 Estado:</strong> {stats['total']} journalists · {stats['with_email']} con email inferido · {stats['with_twitter']} con Twitter público.<br>
<strong>Primer lote enviado (10):</strong> ✅ {stats['delivered']} entregados · ❌ {stats['bounced']} rebotados.<br>
<strong>Frenamos</strong> para proteger reputación nebbuler.com. Resto se envía desde tu Gmail con los botones de abajo.
</div>

<div class="legend">
  <span><span class="status delivered">YA ENTREGADO</span> No re-enviar.</span>
  <span><span class="status bounced">REBOTÓ</span> Email no existe — usar Twitter/LinkedIn.</span>
  <span><span class="status tier1">TIER 1</span> Prioridad máxima — leer notas previas antes.</span>
</div>
""")

# Ordenar: Tier 1 primero, después no-bounced, después bounced
def sort_key(p):
    if p['name'] in TIER1_NAMES:
        return (0, p['idx'])
    if p['email'] in BOUNCED_EMAILS:
        return (2, p['idx'])
    return (1, p['idx'])

for p in sorted(people, key=sort_key):
    is_t1 = p['name'] in TIER1_NAMES
    is_bounced = p['email'] in BOUNCED_EMAILS if p['email'] else False
    is_delivered = p['email'] in DELIVERED_EMAILS if p['email'] else False

    css_class = 'item'
    if is_delivered: css_class += ' delivered'
    elif is_bounced: css_class += ' bounced'
    elif is_t1: css_class += ' tier1'

    status_chip = ''
    if is_delivered: status_chip = '<span class="status delivered">YA ENTREGADO</span>'
    elif is_bounced: status_chip = '<span class="status bounced">REBOTÓ — USAR DM</span>'
    elif is_t1: status_chip = '<span class="status tier1">TIER 1</span>'

    html_parts.append(f'<div class="{css_class}">')
    html_parts.append(f'<h3>{p["name"]} {status_chip}</h3>')
    html_parts.append(f'<div class="meta">{p["medio"]} · {p["cargo"]} · <em>{p["beat"]}</em></div>')

    if p['angulo']:
        html_parts.append(f'<div class="meta" style="color:#444;font-style:italic">{p["angulo"]}</div>')

    html_parts.append('<div class="actions">')

    # Email button (solo si no fue ya entregado)
    if p['email'] and not is_delivered:
        subj = quote(build_subject(p))
        body = quote(build_body(p))
        if is_bounced:
            html_parts.append(f'<span style="color:#999;font-size:12px">📧 email <code>{p["email"]}</code> rebotó · probar mejor por Twitter/LinkedIn</span>')
        else:
            html_parts.append(f'<a class="btn" href="mailto:{p["email"]}?subject={subj}&body={body}">✉️ Enviar email a {p["email"]}</a>')

    # Twitter DM
    if p['twitter']:
        dm_text = quote(build_dm_text(p))
        html_parts.append(f'<a class="btn tw" target="_blank" href="https://twitter.com/messages/compose?recipient_id={p["twitter"]}&text={dm_text}">𝕏 DM a @{p["twitter"]}</a>')
        html_parts.append(f'<a class="btn tw" style="background:#666" target="_blank" href="https://twitter.com/{p["twitter"]}">Ver perfil X</a>')

    html_parts.append('</div></div>')

html_parts.append("""
<div style="margin-top:30px;padding:16px;background:#f7f7f7;border-radius:6px;font-size:12px;color:#666">
<strong>Consejos:</strong><br>
1. Empezá por los <span style="background:#fef3c7;padding:2px 6px;border-radius:3px;color:#92400e;font-weight:600">TIER 1</span> — son los 3 que más probabilidad tienen de responder.<br>
2. Los rebotados (en rojo) → mejor X DM o LinkedIn directo.<br>
3. Si un journalist responde, no lo dejes esperar > 24h.<br>
4. Si una nota sale publicada, agregala a /prensa para citarla en futuros pitches.
</div>
</body></html>""")

OUT.write_text('\n'.join(html_parts))
print(f'✅ HTML generado: {OUT}')
print(f'   Para abrir: open {OUT}')
print(f'\nStats:')
print(f'  Total: {stats["total"]}')
print(f'  Con email inferido: {stats["with_email"]}')
print(f'  Con Twitter público: {stats["with_twitter"]}')
print(f'  Ya entregados (lote 1): {stats["delivered"]}')
print(f'  Rebotaron (lote 1): {stats["bounced"]}')
