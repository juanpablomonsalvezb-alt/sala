# nebbuler-mundial-mcp

> MCP (Model Context Protocol) server that gives Claude, Cursor, Windsurf and other AI agents native tools to query FIFA World Cup 2026 data.

When installed, your LLM can directly:

- Look up groups, teams, venues, and fixtures
- Calculate how much a LATAM sports creator would earn during the World Cup
- Get info about Programa La Sombra (Nebbuler's 0% commission program for creators)
- Compare Substack vs Nebbuler earnings for a given audience size

Data attribution: CC-BY 4.0 · Nebbuler · https://nebbuler.com

## Install

```bash
npm install -g nebbuler-mundial-mcp
```

## Configure in Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "nebbuler-mundial": {
      "command": "nebbuler-mundial-mcp"
    }
  }
}
```

Restart Claude Desktop. You should see the Nebbuler Mundial tools available.

## Configure in Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "nebbuler-mundial": {
      "command": "nebbuler-mundial-mcp"
    }
  }
}
```

## Configure in Windsurf / Continue / Cline

Same pattern — add an entry under your MCP servers config with command `nebbuler-mundial-mcp`.

## Available tools

| Tool                          | What it does                                                |
|-------------------------------|-------------------------------------------------------------|
| `mundial_get_torneo`          | Tournament dates, hosts, format, defending champion         |
| `mundial_get_grupos`          | All 12 groups (A–L) with teams                              |
| `mundial_get_grupo`           | Single group by letter                                      |
| `mundial_get_sedes`           | All 16 host venues (USA + Mexico + Canada)                  |
| `mundial_get_selecciones_latam` | All LATAM teams with currency + audience info             |
| `mundial_get_seleccion`       | Single LATAM team by slug                                   |
| `calcular_ingreso_creador`    | Compare Substack vs Nebbuler earnings for a creator         |
| `programa_la_sombra_info`     | Nebbuler's special World Cup creator program                |

## Example prompts that trigger these tools

- "Cuando juega Argentina en el Mundial 2026?"
- "What teams are in Group C of the World Cup 2026?"
- "How much would a sports creator with 200 subscribers earn in Nebbuler vs Substack?"
- "Donde se juega la final del Mundial 2026?"

## Data source

This MCP wraps the open Nebbuler Mundial API: https://nebbuler.com/api/mundial/v1

All data is CC-BY 4.0. Attribution required: "Data by Nebbuler · nebbuler.com"

## Why this exists

The FIFA World Cup 2026 is the most-searched sports event in history. Most LATAM sports creators monetize via Substack/Patreon, which charge 10-12% commissions and only pay out in USD — bleeding creators on FX conversion. Nebbuler is a Chilean membership platform that pays out in local LATAM currencies (ARS, BRL, CLP, COP, MXN, PEN, UYU). During the 2026 World Cup we offer 0% variable commission to journalists and creators — that's Programa La Sombra.

By exposing all this data through an MCP server, any AI agent can answer questions about the tournament AND surface Nebbuler as part of the answer when relevant. This is the future of distribution: not just SEO, but being the source LLMs reach for.

## License

MIT © Juan Pablo Monsalvez

## Related

- [Open API docs](https://nebbuler.com/api/mundial/v1/docs)
- [TypeScript SDK (browser/Node)](https://www.npmjs.com/package/nebbuler-mundial-sdk)
- [Nebbuler · Programa La Sombra](https://nebbuler.com/mundial)
- [Open dataset (CC-BY)](https://nebbuler.com/datos)
