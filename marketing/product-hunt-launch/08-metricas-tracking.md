# Métricas de Éxito Post-Launch + Dashboard PostHog

---

## North Star Metric del Launch

**Creators que activan su primera suscripción paga dentro de 14 días post-launch.**

Esta métrica importa más que upvotes porque:
- Mide producto, no solo marketing
- Es leading indicator de retention y MRR
- Diferencia "vanity launch" de "launch que mueve el negocio"

**Target:** 5 creators activados en 14 días post-launch.

---

## Métricas en 4 capas

### Capa 1 — Vanity (PH propias)

| Métrica | Mínimo | Objetivo | Stretch | Cómo medir |
|---|---|---|---|---|
| Upvotes totales 24h | 250 | 300 | 500 | PH página producto |
| Comments totales 24h | 25 | 30 | 60 | PH thread |
| Posición ranking del día | Top 10 | Top 5 | Top 3 | PH leaderboard |
| Followers cuenta PH | 50 | 100 | 250 | PH profile |
| Saves del producto | 30 | 60 | 150 | PH analytics |

### Capa 2 — Tráfico (PostHog + Plausible)

| Métrica | Mínimo | Objetivo | Stretch |
|---|---|---|---|
| Visitantes únicos nebbuler.com día 0 | 800 | 1.500 | 3.000 |
| Visitantes únicos T+7 | 2.000 | 4.000 | 8.000 |
| Bounce rate landing | <70% | <55% | <40% |
| Tiempo medio en sitio | >40s | >90s | >180s |
| Páginas/sesión | 1.5 | 2.5 | 4 |
| % tráfico referrer = producthunt.com | 60% | 50% | 30% (significa que otros canales también empujaron) |

### Capa 3 — Conversión (PostHog funnels)

| Funnel step | Mínimo | Objetivo | Stretch |
|---|---|---|---|
| Landing → "Empezar gratis" click | 8% | 15% | 25% |
| Click → Signup completado | 40% | 60% | 75% |
| Signup → Onboarding completado | 50% | 70% | 85% |
| Onboarding → Primer post publicado | 30% | 50% | 70% |
| Primer post → Primer suscriptor pago | 10% | 20% | 35% |

### Capa 4 — Negocio (PostHog + Supabase queries)

| Métrica | Mínimo | Objetivo | Stretch |
|---|---|---|---|
| Email signups día 0 | 80 | 150 | 300 |
| Cuentas creadas día 0 | 30 | 80 | 200 |
| Cuentas creadas T+7 | 100 | 250 | 600 |
| Creators con primer post T+7 | 20 | 50 | 150 |
| Creators con primer subscriber pago T+14 | 5 | 15 | 40 |
| MRR added T+30 | $500 USD | $2.000 USD | $8.000 USD |
| Demos agendadas T+7 | 5 | 15 | 40 |

---

## Dashboard PostHog — Configuración exacta

### Setup previo

1. **Crear proyecto separado** PostHog: `nebbuler-ph-launch-2026-05-26`
2. **Instalar SDK** en frontend si no está: `posthog-js` ya configurado en Next.js 14
3. **Variables de identificación:**
   - `user_id`: del Supabase auth
   - `signup_source`: query param `?ref=ph_launch` o referrer == producthunt.com
   - `country`: detectado por IP via Vercel geo headers

### Eventos a instrumentar (si no están)

```typescript
// Landing
posthog.capture('ph_landing_view', {
  utm_campaign: '2026_05_26_ph_launch',
  referrer: document.referrer
})

posthog.capture('ph_landing_cta_click', { cta_position, cta_text })

// Signup funnel
posthog.capture('signup_started', { method: 'email' | 'google' })
posthog.capture('signup_completed', { user_id, country })
posthog.capture('onboarding_step_completed', { step_name, step_number })
posthog.capture('onboarding_completed', { time_to_complete_seconds })

// Activation
posthog.capture('first_post_published', { user_id, post_id, has_paywall })
posthog.capture('first_subscriber_acquired', { user_id, subscriber_id, plan_price_local })
posthog.capture('first_payment_processed', {
  user_id, amount_local, currency, payment_method, fx_to_usd
})

// Engagement día launch
posthog.capture('calculator_used', { country, monthly_revenue_input, plan_compared })
posthog.capture('demo_scheduled', { user_id, email, calendly_link })
```

### Dashboards a crear

#### Dashboard 1: "Launch Day Live" (refrescar cada 5 min)

Widgets:
1. **Big number:** Visitantes únicos hoy (today, refresh 1 min)
2. **Big number:** Signups completados hoy
3. **Big number:** PH upvotes (manual update cada hora)
4. **Line chart:** Visitantes por hora últimas 24h
5. **Funnel:** Landing → CTA → Signup → Onboarding (today)
6. **Bar chart:** Top 10 referrers
7. **Map:** Visitantes por país
8. **Table:** Últimos 20 signups con país + email + plan elegido

#### Dashboard 2: "Launch Week" (refresh diario)

Widgets:
1. **Cohort retention:** Signups día launch — retention D1/D3/D7/D14
2. **Funnel:** Signup → Onboarding → First post → First subscriber (T+7)
3. **Line chart:** MRR diario T+0 a T+30
4. **Bar chart:** Demos agendadas por día
5. **Stickiness:** DAU/WAU ratio entre signups del launch
6. **Funnel breakdown by country**

#### Dashboard 3: "Attribution Deep-dive" (refresh semanal)

Widgets:
1. **First-touch attribution:** signup → cómo llegó originalmente
2. **Multi-touch:** signups que tocaron PH + LinkedIn + Twitter
3. **Conversion rate por canal:** PH directo vs PH + share vs LinkedIn vs Twitter vs orgánico Google
4. **LTV proyectado por canal** (a 6 meses)
5. **Channel CAC equivalente** (asumiendo cost de tiempo founder a $50/h)

---

## Tracking adicional (no PostHog)

### Plausible (privacidad-friendly, complemento)
- Confirmar tracking script en nebbuler.com (debe estar ya)
- Goal "ph_launch_signup" configurado
- Custom property "ph_launch_visitor" para filtrar

### Google Search Console
- Monitorear queries "nebbuler" semana del launch
- Alerta si hay spike
- Optimizar página /producthunt para capturar tráfico SEO post-launch

### Vercel Analytics
- Core Web Vitals durante peak (target: LCP <2.5s, INP <200ms)
- Si performance se degrada >20%, scale Edge runtime

### Sentry
- Alert critical errors > 5/min
- Hotfix branch lista por si error en payment flow

### Manual tracking sheet (Google Sheets)

| Hora PST | Hora CLT | Upvotes | Comments | Posición | Visitantes (hr) | Signups (hr) | Notas |
|---|---|---|---|---|---|---|---|
| 00:01 | 04:01 | 0 | 0 | -- | -- | -- | GO LIVE |
| 01:00 | 05:00 | | | | | | |
| 02:00 | 06:00 | | | | | | |
| ... | ... | | | | | | |

---

## Reporting post-launch

### T+1 (miércoles 27-mayo)

**Tweet thread interno + LinkedIn post:** "Launch day en números"
- Visitantes
- Signups
- Posición final
- Comments
- Demos agendadas
- Lesson #1 aprendido

### T+7 (martes 02-junio)

**Blog post:** "Cómo fue lanzar Nebbuler en Product Hunt como solo founder desde Chile"
- Métricas vanity + reales
- Qué funcionó, qué no
- Plata invertida vs valor obtenido
- Aprendizajes para próximos founders LATAM
- CTA al producto

### T+30 (jueves 25-junio)

**Reporte interno + post LinkedIn:** "30 días post-Product Hunt"
- Retention de signups del launch
- MRR added directamente atribuible
- Demos → Cliente conversion rate
- ¿Vale la pena? Post-mortem honesto

---

## Reglas de medición

1. **Sin sesgo de éxito:** publicar números reales aunque sean malos
2. **Cohort segregada:** signups del launch tratar como cohort separada para retention real
3. **No vanity confusing:** no celebrar 1.000 signups si solo 5 quedaron activos
4. **Atribución honesta:** un usuario que llegó por LinkedIn pero clickeó en PH no es "PH user"
5. **Transparencia pública:** Nebbuler abre métricas mensualmente. El launch entra a esa cadencia.

---

## Setup checklist técnico (T-3 días)

- [ ] PostHog proyecto separado creado y vinculado
- [ ] Plausible goal "ph_launch_signup" activo
- [ ] Eventos instrumentados (verificar en PostHog activity feed)
- [ ] Dashboards 1, 2, 3 creados con widgets
- [ ] Vercel Analytics activo
- [ ] Sentry alertas críticas configuradas (Slack channel `#ph-launch-alerts`)
- [ ] Google Sheet manual creado, compartido con backup person
- [ ] Slack canal `#ph-launch` creado para war room
- [ ] URL `/producthunt` con landing dedicado a tráfico PH (UTMs auto)
- [ ] Calendly link único `nebbuler.com/demo-ph` con tag ph_launch
