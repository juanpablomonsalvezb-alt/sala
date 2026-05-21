# WhatsApp Cloud API — guía de configuración (Nebbuler)

Esta guía te lleva paso a paso desde 0 hasta tener notificaciones de nuevos posts
enviándose por WhatsApp a tus suscriptores. Tiempo estimado: ~45 min (incluyendo
aprobación de templates por Meta, que puede tardar más en la cola de revisión).

---

## 1. Crear app en Meta Business Manager

1. Entra a [business.facebook.com](https://business.facebook.com) con la cuenta
   propietaria de Nebbuler.
2. Crea un **Business Manager** si aún no tienes (Settings → Business Info).
3. Ve a [developers.facebook.com/apps](https://developers.facebook.com/apps) y
   crea una **App** del tipo **Business**.
4. Dentro de la app, agrega el producto **WhatsApp** (botón "Set up").

---

## 2. Obtener credenciales

Tras configurar WhatsApp en la app verás el panel **API Setup**:

| Variable | Dónde sacarla |
| --- | --- |
| `WHATSAPP_API_TOKEN` | Pestaña *API Setup* → "Temporary access token". Para producción genera un **System User Access Token** permanente en *Business Settings → System Users → Generate New Token* con permisos `whatsapp_business_messaging` y `whatsapp_business_management`. |
| `WHATSAPP_PHONE_NUMBER_ID` | *API Setup* → "From" → copia el ID del número (no el `display_phone_number`). |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | **Inventa tú** un string aleatorio (`openssl rand -hex 32`). Es el shared secret entre Meta y nuestro endpoint. |
| `WHATSAPP_APP_SECRET` *(opcional pero recomendado)* | *App Settings → Basic → App Secret*. Habilita validación HMAC del webhook. |
| `WHATSAPP_TEMPLATE_NEW_POST` *(opcional)* | Nombre del template a usar (default: `nuevo_post_es`). |

---

## 3. Crear templates aprobados

Meta exige que cada mensaje fuera de la ventana de 24h sea un **template
aprobado**. Ve a *WhatsApp Manager → Message Templates → Create*.

### 3.1 Template `nuevo_post_es` (notificación de nuevo post)

- **Name**: `nuevo_post_es`
- **Category**: `MARKETING`
- **Language**: `Spanish` (`es`)
- **Body** (4 parámetros posicionales):

  ```
  {{1}} acaba de publicar:

  "{{2}}"

  Léelo aquí → {{3}}

  Para cambiar canal o desuscribir: {{4}}
  ```

  Donde:
  - `{{1}}` = nombre del creador
  - `{{2}}` = título del post
  - `{{3}}` = URL completa al post
  - `{{4}}` = URL de preferencias / unsubscribe

### 3.2 Template `verificacion_codigo` (código OTP)

- **Name**: `verificacion_codigo`
- **Category**: `AUTHENTICATION` (recomendado — entrega más rápida)
- **Language**: `Spanish` (`es`)
- **Body**:

  ```
  Tu código de verificación de Nebbuler es: {{1}}

  Expira en 10 minutos. No lo compartas con nadie.
  ```

> **Importante:** la aprobación tarda entre 1 minuto y 24 horas. Mientras no esté
> aprobado, el endpoint `/api/notifications/verify-phone` devolverá un error
> `send_failed` con razón explícita en consola, pero **NO crashea** la app.

---

## 4. Configurar webhook

1. En la app de Meta, ve a **WhatsApp → Configuration → Webhook**.
2. **Callback URL**: `https://nebbuler.com/api/webhooks/whatsapp`
3. **Verify token**: el mismo string que pusiste en
   `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
4. Click **Verify and Save**. Meta hará un GET a tu endpoint con `hub.mode=subscribe`.
5. Suscríbete a los campos:
   - `messages` (mensajes inbound, incluye STOP/BAJA)
   - `message_template_status_update` (opcional, para tracking)

> Si la verificación falla, revisa que `WHATSAPP_WEBHOOK_VERIFY_TOKEN` esté
> definido en Vercel y el deployment esté actualizado.

---

## 5. Setear variables en Vercel

Usa `printf` (NO `echo` — añade `\n` invisibles que rompen los tokens):

```bash
cd /Users/juanpablomonsalvez/Downloads/sala

printf "%s" "EAAG...tu-token..." | npx vercel env add WHATSAPP_API_TOKEN production
printf "%s" "1234567890" | npx vercel env add WHATSAPP_PHONE_NUMBER_ID production
printf "%s" "$(openssl rand -hex 32)" | npx vercel env add WHATSAPP_WEBHOOK_VERIFY_TOKEN production
printf "%s" "abcd1234..." | npx vercel env add WHATSAPP_APP_SECRET production  # opcional
printf "%s" "nuevo_post_es" | npx vercel env add WHATSAPP_TEMPLATE_NEW_POST production  # opcional
```

Replica los mismos en `preview` y `development` si los necesitas.

---

## 6. Aplicar migración de DB

```bash
# Si usas Supabase CLI:
npx supabase db push

# O aplica manualmente el SQL de:
# supabase/migrations/20260521000005_whatsapp_prefs.sql
```

Esto crea:
- Columnas `phone_number`, `phone_verified`, etc. en `sala_profiles`
- Columna `channel_preference` en `sala_subscriptions`
- Tabla `sala_notification_log`
- Vista `sala_creator_whatsapp_stats`

---

## 7. Probar end-to-end

1. Abre `/dashboard/preferencias` con tu cuenta de testing.
2. Selecciona "Solo WhatsApp" en alguna suscripción activa.
3. Ingresa tu teléfono en formato E.164 (`+56912345678`).
4. Click **Enviar código de verificación** → debes recibir un WhatsApp con el
   código en 5–10 segundos.
5. Ingresa el código en el modal → debe quedar marcado como verificado.
6. Crea un nuevo post como el creador al que te suscribiste — deberías recibir
   la notificación por WhatsApp en menos de 10 segundos.
7. Envía "STOP" al chat → tu `channel_preference` debe degradar a `email`
   automáticamente (verifica en `sala_subscriptions`).

---

## 8. Comportamiento stub-safe (sin credenciales)

El sistema está diseñado para **NO crashear** si las env vars no están:

| Falta | Comportamiento |
| --- | --- |
| `WHATSAPP_API_TOKEN` | `isWhatsAppConfigured()` devuelve `false`. Los envíos por WA se omiten con `console.warn`. Los emails siguen funcionando. El endpoint de verificación guarda el código en DB y, en `NODE_ENV=development`, lo devuelve en `dev_code` para facilitar testing. |
| `WHATSAPP_PHONE_NUMBER_ID` | Idem. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | GET al webhook devuelve `500 not_configured`. POST inbound se ignora con warning. |
| `WHATSAPP_APP_SECRET` | Validación HMAC se omite (warning en consola). El webhook sigue aceptando POST. |
| `RESEND_API_KEY` | Email skip; si el suscriptor pidió solo email se loguea y se omite. |

---

## 9. Rate limits

WhatsApp Cloud API (Tier 1):
- **80 mensajes/segundo** (rate limit duro)
- **1.000 mensajes/usuario/día**

El cliente en `src/lib/whatsapp.ts` respeta ambos con una cola interna en memoria
(no persistente — si Vercel reinicia el proceso, se reinicia).

Si necesitas más volumen, sube tu cuenta a Tier 2/3/4 desde **WhatsApp Manager → Insights → Quality rating**.

---

## 10. Costos (referencia 2026)

- **Service conversations** (las inbound del usuario): **gratis** dentro de la
  ventana de 24h.
- **Marketing templates** (notificaciones de nuevos posts): ~**0.05 USD por
  conversación** en Chile (24h de mensajes ilimitados con ese usuario).
- **Authentication templates** (códigos OTP): ~**0.0125 USD** por mensaje en
  Chile.

Revisa precios actualizados en
[developers.facebook.com/docs/whatsapp/pricing](https://developers.facebook.com/docs/whatsapp/pricing).

---

## Archivos involucrados

| Archivo | Propósito |
| --- | --- |
| `src/lib/whatsapp.ts` | Cliente Cloud API (envío + helpers) |
| `src/lib/notify.ts` | Dispatcher multi-canal (email + WA) |
| `src/app/api/notifications/verify-phone/route.ts` | OTP por WhatsApp |
| `src/app/api/webhooks/whatsapp/route.ts` | Inbound (STOP/BAJA) + statuses |
| `src/app/api/subscriptions/[id]/channel/route.ts` | Cambiar canal por suscripción |
| `src/app/api/subscriptions/channel/bulk/route.ts` | Aplicar canal a todas |
| `src/components/notifications/PreferencesPanel.tsx` | UI cliente |
| `src/app/dashboard/preferencias/page.tsx` | Página de preferencias |
| `src/app/dashboard/_components/WhatsAppStatsCard.tsx` | Card para el creador |
| `supabase/migrations/20260521000005_whatsapp_prefs.sql` | Schema |

---

## Troubleshooting

**El código no llega al WhatsApp**
- Confirma que el template `verificacion_codigo` está **APPROVED** en Meta.
- Revisa logs de Vercel: `[whatsapp] send failed status=…`
- Verifica que el número del usuario coincide con el formato E.164 (`+CC...`).

**Meta marca el número como "Restricted"**
- Significa que mandaste mensajes a usuarios que te bloquearon. Reduce volumen,
  mejora la calidad del template, espera 24–48h.

**El webhook no recibe eventos**
- Confirma en Meta App Dashboard → WhatsApp → Configuration que el webhook está
  **verificado** y los campos `messages` están suscritos.
- Prueba con `curl -X POST https://nebbuler.com/api/webhooks/whatsapp -d '{}'`
  desde tu terminal — debe responder `{"ok":true}`.

**STOP/BAJA no degrada el canal**
- El número del usuario debe coincidir EXACTAMENTE con `phone_number` en
  `sala_profiles` (E.164, mismo formato).
- Verifica que `phone_verified=true` (sin verificación no se aplica el opt-out).
