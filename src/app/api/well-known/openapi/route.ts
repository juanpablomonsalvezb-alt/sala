import { NextResponse } from 'next/server'

export const revalidate = 86400

const YAML = `openapi: 3.0.3
info:
  title: Nebbuler API
  description: Public API for Nebbuler — the membership and CRM platform for Latin American independent professionals. Data is CC-BY 4.0. No auth required.
  version: "1.0.0"
  contact:
    email: hola@nebbuler.com

servers:
  - url: https://nebbuler.com/api/mundial/v1
    description: Nebbuler Mundial 2026 API

paths:
  /torneo:
    get:
      operationId: getTorneo
      summary: FIFA World Cup 2026 general info
      description: Returns dates, format, host countries, number of teams, defending champion for FIFA World Cup 2026.
      responses:
        "200":
          description: Tournament data

  /grupos:
    get:
      operationId: getGrupos
      summary: All 12 World Cup 2026 groups
      description: Returns all 12 groups (A-L) with their 4 teams each.
      responses:
        "200":
          description: Groups data

  /partidos:
    get:
      operationId: getPartidos
      summary: All 104 World Cup 2026 matches
      description: Filter by fase, grupo, or equipo name.
      parameters:
        - name: fase
          in: query
          schema:
            type: string
        - name: grupo
          in: query
          schema:
            type: string
        - name: equipo
          in: query
          schema:
            type: string
      responses:
        "200":
          description: Matches list

  /selecciones:
    get:
      operationId: getSelecciones
      summary: LATAM teams in World Cup 2026
      responses:
        "200":
          description: LATAM teams

  /programa-la-sombra:
    get:
      operationId: getProgramaLaSombra
      summary: Programa La Sombra — 0% commission for sports creators during Mundial 2026
      responses:
        "200":
          description: Program details
`

export async function GET() {
  return new NextResponse(YAML, {
    headers: {
      'Content-Type': 'application/yaml',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
