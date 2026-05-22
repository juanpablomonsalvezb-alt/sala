# Implementación — Stack de APIs Mundial 2026 para Nebbuler

**Stack confirmado:** OpenFootball + ESPN hidden API + football-data.org + API-Football (puntual) + TheSportsDB (assets)
**Framework:** Next.js 14+ App Router + TypeScript + Vercel ISR + Vercel KV

---

## 1. Variables de entorno necesarias

Agregar a `.env.local` y a Vercel (con `printf` para evitar `\n` invisibles):

```bash
# football-data.org (registro gratis en https://www.football-data.org/client/register)
FOOTBALL_DATA_TOKEN=tu_token_aqui

# API-Football (registro directo en https://dashboard.api-football.com/register, NO RapidAPI)
API_FOOTBALL_KEY=tu_key_aqui

# TheSportsDB v1 free key
SPORTSDB_KEY=123

# Vercel KV (auto-config si activás KV en Vercel Dashboard)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

Comando para agregar a Vercel sin romper:

```bash
printf "tu_token_aqui" | npx vercel env add FOOTBALL_DATA_TOKEN production
printf "tu_key_aqui"   | npx vercel env add API_FOOTBALL_KEY production
printf "123"           | npx vercel env add SPORTSDB_KEY production
```

---

## 2. Estructura de archivos

```
/lib
  /worldcup
    types.ts                  # Tipos compartidos
    openfootball.ts           # Capa 1: esqueleto de fixtures
    espn.ts                   # Capa 2: live data
    footballData.ts           # Capa 3: backup oficial + standings
    apiFootball.ts            # Capa 4: lineups puntuales
    sportsdb.ts               # Capa 5: assets/logos
    aggregator.ts             # Combina todas las fuentes
    cache.ts                  # Wrappers de Vercel KV

/app
  /mundial
    /estadisticas
      page.tsx                # Listado general
    /partido
      /[fecha]
        /[teams]
          page.tsx            # Detalle de partido

/app/api
  /worldcup
    /fixtures/route.ts        # GET /api/worldcup/fixtures
    /live/route.ts            # GET /api/worldcup/live
    /standings/route.ts       # GET /api/worldcup/standings
    /match/[id]/route.ts      # GET /api/worldcup/match/[id]
```

---

## 3. Tipos compartidos (`lib/worldcup/types.ts`)

```typescript
export type Team = {
  name: string;
  code?: string;        // FIFA code: "MEX", "ARG", "BRA"...
  logoUrl?: string;
  flagUrl?: string;
};

export type MatchScore = {
  home: number | null;
  away: number | null;
  status: "scheduled" | "live" | "finished" | "postponed";
  minute?: number;      // solo si live
};

export type Match = {
  id: string;
  round: string;        // "Matchday 1", "Round of 32", "Final"
  group?: string;       // "A".."L" o null para knockouts
  date: string;         // ISO YYYY-MM-DD
  time: string;         // ISO HH:MM en UTC
  venue: string;
  city?: string;
  broadcasters?: string[];
  team1: Team;
  team2: Team;
  score?: MatchScore;
  source: "openfootball" | "espn" | "football-data";
  lastUpdated: string;  // ISO timestamp
};

export type Standing = {
  group: string;
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

export type Lineup = {
  matchId: string;
  team: Team;
  formation: string;    // "4-3-3", "3-5-2"
  startingXI: Array<{ number: number; name: string; position: string }>;
  substitutes: Array<{ number: number; name: string; position: string }>;
};
```

---

## 4. Capa 1 — OpenFootball (`lib/worldcup/openfootball.ts`)

```typescript
import type { Match } from "./types";

const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// Fallback a jsDelivr CDN si GitHub raw tiene rate limit
const FALLBACK_URL =
  "https://cdn.jsdelivr.net/gh/openfootball/worldcup.json@master/2026/worldcup.json";

export async function fetchOpenFootballSchedule(): Promise<Match[]> {
  let res = await fetch(OPENFOOTBALL_URL, {
    next: { revalidate: 21600 }, // 6h
  });

  if (!res.ok) {
    res = await fetch(FALLBACK_URL, { next: { revalidate: 21600 } });
  }

  if (!res.ok) {
    throw new Error(`OpenFootball failed: ${res.status}`);
  }

  const data = await res.json();

  return data.matches.map((m: any, idx: number): Match => ({
    id: `of-${idx}-${m.date}-${m.team1}-${m.team2}`.replace(/\s+/g, "_"),
    round: m.round,
    group: m.group?.replace("Group ", ""),
    date: m.date,
    time: m.time,
    venue: m.ground,
    team1: { name: m.team1 },
    team2: { name: m.team2 },
    source: "openfootball",
    lastUpdated: new Date().toISOString(),
  }));
}
```

---

## 5. Capa 2 — ESPN hidden API (`lib/worldcup/espn.ts`)

```typescript
import type { Match, MatchScore } from "./types";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

/**
 * Devuelve scoreboard del Mundial 2026.
 * Si pasás fechas, filtra por rango (formato YYYYMMDD).
 */
export async function fetchEspnScoreboard(opts?: {
  dateFrom?: string;  // YYYYMMDD
  dateTo?: string;    // YYYYMMDD
  revalidate?: number;
}): Promise<Match[]> {
  const params = new URLSearchParams();
  if (opts?.dateFrom && opts?.dateTo) {
    params.set("dates", `${opts.dateFrom}-${opts.dateTo}`);
  } else if (opts?.dateFrom) {
    params.set("dates", opts.dateFrom);
  }

  const url = `${ESPN_BASE}/scoreboard${params.toString() ? "?" + params : ""}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Nebbuler/1.0 (+https://nebbuler.com)" },
    next: { revalidate: opts?.revalidate ?? 30 },
  });

  if (!res.ok) throw new Error(`ESPN failed: ${res.status}`);
  const data = await res.json();

  return (data.events ?? []).map((ev: any): Match => {
    const comp = ev.competitions?.[0];
    const homeC = comp?.competitors?.find((c: any) => c.homeAway === "home");
    const awayC = comp?.competitors?.find((c: any) => c.homeAway === "away");

    const score: MatchScore = {
      home: homeC?.score ? parseInt(homeC.score) : null,
      away: awayC?.score ? parseInt(awayC.score) : null,
      status: mapEspnStatus(ev.status?.type?.state),
      minute: ev.status?.displayClock ? parseInt(ev.status.displayClock) : undefined,
    };

    return {
      id: `espn-${ev.id}`,
      round: ev.season?.slug ?? "Group Stage",
      date: ev.date.substring(0, 10),
      time: ev.date.substring(11, 16),
      venue: comp?.venue?.fullName ?? "TBD",
      city: comp?.venue?.address?.city,
      broadcasters: comp?.broadcasts?.flatMap((b: any) => b.names) ?? [],
      team1: {
        name: homeC?.team?.displayName,
        code: homeC?.team?.abbreviation,
        logoUrl: homeC?.team?.logo,
      },
      team2: {
        name: awayC?.team?.displayName,
        code: awayC?.team?.abbreviation,
        logoUrl: awayC?.team?.logo,
      },
      score,
      source: "espn",
      lastUpdated: new Date().toISOString(),
    };
  });
}

function mapEspnStatus(state?: string): MatchScore["status"] {
  switch (state) {
    case "pre": return "scheduled";
    case "in": return "live";
    case "post": return "finished";
    default: return "scheduled";
  }
}

export async function fetchEspnStandings() {
  // Endpoint distinto: /apis/v2/ (NO /apis/site/v2/)
  const url = "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings";
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`ESPN standings failed: ${res.status}`);
  return res.json();
}
```

---

## 6. Capa 3 — football-data.org (`lib/worldcup/footballData.ts`)

```typescript
import type { Match, Standing } from "./types";

const FD_BASE = "https://api.football-data.org/v4";
const FD_TOKEN = process.env.FOOTBALL_DATA_TOKEN!;

// Competition code para FIFA World Cup en football-data.org
const WC_COMPETITION = "WC";

async function fdFetch<T>(path: string, revalidate = 600): Promise<T> {
  const res = await fetch(`${FD_BASE}${path}`, {
    headers: { "X-Auth-Token": FD_TOKEN },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`football-data ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchFdMatches(): Promise<Match[]> {
  const data = await fdFetch<any>(`/competitions/${WC_COMPETITION}/matches`, 600);

  return (data.matches ?? []).map((m: any): Match => ({
    id: `fd-${m.id}`,
    round: m.stage ?? m.matchday ?? "Unknown",
    group: m.group?.replace("GROUP_", ""),
    date: m.utcDate.substring(0, 10),
    time: m.utcDate.substring(11, 16),
    venue: m.venue ?? "TBD",
    team1: { name: m.homeTeam?.name, code: m.homeTeam?.tla, logoUrl: m.homeTeam?.crest },
    team2: { name: m.awayTeam?.name, code: m.awayTeam?.tla, logoUrl: m.awayTeam?.crest },
    score: {
      home: m.score?.fullTime?.home,
      away: m.score?.fullTime?.away,
      status: m.status === "FINISHED" ? "finished" : m.status === "IN_PLAY" ? "live" : "scheduled",
    },
    source: "football-data",
    lastUpdated: new Date().toISOString(),
  }));
}

export async function fetchFdStandings(): Promise<Standing[]> {
  const data = await fdFetch<any>(`/competitions/${WC_COMPETITION}/standings`, 1800);
  const standings: Standing[] = [];

  for (const table of data.standings ?? []) {
    if (table.type !== "TOTAL") continue;
    for (const row of table.table ?? []) {
      standings.push({
        group: table.group?.replace("GROUP_", "") ?? "?",
        position: row.position,
        team: { name: row.team.name, code: row.team.tla, logoUrl: row.team.crest },
        played: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDiff: row.goalDifference,
        points: row.points,
      });
    }
  }
  return standings;
}
```

---

## 7. Capa 4 — API-Football puntual (`lib/worldcup/apiFootball.ts`)

```typescript
import type { Lineup } from "./types";

const AF_BASE = "https://v3.football.api-sports.io";
const AF_KEY = process.env.API_FOOTBALL_KEY!;

// FIFA World Cup 2026 league ID en API-Football (verificar en su dashboard).
// Históricamente WC = 1, season = 2026
const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

async function afFetch<T>(path: string, revalidate = 86400): Promise<T> {
  const res = await fetch(`${AF_BASE}${path}`, {
    headers: { "x-apisports-key": AF_KEY },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`api-football ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * IMPORTANTE: solo llamar para partidos clave en build time o on-demand,
 * porque el free tier es 100 req/día. Cachear permanentemente en Vercel KV.
 */
export async function fetchApiFootballLineup(fixtureId: number): Promise<Lineup[]> {
  const data = await afFetch<any>(
    `/fixtures/lineups?fixture=${fixtureId}`,
    60 * 60 * 24 * 7  // 1 semana
  );

  return (data.response ?? []).map((l: any): Lineup => ({
    matchId: String(fixtureId),
    team: { name: l.team.name, code: l.team.code, logoUrl: l.team.logo },
    formation: l.formation,
    startingXI: (l.startXI ?? []).map((p: any) => ({
      number: p.player.number,
      name: p.player.name,
      position: p.player.pos,
    })),
    substitutes: (l.substitutes ?? []).map((p: any) => ({
      number: p.player.number,
      name: p.player.name,
      position: p.player.pos,
    })),
  }));
}

export async function fetchApiFootballFixtures() {
  return afFetch<any>(
    `/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
    60 * 60 * 6 // 6h
  );
}
```

---

## 8. Capa 5 — TheSportsDB para logos (`lib/worldcup/sportsdb.ts`)

```typescript
const SDB_BASE = `https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_KEY ?? "123"}`;
const WC_LEAGUE_ID = "4429"; // FIFA World Cup

export async function fetchTeamArtwork(teamName: string) {
  const res = await fetch(`${SDB_BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`, {
    next: { revalidate: 60 * 60 * 24 * 30 }, // 30 días
  });
  if (!res.ok) return null;
  const data = await res.json();
  const team = data.teams?.[0];
  if (!team) return null;
  return {
    badge: team.strTeamBadge,    // logo
    banner: team.strTeamBanner,
    fanart: team.strTeamFanart1,
    jersey: team.strTeamJersey,
  };
}
```

---

## 9. Caché con Vercel KV (`lib/worldcup/cache.ts`)

```typescript
import { kv } from "@vercel/kv";

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const hit = await kv.get<T>(key);
    if (hit !== null && hit !== undefined) return hit;
  } catch {
    // si KV falla, seguimos al fetcher
  }

  const fresh = await fetcher();

  try {
    await kv.set(key, fresh, { ex: ttlSeconds });
  } catch {
    // ignore — el dato igual se devuelve
  }

  return fresh;
}
```

---

## 10. Agregador inteligente (`lib/worldcup/aggregator.ts`)

```typescript
import { fetchOpenFootballSchedule } from "./openfootball";
import { fetchEspnScoreboard, fetchEspnStandings } from "./espn";
import { fetchFdMatches, fetchFdStandings } from "./footballData";
import { cached } from "./cache";
import type { Match, Standing } from "./types";

/**
 * Merge inteligente: usa OpenFootball como base, sobreescribe con ESPN
 * (que trae scores), y si ESPN falla cae a football-data.org.
 */
export async function getAllMatches(): Promise<Match[]> {
  return cached("wc2026:matches:all", 60, async () => {
    const base = await fetchOpenFootballSchedule();

    let live: Match[] = [];
    try {
      live = await fetchEspnScoreboard({ revalidate: 30 });
    } catch (err) {
      console.warn("[wc2026] ESPN failed, falling back to football-data", err);
      try {
        live = await fetchFdMatches();
      } catch (err2) {
        console.error("[wc2026] All live sources failed", err2);
      }
    }

    // Merge por (date + team1 + team2)
    const liveIndex = new Map<string, Match>();
    for (const m of live) {
      const key = matchKey(m);
      liveIndex.set(key, m);
    }

    return base.map((m) => {
      const liveMatch = liveIndex.get(matchKey(m));
      if (!liveMatch) return m;
      return {
        ...m,
        ...liveMatch,
        // Conservar venue de OpenFootball si ESPN no lo tiene
        venue: liveMatch.venue !== "TBD" ? liveMatch.venue : m.venue,
        source: liveMatch.source,
      };
    });
  });
}

function matchKey(m: Match): string {
  const t1 = normalize(m.team1.name);
  const t2 = normalize(m.team2.name);
  const teams = [t1, t2].sort().join("-");
  return `${m.date}-${teams}`;
}

function normalize(s: string = ""): string {
  return s.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export async function getStandings(): Promise<Standing[]> {
  return cached("wc2026:standings", 1800, async () => {
    try {
      return await fetchFdStandings();
    } catch {
      // Si fd falla, devolver array vacío (página puede mostrar "actualizando")
      return [];
    }
  });
}
```

---

## 11. API Routes Next.js

### `app/api/worldcup/fixtures/route.ts`

```typescript
import { getAllMatches } from "@/lib/worldcup/aggregator";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const matches = await getAllMatches();
    return NextResponse.json({ matches, count: matches.length });
  } catch (err) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}
```

### `app/api/worldcup/standings/route.ts`

```typescript
import { getStandings } from "@/lib/worldcup/aggregator";
import { NextResponse } from "next/server";

export const revalidate = 1800;

export async function GET() {
  const standings = await getStandings();
  return NextResponse.json({ standings });
}
```

### `app/api/worldcup/match/[id]/route.ts`

```typescript
import { fetchApiFootballLineup } from "@/lib/worldcup/apiFootball";
import { cached } from "@/lib/worldcup/cache";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  // Cachear permanentemente — solo se llama on-demand y rara vez.
  const lineup = await cached(
    `wc2026:lineup:${params.id}`,
    60 * 60 * 24 * 30, // 30 días
    () => fetchApiFootballLineup(Number(params.id))
  );
  return NextResponse.json({ lineup });
}
```

---

## 12. Estrategia de caché

| Recurso | Fuente | ISR | KV TTL | Razón |
|---|---|---|---|---|
| Fixtures base (calendario) | OpenFootball | 6h | — | Cambia rara vez |
| Live scoreboard | ESPN | 30s | 60s | Balance entre frescura y rate-friendly |
| Standings | football-data | 30min | 30min | 10 req/min ajustado |
| Lineups | API-Football | — | 30 días | 100 req/día — cachear permanente |
| Logos/banderas | TheSportsDB | 30 días | 30 días | Estáticos |

**Truco clave:** Durante un partido en vivo, hacer un único pull cada 30s desde un cron job (`/api/cron/worldcup-live`) y guardar en KV. El frontend lee de KV con SWR para UI reactiva sin pegarle a ESPN desde cada visitante.

```typescript
// app/api/cron/worldcup-live/route.ts
import { fetchEspnScoreboard } from "@/lib/worldcup/espn";
import { kv } from "@vercel/kv";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const matches = await fetchEspnScoreboard({ revalidate: 0 });
  await kv.set("wc2026:live", matches, { ex: 90 });
  return Response.json({ ok: true, count: matches.length });
}
```

Y en `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/worldcup-live", "schedule": "*/1 * * * *" }
  ]
}
```

---

## 13. Plan B — Si la API recomendada cae

| Si falla… | Fallback |
|---|---|
| ESPN hidden API | Cae a football-data.org automáticamente en aggregator |
| football-data.org | OpenFootball cubre el calendario base; standings se ocultan con mensaje |
| OpenFootball (GitHub raw) | jsDelivr CDN como mirror automático (ya implementado) |
| API-Football (lineups) | UI muestra "Alineación no disponible" + link a fuente externa |
| TheSportsDB | Fallback a logos genéricos (banderas Unicode emoji o SVG hosted en /public) |
| Vercel KV cae | `cached()` ya tiene try/catch y degrada al fetcher directo |

---

## 14. Estimación de costo si crecemos

| Tráfico | Stack | Costo mensual |
|---|---|---|
| < 10k visitantes/día | Free combo actual | **USD 0** |
| 10k-50k visitantes/día | Free combo + Vercel Pro | **USD 20** (solo Vercel) |
| 50k-200k visitantes/día | + API-Football Pro (7.500 req/día) | **USD 39** |
| 200k-1M visitantes/día | + BALLDONTLIE ALL-STAR (heatmaps/xG) | **USD 49** |
| > 1M visitantes/día | Sportmonks WC2026 Special EUR 69 + Vercel Enterprise | **USD ~150+** |

**Punto de quiebre:** Hasta ~50k visitantes/día durante el Mundial con caché agresiva, el stack gratuito alcanza sobradamente. El upgrade más rentable es **API-Football Pro USD 19/mes** que destraba lineups en vivo de todos los partidos.

---

## 15. Checklist de lanzamiento

- [ ] Registrar account en football-data.org → guardar token en Vercel env
- [ ] Registrar account en api-sports.io (NO RapidAPI) → guardar key en Vercel env
- [ ] Habilitar Vercel KV en el proyecto → variables auto-inyectadas
- [ ] Configurar `CRON_SECRET` en Vercel
- [ ] Crear cron job `/api/cron/worldcup-live` en `vercel.json`
- [ ] Pre-cachear logos/banderas de 48 selecciones en Vercel Blob (one-time script)
- [ ] Implementar fallback UI para cada capa
- [ ] Smoke test antes del 11-jun-2026: pegarle a `/api/worldcup/fixtures` y validar 80 partidos

---

## 16. Respuestas finales

### ¿Cuál es la MEJOR API gratuita para Mundial 2026 hoy?
**ESPN hidden API** (`fifa.world`) es la más completa en datos (fixtures + scores + venues + broadcasters + standings sin auth), pero **OpenFootball worldcup.json** es la más segura legalmente. La respuesta correcta es **combinar ambas**.

### ¿Hay alguna combinación óptima?
Sí: **OpenFootball (base estática) + ESPN (live) + football-data.org (backup oficial) + API-Football (lineups puntuales) + TheSportsDB (assets)**. Cero costo, redundancia real, cobertura completa.

### ¿Vale la pena scraping de fbref/Transfermarkt?
**No.** Riesgo legal alto (TOS), anti-bot creciente, mantenimiento constante, y las APIs combinadas cubren ~95% del caso de uso de Nebbuler. Solo considerar fbref para análisis post-evento (ya con scores oficiales en BD).

### Si todas las APIs gratuitas fueran insuficientes, ¿costo mínimo realista?
- **USD 19/mes** — API-Football Pro (7.500 req/día, lineups + stats avanzados en vivo).
- **USD 39.99/mes** — BALLDONTLIE GOAT (heatmaps, xG, shot maps).
- **EUR 69/mes** — Sportmonks WC2026 Special (enterprise con SLA).

Para Nebbuler, el upgrade más razonable es **USD 19/mes a API-Football Pro** si superamos los 50k visitantes/día.
