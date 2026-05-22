# Nebbuler — Product Hunt Launch | Plan Ejecutivo

**Fecha de lanzamiento:** Martes 26 de mayo de 2026
**Hora de lanzamiento:** 00:01 PST (03:01 ART / 04:01 BRT / 01:01 CLT)
**Hunter:** Self-hunted (recomendación 2026: self-hunting > top hunter)
**Maker principal:** Juan Pablo Monsalvez
**URL producto:** https://nebbuler.com

---

## 1. Resumen ejecutivo

Nebbuler lanza el primer martes posterior a un fin de semana corto en EEUU (Memorial Day fue el 25), lo que reduce competencia de launches grandes. Estrategia: self-hunted, narrativa "Stripe for LATAM creators", priorizando comentarios sustantivos sobre upvotes brutos. Target conservador: 300 upvotes, 30+ comments, top 5 del día.

## 2. Objetivos cuantitativos

| Métrica | Mínimo | Objetivo | Stretch |
|---|---|---|---|
| Upvotes 24h | 250 | 300 | 500 |
| Comentarios sustantivos | 25 | 30 | 60 |
| Posición ranking del día | Top 10 | Top 5 | Top 3 |
| Visitantes únicos a nebbuler.com | 800 | 1.500 | 3.000 |
| Email signups | 80 | 150 | 300 |
| Creators agendando demo | 5 | 15 | 40 |
| Followers PH cuenta Nebbuler | 50 | 100 | 250 |

## 3. Por qué este martes

- 26 de mayo: día siguiente a Memorial Day (USA). Competencia más baja.
- Martes históricamente bate a miércoles/jueves en visibilidad.
- Coincide con cierre de mes en LATAM, momento donde creators evalúan tooling de monetización.
- Permite usar fin de semana largo (24-25) para warm-up final.

## 4. Estrategia narrativa central

**Hook narrativo:** "Substack y Patreon no procesan pagos en pesos chilenos, soles peruanos ni bolívares. Construí lo que no existía."

**Tres ángulos de prensa:**
1. Founder solo + bootstrap desde Chile (resuena con indie hackers PH)
2. Infraestructura LATAM-first (resuena con audiencia Stripe Atlas, fintech)
3. Creator economy hispanohablante (mercado 500MM+ personas desatendido)

## 5. Arquitectura del lanzamiento

```
T-7 días  → LinkedIn announce + outreach hunters
T-5 días  → Cold outreach 20 hunters (mensaje personalizado)
T-3 días  → Pre-tease Twitter/LinkedIn + landing capture
T-1 día   → Notificación red personal (50 contactos)
T-0       → Plan minuto a minuto 00:01 → 23:59 PST
T+1 a T+7 → Follow-up, agradecimientos, capitalizar tráfico residual
```

## 6. Diferenciadores únicos (memorizar)

1. **Pagos nativos LATAM** — MercadoPago, Khipu, Webpay, PIX. Ningún competidor global procesa pesos chilenos.
2. **Sin retención fiscal abusiva** — Substack retiene 30% impuestos a no-residentes USA. Nebbuler 0%.
3. **0% comisión 6 meses** para los primeros 100 creators (Substack 10%, Patreon 8-12%).
4. **Soporte en español** — Sincrónico, mismo huso horario.
5. **Stack moderno** — Next.js + Supabase, no PHP de 2012.

## 7. Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| Competidor grande lanza mismo día | Monitorear upcoming launches; tener plan B miércoles 27 |
| 0 tracción primera hora | Pool 30 personas confirmadas para upvote 00:01-01:00 |
| Comentarios negativos sobre "otro Substack más" | Prepared answers listos, responder en <5 min |
| Bug crítico en sitio durante peak | Status page activo, hotfix branch lista, fallback landing estática |
| Founder solo no alcanza a responder | Coordinar 3 amigos para responder dudas técnicas básicas |

## 8. Stack de monitoreo durante launch

- **PostHog** — Dashboard custom "PH-Launch-2026-05-26"
- **Plausible** — Tráfico realtime nebbuler.com
- **Vercel Analytics** — Performance + Web Vitals
- **Sentry** — Errores producción
- **Slack #ph-launch** — War room canal personal
- **Tab fija** Product Hunt page + comentarios

## 9. Inversión mínima

- $0 en ads (estrategia 100% orgánica para autenticidad)
- ~15h de trabajo founder semana previa
- ~16h día del launch (00:01 a 23:59 PST con descansos cortos)

## 10. Definición de éxito post-launch

**Win condition:** Top 5 + 30 demos agendadas + 5 creators activados con primer subscriber pagando en 14 días.

---

## Archivos de este plan

| # | Archivo | Propósito |
|---|---|---|
| 00 | OVERVIEW.md | Este documento |
| 01 | tagline-descripcion.md | Tagline + descripción (3 opciones A/B) |
| 02 | imagenes-galeria.md | 5 imágenes con specs de diseño |
| 03 | first-comment.md | Comentario del fundador (500-800 palabras) |
| 04 | hunters-target.md | 20 hunters con mensajes personalizados |
| 05 | warming-plan.md | Cronograma 7 días previos + día del launch |
| 06 | notificaciones-red.md | Templates email + WhatsApp |
| 07 | respuestas-preparadas.md | 10 respuestas preparadas |
| 08 | metricas-tracking.md | KPIs + dashboard PostHog |
| -- | CHECKLIST-LANZAMIENTO.md | Lista chequeable día del launch |
