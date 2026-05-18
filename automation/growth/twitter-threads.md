# 10 Threads para Twitter/X — listos para programar

> Cada thread = 6-10 tweets. Tono: profesional pero conversacional. Sin emojis spam.
> Programar 1 por día durante 10 días desde la cuenta @nebbuler (o personal del founder).
> Mejor hora LATAM: 9-11am hora local de cada audiencia target.

---

## Thread 1 — "Por qué Substack no funciona en LATAM" (gancho de dolor)

```
1/ Por qué un newsletter en español pierde el 30-50% de su audiencia paga vs uno en inglés. No es la calidad. Es el método de pago.

Hilo. ↓

2/ Substack cobra en USD via Stripe. Un lector en Bogotá que quiere pagar US$5/mes:
  - paga el monto en USD
  - + 1.5-4% recargo internacional de su banco
  - + diferencia entre TC oficial y TC tarjeta
Costo real: 8-15% más alto que el nominal.

3/ ¿Resultado? La tasa de conversión gratuita → paga en español es típicamente 2-3x menor que en inglés. No porque el lector valore menos el contenido. Porque la fricción es real y se siente.

4/ Y al creador, encima, Substack le cobra 10% de comisión variable. A $100/mes en suscripciones, son US$10. A $1.000/mes, US$100. Para siempre.

5/ Lo curioso: este problema no es secreto. Está documentado en testimonios de creadores LATAM en Substack hace 3 años. Pero Substack no localiza porque su TAM en USD es enorme sin nosotros.

6/ Resultado lateral: en LATAM la "creator economy" se concentra en YouTube (ads), Hotmart (cursos one-time) y Instagram (sponsorships). El modelo "suscripción a contenido editorial" — el que en EE.UU. construyó The Free Press y Stratechery — está virtualmente vacío.

7/ Por eso construimos @nebbuler. Tarifa fija ~US$30/mes para el creador. 0% comisión variable. Pagos directos en COP, MXN, ARS, PEN, CLP+. La fricción de pago desaparece.

8/ Lo construimos en 4 meses con Next.js + Supabase + MercadoPago Connect. Está vivo en nebbuler.com. Ahora viene la parte difícil: distribución en un mercado fragmentado.

9/ Si sos profesional hispanohablante y publicás análisis/opinión/insights gratis en LinkedIn esperando algún día monetizar: estamos para vos. nebbuler.com/abrir

Comentarios y feedback bienvenidos.
```

---

## Thread 2 — "Comparativa real Nebbuler vs Substack con números" (visual)

```
1/ Construí un comparador en vivo. Metés cuántos suscriptores tenés y a cuánto cobrás. Te calcula lo que te queda en cada plataforma.

nebbuler.com/calculadora

2/ Con 100 suscriptores pagando US$7/mes:
  Substack: te quedan ~US$580 (10% comisión + Stripe fees)
  Patreon Pro: te quedan ~US$580 (8% comisión + 5% proc)
  Beehiiv: ~US$590 (US$39/mes + Stripe)
  Nebbuler: ~US$670 (US$30/mes fijo)

3/ Con 500 suscriptores: la diferencia se amplía exponencialmente. En Substack pagás US$350/mes en comisiones para siempre. En Nebbuler son US$30 fijos.

4/ El break-even (a partir de dónde Nebbuler te conviene): 4 suscriptores pagos de US$10/mes. Casi cualquier creador serio supera eso en mes 1.

5/ Pero el ahorro nominal no es el gancho. El gancho es la conversión: tu audiencia LATAM se duplica/triplica cuando puede pagar en su moneda.

6/ Probalo tú: nebbuler.com/calculadora

Cualquier feedback sobre supuestos o casos edge, dale.
```

---

## Thread 3 — "Cómo construí Nebbuler en 4 meses solo" (building in public)

```
1/ Construí @nebbuler en 4 meses solo. Stack y decisiones. Sin BS.

2/ Stack:
- Next.js 14 (App Router) + TypeScript
- Supabase (Postgres + Auth + RLS)
- MercadoPago Connect (OAuth marketplace para LATAM)
- Stripe Connect (para creadores con audiencia anglosajona)
- Vercel hosting + Edge Functions para OG dinámicos

3/ Decisiones que tomé bien:
- Schema-first. JSON-LD en cada página desde día 1. Hoy ChatGPT/Claude citan datos del sitio.
- TypeScript strict. Atrapó bugs antes de prod.
- Tests para lógica pura. 26/26 verde antes de cada deploy.

4/ Decisiones que tomé mal:
- Webhook idempotency naïve (solo data.id). MP envía payment.created + payment.approved con mismo data.id. Detecté por verificación post-deploy.
- REVOKE column-level en PostgREST. NO funciona. Tuve que mover tokens OAuth a tabla separada.
- Confiar en migraciones del codebase. Resulta que una nunca se aplicó en prod, columnas no existían. Audit por curl directo lo reveló.

5/ Lo más difícil: distribución. No el código.
El producto se construye en 4 meses. La distribución es 12-24 meses mínimo en un mercado fragmentado como LATAM.

6/ Si te interesa el código de cómo funciona MP Connect + Stripe Connect simultáneamente:
github.com/juanpablomonsalvezb-alt/awesome-latam-creator-economy (no es el código del producto pero hay docs útiles)

7/ Próximo: roadmap público en nebbuler.com/roadmap. Cualquier ojo crítico sobre prioridades, bienvenido.
```

---

## Thread 4 — "Estado de Creator Economy LATAM 2026" (autoridad)

```
1/ Publicamos el primer informe abierto sobre Creator Economy en América Latina 2026.

Bajo licencia CC BY 4.0 — citable, redistribuible, libre.

nebbuler.com/informe-2026

2/ Datos clave:
- Mercado 2022: US$38.500M
- Proyección 2030: US$112.700M
- CAGR 19.7%

Pero el subsegmento "suscripciones a contenido editorial" está virtualmente vacío en español. Eso es la oportunidad.

3/ Fricciones documentadas:
- Cambiaria (8-15% costo extra para el lector LATAM en plataformas USD)
- Procesamiento (Stripe no opera en VE, BO, CU, PY; opera limitado en AR)
- Regulatoria (5 países = 5 estructuras tributarias distintas)

4/ Comparativa de plataformas, completa en el informe:
| Plataforma | Comisión | Moneda local |
| Substack   | 10%      | No |
| Patreon    | 5-12%    | No |
| Beehiiv    | $39/mes  | No |
| Nebbuler   | $30/mes  | Sí (CLP/COP/MXN/ARS/PEN+) |

5/ Si sos periodista cubriendo creator economy o startups LATAM: este informe es para vos. Datos verificables, sin fluff. Casos y entrevistas: prensa@nebbuler.com

6/ El informe es solo el comienzo. Estamos planeando publicar uno trimestral con datos de uso real de Nebbuler (anonimizados). Si te interesa que avisemos: respondé este tweet.
```

---

## Thread 5 — Hot take + datos

```
1/ Hot take: la "creator economy" como categoría está mal definida. Mezclar TikTokers con newsletter writers no ayuda a nadie.

2/ Son dos modelos completamente distintos:
  - INFLUENCERS: monetizan ATENCIÓN → ads, sponsorships, productos. Métricas: vistas, engagement, CPM.
  - CREADORES PROFESIONALES: monetizan EXPERTISE → suscripciones a contenido editorial. Métricas: ARR, retention, churn.

3/ TikTok/Instagram/YouTube son para los primeros. Substack/Patreon/Nebbuler son para los segundos.

4/ El primer grupo tiene un mercado enorme y muchas plataformas. El segundo grupo en LATAM tiene mercado emergente y casi cero plataformas localizadas.

5/ Por eso construimos Nebbuler enfocado en el segundo grupo: profesionales con expertise específica (economistas, abogados, coaches, analistas) que cobran por análisis, no por atención.

6/ ¿Cuál es la diferencia operativa? Un creador profesional puede vivir con 200-500 suscriptores pagos. Un influencer necesita 100K+ followers para algo similar. El primer modelo es más sostenible y democratizable.

7/ Por eso me importa más bajar la fricción de pago (8-15% de leak en LATAM) que pulir el feed algorítmico.

Mañana: "Lo que vimos en 50 conversaciones con creadores LATAM"
```

---

## Thread 6 — Caso de uso real

```
1/ En las últimas 8 semanas tuve 50 conversaciones con creadores hispanohablantes pensando en monetizar. Lo que vi.

2/ Top 3 nichos con disposición REAL a pagar por suscripción:
  - Análisis financiero/macro (economistas, asset managers retirados)
  - Derecho laboral/tributario (abogados publicando análisis)
  - Coaching ejecutivo (gente con LinkedIn 50K+ que ya monetiza con sessions)

3/ Top 3 fricciones que mencionaron sin que les preguntara:
  - "Substack me parece caro para lo que cobro" (10% comisión)
  - "Mis lectores no quieren pagar en dólares"
  - "No sé cómo facturar como creador en mi país"

4/ El 73% mencionó "fricción de pago" como motivo principal por el que aún no monetizan. Solo el 12% dijo "calidad de la audiencia".

5/ Esto es importante: la audiencia EXISTE. El producto TIENE valor. Lo que falta es la infraestructura para conectarlos sin perder 30% en cada transacción.

6/ Lo que están haciendo hoy (en lugar de monetizar):
  - Posts gratis en LinkedIn esperando "algún día"
  - Cursos one-time en Hotmart (sirve, pero no es recurrente)
  - Servicios personales 1-a-1 (no escala)

7/ El modelo que funciona en EE.UU. (newsletter pago) está virtualmente inexplorado en LATAM por falta de infra. No falta demanda. Falta oferta de plataforma.

8/ Eso es Nebbuler. nebbuler.com
```

---

## Thread 7 — Anti-marketing (autenticidad)

```
1/ Estoy lanzando una startup que es una alternativa a Substack para LATAM. Voy a decir las 5 cosas que probablemente debería ocultar pero no.

2/ #1: No tenemos ningún feature técnico que Substack no pueda copiar mañana. Nuestra ventaja es enfoque y velocidad de localización. No es un moat técnico.

3/ #2: Nuestro modelo (tarifa fija vs comisión variable) puede ser peor para nosotros si crecemos muy rápido. Si tenés 10K creadores ganando $10K/mes cada uno, nos perdemos 10% de un montón.

4/ #3: MercadoPago Connect tiene problemas conocidos (refresh tokens, rate limits raros, docs incompletas). Construir sobre su API es elegir un partner imperfecto pero indispensable en LATAM.

5/ #4: La curva de adopción de "newsletter pago" en español va a ser lenta. Probablemente 18-24 meses hasta que veamos los primeros casos de éxito visibles que arrastren al resto.

6/ #5: Soy 1 persona. Sin VC. Construyendo en público. Si la cosa no funciona en 12 meses, vuelvo a trabajar normal. Es una apuesta a un mercado real con riesgo real.

7/ Por qué digo esto: porque la gente está cansada del marketing de startups. Si construyo algo basado en honestidad, gano la audiencia correcta.

Si te suena: nebbuler.com
```

---

## Thread 8 — Para devs (técnico)

```
1/ Para devs construyendo SaaS para LATAM: 5 cosas técnicas que aprendí de la peor manera con MercadoPago Connect.

2/ #1: Su webhook fires payment.created + payment.approved con MISMO data.id pero DIFERENTE x-request-id. Si tu eventId es solo data.id, te perdés activaciones. Usá ambos.

3/ #2: Sus tokens OAuth expiran a 180 días. Si no tenés un cron que refresca proactivamente, las suscripciones de tus creadores quedan zombi. MP cobra pero vos no podés consultar el estado.

4/ #3: El endpoint normInvitations devuelve internal status 301 sin error visible cuando la cuenta de quien envía la invitación está restringida (cuentas nuevas, históricamente bloqueadas, etc.). Tenés que detectarlo y manejarlo.

5/ #4: Si usás PostgREST con Supabase, REVOKE SELECT (column) NO funciona para esconder columnas de la anon key. Migrá los tokens a una tabla separada con RLS estricta.

6/ #5: Las cuentas TEST tienen un site_id distinto al de las APP_USR-. Si copias-pegas un endpoint que funcionaba en TEST, va a fallar en prod o viceversa.

7/ Todo esto está documentado en commits del proyecto si querés ver fixes específicos: github.com/juanpablomonsalvezb-alt/sala (privado pero te puedo dar acceso si te interesa)

8/ El proyecto es @nebbuler. Si construyes algo para LATAM y querés intercambiar notas, DM abiertos.
```

---

## Thread 9 — Específico por país

```
1/ Para creadores COLOMBIANOS pensando en monetizar contenido en español:

Datos brutales (no marketing) ↓

2/ Substack te cobra 10% + Stripe te cobra ~3.2% + tu suscriptor paga 1.5-3% recargo internacional de su tarjeta colombiana. Total leak: ~15% del valor que generaste.

3/ Patreon: 5-12% + Stripe 3.2%. Similar.

4/ Gumroad: 10% + 3.5%. Solo sirve para venta única.

5/ Tu suscriptor colombiano paga US$5 → vos recibís en cuenta US$4.20 después de fees → al cambiarlos a COP perdés otro 1-2% en spread.

6/ Nebbuler: tarifa fija US$30/mes + cobros directos en COP via PSE/tarjeta colombiana. 0% comisión variable. Sin spread cambiario para tu suscriptor.

7/ Con 100 suscriptores a $20.000 COP/mes en Nebbuler: te quedan ~$1.880.000 COP/mes (~US$470). En Substack: ~$1.620.000 COP (~US$405). Diferencia: US$65/mes, US$780/año.

8/ Si tu audiencia es 80%+ colombiana, no hay razón racional para seguir en Substack.

Pruébalo: nebbuler.com (calculadora en /calculadora).
```

(Variar países: hacer versión para MX, AR, CL, PE replicando este formato con datos locales)

---

## Thread 10 — Founder vulnerability + CTA suave

```
1/ Lo más difícil de construir Nebbuler no fue el código. Fue creer que valía la pena.

2/ Cada 2 semanas durante 4 meses tuve la misma duda: "¿de verdad LATAM necesita esto, o es Substack lo suficientemente bueno para todos?"

3/ Lo que me sacó de la duda: las 50 conversaciones reales con creadores. Todos —absolutamente todos— mencionaron fricción de pago. Ninguno dijo "Substack funciona bien para mi audiencia LATAM".

4/ La gente que NO está monetizando en español ahora no es porque no haya audiencia. Es porque no hay plataforma diseñada para esa audiencia.

5/ Ese gap se va a cerrar en los próximos 24 meses. Por nosotros o por alguien más. Cuanto más temprano más probabilidad tiene Nebbuler de ser el default.

6/ Si sos creador y estás pensando "más adelante quizás monetizo": abrir tu sala ahora es gratis (la tarifa solo arranca cuando empezás a cobrar). Te aseguras tu slug, lo dejás listo.

nebbuler.com/abrir

7/ Y si no es para vos pero conocés a alguien — un colega, un mentor, alguien que escribe insights gratis en LinkedIn — pasale este thread. Es la única forma orgánica de crecer.

Gracias por leer.
```

---

# 5 Posts para Reddit

> Tono: 100% NO marketing. Aportar valor primero. Mencionar Nebbuler solo cuando es genuinamente relevante.
> Subreddits: r/Entrepreneur, r/SaaS, r/startups, r/digitalnomad, r/spain, r/argentina (en sus subs de tech/emprendimiento)
> Reddit DETECTA y BANEA promo descarada. Cada post lo escribís VOS, no copy-paste literal.

---

## Post 1 — r/Entrepreneur

**Título:** What I learned building a Substack alternative for Latin America in 4 months (technical + market notes)

**Cuerpo:**
```
I spent the last 4 months building Nebbuler — a membership platform for Spanish-speaking creators in LATAM. The product is live. I'm sharing what I learned, not asking for upvotes.

THE PROBLEM:
Substack/Patreon/Beehiiv don't work for LATAM creators. They charge in USD, force the audience to pay in dollars, and the audience drop-off is huge. A Colombian reader paying $5 to a Colombian newsletter ends up paying ~17,000 COP after currency conversion + 3% international card surcharge + bank fees. Conversion drops 30-50% vs anglosaxon audiences.

WHAT I BUILT:
- Stack: Next.js 14, Supabase, MercadoPago Connect (for LATAM), Stripe Connect (for non-LATAM)
- Model: flat $30/month platform fee instead of variable commission (Substack takes 10% forever, Patreon 8-12%)
- Local currencies: COP, MXN, ARS, PEN, CLP via MercadoPago

WHAT I LEARNED THAT WAS HARD:
1. Webhook idempotency. MercadoPago fires the same data.id with different x-request-id for payment.created and payment.approved. If you use only data.id as deduplication key, you lose activations.
2. PostgREST doesn't respect REVOKE column-level grants. I had to move OAuth tokens to a separate table with RLS to actually hide them from the anon key.
3. 50% of feedback from creators was about discoverability, not the platform. The "build it and they will come" doesn't apply to small markets.

WHAT I'M STILL FIGURING OUT:
- Distribution. Building product is solved problem. Distribution in fragmented markets like LATAM (18 countries, different regulations, no single ad platform) is the real moat.
- Pricing communication. "Flat fee" is unintuitive when everyone else charges %.

The product: nebbuler.com (no signup needed to check)
Open-source awesome list I built along the way: github.com/juanpablomonsalvezb-alt/awesome-latam-creator-economy

Happy to answer questions about MercadoPago Connect, Supabase RLS, the LATAM regulatory mess, or anything else.
```

---

## Post 2 — r/SaaS

**Título:** I'm bootstrapping a vertical SaaS for an underserved geographic market. AMA

**Cuerpo:** similar al de arriba pero más enfocado en business model + numbers.

---

## Post 3 — r/digitalnomad

**Título:** Creator economy platforms that actually work in Latin America (alternatives to Substack/Patreon)

**Cuerpo:** lista útil de 5-7 plataformas (Nebbuler entre ellas), pros/cons de cada una, no autopromocional.

---

## Post 4 — r/Spanish (o r/argentina, r/colombia, etc.)

**Título:** Estoy lanzando una plataforma para que profesionales hispanohablantes cobren membresías sin perder el 30% en cambio de moneda. Feedback?

**Cuerpo:** explicación en español, vulnerable, pidiendo feedback genuino.

---

## Post 5 — r/Indiehackers o IndieHackers.com directamente

**Título:** Show IH: Nebbuler — Substack for LATAM (flat fee, local currencies)

**Cuerpo:** versión adaptada del Show HN, más comunidad-friendly.
