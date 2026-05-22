# Plan de lanzamiento Nebbuler · 21 mayo 2026

> Generado y ejecutado autónomamente. Resumen ejecutivo de TODO lo construido y plan de ejecución de los próximos 7 días.

---

## 🎯 Objetivo

Pasar de **1 visita/48h → 200-500 visitas diarias sostenidas en 14 días.**

---

## ✅ Lo que ya está construido y desplegado

### 1. Calculadora viral en producción
- **URL:** [nebbuler.com/cuanto-te-quitan](https://nebbuler.com/cuanto-te-quitan)
- **OG dinámico:** [/api/og/cuanto-te-quitan](https://nebbuler.com/api/og/cuanto-te-quitan)
- **Tono:** provocador, anti-Substack/Patreon, datos reales
- **CTAs:** botones gigantes WhatsApp + X + LinkedIn share
- **Schema:** WebApplication + FAQPage para AI Overviews
- **Archivo:** `src/app/cuanto-te-quitan/`

### 2. Outreach LinkedIn — 50 creadores LATAM reales
- **Archivo:** `automation/outreach/campaigns/2026-05-21-creadores-reales/targets-reales.csv`
- **25 Chile + 25 Colombia**, 5 nichos balanceados
- **16 prioridad ALTA** (10K+ seguidores)
- **34 prioridad MEDIA** (3-10K seguidores)
- **100% URLs verificadas** (Favikon, Forbes, Tickelia, La República, Emol)
- **Mensaje personalizado** por cada uno (versión B < 300 chars)

### 3. Pitches a 15 newsletters/medios LATAM
- **Archivo:** `automation/outreach/campaigns/2026-05-21-newsletters/pitches-newsletters.json`
- **Emails verificados** vía Resend listos para enviar
- **Top 8 prioridad ALTA:** Cenital, Bloomberg Línea, Whitepaper.mx, Latitud, Story Baker, Latinometrics, Tendenci@s, Suma Positiva
- **Script:** `node scripts/send-newsletter-pitches.mjs --priority alta`

### 4. Paquete completo de directorios
- **Carpeta:** `marketing/directorios/`
- 6 directorios con assets, descripciones, categorías exactas:
  - BetaList (free + 3 tiers pagos)
  - **AlternativeTo** ← mayor ROI permanente
  - IndieHackers (con post 800 palabras listo)
  - **SaaSHub** ← multiplicador (desbloquea 107 directorios)
  - Product Hunt (martes 26 mayo)
  - G2 / Capterra (estrategia 50 reviews/60 días)

### 5. Product Hunt launch — martes 26 mayo
- **Carpeta:** `marketing/product-hunt-launch/`
- Plan minuto a minuto del launch day
- 3 taglines A/B testeables
- 5 imágenes especificadas (1270x760)
- First comment fundador (200 palabras)
- 20 hunters identificados
- Plan de calentamiento día -7 a día 0

### 6. Posts virales para HN/IH/Reddit
- **Carpeta:** `marketing/posts-virales/`
- Show HN (inglés técnico): título 78 chars + first comment
- IndieHackers (storytelling vulnerable, métricas honestas)
- Reddit Argentina (español rioplatense, anti-chamuyo)
- Reddit México (español neutro, ángulo SAT/CFDI)
- Reddit r/CreatorEconomy (inglés)
- **ESTRATEGIA.md:** horarios óptimos + manejo de 10 críticas predecibles

### 7. Scripts de ejecución autónoma
- `scripts/post-linkedin-viral.mjs [1|2|3]` — publica post viral (calculadora / carta abierta / manifesto)
- `scripts/send-newsletter-pitches.mjs [--dry-run] [--priority alta]` — envío masivo con retry de bounces

---

## 📅 Plan de ejecución 7 días

### **HOY — Jueves 21 mayo (post-deploy)**
- [x] Calculadora `/cuanto-te-quitan` en producción
- [x] Post variante 1 publicado en LinkedIn (anuncia calculadora)
- [x] 8 pitches prioridad ALTA enviados a newsletters

### **Viernes 22 mayo**
- [ ] Enviar 7 pitches restantes (prioridad MEDIA)
- [ ] Enviar 16 DMs LinkedIn (prioridad ALTA — `targets-reales.csv`)
- [ ] Post LinkedIn variante 2 (carta abierta) — programar 17:00 UTC
- [ ] Submit a **AlternativeTo** (alternative to Substack + Patreon)
- [ ] Submit a **SaaSHub** (desbloquea 107 más)

### **Sábado 23 mayo**
- [ ] Submit a BetaList (free tier)
- [ ] Submit a IndieHackers (con post completo)
- [ ] Post Reddit r/argentina (mejor hora: 20:00 CLT sábado)
- [ ] Revisar respuestas LinkedIn y newsletters → agendar calls

### **Domingo 24 mayo**
- [ ] Post Reddit r/Mexico (12:00 CLT domingo)
- [ ] Post LinkedIn variante 3 (manifesto/métricas honestas)
- [ ] Calentamiento Product Hunt: anuncio a red personal

### **Lunes 25 mayo (T-1 PH)**
- [ ] Enviar 34 DMs LinkedIn restantes (prioridad MEDIA)
- [ ] Pre-tease Product Hunt en LinkedIn + Twitter
- [ ] Notificar 50 contactos red personal (template en `06-notificaciones-red.md`)
- [ ] Submit Show HN (mejor hora: martes 12:00 CLT — preparar)

### **Martes 26 mayo — PRODUCT HUNT LAUNCH DAY**
- [ ] 00:01 PST: lanzamiento PH
- [ ] 08:00 CLT: Show HN
- [ ] 12:00 CLT: IndieHackers post
- [ ] Bloquear 8h para responder comentarios
- [ ] Plan minuto a minuto en `marketing/product-hunt-launch/05-warming-plan.md`

### **Miércoles 27 mayo**
- [ ] Follow-up newsletters (sin respuesta en 5 días)
- [ ] Métricas PH: upvotes, comentarios, conversaciones cualitativas
- [ ] Iterar lo que más viralizó

---

## 📊 Métricas a trackear (PostHog)

| KPI | Meta semana 1 | Meta semana 2 |
|---|---|---|
| Visitas diarias únicas | 50+ | 200+ |
| Shares de `/cuanto-te-quitan` | 20 | 100 |
| DMs LinkedIn respondidos | 5 | 12 |
| Newsletters que mencionan | 1 | 3 |
| Creadores registrados | 1 | 5 |
| Upvotes PH | n/a | 300+ |
| Backlinks orgánicos | 5 | 20 |

---

## 🚨 Lo que requiere acción manual de Juan Pablo

1. **DMs LinkedIn:** LinkedIn no permite envío masivo vía API en cuenta gratuita. Hay que copiar/pegar manualmente desde `targets-reales.csv` (15 min por lote de 20).
2. **Submits a directorios:** Todos requieren login + formulario web. Asistencia en `marketing/directorios/README.md`.
3. **Posts Reddit / HN:** Requieren cuenta personal. Contenido en `marketing/posts-virales/`.
4. **Product Hunt:** Necesita hunter (ver lista en `04-hunters-target.md`) y cuenta PH del fundador.

---

## 💡 La verdad estratégica

Visibilidad técnica perfecta ≠ tracción. El 80% del impacto en los próximos 14 días vendrá de:

1. **Los 50 DMs LinkedIn** (canal #1 LATAM, audiencia exacta)
2. **La calculadora viral compartida en WhatsApp** (canal viral #1 LATAM)
3. **Una pieza de medio editorial** (Cenital, Bloomberg Línea, Latinometrics) = 500-2000 visitas en 24h
4. **Product Hunt + Show HN** combo del martes 26

El SEO programático que ya existe (950+ páginas) seguirá rankeando pasivamente. No requiere más optimización ahora.
