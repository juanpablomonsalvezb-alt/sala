# Auditoría de seguridad — 2026-05-21

Resumen ejecutivo de fixes aplicados tras auditoría completa.

## Estado

| Categoría | Cerrados | Pendientes |
|---|---|---|
| **CRÍTICOS** | 5/5 | 0 |
| **ALTOS** | 8/8 | 0 |
| **MEDIOS** | 4/10 | 6 (no críticos: Sentry, Turnstile, etc.) |

## Acción manual pendiente

**Aplicar la migración SQL en Supabase producción:**

```
supabase/migrations/20260521000000_critical_audit_fixes.sql
```

Esta migración cierra dos vulnerabilidades CRÍTICAS:

1. **RLS de `sala_subscriptions`** — bloquea INSERT/UPDATE/DELETE desde `authenticated`.
   Sin este fix, cualquier usuario logueado puede insertar suscripciones falsas
   y acceder al contenido pagado sin pagar.
2. **Trigger `sala_protect_superadmin`** — preserva `is_superadmin` salvo `service_role`.
   Sin este fix, cualquier usuario logueado puede ejecutar
   `UPDATE sala_profiles SET is_superadmin=true WHERE id=auth.uid()` y obtener
   acceso al dashboard admin de Nebbuler.

### Cómo aplicar

**Opción A — Dashboard Supabase (más rápido):**
1. Abrir https://supabase.com/dashboard/project/pnezuntljreblaefalpl/sql/new
2. Copiar el contenido de `supabase/migrations/20260521000000_critical_audit_fixes.sql`
3. Ejecutar
4. Verificar que `select count(*) from pg_policies where tablename = 'sala_subscriptions' and cmd in ('INSERT', 'UPDATE', 'DELETE');` devuelve 0

**Opción B — Supabase CLI:**
```bash
supabase login
supabase link --project-ref pnezuntljreblaefalpl
supabase db push
```

## Cambios en código (ya desplegados)

### CRÍTICOS

| Fix | Archivo | Cambio |
|---|---|---|
| Bloqueo 35d funcional | `src/lib/subscription.ts` | Leer `last_paid_at` en vez de `created_at` |
| Validación precio | `src/app/dashboard/configuracion/_actions.ts` | Validar rango [1000, 100000] CLP + sanitización completa |
| Refund automático | `src/app/api/mp/webhook/route.ts` | En amount mismatch: refund vía MP API + no commit del evento |

### ALTOS

| Fix | Archivo |
|---|---|
| Cancelación por usuario | `src/app/api/subscriptions/cancel/route.ts` + `/mis-suscripciones/` |
| Stripe webhook | `src/app/api/stripe/webhook/route.ts` — no pisar `created_at` |
| CRON_SECRET en headers | `src/lib/cron-auth.ts` + `post-content` + `detect-opportunities` + `refresh-social-accounts` |
| /api/seo/submit auth | `src/app/api/seo/submit-to-search-engines/route.ts` |
| Fallback anon key | `src/app/api/nominations/route.ts` + `src/app/api/newsletter/construyendo/route.ts` |

### MEDIOS

| Fix | Archivo |
|---|---|
| Health endpoint | `src/app/api/health/route.ts` — pública minimalista, detalle con Bearer o sesión superadmin |
| CSP enforcing | `next.config.ts` — quitar `-Report-Only` |
| service_role policies | `supabase/migrations/20260521000000_critical_audit_fixes.sql` |
| Crons schedule | `vercel.json` — desplazar refresh-mp-tokens, agregar update-snippets |

## Verificación post-deploy

```bash
# 1. Build status (debe devolver ok=true)
curl https://nebbuler.com/api/health

# 2. CSP enforcing (debe devolver Content-Security-Policy, no -Report-Only)
curl -I https://nebbuler.com | grep -i content-security

# 3. Cron sin query string (debe devolver 401)
curl https://nebbuler.com/api/cron/post-content?secret=foo

# 4. SEO submit cerrado (debe devolver 401)
curl -X POST https://nebbuler.com/api/seo/submit-to-search-engines \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://nebbuler.com"]}'

# 5. /mis-suscripciones existe
curl -I https://nebbuler.com/mis-suscripciones
```

## Hallazgos no implementados (priorizables a futuro)

- **Sentry** — integrar `@sentry/nextjs` para errores server-side de crons/webhooks
- **Turnstile/hCaptcha** en `/api/contacto` (bot protection)
- **`stripe/create-checkout`** — eliminar si no se usa (la UI usa MP)
- **Rate limit fail-closed** para endpoints de pago
- **TTL job** para `sala_webhook_events` (>90 días)
- **View-count anti-fraude** en `/api/track/view`

## OK confirmados (no requieren acción)

- HMAC verification con anti-replay ±5min y `timingSafeEqual`
- Tokens MP en `sala_creator_secrets` con RLS sin policies
- OAuth state anti-CSRF con cookie HttpOnly + comparación constant-time
- Idempotencia webhooks con estado processing/done + TTL 5min
- Sanitización HTML con `sanitize-html` + whitelist iframes
- Email injection check (CRLF) en /contacto y /newsletter
- Headers seguridad completos (HSTS, XFO, XCO, Referrer-Policy)
- 0 secrets hardcodeados en `src/`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` usa la key publishable correcta
