// Mock temporal para diseñar la UI del Grupo A.
// Será reemplazado por src/data/mundial-historia-grupos-a-d.json cuando termine el agente.

import type { GrupoHistoria } from '@/lib/mundial/grupo-historia-types'

export const GRUPO_A_MOCK: GrupoHistoria = {
  id: 'A',
  selecciones: [
    {
      pais: 'México',
      apodo: 'El Tri',
      bandera: '🇲🇽',
      fifa_ranking_actual_2026: 17,
      mundiales_jugados_total: 17,
      mejor_resultado_historico: 'Cuartos de final (1970, 1986)',
      titulos_mundiales: 0,
      record_fase_grupos_ultimos_5_mundiales: {
        ganados: 7,
        empatados: 4,
        perdidos: 4,
        porcentaje_avance_a_8vos: 100,
      },
      goleadores_historicos_mundiales: [
        { nombre: 'Javier Hernández', goles: 4 },
        { nombre: 'Luis Hernández', goles: 4 },
        { nombre: 'Cuauhtémoc Blanco', goles: 3 },
      ],
      dt_actual_2026: 'Javier Aguirre',
      capitan_2026: 'A confirmar',
      caso_especial:
        'Anfitrión por tercera vez (1970, 1986, 2026). El Estadio Azteca abre el torneo.',
    },
    {
      pais: 'Sudáfrica',
      apodo: 'Bafana Bafana',
      bandera: '🇿🇦',
      fifa_ranking_actual_2026: 56,
      mundiales_jugados_total: 4,
      mejor_resultado_historico: 'Fase de grupos',
      titulos_mundiales: 0,
      caso_especial: 'Vuelve a un Mundial 16 años después de ser anfitriona en 2010.',
    },
    {
      pais: 'Corea del Sur',
      apodo: 'Los Guerreros Taegeuk',
      bandera: '🇰🇷',
      fifa_ranking_actual_2026: 23,
      mundiales_jugados_total: 11,
      mejor_resultado_historico: 'Semifinal (2002, anfitrión)',
      titulos_mundiales: 0,
      caso_especial: 'Primer Mundial post-era Son Heung-min como referente exclusivo.',
    },
    {
      pais: 'República Checa',
      apodo: 'Národní tým',
      bandera: '🇨🇿',
      fifa_ranking_actual_2026: 39,
      mundiales_jugados_total: 10,
      mejor_resultado_historico: 'Subcampeón como Checoslovaquia (1934, 1962)',
      titulos_mundiales: 0,
      caso_especial: 'Vuelve a un Mundial 20 años después (Alemania 2006).',
    },
  ],
  enfrentamientos: [
    {
      team1: 'México',
      team2: 'Corea del Sur',
      enfrentamientos_totales_historicos: 12,
      h2h_en_mundiales_count: 2,
      h2h_en_mundiales_detalle: [
        {
          año: 1998,
          mundial_sede: 'Francia',
          fase: 'Grupo E',
          resultado: 'México 3-1 Corea del Sur',
          goleadores: [
            "Peláez 27', L. Hernández 75' 84' (MEX)",
            "Ha Seok-ju 28' (KOR)",
          ],
          sede_estadio: 'Stade Gerland, Lyon',
        },
        {
          año: 2018,
          mundial_sede: 'Rusia',
          fase: 'Grupo F',
          resultado: 'México 2-1 Corea del Sur',
          goleadores: [
            "Vela 26' (pen), C. Hernández 66' (MEX)",
            "Son 90+3' (KOR)",
          ],
          sede_estadio: 'Rostov Arena',
        },
      ],
      total_historico_h2h: { victorias_team1: 7, empates: 3, victorias_team2: 2 },
      ultimo_enfrentamiento: {
        fecha: '2024-09-08',
        competicion: 'Amistoso',
        resultado: 'Empate 0-0',
      },
      dato_curioso: 'México nunca perdió contra Corea del Sur en un Mundial (2-0 en H2H mundialista).',
    },
  ],
  narrativa: {
    favorito_data_historica:
      'México (anfitrión, FIFA #17, generación post-Lozano)',
    segundo_favorito: 'Corea del Sur',
    underdog: 'Sudáfrica',
    partido_clave_a_cubrir: 'México vs Corea del Sur (revancha mundialista 1998 + 2018)',
    datos_curiosos_grupo: [
      'Cuarto Mundial donde México y Corea del Sur coinciden en fase de grupos.',
      'El Estadio Azteca abre el Mundial: único estadio en 3 Mundiales (1970, 1986, 2026).',
      'Sudáfrica regresa 16 años después de ser anfitriona en 2010.',
    ],
    storyline_narrativo:
      'El Grupo A arranca con peso simbólico: México juega en casa por tercera vez en la historia, en el mismo Azteca donde lo hizo en 1970 y 1986. Corea del Sur llega con una de las generaciones más jóvenes post-Son. República Checa, ausente del Mundial desde 2006, regresa por el playoff europeo. Sudáfrica busca redimir el peor desempeño histórico como anfitrión en 2010.',
  },
  fuentes: ['FIFA.com', 'Wikipedia EN', 'RSSSF.com', 'ESPN Deportes'],
}
