# Auditoría de APIs gratuitas de estadísticas de fútbol — Mundial 2026

> Investigación 2026-05-22 · Auditoría de 12+ APIs · Verificación en vivo de ESPN hidden + OpenFootball

---

## TL;DR — Stack ganador (100% gratis, listo para producción)

1. **OpenFootball worldcup.json** — Base de fixtures, grupos y bracket (CC0, sin API key, 80 partidos del Mundial 2026 ya cargados)
2. **ESPN hidden API (`fifa.world`)** — Live scores, venues, broadcasters (verificado en vivo: devuelve "Mexico vs South Africa, 11-jun-2026, Estadio Banorte")
3. **football-data.org free tier** — Backup oficial con licencia clara para standings (FIFA WC en lista "free forever")
4. **API-Football (100/día)** — Solo para lineups puntuales cacheados en KV
5. **TheSportsDB (key=123)** — Logos y banderas de selecciones

---

## Tabla comparativa completa

| API | Free tier real | Rate limit | Cubre WC 2026 | Live scores | Lineups | Stats | CORS | Comercial |
|---|---|---|---|---|---|---|---|---|
| **OpenFootball worldcup.json** | Sí (CC0) | Ilimitado | Sí (80 partidos, grupos A-L) | No | No | No | Sí | Sí |
| **ESPN hidden API** | Sí (no oficial) | Sin límite publicado | Sí (verificado) | Sí | Parcial | Limitado | Sí | Zona gris |
| **football-data.org** | Sí "forever" | 10 req/min | Sí | Delayed | No (paid) | No (paid) | Server-side | Sí con attribution |
| **API-Football** | Sí | **100 req/día** | Sí | Sí | Sí | Sí | Sí | Sí |
| **TheSportsDB v1** | Sí (key 123) | ~2 req/seg | Sí (liga 4429) | No (v2 paid) | No | No | Sí | Sí |
| **BALLDONTLIE FIFA** | Sí muy limitada | 5 req/min (solo Teams/Stadiums) | Sí | No (free) | No (free) | No (free) | Sí | Sí |
| **OpenLigaDB** | Sí | Sin límite | **No** (solo Alemania) | — | — | — | Sí | Sí |
| **Sportmonks** | No (14 días) | — | Sí | Sí | Sí | Sí + xG | Sí | EUR 69/mes |
| **StatsBomb Open Data** | Sí | — | **No** (solo históricos cerrados) | — | — | — | — | Sí |
| **fbref/Sofascore/Transfermarkt** | Scraping | Variable + bans | Sí | Variable | Variable | Variable | No | **Prohibido por TOS** |
| **FIFA.com API pública** | **No existe** | — | — | — | — | — | — | Solo via Opta/Sportradar enterprise |
| **UEFA/CONMEBOL APIs** | **No públicas** | — | — | — | — | — | — | — |

---

## APIs que NO sirven en 2026 (descartadas con razón)

- **FIFA.com API oficial**: no existe pública. FIFA distribuye vía Opta/Sportradar con contratos enterprise (USD 10K+/mes mínimo).
- **UEFA/CONMEBOL APIs**: no son públicas y no cubren Mundial.
- **StatsBomb Open Data**: solo torneos históricos cerrados, NO live Mundial 2026.
- **Sportmonks "free trial"**: 14 días, no es free tier real.
- **Live-Score-API "free"**: también es trial de 14 días.
- **Wrappers tipo worldcupapi.com / statorium / WC2026API**: son re-empaquetados de las mismas fuentes. Sin valor agregado sobre ir directo.

---

## El hallazgo verificado en vivo

**ESPN hidden API funciona y devuelve datos reales del Mundial 2026:**

- Endpoint: `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard`
- Sin auth, devuelve eventos con venues (Estadio Banorte, Estadio Akron), broadcasters (FOX, FS1, Peacock, Tele), logos de equipos, odds de DraftKings.
- Para standings usar `/apis/v2/` (NO `/apis/site/v2/`, ese devuelve vacío).
- Slugs útiles: `fifa.world` (Mundial), `fifa.worldq` (qualifiers), `fifa.friendly` (amistosos).

**Es la pieza clave del stack — datos calidad enterprise sin pagar.**

---

## Por qué NO scraping

| Fuente | Veredicto |
|---|---|
| fbref | OK para análisis post-evento, NUNCA en runtime |
| Sofascore | TOS prohibido, riesgo de ban + demanda |
| Transfermarkt | TOS muy estricto, demandas históricas |
| WhoScored | Anti-bot agresivo, requiere Selenium |

ESPN + football-data.org cubren ~95% del caso de uso sin riesgo legal. Scraping no compensa.

---

## Estrategia de caché recomendada

| Recurso | Fuente | ISR Vercel | KV TTL |
|---|---|---|---|
| Fixtures base | OpenFootball | 6h | — |
| Live scoreboard | ESPN | 30s | 60s |
| Standings | football-data | 30min | 30min |
| Lineups | API-Football | — | **30 días** (crítico por límite 100/día) |
| Logos/banderas | TheSportsDB | 30 días | 30 días |

**Truco clave:** Un único cron job cada 1 minuto pegándole a ESPN, guardando en Vercel KV. Todos los visitantes leen de KV (no de ESPN). Esto absorbe cualquier rate limit y blinda contra caída de ESPN.

---

## Costo si escalamos

| Tráfico | Costo mensual |
|---|---|
| < 10k visitantes/día | **USD 0** |
| 10-50k | **USD 20** (Vercel Pro) |
| 50-200k | **USD 39** (+ API-Football Pro 7.500 req/día) |
| 200k-1M | **USD 49** (+ BALLDONTLIE ALL-STAR) |
| > 1M | **USD ~150** (Sportmonks Special EUR 69 + Vercel Enterprise) |

**Punto de quiebre real:** hasta 50k visitantes/día con caché agresiva, el stack 100% gratis alcanza. El upgrade más rentable es API-Football Pro a USD 19/mes.

---

## Respuestas finales

1. **¿Mejor API gratuita HOY para WC 2026?** ESPN hidden API (`fifa.world`) por completitud de datos, **combinada con** OpenFootball worldcup.json para tener un esqueleto legalmente blindado (CC0).

2. **¿Combinación óptima?** Sí: OpenFootball (base) + ESPN (live) + football-data.org (backup oficial) + API-Football (lineups puntuales) + TheSportsDB (assets). Cero costo, redundancia real, cobertura completa.

3. **¿Vale la pena scraping fbref/Transfermarkt?** No. Riesgo legal alto, mantenimiento constante, APIs combinadas cubren ~95% del caso. Solo fbref para análisis post-evento ya escritos en BD propia.

4. **¿Costo mínimo realista si gratis no alcanza?** USD 19/mes (API-Football Pro, 7.500 req/día con lineups + stats vivos). Es el upgrade obvio.

---

## Sources

- [football-data.org policies](https://docs.football-data.org/general/v4/policies.html)
- [football-data.org pricing](https://www.football-data.org/pricing)
- [API-Football pricing](https://www.api-football.com/pricing)
- [API-Sports Football v3 docs](https://api-sports.io/documentation/football/v3)
- [TheSportsDB free API](https://www.thesportsdb.com/free_sports_api)
- [OpenFootball worldcup.json](https://github.com/openfootball/worldcup.json)
- [BALLDONTLIE FIFA API](https://fifa.balldontlie.io/)
- [Public ESPN API repo](https://github.com/pseudo-r/Public-ESPN-API)
- [ESPN soccer endpoints](https://github.com/pseudo-r/Public-ESPN-API/blob/main/docs/sports/soccer.md)
- [ESPN hidden API gist](https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b)
- [Sportmonks WC 2026 API](https://www.sportmonks.com/football-api/world-cup-api/)
- [soccerdata library](https://github.com/probberechts/soccerdata)
