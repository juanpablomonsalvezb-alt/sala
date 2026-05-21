# Sentry — Setup de observabilidad para Nebbuler

Captura silenciosamente errores que hoy se pierden en logs de Vercel. Tier gratuito (5k errors/mes, 30 días retención). **Si no configurás las env vars, todo sigue funcionando exactamente igual** — la integración es stub-safe.

## TL;DR

1. Crear cuenta en https://sentry.io (Developer plan, gratis)
2. Crear proyecto tipo "Next.js" llamado `nebbuler`
3. Copiar el DSN
4. Agregar 4 env vars en Vercel
5. Configurar 3 alert rules en el dashboard
6. Deploy y verificar primer evento

---

## 1. Crear cuenta y proyecto

1. Ir a https://sentry.io/signup/
2. Crear org (sugerido: `nebbuler`)
3. **Create Project** → Platform: **Next.js** → Project name: `nebbuler`
4. Copiar el DSN que muestra (formato: `https://abc123@o4567890.ingest.sentry.io/1234567`)
5. Anotar el **org slug** y **project slug** (visibles en la URL del dashboard: `sentry.io/organizations/<ORG>/projects/<PROJECT>/`)

## 2. Generar Auth Token (opcional — para source maps)

Sin esto Sentry funciona, pero los stacktraces en producción aparecen minificados (poco legibles).

1. Settings → Account → Auth Tokens → **Create New Token**
2. Scopes: `project:releases` y `org:read`
3. Copiar el token (formato: `sntrys_...`)

## 3. Variables de entorno en Vercel

```bash
cd /Users/juanpablomonsalvez/Downloads/sala

# DSN — público, va al cliente. Usar printf para evitar \n invisibles.
printf "%s" "https://TU_DSN_AQUI" | npx vercel env add NEXT_PUBLIC_SENTRY_DSN production
printf "%s" "https://TU_DSN_AQUI" | npx vercel env add NEXT_PUBLIC_SENTRY_DSN preview

# Mismo DSN también disponible server-side (sin prefijo NEXT_PUBLIC_)
printf "%s" "https://TU_DSN_AQUI" | npx vercel env add SENTRY_DSN production
printf "%s" "https://TU_DSN_AQUI" | npx vercel env add SENTRY_DSN preview

# Slugs
printf "%s" "nebbuler" | npx vercel env add SENTRY_ORG production
printf "%s" "nebbuler" | npx vercel env add SENTRY_PROJECT production

# Auth token (solo production — solo se usa en build)
printf "%s" "sntrys_TU_TOKEN" | npx vercel env add SENTRY_AUTH_TOKEN production
```

Verificación:

```bash
npx vercel env ls | grep SENTRY
```

| Variable                  | Scope               | Uso                                    |
|---------------------------|---------------------|----------------------------------------|
| `NEXT_PUBLIC_SENTRY_DSN`  | production, preview | Cliente (browser) — bundleado          |
| `SENTRY_DSN`              | production, preview | Server (Node + Edge runtime)           |
| `SENTRY_ORG`              | production          | Source map upload                      |
| `SENTRY_PROJECT`          | production          | Source map upload                      |
| `SENTRY_AUTH_TOKEN`       | production          | Source map upload (build-time)         |

## 4. Deploy

```bash
cd /Users/juanpablomonsalvez/Downloads/sala && ./deploy.sh
```

## 5. Verificar primer evento

Después de deploy, forzar un error de prueba (una sola vez):

1. En el dashboard de Sentry → Projects → `nebbuler` → **Issues**
2. Si no aparece nada en 2 minutos: navegar a `https://nebbuler.com/__no-existe-test-404` (genera 404 controlado, no debe llegar)
3. Para test real, llamar `Sentry.captureMessage('test-prod')` desde un route temporal — borrar después.

## 6. Configurar alertas críticas

En Sentry → Projects → `nebbuler` → **Alerts** → **Create Alert**:

### Alert 1 — Webhook MercadoPago caído
- **When**: An event is seen
- **If**: `tags[webhook]` equals `mp` AND `level` equals `error`
- **Frequency**: At least 3 events in 10 minutes
- **Then**: Send notification to `juanpablo.monsalvezb@gmail.com`

### Alert 2 — Cron fallando reiteradamente
- **When**: An issue changes state
- **If**: `tags[cron]` is present AND issue is unresolved for more than 2 days
- **Then**: Email a `juanpablo.monsalvezb@gmail.com`

### Alert 3 — Error rate spike
- **When**: Number of errors in an issue
- **If**: More than 50 events in 1 hour
- **Then**: Email + (opcional) Slack webhook

### Alert 4 — Issue con tag `critical`
- **When**: A new issue is created
- **If**: `tags[critical]` equals `true`
- **Frequency**: 1 event (notificación inmediata)
- **Then**: Email a `juanpablo.monsalvezb@gmail.com`

> Para marcar errores como críticos desde código:
> ```ts
> import * as Sentry from '@sentry/nextjs'
> Sentry.withScope((s) => { s.setTag('critical', 'true'); Sentry.captureException(err) })
> ```

## 7. Quotas y limpieza

Tier free de Sentry:
- 5.000 errors/mes
- 10.000 performance units/mes
- 50 replays/mes
- 1 GB attachments

Si te acercás al límite:
- Subir `tracesSampleRate` a `0.02` (server) y `0.05` (cliente) en los archivos `sentry.*.config.ts`
- Agregar más patrones al array `ignoreErrors` para suprimir ruido
- Settings → Inbound Filters → activar "Filter out events from legacy browsers" y "Browser extension errors"

## Arquitectura local

```
sala/
├── instrumentation.ts             # Hook server (Node + Edge)
├── instrumentation-client.ts      # Hook cliente (Next 16)
├── sentry.client.config.ts        # Init browser
├── sentry.server.config.ts        # Init Node runtime
├── sentry.edge.config.ts          # Init Edge runtime (middleware)
├── next.config.ts                 # withSentryConfig wrapper + source maps
├── src/lib/observability.ts       # Helpers: captureError, captureMessage, setTag, withTags
└── SENTRY_SETUP.md                # este archivo
```

## Stub-safe — qué pasa sin DSN

| Pieza                          | Sin `SENTRY_DSN`                                   |
|--------------------------------|----------------------------------------------------|
| `sentry.client.config.ts`      | `if (dsn)` short-circuit — no inicializa nada      |
| `sentry.server.config.ts`      | Idem                                               |
| `sentry.edge.config.ts`        | Idem                                               |
| `instrumentation.ts`           | Carga los archivos, pero quedan sin efecto         |
| `next.config.ts` build         | Source maps no se suben (no falla)                 |
| `captureError()` / `captureMessage()` | Cae a `console.error` — visible en Vercel logs |
| `withTags()` / `setTag()` / `setUserContext()` | No-ops silenciosas                  |

Eso significa que podés mergear esta integración **antes** de crear la cuenta de Sentry y nada se rompe.

## Privacidad / PII

Tanto el cliente como el servidor sanean antes de enviar:

- Email del user → eliminado
- IP del user → eliminada
- Query params sensibles (`email`, `token`, `access_token`, `phone`, `tel`, `password`) → `[redacted]`
- Headers sensibles (`authorization`, `cookie`, `x-supabase-auth`, `x-api-key`) → `[redacted]`
- Session replay → `maskAllText: true`, `maskAllInputs: true`, `blockAllMedia: true`

## Uso desde código

```ts
import { captureError, captureMessage, setTag, withTags } from '@/lib/observability'

// Errores recuperables (catch normal)
try {
  await algo()
} catch (err) {
  captureError(err, { stage: 'algo', userId: user.id })
}

// Eventos sin excepción (degradaciones, casos raros)
captureMessage('payment retry max attempts reached', 'warning', {
  paymentId,
  attempts: 5,
})

// Tagging a nivel scope completo (útil al inicio de un webhook/cron)
setTag('webhook', 'stripe')

// Tagging temporal solo dentro del callback
return withTags({ webhook: 'whatsapp' }, async () => {
  // todo error capturado aquí lleva el tag
  return procesarMensaje()
})
```

## Ignored errors

Si aparece ruido recurrente que no es accionable, agregalo al array `ignoreErrors` de `sentry.server.config.ts` o `sentry.client.config.ts`. Patrones permitidos: string exacto o RegExp.

## Migrar entre versiones de Sentry

Cuando salga una versión major (ej. 11.x), Sentry suele tener una guía oficial. Antes de upgradear:

```bash
npm view @sentry/nextjs version peerDependencies
```

Confirmar que la nueva versión soporta el Next.js que usamos (hoy 16.x).
