# IndieHackers — Product + Post "How I built Nebbuler"

## URLs clave
- **Agregar producto:** https://www.indiehackers.com/products/new
- **Comunidad:** https://www.indiehackers.com/group/creators
- **Build Board (daily leaderboard):** https://www.indiehackers.com/buildboard

---

## Parte 1 — Producto en /products

### Nombre
`Nebbuler`

### Tagline (60 chars)
`Membership platform built for Latin American creators`

### Website
`https://nebbuler.com`

### Logo
256x256px mínimo, recomendado 512x512px PNG transparente.

### Descripción
```
Nebbuler is the Spanish-speaking alternative to Substack and Patreon. We let LATAM creators charge their audience in local currency (COP, MXN, ARS, CLP, PEN, BRL) via MercadoPago — instead of forcing USD checkouts that kill conversion by 8-15%. 0% fees the first 6 months, Spanish-language support, free audience export.
```

### Categoría
**SaaS** + **Creator Tools** + **Content / Media**

### Revenue (opcional — solo si querés flexear)
Empezar en `Stealth` o `<$1k MRR`. Actualizar mensualmente.

### Tech stack tags
Next.js, TypeScript, Supabase, MercadoPago, Vercel, Tailwind CSS

---

## Parte 2 — Post "How I Built Nebbuler" (800 palabras)

**Título:** `How I built Nebbuler — a Substack alternative for Latin America that charges in local currency`

**Categoría:** Starting Up / Building

**Body:**

```markdown
## The problem nobody in San Francisco sees

I'm Juan Pablo, from Chile. For two years I watched friends — newsletter writers, podcasters, educators with real audiences in Spanish — try to monetize on Substack, Patreon, and Beehiiv. Every single one hit the same wall:

**Their audience couldn't pay them.**

Not because nobody wanted to subscribe. But because:
- Substack charges in USD. A Colombian fan sees "$5/month" and his bank charges him 4.500 pesos plus a 3% international fee plus a foreign-transaction warning that scares him off the checkout.
- Patreon doesn't accept most LATAM debit cards. Period.
- MercadoPago, the dominant payment method across 9 LATAM countries, is supported by literally zero of the big creator platforms.

Conversion rate on those platforms for a LATAM audience? **Single digits.** I measured it. A friend with 18.000 newsletter subscribers in Mexico had 47 paying subs on Substack. 0.26% conversion. He should have had 360.

So I built Nebbuler.

## What it is

Nebbuler is a membership + newsletter + paywall platform that looks and feels like Substack — but the entire payment layer is rebuilt around LATAM:

- **Pagos en moneda local** (COP, MXN, ARS, CLP, PEN, BRL) via MercadoPago, Khipu (Chile), and PSE (Colombia)
- Checkout in 3 clicks, with the user's local card, transfer, or even cash voucher (OXXO in Mexico, Rapipago in Argentina)
- Newsletter + paywall + member-only content + podcast hosting in one dashboard
- 0% commission first 6 months, 5% after
- Spanish-speaking human support (not a chatbot routing tickets to Manila)
- Free CSV export of your subscribers anytime — no lock-in

## The stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** for auth, Postgres, RLS, and storage
- **MercadoPago** SDK for payments (webhooks the most painful part — partial captures, IPN duplicates, currency rounding edge cases on the Argentine peso… don't get me started)
- **Resend** for transactional + newsletter email at 1c per send
- **Tailwind + shadcn/ui** for the UI
- **Vercel** for hosting, edge functions for the paywall middleware

The whole thing is ~12k lines of TypeScript. Built solo in 4 months while consulting on the side.

## The pricing bet

I went against every SaaS playbook. Instead of charging US$29/month flat, I do:

- **0% commission for the first 6 months** (yes, zero)
- **5% after that** (vs Substack's 10%, Patreon's 8-12%)
- Optional Pro plan at **US$19/month** for white-label + custom domain + advanced analytics

Why give away revenue? Because the bottleneck isn't margin — it's trust. LATAM creators have been burned by every US platform that launched, ignored them, then sunset the Spanish dashboard. Six months of free comm is my way of saying "we're not going anywhere, prove it works for you first."

## Early traction

I soft-launched 6 weeks ago to my personal network. Numbers as of today:
- **187** creators signed up
- **23** activated (publishing weekly)
- **US$1.840** in GMV processed in May
- **9** paid Pro subscriptions

Tiny. Real. Growing 30% week-over-week.

## What I'm doing now

Three things this month:
1. **Submitting to every directory that matters** (AlternativeTo, Product Hunt, this post 🫡)
2. **Reaching out to top Spanish newsletter writers** for migration assistance — I import their Substack subscribers for free
3. **Building an "import from Substack" wizard** — one click, 24h migration

## What I want from you, IH community

- If you've built or are building a creator platform: what was your biggest payment integration nightmare?
- If you're a LATAM creator on Substack/Patreon: would love to hear your conversion data
- Roasts welcome on the landing page → nebbuler.com

Cheers from Santiago.

— JP
```

---

## Posts de seguimiento (programar)

- **Semana 2:** "First US$1k MRR — what worked"
- **Semana 4:** "Why I'm giving away 6 months of commission (and the math behind it)"
- **Mes 2:** "The MercadoPago webhook nightmare: 7 edge cases nobody warned me about"
- **Mes 3:** "From 187 to 1.000 creators: cohort analysis"

## Hashtags / Groups donde repostear
- /group/creators
- /group/starting-up
- /group/saas
- /group/landing-page-feedback
- /group/marketing
