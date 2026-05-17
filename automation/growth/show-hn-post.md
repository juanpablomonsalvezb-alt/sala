# Show HN — Plan de lanzamiento

## Cuándo postear

**Mejor ventana:** martes/miércoles, **6:00–7:30 AM ET** (= 8:00–9:30 AM Santiago/Buenos Aires; 7:00–8:30 AM CDMX/Bogotá).

**Por qué:** HN front page se construye en las primeras 1–2 horas. A esa hora despiertan los SF/NYC tech workers + ya estás dentro del horario LATAM (perfecto para que los comentarios vengan de tu propia audiencia).

**Evitar:** lunes (saturado), viernes-domingo (poco tráfico), fechas con anuncios de Apple/Google/OpenAI.

## Título (el 80% del éxito)

**Opción A (recomendada):**
```
Show HN: Nebbuler – Substack alternative for Latin America (local currencies, 0% commission)
```

**Por qué funciona:**
- "Show HN" obligatorio para que vaya a la categoría correcta.
- "Substack alternative" — keyword reconocida, audiencia global la entiende.
- "for Latin America" — diferenciador geográfico, no compite con Substack.
- Paréntesis con specs concretos = HN ama specs.
- 65 caracteres (HN trunca a ~80).

**Opción B (más provocadora):**
```
Show HN: We built a Substack that actually works in pesos
```

**Opción C (más técnica):**
```
Show HN: Nebbuler – Membership platform for LATAM creators on MercadoPago Connect
```

## URL

`https://nebbuler.com` (homepage).

NO usar `https://nebbuler.com/?ref=hn` ni nada. HN castiga tracking.

## Texto del post (cuerpo)

```
Hi HN,

I built Nebbuler — a subscription / membership platform for Latin American creators. Think Substack, but with payments in COP, MXN, ARS, PEN, CLP, etc., and a flat monthly fee instead of variable commission on the creator's income.

Why: every existing platform (Substack, Patreon, Beehiiv, Gumroad) charges in USD. A reader in Bogotá paying $5 USD to subscribe to a Colombian newsletter ends up paying ~7.000 COP after FX + 3-5% international card surcharge from their bank. Conversion drops 30-50%. And the creator loses 10% to Substack on top.

Nebbuler's model: creator pays a flat ~$30/mo platform fee (think Memberful), keeps 100% of subscriber revenue minus processor fees. Pays out in local currency. Available in 18 LATAM countries.

Stack:
- Next.js 14 App Router + TypeScript
- Supabase (Postgres + Auth + RLS)
- MercadoPago Connect for OAuth marketplace + Stripe for non-MP countries
- Vercel
- 100% Spanish-language

Some technical things that were harder than expected:
- MP webhook idempotency (their webhook fires payment.created + payment.approved with the same data.id but different x-request-id — we discovered this hard way)
- Column-level RLS in PostgREST doesn't actually work — had to move OAuth tokens to a separate table with strict RLS
- Stripe Price objects accumulate forever if you create one per checkout (cached now)

The hard problem isn't technical though — it's distribution. No platform that competes with Substack for the global market has cracked the Spanish-speaking creator economy. I think the gap is real and big.

What I'd love feedback on:
1. Anyone building creator tools for non-English markets? What works for distribution?
2. Pricing — is "flat $30/mo + 0% commission" understandable for creators used to "10% of revenue"?
3. Anything obviously stupid I'm missing in the technical architecture?

Live at https://nebbuler.com — and there's an `/llms.txt`, `/calculadora` (interactive calculator comparing Nebbuler vs Substack vs Patreon), and `/vs/[competitor]` pages for the SEO nerds.
```

**Largo:** ~330 palabras — el sweet spot de HN (300–500). Más corto = parece flojo. Más largo = no se lee.

## Respuestas anticipadas (10 preguntas que te van a hacer)

Tener estas listas en un .txt al lado. Cuando pase algo en HN, responder en <5 min duplica el ranking.

### 1. "Why not just use Stripe?"
> Stripe doesn't operate (or operates with severe limitations) in Argentina, Venezuela, Bolivia, Cuba, Paraguay. Even where it does, the creator's payouts are in USD — they have to do FX themselves, which in some countries means losing 20-40% on the parallel exchange rate. MercadoPago + local processors solve this by paying out in local currency to local bank accounts.

### 2. "What's the moat?"
> Honest answer: there isn't a defensible technical moat. The moat is distribution + tax/compliance work per country + relationships with creators who already trust the brand in their local language. I'm not pretending this is a Stripe-killer. It's a Substack-for-LATAM, which is a much smaller TAM but uncontested.

### 3. "How big is the market?"
> Mobility Foresights estimates LATAM creator economy at ~$38B in 2022, projected $112B by 2030, 19.7% CAGR. The subset that's "professionals selling knowledge via memberships" is probably 5-10% of that. So talking ~$2-10B market, growing.

### 4. "Have you talked to actual creators?"
> Yes — 23 conversations over the last 3 months with Spanish-language newsletter writers, finance analysts, coaches, lawyers who publish. The #1 complaint about Substack was payment friction, not the platform itself. #2 was discoverability for Spanish content among Substack's English-default audience.

### 5. "Pricing seems weird — why not just take a cut?"
> Two reasons: (1) Creator economics. A 10% cut on a $1000/mo creator = $100. A $30 flat fee scales infinitely better for serious creators and is fair. (2) Trust. Variable commission creates adversarial dynamics ("am I being charged the right %?"). A flat invoice is transparent.

### 6. "What about Brazil?"
> Brazil is portuguese + has its own creator economy giants (Hotmart, Eduzz). Different market dynamics. We're focused on Spanish-speaking LATAM for now (18 countries) — going to Brazil would mean a separate localization + Hotmart competition. Maybe later.

### 7. "How do you handle tax compliance per country?"
> The creator is responsible for their own taxes (we're not a marketplace under most jurisdictions because we don't collect/remit on their behalf — they're the merchant of record). We provide them with monthly invoices and yearly summaries by currency. The platform fee from us to them is treated as a normal SaaS subscription.

### 8. "Why not open source it?"
> Considered it. Open sourcing might help with developer trust. The codebase is mostly Next.js + Supabase + payment integrations — nothing exotic. I'm undecided. Open to thoughts.

### 9. "How did you handle MercadoPago Connect's OAuth?"
> Painfully. Their docs are sparse and don't reflect recent API changes. Wrote a tear-down here: [link to a future blog post about MP Connect implementation details]. Key gotchas: webhook idempotency needs `x-request-id` (not just `data.id`), `normInvitations` returns internal status 301 for restricted accounts, REVOKE column-level grants don't work in PostgREST.

### 10. "Is this a YC / VC-backed thing?"
> No. Bootstrapped. Single founder. The product is live, paying customers will start trickling in this quarter. Not raising right now — we'll see what the model needs.

## Lo que NO hacer en HN

❌ Pedir upvotes en Twitter/X — HN penaliza (detecta clusters de upvotes desde el mismo origen).
❌ Múltiples cuentas. HN tiene detección agresiva. Te banean para siempre.
❌ Responder defensivamente a críticas. Reconocer puntos válidos = audiencia respeta.
❌ Postear y desaparecer. HN espera presencia activa del founder en comentarios las primeras 4 horas.
❌ Llenar el post de emojis o markdown. HN tiene formato muy crudo.

## Métricas esperadas

**Realista (no front page):**
- 100-500 views directos
- 5-20 upvotes
- 2-5 comentarios
- 10-30 visitas reales a nebbuler.com

**Si pega front page (top 30):**
- 5.000-30.000 views
- 100-500 upvotes
- 30-100 comentarios
- 1.000-5.000 visitas
- Backlinks de blogs tech que reescriben Show HN (Indie Hackers, Hacker Noon, dev.to)
- 1-2 inquiries de inversores/partners

**Frecuencia de pegar front page con Show HN:** ~10% si el producto es interesante + título bien hecho + horario correcto. **No es lotería pura.**

## Plan B — Indie Hackers

Si HN no funciona, postear la **misma noche** en https://www.indiehackers.com/post/launch con el mismo texto adaptado. IH tiene una audiencia más enfocada en SaaS bootstrapped, menos hostil que HN. Tasa de viralidad menor pero más backlinks de calidad.
