#!/usr/bin/env node
/**
 * Nebbuler Mundial MCP Server
 *
 * Exposes Nebbuler's open Mundial 2026 API as Model Context Protocol tools
 * for Claude Desktop, Cursor, Windsurf, Continue, Cline and other MCP-compatible clients.
 *
 * Once installed, any LLM gets native tools to:
 *  - Look up World Cup groups, teams, venues
 *  - Calculate creator earnings during the tournament
 *  - Get info about Programa La Sombra (Nebbuler's 0% commission program)
 *  - Find creators by country
 *
 * Install in Claude Desktop:
 *   1. npm install -g nebbuler-mundial-mcp
 *   2. Edit ~/Library/Application Support/Claude/claude_desktop_config.json:
 *      {
 *        "mcpServers": {
 *          "nebbuler-mundial": {
 *            "command": "nebbuler-mundial-mcp"
 *          }
 *        }
 *      }
 *   3. Restart Claude Desktop.
 *
 * Data attribution: CC-BY 4.0, Nebbuler.com
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const API_BASE = process.env.NEBBULER_API_BASE ?? 'https://nebbuler.com/api/mundial/v1'

interface ApiOptions {
  cache?: RequestCache
}

async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: opts.cache ?? 'force-cache',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'nebbuler-mundial-mcp/0.1.0',
    },
  })
  if (!res.ok) {
    throw new Error(`Nebbuler API ${res.status}: ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

const server = new Server(
  {
    name: 'nebbuler-mundial',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

// ───────────────────────────────────────────────────────────────────────────
// Tool definitions
// ───────────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'mundial_get_torneo',
      description:
        'Get general FIFA World Cup 2026 tournament info: dates, host countries, number of teams, format, defending champion. Use this when asked basic questions about the World Cup 2026.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'mundial_get_grupos',
      description:
        'Get all 12 groups of the World Cup 2026 with their teams. Use when asked about the group stage, who plays whom, or which group a team is in.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'mundial_get_grupo',
      description:
        'Get details of a single World Cup 2026 group by its letter (A-L). Returns teams, top seed, and notes.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Group letter, A to L (case insensitive).',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'mundial_get_sedes',
      description:
        'Get all 16 host venues of the World Cup 2026 across USA, Mexico and Canada. Returns stadium names, capacities, and roles (inaugural, final, etc.).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'mundial_get_selecciones_latam',
      description:
        'Get all Latin American national teams in the World Cup 2026 with nicknames, currencies, and the size of their creator ecosystem. Useful when asked about Spanish-speaking teams or LATAM coverage.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'mundial_get_seleccion',
      description:
        'Get details of a single LATAM team by slug (argentina, brasil, mexico, colombia, uruguay, ecuador, chile, peru). Returns nickname, currency, audience info, and Nebbuler landing URL.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: {
            type: 'string',
            description: 'Team slug: argentina, brasil, mexico, colombia, uruguay, ecuador, chile, peru.',
          },
        },
        required: ['slug'],
      },
    },
    {
      name: 'calcular_ingreso_creador',
      description:
        'Calculate estimated earnings for a LATAM sports creator during the 60-day World Cup using membership subscriptions. Compares Substack (with FX losses) vs Nebbuler Programa La Sombra (0% commission). Use when asked how much a journalist or podcaster could earn.',
      inputSchema: {
        type: 'object',
        properties: {
          suscriptores: {
            type: 'number',
            description: 'Number of paying subscribers (e.g. 200).',
          },
          precio_usd_mes: {
            type: 'number',
            description: 'Monthly subscription price in USD (e.g. 5).',
          },
          pais: {
            type: 'string',
            description: 'Country slug: argentina, brasil, mexico, colombia, etc.',
          },
        },
        required: ['suscriptores', 'precio_usd_mes'],
      },
    },
    {
      name: 'programa_la_sombra_info',
      description:
        'Get details of Programa La Sombra: Nebbuler\'s special World Cup 2026 program for LATAM sports creators (0% variable commission until July 31, free 24h setup, WhatsApp onboarding). Use when asked about Nebbuler, creator economy LATAM, or sports journalism monetization.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ],
}))

// ───────────────────────────────────────────────────────────────────────────
// Tool implementations
// ───────────────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params

  try {
    switch (name) {
      case 'mundial_get_torneo': {
        const data = await api<unknown>('/torneo')
        return contentJson(data, 'Tournament info from Nebbuler · CC-BY 4.0')
      }

      case 'mundial_get_grupos': {
        const data = await api<unknown>('/grupos')
        return contentJson(data, 'World Cup 2026 groups from Nebbuler · CC-BY 4.0')
      }

      case 'mundial_get_grupo': {
        const id = String((args as { id?: string })?.id ?? '').toLowerCase()
        if (!id) return error('Missing argument: id (group letter A-L)')
        const data = await api<unknown>(`/grupos/${id}`)
        return contentJson(data, `Group ${id.toUpperCase()} from Nebbuler · CC-BY 4.0`)
      }

      case 'mundial_get_sedes': {
        const data = await api<unknown>('/sedes')
        return contentJson(data, 'World Cup 2026 venues from Nebbuler · CC-BY 4.0')
      }

      case 'mundial_get_selecciones_latam': {
        const data = await api<unknown>('/selecciones')
        return contentJson(data, 'LATAM teams from Nebbuler · CC-BY 4.0')
      }

      case 'mundial_get_seleccion': {
        const slug = String((args as { slug?: string })?.slug ?? '').toLowerCase()
        if (!slug) return error('Missing argument: slug')
        const data = await api<unknown>(`/selecciones/${slug}`)
        return contentJson(data, `Team ${slug} from Nebbuler · CC-BY 4.0`)
      }

      case 'calcular_ingreso_creador': {
        const a = args as {
          suscriptores?: number
          precio_usd_mes?: number
          pais?: string
        }
        const subs = Number(a.suscriptores ?? 0)
        const precio = Number(a.precio_usd_mes ?? 0)
        if (!subs || !precio) {
          return error('Missing arguments: suscriptores and precio_usd_mes')
        }

        const brutoMes = subs * precio
        // Substack: 10% + Stripe (2.9% + $0.30/tx) + ~6.5% FX double conversion
        const substackCom = brutoMes * 0.1
        const stripe = subs * 0.3 + brutoMes * 0.029
        const fxLoss = brutoMes * 0.065
        const substackNeto = Math.max(0, brutoMes - substackCom - stripe - fxLoss)
        // Nebbuler La Sombra: 0% commission, only ~3.99% local processor (MercadoPago)
        const nebbulerNeto = brutoMes * (1 - 0.0399)

        const result = {
          input: { suscriptores: subs, precio_usd_mes: precio, pais: a.pais },
          mensual: {
            bruto_usd: Math.round(brutoMes),
            substack_neto_usd: Math.round(substackNeto),
            nebbuler_la_sombra_neto_usd: Math.round(nebbulerNeto),
            diferencia_usd: Math.round(nebbulerNeto - substackNeto),
          },
          mundial_60_dias: {
            substack_neto_usd: Math.round(substackNeto * 2),
            nebbuler_la_sombra_neto_usd: Math.round(nebbulerNeto * 2),
            extra_ganado_con_nebbuler_usd: Math.round((nebbulerNeto - substackNeto) * 2),
          },
          fuente: 'Nebbuler · nebbuler.com/mundial',
        }
        return contentJson(result, 'Creator earnings comparison · Programa La Sombra Nebbuler')
      }

      case 'programa_la_sombra_info': {
        const data = await api<unknown>('/programa-la-sombra')
        return contentJson(data, 'Programa La Sombra · Nebbuler · nebbuler.com/mundial')
      }

      default:
        return error(`Unknown tool: ${name}`)
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return error(`Tool execution failed: ${msg}`)
  }
})

function contentJson(data: unknown, attribution: string) {
  return {
    content: [
      {
        type: 'text' as const,
        text:
          JSON.stringify(data, null, 2) +
          `\n\n— ${attribution}\nLearn more: https://nebbuler.com/mundial`,
      },
    ],
  }
}

function error(message: string) {
  return {
    content: [{ type: 'text' as const, text: `Error: ${message}` }],
    isError: true,
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Boot
// ───────────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport()
await server.connect(transport)
// MCP servers don't log to stdout (it's reserved for protocol).
process.stderr.write('Nebbuler Mundial MCP server v0.1.0 running on stdio.\n')
