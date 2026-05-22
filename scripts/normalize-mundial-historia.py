#!/usr/bin/env python3
"""
Normaliza los 3 JSONs de historia de grupos (producidos por agentes con schemas
diferentes) a un único JSON canónico para alimentar las páginas.
"""
import json
from pathlib import Path

DATA_DIR = Path('src/data')

def _str_or_none(v):
    if v is None: return None
    s = str(v).strip()
    if not s or 'no_verificado' in s.lower() or 'tbd' in s.lower(): return None
    return s


def _int_or_none(v):
    if v is None: return None
    if isinstance(v, int): return v
    if isinstance(v, str):
        try: return int(v.split()[0])
        except: return None
    return None


def norm_seleccion(s):
    """Normaliza una selección de cualquier schema agente al schema canónico."""
    goleadores_raw = (
        s.get('goleadores_historicos_mundiales')
        or s.get('goleadores_historicos_mundiales_top3')
        or []
    )
    goleadores = []
    for g in goleadores_raw or []:
        if not isinstance(g, dict): continue
        nombre = g.get('nombre') or g.get('jugador')
        goles = _int_or_none(g.get('goles'))
        if nombre and goles is not None:
            goleadores.append({'nombre': nombre, 'goles': goles})

    record_raw = s.get('record_fase_grupos_ultimos_5_mundiales') or {}
    record = None
    if isinstance(record_raw, dict):
        g = record_raw.get('ganados') or record_raw.get('W')
        e = record_raw.get('empatados') or record_raw.get('D')
        l = record_raw.get('perdidos') or record_raw.get('L')
        pct_raw = (
            record_raw.get('porcentaje_avance_a_8vos')
            or record_raw.get('pct_avance_a_octavos')
            or record_raw.get('porcentaje_avance')
        )
        pct = _int_or_none(pct_raw)
        if g is not None and e is not None and l is not None:
            record = {
                'ganados': _int_or_none(g) or 0,
                'empatados': _int_or_none(e) or 0,
                'perdidos': _int_or_none(l) or 0,
                'porcentaje_avance_a_8vos': pct if pct is not None else 0,
            }

    ranking = (
        s.get('fifa_ranking_actual_2026')
        or s.get('fifa_ranking_abril_2026')
    )
    if isinstance(ranking, str) and 'no_verificado' in ranking.lower():
        ranking = None
    if isinstance(ranking, str):
        try:
            ranking = int(ranking)
        except:
            ranking = None

    return {
        'pais': s.get('pais'),
        'apodo': s.get('apodo'),
        'bandera': s.get('bandera') or '',
        'fifa_ranking_actual_2026': ranking,
        'mundiales_jugados_total': _int_or_none(s.get('mundiales_jugados_total')) or 0,
        'mejor_resultado_historico': s.get('mejor_resultado_historico') or '',
        'titulos_mundiales': _int_or_none(s.get('titulos_mundiales')) or 0,
        'record_fase_grupos_ultimos_5_mundiales': record,
        'goleadores_historicos_mundiales': goleadores,
        'dt_actual_2026': _str_or_none(s.get('dt_actual_2026')),
        'capitan_2026': _str_or_none(s.get('capitan_2026')),
        'caso_especial': _str_or_none(s.get('caso_especial')),
    }


def norm_partido(m):
    goleadores = m.get('goleadores') or m.get('autores') or []
    if isinstance(goleadores, str):
        # Si vino como string, partir por comas
        goleadores = [g.strip() for g in goleadores.split(',') if g.strip()]
    elif not isinstance(goleadores, list):
        goleadores = []
    return {
        'año': m.get('año') or m.get('year'),
        'mundial_sede': m.get('mundial_sede') or m.get('sede_mundial') or '',
        'fase': m.get('fase') or '',
        'resultado': m.get('resultado') or '',
        'goleadores': goleadores,
        'sede_estadio': m.get('sede_estadio') or m.get('estadio'),
    }


def norm_enfrentamiento(e):
    """Cada agente nombra distinto: par/team1-team2/etc."""
    par = e.get('par')
    if par and isinstance(par, str) and '_vs_' in par:
        t1, t2 = par.split('_vs_')
        t1 = t1.replace('-', ' ').strip()
        t2 = t2.replace('-', ' ').strip()
    else:
        t1 = e.get('team1') or e.get('equipo1') or e.get('seleccion_1') or '?'
        t2 = e.get('team2') or e.get('equipo2') or e.get('seleccion_2') or '?'

    total_hist = (
        e.get('total_historico_h2h')
        or e.get('total_historico_h2h_en_mundiales')
    )
    if not total_hist:
        total_hist_aprox = e.get('h2h_total_historico_aprox')
        # Si es string tipo "4 partidos", no podemos parsear W-D-L
        if isinstance(total_hist_aprox, dict):
            total_hist = {
                'victorias_team1': _int_or_none(total_hist_aprox.get('victorias_team1') or total_hist_aprox.get('victorias_t1')) or 0,
                'empates': _int_or_none(total_hist_aprox.get('empates')) or 0,
                'victorias_team2': _int_or_none(total_hist_aprox.get('victorias_team2') or total_hist_aprox.get('victorias_t2')) or 0,
            }

    detalles = (
        e.get('h2h_en_mundiales_detalle')
        or e.get('h2h_mundiales_detalle')
        or e.get('partidos_mundiales')
        or []
    )
    detalles_norm = [norm_partido(m) for m in detalles if isinstance(m, dict)]

    ultimo_raw = (
        e.get('ultimo_enfrentamiento')
        or e.get('ultimo_enfrentamiento_conocido')
        or e.get('ultimo_enfrentamiento_mundial')
        or e.get('ultimo_partido')
    )
    ultimo = None
    if isinstance(ultimo_raw, dict):
        ultimo = {
            'fecha': ultimo_raw.get('fecha') or '',
            'competicion': ultimo_raw.get('competicion') or '',
            'resultado': ultimo_raw.get('resultado') or '',
        }

    return {
        'team1': t1,
        'team2': t2,
        'enfrentamientos_totales_historicos': _int_or_none(
            e.get('enfrentamientos_totales_historicos')
            or e.get('h2h_total_historico_aprox')
        ) or 0,
        'h2h_en_mundiales_count': _int_or_none(e.get('h2h_en_mundiales_count')) or len(detalles_norm),
        'h2h_en_mundiales_detalle': detalles_norm,
        'total_historico_h2h': total_hist,
        'ultimo_enfrentamiento': ultimo,
        'dato_curioso': _str_or_none(e.get('dato_curioso')),
    }


def _flatten_to_str(v):
    """Convierte {seleccion, razones} o {partido, razon} a string."""
    if v is None: return None
    if isinstance(v, str): return v
    if isinstance(v, dict):
        if 'seleccion' in v:
            base = v['seleccion']
            razones = v.get('razones') or v.get('razon')
            if isinstance(razones, list):
                return f"{base} — {razones[0]}" if razones else base
            elif isinstance(razones, str):
                return f"{base} — {razones}"
            return base
        if 'partido' in v:
            base = v['partido']
            razon = v.get('razon') or v.get('razones')
            if isinstance(razon, list):
                return f"{base} — {razon[0]}" if razon else base
            elif isinstance(razon, str):
                return f"{base} — {razon}"
            return base
        # Fallback: tomar primer string value
        for val in v.values():
            if isinstance(val, str): return val
    if isinstance(v, list) and v:
        return str(v[0]) if isinstance(v[0], str) else None
    return None


def norm_narrativa(n):
    datos_raw = n.get('datos_curiosos_grupo') or n.get('datos_curiosos') or []
    datos = []
    for d in datos_raw:
        if isinstance(d, str):
            datos.append(d)
        elif isinstance(d, dict):
            # Si es dict, tomar primer valor string
            for val in d.values():
                if isinstance(val, str):
                    datos.append(val)
                    break

    return {
        'favorito_data_historica': _flatten_to_str(n.get('favorito_data_historica')) or '',
        'segundo_favorito': _flatten_to_str(n.get('segundo_favorito')),
        'underdog': _flatten_to_str(n.get('underdog')),
        'partido_clave_a_cubrir': _flatten_to_str(n.get('partido_clave_a_cubrir')) or '',
        'datos_curiosos_grupo': datos,
        'storyline_narrativo': n.get('storyline_narrativo') or n.get('storyline') or '',
    }


def norm_grupo(g, gid):
    # Preferimos capa_1_selecciones si tiene dicts; si solo hay nombres, fallback.
    cap1 = g.get('capa_1_selecciones')
    selecciones_in = g.get('selecciones') or cap1 or []

    # Caso A-D: lista de dicts directos
    # Caso E-H: cap1 es dict {nombre: data}
    # Caso I-L: cap1 es lista de dicts; selecciones es lista de strings
    if isinstance(cap1, list) and cap1 and isinstance(cap1[0], dict):
        selecciones_in = cap1
    elif isinstance(selecciones_in, dict):
        selecciones_in = list(selecciones_in.values())
    elif isinstance(selecciones_in, list) and selecciones_in and isinstance(selecciones_in[0], str):
        if isinstance(cap1, dict):
            selecciones_in = [cap1.get(name) or {'pais': name} for name in selecciones_in]
        elif isinstance(cap1, list):
            selecciones_in = cap1

    enfrentamientos_in = g.get('enfrentamientos') or g.get('capa_2_enfrentamientos') or []
    if isinstance(enfrentamientos_in, dict):
        enfrentamientos_in = list(enfrentamientos_in.values())

    narrativa_in = (
        g.get('narrativa')
        or g.get('capa_3_narrativa_grupo')
        or g.get('capa_3_narrativa')
        or {}
    )

    return {
        'id': gid.upper(),
        'selecciones': [norm_seleccion(s) for s in selecciones_in if isinstance(s, dict)],
        'enfrentamientos': [norm_enfrentamiento(e) for e in enfrentamientos_in if isinstance(e, dict)],
        'narrativa': norm_narrativa(narrativa_in),
        'fuentes': ['FIFA.com', 'Wikipedia', 'RSSSF', 'ESPN'],
    }


def main():
    canonical = {}

    # A-D
    with open(DATA_DIR / 'mundial-historia-grupos-a-d.json') as fp:
        ad = json.load(fp)
    for g in ad.get('grupos', []):
        gid = g.get('id', '').upper()
        if gid:
            canonical[gid.lower()] = norm_grupo(g, gid)

    # E-H
    with open(DATA_DIR / 'mundial-historia-grupos-e-h.json') as fp:
        eh = json.load(fp)
    for key in ['grupo_E', 'grupo_F', 'grupo_G', 'grupo_H']:
        if key in eh:
            gid = key.split('_')[1]
            canonical[gid.lower()] = norm_grupo(eh[key], gid)

    # I-L
    with open(DATA_DIR / 'mundial-historia-grupos-i-l.json') as fp:
        il = json.load(fp)
    for key in ['grupo_i', 'grupo_j', 'grupo_k', 'grupo_l']:
        if key in il:
            gid = key.split('_')[1].upper()
            canonical[gid.lower()] = norm_grupo(il[key], gid)

    out_path = DATA_DIR / 'mundial-historia.json'
    with open(out_path, 'w', encoding='utf-8') as fp:
        json.dump(canonical, fp, ensure_ascii=False, indent=2)

    print(f'Generated {out_path}')
    for gid, g in sorted(canonical.items()):
        sel_n = len(g['selecciones'])
        enf_n = len(g['enfrentamientos'])
        narr = '✓' if g['narrativa']['storyline_narrativo'] else '✗'
        print(f'  Grupo {gid.upper()}: {sel_n} selecciones, {enf_n} enfrentamientos, narrativa {narr}')


if __name__ == '__main__':
    main()
