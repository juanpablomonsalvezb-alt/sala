# Documentación de SEO y Wikidata — Nebbuler

Este directorio contiene documentación técnica completa para optimización de búsqueda, integración con Wikidata, y auditoría de madurez SEO.

## Archivos

### 1. **SEO_MATURITY_AUDIT.md** ⭐ Leer primero
Auditoría completa de madurez SEO actual de Nebbuler (7.6/10).

**Incluye**:
- Análisis de 12 categorías SEO
- Scores detallados por categoría
- Identificación de fortalezas y debilidades
- Recomendaciones prioritizadas (P0/P1/P2)
- Timeline para mejoras

**Acción inmediata**: Revisar sección "Próximos Pasos Inmediatos"

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

**Cuándo usar**: Cuando estés listo para crear la entrada en Wikidata.org

---

### 3. **WIKIDATA_ENTRY_TEMPLATE.md** — Copy-Paste Ready
Template pre-llenado con todos los valores específicos de Nebbuler.

**Incluye**:
- Labels y descripciones (español/inglés/portugués)
- 12 afirmaciones (statements) estructuradas
- Referencias preparadas
- Formulario de verificación
- Checklist pre-submit

**Cuándo usar**: Ahora. Copia este contenido al formulario de Wikidata.

---

## Flujo de Trabajo Recomendado

### Fase 1: Verificación Actual (AHORA)
```
1. Leer: SEO_MATURITY_AUDIT.md
2. Revisar: Scoring actual (7.6/10)
3. Identificar: P0 tareas críticas
```

**P0 Crítica (Hacer YA)**:
- [ ] Google Search Console: https://search.google.com/search-console
  - Agregar propiedad `nebbuler.com`
  - Enviar sitemap
  - Monitorear indexación
- [ ] Bing Webmaster Tools: https://www.bing.com/webmasters
- [ ] Wikidata entry (ver Fase 2)

### Fase 2: Wikidata Integration (Este mes)
```
1. Leer: WIKIDATA_INTEGRATION.md (entender el contexto)
2. Copiar: WIKIDATA_ENTRY_TEMPLATE.md
3. Crear: Nueva entrada en https://www.wikidata.org/wiki/Wikidata:New_Item
4. Pegar: Template pre-llenado
5. Revisar: Checklist de validación
6. Publicar: Crear item
```

**Tiempo estimado**: 15-20 minutos

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

✅ **Código y Schema** (no requiere acción):

- Organization schema.org: `/app/sobre/page.tsx`
- Person schema (founder): `/app/sobre/page.tsx`
- WebSite schema: `/app/layout.tsx`
- SoftwareApplication schema: `/app/layout.tsx`
- Article schema: `/app/c/[creator]/[quoteId]/page.tsx`
- NewsArticle schema: `/app/construyendo/page.tsx`
- Twitter cards: `/app/layout.tsx`
- OpenGraph: Raíz + página-específico
- Sitemap dinámico: `/app/sitemap.xml/route.ts`
- Robots.txt: `/public/robots.txt`

---

## Preguntas Frecuentes

### ¿Por qué Wikidata?
- Aparece en Google Knowledge Graph
- Soporta búsqueda semántica
- Indexado por IA (ChatGPT, Claude, etc.)
- Mejora credibilidad y discoverabilidad

### ¿Cuánto tarda Wikidata en reflejarse?
- Creación: Inmediata
- Google Knowledge Graph: 24-48 horas
- Búsqueda general: 1 semana
- Citas en IA: 2-4 semanas

### ¿Qué pasa si me equivoco en Wikidata?
- Totalmente reversible
- La comunidad puede corregir
- Puedes editar después
- No hay penalización por errores

### ¿Es obligatorio?
No, pero es:
- Muy recomendado para credibilidad
- Relativamente fácil (con template)
- Diferenciador competitivo
- Base para featured snippets

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

**30 días post-Wikidata**:
- ✅ Entrada visible en Google Knowledge Graph
- ✅ Indexación en search engines (100% de URLs)
- ✅ Zero crawl errors en GSC
- ✅ Citas en al menos 1 motor de IA

**90 días post-Wikidata**:
- ✅ 50+ keywords rankeando
- ✅ 1000+ monthly impressions en GSC
- ✅ Backlinks desde 10+ sitios relevantes
- ✅ Featured snippets para key queries

---

## Contacto y Soporte

Para preguntas sobre:
- **Wikidata**: Consulta el chat comunitario de Wikidata (link arriba)
- **Schema.org**: Usa [schema.org/docs](https://schema.org/docs)
- **Google SEO**: Documentación de [Google Search Central](https://developers.google.com/search)

---

## Historial de Cambios

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-05-12 | Auditoría completa + Wikidata docs | ✅ Completado |
| 2026-05-12 | Schema.org enhancement | ✅ Completado |
| TBD | Search Console verification | ⏳ Pendiente |
| TBD | Wikidata entry creation | ⏳ Pendiente |

---

**Última actualización**: 2026-05-12  
**Versión**: 1.0  
**Autor**: Claude AI (SEO Maturity Phase 2E)
