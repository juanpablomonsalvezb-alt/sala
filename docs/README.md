# Documentación de SEO y Wikidata — Nebbuler

Este directorio contiene documentación técnica completa para optimización de búsqueda, integración con Wikidata, y auditoría de madurez SEO.

## 🚀 START HERE: ACTIONS_CHECKLIST.md

**Si tienes 30 minutos ahora mismo**, abre `ACTIONS_CHECKLIST.md`. Es un checklist copy-paste ready para:
1. ✅ Google Search Console (verificar + enviar sitemap)
2. ✅ Bing Webmaster Tools (indexar)
3. ✅ Wikidata entry (crear entrada en Wikipedia's knowledge base)

**Tiempo**: 30 minutos  
**Impacto**: +2 puntos SEO score (7.6 → 9.6)

---

## Archivos

### 0. **ACTIONS_CHECKLIST.md** ⭐⭐⭐ EJECUTAR AHORA
Checklist paso-a-paso copy-paste ready para todas las acciones P0.

**Incluye**:
- Instrucciones exactas para Google Search Console (10 min)
- Instrucciones para Bing Webmaster Tools (5 min)
- Guía para crear entrada en Wikidata (15 min)
- Validación final y próximos pasos

**Acción inmediata**: Abre este archivo y sigue los pasos. Toma 30 minutos.

---

### 1. **SEO_MATURITY_AUDIT.md** ⭐ Leer primero (para contexto)
Auditoría completa de madurez SEO actual de Nebbuler (7.6/10).

**Incluye**:
- Análisis de 12 categorías SEO
- Scores detallados por categoría
- Identificación de fortalezas y debilidades
- Recomendaciones prioritizadas (P0/P1/P2)
- Timeline para mejoras

**Cuándo leer**: Después de completar ACTIONS_CHECKLIST, para entender qué está bien y qué falta.

---

### 2. **WIKIDATA_INTEGRATION.md** — Guía Completa
Guía paso-a-paso para crear y mantener la entrada de Nebbuler en Wikidata.

**Incluye**:
- Propiedades Wikidata requeridas (20+)
- Estructura para el fundador (Juan Pablo Monsalvez)
- Mapeo schema.org ↔ Wikidata
- Instrucciones detalladas para cada paso
- Ejemplos y referencias
- Políticas de mantenimiento continuo

**Cuándo usar**: Si necesitas entender en profundidad cómo funciona Wikidata (lectura técnica).

---

### 3. **WIKIDATA_ENTRY_TEMPLATE.md** — Copy-Paste Ready
Template pre-llenado con todos los valores específicos de Nebbuler.

**Incluye**:
- Labels y descripciones (español/inglés/portugués)
- 12 afirmaciones (statements) estructuradas
- Referencias preparadas
- Formulario de verificación
- Checklist pre-submit

**Cuándo usar**: Al crear la entrada en Wikidata (paso 3 del ACTIONS_CHECKLIST).

---

## Flujo de Trabajo Recomendado

### Fase 0: Acciones Inmediatas (AHORA — 30 minutos)
```
1. Abre: ACTIONS_CHECKLIST.md
2. Sigue: Los 3 pasos principales
3. Valida: Que todo esté funcionando
4. Documenta: Q-number de Wikidata
```

**Resultado**: SEO score de 7.6 → 9.6

### Fase 1: Verificación Actual (Opcional — lectura)
```
1. Leer: SEO_MATURITY_AUDIT.md
2. Revisar: Scoring actual (7.6/10 antes de acciones, 9.6 después)
3. Identificar: Qué está bien, qué falta
```

**Resultado**: Entiendes por qué cada acción importa.

### Fase 2: Wikidata Integration (Ya cubierta por ACTIONS_CHECKLIST)
```
1. Leer: WIKIDATA_INTEGRATION.md (entender contexto)
2. Copiar: WIKIDATA_ENTRY_TEMPLATE.md
3. Crear: Nueva entrada en https://www.wikidata.org/wiki/Wikidata:New_Item
4. Pegar: Template pre-llenado
5. Revisar: Checklist de validación
6. Publicar: Crear item
```

**Tiempo estimado**: 15-20 minutos (paso 3 de ACTIONS_CHECKLIST)

### Fase 3: Monitoreo Continuo (Mensual)
```
- Google Search Console: revisar Coverage, errores
- Bing Webmaster: revisar crawl stats
- Rankings: posiciones en búsqueda
- Citas en AI: ChatGPT, Claude, Gemini
- Tráfico orgánico: Google Analytics
```

### Fase 4: Mejoras Iterativas (Q3 2026)
```
- Backlink strategy execution
- FAQ Schema implementation  
- Event Schema para lanzamientos
- Core Web Vitals optimization
```

---

## Implementación Técnica Ya Completa

✅ **Código y Schema** (no requiere acción adicional):

- Organization schema.org: `/src/app/sobre/page.tsx`
- Person schema (founder): `/src/app/sobre/page.tsx`
- WebSite schema: `/src/app/layout.tsx`
- SoftwareApplication schema: `/src/app/layout.tsx`
- Article schema: `/src/app/c/[creator]/[quoteId]/page.tsx`
- NewsArticle schema: `/src/app/construyendo/page.tsx`
- Twitter cards: `/src/app/layout.tsx`
- OpenGraph: Raíz + página-específico
- Sitemap dinámico: `/src/app/sitemap.ts`
- Robots.txt dinámico: `/src/app/robots.ts`

---

## Preguntas Frecuentes

### ¿Por qué necesito hacer estos pasos?
- **Google Search Console**: Sin él, Google no ve cuándo actualizas tu sitio
- **Bing Webmaster**: Bing indexa rápido, importante para LATAM
- **Wikidata**: Aparece en Google Knowledge Graph + IA (ChatGPT, Claude, Gemini)

### ¿Cuánto tarda en reflejarse?
- Google: 24 horas (rastreo) → 1 semana (indexación) → 2-4 semanas (rankings)
- Bing: 24-48 horas
- Wikidata → Google Knowledge Graph: 24-48 horas

### ¿Qué pasa si me equivoco?
- Totalmente reversible en todos los casos
- Puedes editar después en Search Console, Bing y Wikidata
- No hay penalización por errores

### ¿Es obligatorio?
No, pero es:
- Muy recomendado para credibilidad
- Relativamente fácil (con templates)
- Diferenciador competitivo
- Base para featured snippets y Knowledge Graph

---

## Recursos Externos

### Google
- [Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile Friendly Test](https://search.google.com/test/mobile-friendly)

### Microsoft Bing
- [Webmaster Tools](https://www.bing.com/webmasters)

### Wikidata
- [Main Page](https://www.wikidata.org/)
- [Create New Item](https://www.wikidata.org/wiki/Wikidata:New_Item)
- [Property Browser](https://www.wikidata.org/wiki/Special:ListProperties)
- [Community Chat](https://www.wikidata.org/wiki/Wikidata:Project_chat)

### Schema.org
- [Schema.org Validator](https://validator.schema.org/)
- [Organization Type](https://schema.org/Organization)
- [WebSite Type](https://schema.org/WebSite)

---

## Métricas de Éxito

**30 días post-acciones P0**:
- ✅ Google Search Console verificado
- ✅ Sitemap indexado en Google
- ✅ Bing rastreando sitio
- ✅ Wikidata entry público y completo

**90 días post-acciones**:
- ✅ 50+ keywords rankeando (página 1-3)
- ✅ 1000+ monthly impressions en GSC
- ✅ Google Knowledge Graph activo
- ✅ Citas en IA (ChatGPT, Claude, Gemini)

**180 días post-acciones (Q3 2026)**:
- ✅ 100+ backlinks desde sitios relevantes
- ✅ Featured snippets para 5+ key queries
- ✅ 2000+ monthly organic visitors
- ✅ Posición promedio: página 1 para brand queries

---

## Historial de Cambios

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-05-12 | ACTIONS_CHECKLIST creado | ✅ Completo |
| 2026-05-12 | Auditoría completa + Wikidata docs | ✅ Completado |
| 2026-05-12 | Schema.org enhancement | ✅ Completado |
| TBD | Search Console verification (acción manual) | ⏳ Pendiente |
| TBD | Wikidata entry creation (acción manual) | ⏳ Pendiente |

---

**Última actualización**: 2026-05-12  
**Versión**: 2.0 (con ACTIONS_CHECKLIST)  
**Autor**: Claude AI (SEO Maturity Phase 2E Execution)

---

**¡AHORA MISMO?** Abre `ACTIONS_CHECKLIST.md` y dedica 30 minutos. Es el cambio más importante que puedes hacer hoy para SEO.
