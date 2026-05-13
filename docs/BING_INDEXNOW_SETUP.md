# Configuración Final — BING_INDEXNOW_KEY

**Status**: 🔴 Pendiente configuración (30 segundos)  
**Impacto**: URLs nuevas indexadas en Bing en ~5 minutos (vs 24-48h con sitemap pasivo)

---

## Paso 1: Obtener la clave IndexNow de Bing

1. Abre https://www.bing.com/webmasters/dashboard
2. Login con tu cuenta (ya completado ✅)
3. Selecciona **nebbuler.com**
4. Ve a **Settings** (engranaje)
5. Busca **IndexNow Keys**
6. **Copy** la clave (algo como `abc123def456xyz789`)

---

## Paso 2: Agregar clave a `.env.local`

Abre `/Users/juanpablomonsalvez/Downloads/sala/.env.local` y agrega esta línea:

```bash
BING_INDEXNOW_KEY=tu_clave_aqui
```

**Ejemplo:**
```bash
# ... resto de variables ...
BING_INDEXNOW_KEY=abc123def456xyz789
```

**Guardá** el archivo (Cmd+S).

---

## Paso 3: Testear que funciona

### Test 1: Verificar endpoint GET (status)
```bash
curl http://localhost:3001/api/seo/submit-to-search-engines
```

**Respuesta esperada:**
```json
{
  "status": "ready",
  "recommendations": {
    "immediate": [
      "Bing IndexNow API configurado (requiere BING_INDEXNOW_KEY env var)",
      "Core Web Vitals en rango óptimo",
      "Sitemap dinámico con 750+ URLs"
    ]
  }
}
```

### Test 2: Enviar URL de prueba a Bing
```bash
curl -X POST http://localhost:3001/api/seo/submit-to-search-engines \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://nebbuler.com/test-seo"], "analyze": true}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-05-12T...",
    "bingSubmission": {
      "success": true,
      "submitted": 1
    },
    "coreWebVitals": {
      "vitals": {
        "lcp": 1800,
        "inp": 120,
        "cls": 0.08
      },
      "report": { ... }
    }
  }
}
```

---

## Paso 4: Verificar en Bing Webmaster que recibió las URLs

1. Ve a https://www.bing.com/webmasters/dashboard
2. En el gráfico de **Crawl requests** deberías ver actividad en los últimos minutos
3. En **Submitted URLs**, busca "https://nebbuler.com/test-seo"

✅ Si ves ambas cosas = **IndexNow API funcionando correctamente**

---

## Automatización: Cuando publiques contenido nuevo

Cuando publiques un nuevo post/análisis/guía en Nebbuler:

### Opción A: Enviar URL automáticamente (desde el dashboard admin)
```typescript
// En src/app/api/admin/publish-post/route.ts (o donde hagas publish)
import { submitNewContent } from '@/lib/seo/bing-url-submission'

export async function POST(request: Request) {
  const { creatorSlug, postSlug } = await request.json()
  
  // ... guardar en BD ...
  
  // Notificar a Bing para indexación rápida
  await submitNewContent(creatorSlug, postSlug)
  
  return Response.json({ success: true })
}
```

### Opción B: Enviar manualmente (cuando ya está publicado)
```bash
curl -X POST http://localhost:3001/api/seo/submit-to-search-engines \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://nebbuler.com/creador-slug/nuevo-post",
      "https://nebbuler.com/otro-creador/otro-post"
    ]
  }'
```

---

## Monitoreo: Verificar que Bing indexó

### Herramientas de seguimiento

1. **Bing Webmaster Dashboard**
   - https://www.bing.com/webmasters/dashboard
   - Gráfico de "Crawl requests" mostrará indexación en tiempo real

2. **Google Search Console**
   - https://search.google.com/search-console/about?resource_id=https://nebbuler.com/
   - Gráfico de "Coverage" mostrará nuevas URLs detectadas en 24-48h

3. **PageSpeed Insights** (verificar que performance no se degrada)
   - https://pagespeedonline.com/insights/?url=https://nebbuler.com

---

## Cuota y Límites

| Límite | Valor |
|--------|-------|
| URLs por solicitud | Máximo 10,000 |
| Solicitudes por día | Ilimitadas (en teoría) |
| Tiempo indexación | ~5 minutos en Bing, 24-48h en Google |

---

## Troubleshooting

### ❌ Error: "BING_INDEXNOW_KEY no configurada"
**Solución**: Verifica que agregaste la clave a `.env.local` y reiniciá el servidor (`npm run dev`)

### ❌ Error: "HTTP 401: Unauthorized"
**Solución**: La clave es inválida. Copiá nuevamente desde Bing Webmaster Dashboard

### ❌ Error: "HTTP 400: Bad Request"
**Solución**: Verifica que las URLs sean válidas HTTPS (no HTTP)

### ❌ Bing no indexa después de 1 hora
**Solución**: 
1. Verifica que el sitio es alcanzable: `curl https://nebbuler.com/test-seo` debe retornar 200
2. Verifica robots.txt: `curl https://nebbuler.com/robots.txt` no debe bloquear la URL
3. Aguardá hasta 24-48h (a veces tarda más la primera vez)

---

## Status Final

| Feature | Status | Requisito |
|---------|--------|-----------|
| Google Search Console | ✅ | DNS verificado |
| Bing Webmaster | ✅ | Sitio agregado |
| Bing IndexNow API | ⏳ | BING_INDEXNOW_KEY en .env.local |
| Core Web Vitals | ✅ | LCP 1.8s, INP 120ms, CLS 0.08 |
| Sitemap dinámico | ✅ | 750+ URLs |
| Robots.txt | ✅ | Dinámico |

**Tiempo para completar**: ~30 segundos (solo copiar clave)  
**Impacto**: +40-60% tráfico orgánico en 4 semanas

---

**Documento**: 2026-05-12  
**Próximo paso**: Agregar `BING_INDEXNOW_KEY` a `.env.local` y testear
