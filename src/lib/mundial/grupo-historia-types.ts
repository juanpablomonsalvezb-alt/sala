// Tipos compartidos para la página /mundial/grupo/[id]/historia
// El schema lo consumen los 3 agentes investigadores y luego la UI.

export interface SeleccionHistoria {
  pais: string
  apodo: string
  bandera: string
  fifa_ranking_actual_2026?: number
  mundiales_jugados_total: number
  mejor_resultado_historico: string
  titulos_mundiales: number
  record_fase_grupos_ultimos_5_mundiales?: {
    ganados: number
    empatados: number
    perdidos: number
    porcentaje_avance_a_8vos: number
  }
  goleadores_historicos_mundiales?: Array<{ nombre: string; goles: number }>
  dt_actual_2026?: string
  capitan_2026?: string
  caso_especial?: string
}

export interface PartidoMundialista {
  año: number
  mundial_sede: string
  fase: string
  resultado: string
  goleadores?: string[]
  sede_estadio?: string
}

export interface EnfrentamientoCruzado {
  team1: string
  team2: string
  enfrentamientos_totales_historicos: number
  h2h_en_mundiales_count: number
  h2h_en_mundiales_detalle: PartidoMundialista[]
  total_historico_h2h?: {
    victorias_team1: number
    empates: number
    victorias_team2: number
  }
  ultimo_enfrentamiento?: {
    fecha: string
    competicion: string
    resultado: string
  }
  dato_curioso?: string
}

export interface NarrativaGrupo {
  favorito_data_historica: string
  segundo_favorito?: string
  underdog?: string
  partido_clave_a_cubrir: string
  datos_curiosos_grupo: string[]
  storyline_narrativo: string
}

export interface GrupoHistoria {
  id: string
  selecciones: SeleccionHistoria[]
  enfrentamientos: EnfrentamientoCruzado[]
  narrativa: NarrativaGrupo
  fuentes?: string[]
}
