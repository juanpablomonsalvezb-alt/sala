# AUDIT — Sistema de pagos y endpoints críticos

> Documento vivo. Cada auditoría agrega una sección con fecha, alcance,
> hallazgos, fixes y commit hash. NO se borra contenido anterior.
> Si una zona no fue auditada, se declara explícitamente en "Scope NO cubierto".

---

## 2026-05-17 — Auditoría de pagos (MP + Stripe)

**Auditor:** Claude Opus 4.7 (sesión 570cd61a)
**Trigger:** Usuario solicitó revisión de elementos críticos del sitio web.

### Scope CUBIERTO

| Archivo | Líneas leídas | Hallazgos |
|---|---|---|
| `src/app/api/mp/webhook/route.ts` | 1-340 (todo) | 5 |
| `src/app/api/mp/platform-checkout/route.ts` | 1-75 (todo) | 4 |
| `src/app/api/mp/connect/route.ts` | 1-51 (todo) | 1 |
| `src/app/api/mp/connect/callback/route.ts` | 1-104 (todo) | 5 |
| `src/app/api/mp/disconnect/route.ts` | 1-41 (todo) | 2 |
| `src/app/api/stripe/webhook/route.ts` | 1-124 (todo) | 6 |
| `src/app/api/stripe/create-checkout/route.ts` | 1-110 (todo) | 3 |

### Scope NO cubierto (declarado explícitamente)

- ❌ `src/lib/mercadopago.ts` — helper no leído
- ❌ `src/lib/stripe.ts` — helper no leído
- ❌ `src/lib/supabase/server.ts` (RLS, service client) — no leído
- ❌ Tablas Supabase: `sala_subscriptions`, `sala_creators`, `sala_webhook_events`, `sala_profiles` — schema y RLS no inspeccionadas
- ❌ Migraciones Supabase (`supabase/migrations/`) — no leídas
- ❌ Endpoints de autenticación (`src/app/api/auth/*`)
- ❌ Endpoints de tracking (`src/app/api/track/*`)
- ❌ Endpoints `/api/social/*`, `/api/seo/*`, `/api/og/*`
- ❌ Cron jobs (`src/app/api/cron/*`)
- ❌ Middleware (`middleware.ts` / `proxy.ts`)
- ❌ Tests existentes — no se ejecutaron
- ❌ Variables de entorno expuestas en client bundle — no revisado
- ❌ Migración Stripe → MP — no se verificó si quedan accesos a Stripe que deberían estar en MP

**No se ejecutaron tests de integración** contra MP/Stripe sandbox. La auditoría es de código estático.

### Hallazgos CRÍTICOS (puede causar pérdida de dinero o hijacking)

| # | Archivo:línea | Problema | Estado |
|---|---|---|---|
| C1 | `api/mp/webhook/route.ts:278` | `eventId` no único entre `payment.created` y `payment.approved` del mismo recurso → activaciones perdidas | ⏳ por fixear |
| C2 | `api/mp/webhook/route.ts:280` | `markEventProcessed` antes de procesar exitosamente → fallo en MP API marca evento como procesado y retries se ignoran | ⏳ por fixear |
| C3 | `api/mp/connect/callback/route.ts:41` | `user_id` extraído de `state` sin verificar contra sesión actual → posible hijacking de cuenta MP | ⏳ por fixear |
| C4 | `api/stripe/webhook/route.ts` (todo) | Sin idempotencia + `INSERT` en vez de `UPSERT` → duplicación de suscripciones en retries | ⏳ por fixear |
| C5 | `api/mp/webhook/route.ts:134` | `validatePlatformAmount` acepta ±7% (28000-32000 para tarifa 29990) → demasiado laxo | ⏳ por fixear |

### Hallazgos IMPORTANTES (fragilidad operacional)

| # | Archivo | Problema |
|---|---|---|
| I1 | MP webhook | Pisa `created_at` en cada renovación; si MP no notifica → suscripción se bloquea |
| I2 | MP webhook | Welcome email re-enviado en re-activaciones tras cancelación |
| I3 | MP webhook | `validateAmount` usa precio actual del creador, no el del `external_reference` |
| I4 | MP callback | Tokens MP guardados en plain text (sin encriptación) |
| I5 | MP callback | Sin refresh token automático cuando expira el access_token |
| I6 | MP disconnect | No revoca tokens en MP (`/oauth/revoke`) |
| I7 | MP disconnect | No verifica si hay suscripciones activas antes de desconectar |
| I8 | Stripe webhook | No maneja `customer.subscription.updated` ni `charge.dispute.created` |
| I9 | Stripe checkout | `stripe.prices.create` cada vez → contamina catálogo Stripe |
| I10 | Stripe checkout | No hay rate limiting |

### Plan de remediación HOY

1. Fix C1, C2, C3, C4, C5 en commit separado por contexto.
2. Test mínimo por cada fix que demuestre el comportamiento esperado.
3. Re-deploy a producción.
4. Actualizar este documento con commits y resultado de tests.

### NO se afirma en esta auditoría

- ❌ "El sistema de pagos está bien."
- ❌ "Estos son los únicos bugs."
- ❌ "Después de los fixes, no quedan problemas."

**Solo se afirma:** Los 5 críticos listados existen en las líneas indicadas y los fixes aplicados se demuestran con tests específicos.

### 🔴 Hallazgo POSTERIOR (detectado al verificar migración) — C6

Durante la verificación de la migración en producción (con `curl` al REST API),
Supabase respondió:

```
{"message":"Legacy API keys are disabled","hint":"Your legacy API keys (anon,
service_role) were disabled on 2026-04-19T04:28:56.67029+00:00..."}
```

**Impacto:** Cualquier código que use `process.env.SUPABASE_SERVICE_ROLE_KEY`
(JWT viejo) **falla en producción desde el 2026-04-19**. El webhook MP
(`mp/webhook/route.ts:17`) solo leía esa variable → **el primer pago real
habría llegado y la suscripción nunca se habría activado.**

Verificación con datos reales del proyecto:
- Webhooks MP procesados desde 2026-04-19: **0** (`content-range: */0`)
- Suscripciones activas creadas en último mes: **0**

**Conclusión:** sin daño financiero porque no hubo tráfico real todavía, pero
el bug era latente y crítico para el primer cobro.

**Archivos arreglados** (cambiados a `SUPABASE_SECRET_KEY ?? SUPABASE_SERVICE_ROLE_KEY`):

| Archivo | Línea | Severidad |
|---|---|---|
| `src/app/api/mp/webhook/route.ts` | 9-18 | 🔴 Crítica (pagos) |
| `src/app/dashboard/nueva-publicacion/_actions.ts` | 114, 199 | 🟡 Media (publicación de posts) |
| `src/app/api/nominations/route.ts` | 62-67 | 🟡 Media |
| `src/app/api/newsletter/construyendo/route.ts` | 27-32 | 🟡 Media |
| `src/app/api/indexnow/route.ts` | 13-17 | 🟢 Baja (solo IndexNow ping) |

**Cómo se detectó:** porque verifiqué la migración haciendo `curl` real al REST
API de producción en lugar de asumir que funcionaba. Si solo hubiera ejecutado
`npm test` (que pasa contra mocks/funciones puras), este bug habría quedado
oculto.

**Lección operacional:** los tests unitarios verifican lógica pura. Los bugs de
infraestructura (keys expiradas, RLS, env vars) solo se detectan ejerciendo el
sistema contra producción real. AUDIT.md debe incluir una sección "tests de
sanidad contra prod" para próximas auditorías.

---

### Resultado de la remediación

**Tests:** `npm test` — 19/19 pasaron (`tests/mp-helpers.test.ts`).

**Verificación contra producción (Supabase REST):**
- ✅ INSERT con `status='processing'` y `attempted_at` → 200 OK
- ✅ UPDATE a `status='done'` con `processed_at` → 200 OK
- ✅ CHECK constraint `status IN ('processing','done')` activo → rechaza `'bogus'` con código 23514
- ✅ DELETE → 204 No Content

| # | Fix aplicado en | Test que lo demuestra |
|---|---|---|
| C1 | `src/lib/payments/mp-helpers.ts` (buildEventId) + import en webhook | `produce IDs distintos para mismo type+dataId si request-id difiere` |
| C2 | `src/app/api/mp/webhook/route.ts` (reserveEvent + commitEvent) + migración `20260517000000_webhook_idempotency.sql` | (verificación requiere BD — NO testeado unitariamente; lógica documentada en comentarios del módulo) |
| C3 | `src/app/api/mp/connect/callback/route.ts` (userId desde sesión + safeStringEq) | `safeStringEq` cubierto (4 tests). Verificación end-to-end requiere flow OAuth real. |
| C4 | `src/app/api/stripe/webhook/route.ts` (reserveStripeEvent + UPSERT) | (verificación requiere BD — NO testeado unitariamente) |
| C5 | `src/lib/payments/mp-helpers.ts` (validatePlatformAmount ±1%) | 4 tests incluyendo "RECHAZA montos que el código viejo aceptaba" |

### Lo que NO se demuestra con estos tests (honestidad)

- C2 y C4 requieren BD real para probar el ciclo `processing → done` con
  retries y TTL. Los tests unitarios solo cubren la lógica pura. Para
  validar end-to-end hace falta un test de integración con Supabase de prueba.
- C3 cubre `safeStringEq` aisladamente; el flujo OAuth completo no fue ejercitado.
- Los IMPORTANTES (I1–I10) NO fueron arreglados en esta ronda.
- El scope NO cubierto sigue siendo NO auditado.

### Pendiente para próximas auditorías

- Auditar scope NO cubierto (lib helpers, RLS, migrations, auth, middleware).
- Tests de integración con Supabase local contra los webhooks.
- Tests con fixtures de payloads reales de MP y Stripe (firmas válidas e inválidas).
- Atacar IMPORTANTES I1–I10.
- Revisar logs de producción para detectar bugs ya manifestados.
