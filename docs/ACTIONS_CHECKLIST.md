# Checklist de Acciones — Fase P0 de SEO

**Estado**: Listo para ejecución  
**Tiempo estimado**: 30 minutos  
**Beneficio**: +2 puntos de SEO score (7.6 → 9.6)

---

## 1. Google Search Console — 10 minutos

Este es el PASO MÁS CRÍTICO. Sin Search Console, Google no ve actualizaciones en tu sitio.

### Paso 1.1: Crear/Acceder a Search Console
1. Ve a: https://search.google.com/search-console
2. Inicia sesión con tu Google Account (la misma que usas para Gmail/Drive)

### Paso 1.2: Agregar propiedad (dominio completo)
1. Click en **"Agregar propiedad"** (esquina superior izquierda)
2. Selecciona **"Dominio"** (NO URL prefix)
3. Ingresa: `nebbuler.com`
4. Click **"Continuar"**

### Paso 1.3: Verificar propiedad (DNS)
Se te pedirá verificar que eres dueño del dominio. Hay dos métodos:

**Método A: Registro DNS (RECOMENDADO — permanente)**
1. Search Console te dará un registro TXT: `google-site-verification=XXXXXXX`
2. Ve a tu proveedor de DNS (probablemente Vercel o el registrador del dominio)
3. Agrega un nuevo registro TXT:
   - **Tipo**: TXT
   - **Nombre**: `nebbuler.com` (o dejar vacío según el proveedor)
   - **Valor**: `google-site-verification=XXXXXXX` (copia exacta de Search Console)
4. Click "Verificar" en Search Console
5. Espera 1-5 minutos (DNS tarda en propagar)

**Método B: Etiqueta HTML (temporal)**
1. Search Console te da una etiqueta `<meta>` como:
   ```html
   <meta name="google-site-verification" content="XXXXXXX">
   ```
2. Agrégala a `/src/app/layout.tsx` en el `<head>` (pero esto NO es permanente)
3. Deploy a producción (`vercel deploy --prod`)
4. Vuelve a Search Console y click "Verificar"

**Recomendación**: Usa Método A (DNS). Es más robusto y permanente.

### Paso 1.4: Enviar Sitemap
1. Una vez verificada la propiedad, ve a **"Sitemaps"** en el menú izquierdo
2. Click **"Agregar/probar sitemap"**
3. Ingresa: `nebbuler.com/sitemap.xml`
4. Click **"Enviar"**

### Paso 1.5: Verificar indexación inicial
1. Ve a **"Cobertura"** en el menú izquierdo
2. Verás un gráfico con URLs indexadas/excluidas
3. Espera 24-48 horas. Google comenzará a crawlear el sitio.
4. Vuelve cada día para monitorear:
   - URLs indexadas (debe crecer)
   - Errores (debe ser 0)
   - Advertencias (debe ser mínimo)

**Señal de éxito**: "Válida" = URL indexada correctamente

### Checklist 1
- [ ] Accedí a Search Console
- [ ] Agregué propiedad `nebbuler.com` (dominio)
- [ ] Verifiqué propiedad (DNS o HTML)
- [ ] Envié sitemap.xml
- [ ] Verifiqué que el sitio aparece en Cobertura
- [ ] Documenté la fecha de verificación

---

## 2. Bing Webmaster Tools — 5 minutos

Menos crítico que Google, pero Bing indexa rápido y es importante para mercados hispanohablantes.

### Paso 2.1: Crear/Acceder a Bing Webmaster
1. Ve a: https://www.bing.com/webmasters
2. Inicia sesión con Microsoft Account (Hotmail/Outlook) o Google

### Paso 2.2: Agregar sitio
1. Click **"Agregar sitio"**
2. Ingresa: `https://nebbuler.com`
3. Click **"Agregar"**

### Paso 2.3: Verificar propiedad (método simplificado)
Bing ofrece múltiples métodos:
1. **XML sitemap** (más fácil): Si ya verificaste en Google Search Console, Bing puede detectarlo automáticamente. Espera 1-2 minutos.
2. **Meta tag HTML**: Similar a Google, agrega una etiqueta al `<head>`
3. **CNAME DNS**: Crea un registro DNS especial

**Recomendación**: Espera 2-3 minutos a que Bing detecte automáticamente tu sitemap. Si no lo hace, usa XML Sitemap manualmente:
- Click **"Sitemap"** en el menú
- Ingresa: `https://nebbuler.com/sitemap.xml`

### Paso 2.4: Verificar crawling
1. Ve a **"Rastreo"** → **"Actividad de rastreo"**
2. Verás cuántas páginas ha rastreado Bing
3. Debe crecer en los próximos días

### Checklist 2
- [ ] Accedí a Bing Webmaster Tools
- [ ] Agregué sitio `nebbuler.com`
- [ ] Verifiqué propiedad
- [ ] Envié sitemap (si fue necesario)
- [ ] Verifiqué actividad de rastreo

---

## 3. Wikidata Entry — 15 minutos

Esta es la parte más poderosa: hace que Nebbuler aparezca en Wikipedia, Google Knowledge Graph, y bases de datos IA.

### Paso 3.1: Preparación
1. Abre en una pestaña: https://www.wikidata.org/wiki/Wikidata:New_Item
2. Abre en otra pestaña: `/Users/juanpablomonsalvez/Downloads/sala/docs/WIKIDATA_ENTRY_TEMPLATE.md`
3. Ten listo el template copy-paste

### Paso 3.2: Crear nuevo ítem
1. En Wikidata New Item:
   - **Language**: Selecciona "Español"
   - **Label**: `Nebbuler`
   - **Description**: `plataforma de newsletters profesionales de pago para América Latina`
   - **Aliases**: `Nebbuler - Plataforma de Newsletters`, `Newsletter profesional Nebbuler`

2. Click **"Create"**

### Paso 3.3: Agregar afirmaciones (statements)
Ahora estás en la página del ítem de Nebbuler. Ve a WIKIDATA_ENTRY_TEMPLATE.md y copia cada bloque de 12 afirmaciones:

1. Click **"+ add statement"**
2. **Property**: (copia del template, ej: `instance of`)
3. **Value**: (copia del template, ej: `Project`)
4. Click "Publish"
5. Repite para las 12 afirmaciones

**Orden sugerido** (del template):
1. instance of (P31) → Project (Q41710)
2. inception (P571) → 2025-01-01
3. founded by (P112) → [crea o busca Juan Pablo Monsalvez]
4. country (P17) → Chile (Q298)
5. located in administrative territory (P131) → Metropolitan Region of Santiago (Q2474)
6. coordinate location (P625) → -33.4489, -70.6693
7. official website (P856) → https://nebbuler.com
8. language of work or name (P407) → Spanish (Q1321)
9. genre (P680) → Newsletter (Q4418383)
10. LinkedIn company ID (P6634) → nebbuler
11. Instagram username (P2003) → nebbuler
12. area served (P2541) → [Agrega los 19 países]

### Paso 3.4: Agregar referencias (IMPORTANTE)
Para cada statement importante:
1. Click en el ícono de referencia ("cite" o "reference")
2. **stated in (P248)**: https://nebbuler.com/sobre
3. **retrieved (P813)**: Hoy (2026-05-12)
4. Click "Publish"

### Paso 3.5: Agregar descripciones multilingües (opcional pero recomendado)
1. Click **"add label"** en la sección de inglés
2. **Label**: `Nebbuler`
3. **Description**: `professional newsletter platform for Latin America`

### Paso 3.6: Publicar
1. Click **"Publish"** (debe estar visible en botón superior)
2. Espera confirmación de que el ítem fue creado

**Señal de éxito**: Tu ítem tiene una URL como `https://www.wikidata.org/wiki/Q123456` (donde Q123456 es el ID de tu ítem)

### Checklist 3
- [ ] Creé entrada en Wikidata.org
- [ ] Agregué 12 afirmaciones (statements)
- [ ] Agregué referencias para cada statement
- [ ] Agregué descripciones multilingües (opcional)
- [ ] Publiqué el ítem
- [ ] Copié el URL del ítem (Q-number)
- [ ] Documenté el Q-number en un archivo local

---

## 4. Validación Final — 2 minutos

Después de completar los 3 pasos anteriores, verifica que todo funciona:

### Validación 4.1: Google Search Console
```bash
# En tu navegador, abre:
https://search.google.com/search-console
# Y verifica:
# - Cobertura: debe mostrar URLs indexadas
# - Errores: debe ser 0
```

### Validación 4.2: Bing Webmaster
```bash
# En tu navegador, abre:
https://www.bing.com/webmasters
# Y verifica:
# - Rastreo: debe mostrar páginas rastreadas
# - Sitemap: debe estar "procesado"
```

### Validación 4.3: Wikidata
```bash
# En tu navegador, abre:
https://www.wikidata.org/wiki/Q[TU-NUMERO]
# Y verifica:
# - Todas las afirmaciones están presentes
# - Referencias están activas
```

### Validación 4.4: Google Knowledge Graph (24-48 horas)
```bash
# Dentro de 24-48 horas, busca en Google:
https://www.google.com/search?q=Nebbuler
# Deberías ver un panel a la derecha con:
# - Logo
# - Descripción
# - Links
# - Información de contacto
```

### Checklist 4
- [ ] Search Console muestra URLs indexadas
- [ ] Bing Webmaster muestra actividad de rastreo
- [ ] Wikidata ítem es visible y públicamente accesible
- [ ] (Opcional) Google Knowledge Graph aparece después de 48h

---

## 5. Próximos Pasos (Fase 2+)

Una vez completes los P0 anteriores:

### Monitoreo Semanal (5 minutos)
- Search Console → Coverage: Verificar que no hay nuevos errores
- Bing Webmaster → Rastreo: Verificar que crece
- Google Analytics (si existe): Revisar tráfico orgánico

### Mejora Mensual (30 minutos)
- Crear 1-2 artículos de blog (newsletter "Construyendo Nebbuler" ya está, continúa)
- Analizar top queries en Search Console (qué te buscan, qué rankings tienes)
- Mejorar meta descriptions basado en CTR bajo
- Actualizar Wikidata con nuevos datos (si hay cambios)

### Objetivo Q3 2026
- 50+ keywords rankeando (página 1-3)
- 1000+ monthly impressions en Google
- 100+ backlinks desde sitios relevantes
- Featured snippets para 5+ queries principales

---

## 6. Documento de Referencia Rápida

Guarda estas URLs para referencia futura:

```
Google Search Console: https://search.google.com/search-console
Bing Webmaster: https://www.bing.com/webmasters
Wikidata Nebbuler: https://www.wikidata.org/wiki/Q[TU-NUMERO]
Nebbuler robots.txt: https://nebbuler.com/robots.txt
Nebbuler sitemap.xml: https://nebbuler.com/sitemap.xml
Audit técnico: /docs/SEO_MATURITY_AUDIT.md
Template Wikidata: /docs/WIKIDATA_ENTRY_TEMPLATE.md
Guía Wikidata: /docs/WIKIDATA_INTEGRATION.md
```

---

## 7. Soporte y Preguntas Frecuentes

### ¿Cuánto tarda en aparecer en Google?
- Rastreo inicial: 1-7 días
- Indexación: 1-2 semanas
- Rankings iniciales: 2-4 semanas
- Estabilización: 1-3 meses

### ¿Qué hago si hay errores en Search Console?
1. Click en "Errores"
2. Selecciona un error específico
3. Lee la descripción (generalmente da la solución)
4. Corrige en el código (si es necesario deploy)
5. Click "Solicitar indexación" cuando está arreglado

### ¿Puede equivocarme en Wikidata?
Sí, y es completamente reversible. La comunidad de Wikidata puede corregir tus cambios. No hay penalización por errores.

### ¿Qué pasa después de verificar en Search Console?
Google comenzará a rastrear tu sitio automáticamente. El proceso toma días/semanas. Mientras esperas, puedes:
- Crear más contenido (blog, newsletter)
- Mejorar Core Web Vitals
- Construir backlinks
- Actualizar Wikidata

---

**Estado**: ✅ Listo para ejecutar  
**Última actualización**: 2026-05-12  
**Versión**: 1.0
