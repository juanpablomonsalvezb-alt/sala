# Show HN: Nebbuler – Substack for Latin America, paid in local currency

## Título (copiar/pegar al submit)

```
Show HN: Nebbuler – Substack for Latin America, paid in local currency
```

(78 chars, dentro del límite de HN)

## URL

https://nebbuler.com

## Texto del post (opcional en Show HN, dejarlo vacío y poner todo en el primer comentario)

Vacío. HN penaliza posts con texto + URL. La explicación va en el primer comentario.

---

## Primer comentario del fundador (publicar inmediatamente después del submit)

Hi HN, Juan Pablo here, solo founder building this from Santiago, Chile.

Quick context on why this exists: Substack and Patreon both charge 8–12% and only payout in USD. For a creator in Argentina or Colombia, that means: (1) Stripe doesn't operate in half the region, (2) the ones that get paid eat a 30–40% FX spread when converting to local currency, (3) most of their readers literally can't subscribe because international cards get blocked or rejected. I ran the numbers across the 18 Spanish-speaking countries and the average LATAM creator on Substack loses about US$4,200/year just to fees + FX. That's the wedge.

Nebbuler integrates MercadoPago (the dominant LATAM processor) so payments happen in COP, MXN, ARS, CLP, PEN natively. No FX leak. Subscribers pay with whatever card their local bank issued them.

**Stack, since this is HN:**

- Next.js 14 App Router + TypeScript, deployed on Vercel
- Supabase (Postgres + Auth + RLS), MercadoPago for payments
- Edge functions for webhook signature verification
- Resend for transactional, ~200ms cold start budget
- Tailwind + shadcn/ui for the UI, no design system bloat

**The part I think is actually interesting technically:**

I built a programmatic SEO pipeline that generates 950+ pages (one per city/profession/salary-band intersection across LATAM) seeded by a public CC-BY salary dataset I curated. Each page is statically generated at build, pushed via IndexNow to Bing/Yandex on deploy, and there's a parallel AEO (Answer Engine Optimization) layer: structured `schema.org/FAQPage` + `llms.txt` + a daily-regenerated `/trends` observatory that I feed to Gemini 2.0 Flash to produce JSON-LD-friendly summaries the LLMs actually quote. It's the first time I've seen ChatGPT cite a 2-week-old domain in answers, so I'm cautiously optimistic the AEO loop works.

The dataset is open and free here if anyone wants it: nebbuler.com/dataset (CC-BY).

**Honest metrics, because Show HN deserves them:**

- 0 paying creators
- 1 (one) unique visitor in the last 48h before this post
- MRR: $0
- Monthly infra cost: ~US$24 (Vercel Pro + Supabase Pro + Resend free)
- ~6 weeks of nights and weekends to ship v1

I know "0 users" is not a great pitch. I'm posting because I'd rather get torn apart on HN now than after I've spent another 6 months. Specific things I'd love feedback on:

1. Does the AEO pipeline actually make sense or am I cargo-culting? Anyone here measured LLM citation lift from `llms.txt` + structured data?
2. MercadoPago's webhook idempotency is genuinely painful — anyone solved this elegantly without a Redis lock?
3. Is "0% commission for the first 6 months" the right hook or is it just discounting the value away?

Happy to answer anything. Code, decisions, dumb mistakes — all of it.
