# How I'm building Substack for Latin America (transparent metrics inside)

**Plataforma:** IndieHackers
**Categoría:** Starting Up
**Tags:** founder-story, latam, creator-economy, transparency

---

## Título

How I'm building Substack for Latin America (transparent metrics inside)

## Cuerpo

Six weeks ago I had a frustrating conversation with a friend in Buenos Aires. She writes a really good Spanish-language newsletter about behavioral economics — like, genuinely good, 3k engaged readers good — and she was telling me she'd given up trying to charge for it.

Not because nobody wanted to pay. People wanted to pay. The problem was that Substack pays out in USD via Stripe, Stripe doesn't fully operate in Argentina, and the workaround (Stripe Atlas + a US LLC + a Wise account) was both expensive and, in her words, "a paperwork nightmare I'd rather not do for 200 bucks a month." So she just… didn't monetize. Three thousand readers, zero dollars.

I started asking around and the pattern was everywhere. A guy in Bogotá running a fintech newsletter, a woman in Mexico City with a parenting podcast, a friend in Lima doing political analysis. All of them had the same story: the international platforms technically work, but the friction is enough that 90% of LATAM creators just don't bother charging.

I ran some rough math. The average LATAM creator who *does* push through the friction loses about US$4,200/year to Stripe fees (2.9% + $0.30), Substack/Patreon's cut (8–12%), and FX spread when converting USD to their local currency (typically 4–7% via Wise, much worse via local banks). That's not a rounding error. That's rent.

So I built Nebbuler.

### What it is

A membership platform for LATAM creators that processes payments in local currency through MercadoPago (the dominant regional processor — think Stripe but it actually works in Argentina, Colombia, Mexico, Chile, Peru, Uruguay). Creators set their price in their local currency, subscribers pay with whatever card their local bank gave them, money lands in a local bank account. No FX leak, no Stripe Atlas, no paperwork.

The pitch is boring on purpose: same product as Substack, just one that actually works for half a billion Spanish-speakers.

### The stack (for the curious)

- Next.js 14 (App Router) + TypeScript on Vercel
- Supabase for Postgres, Auth, RLS
- MercadoPago for payments (their webhook API is… let's say it has personality)
- Resend for email
- Tailwind + shadcn/ui
- A homegrown SEO pipeline that generates ~950 programmatic pages

Total infra cost: about US$24/month. I'm solo and I want to stay solo for as long as possible.

### Honest metrics (the part you came for)

- **MRR:** $0
- **Paying creators:** 0
- **Total signups:** a handful of friends I bribed with coffee
- **Unique visitors last 7 days:** 14 (I am not making this number up)
- **Time invested:** ~6 weeks of nights and weekends
- **Cash burned:** about US$180 (domain, infra, one Figma seat I cancelled)
- **Runway:** infinite — I have a day job and this is genuinely the cheapest startup I've ever built

I'm posting these numbers because I think the "shipped my MVP and got 10k users in week one" stories on this forum are mostly survivorship bias and they make the rest of us feel terrible. The reality of going 0 → 1 in a new market is that you sit at 0 for a while. I'm at zero. It's fine.

### What I got wrong already

1. **I built the product before I built the audience.** Classic. I have a beautiful platform and nobody to put on it. If I were doing it again I'd spend weeks 1–4 just DM'ing creators on LinkedIn and Twitter and only build what they explicitly asked for.
2. **I overinvested in SEO.** I built a programmatic SEO engine that produces 950+ pages indexed in Google. It's technically impressive and it has produced exactly 14 visitors. SEO is a 6-month bet minimum. I should have been doing direct outreach in parallel from day one.
3. **I underestimated trust.** LATAM creators have been burned by enough fly-by-night startups that "new platform with 0 creators" is a really hard sell. The 0% commission for 6 months helps, but the real unlock is going to be 3–5 lighthouse creators willing to migrate publicly.

### What I'm doing next (this month)

- 50 personalized DMs to LATAM creators currently on Substack/Patreon
- 1 case-study with a real creator migrating, fully transparent numbers
- Open-sourcing the LATAM salary dataset I built for SEO (it's already CC-BY at nebbuler.com/dataset) to drive top-of-funnel
- Submitting here, HN, Reddit, and a few LATAM tech podcasts

### What I'd love feedback on

- If you've built a marketplace/two-sided platform: how did you get the first 10 suppliers without paying them?
- If you're a creator: what would make you actually consider switching from Substack? Be brutal.
- If you've launched in LATAM: what did I probably miss?

I'll hang out in the comments all week. AMA on stack, decisions, the embarrassing parts. Anything.

URL if you want to poke at it: nebbuler.com

Thanks for reading.
— JP, Santiago, Chile
