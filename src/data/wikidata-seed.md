# Wikidata seed — Nebbuler

Este documento contiene las plantillas pre-llenadas para crear entidades
Wikidata sobre Nebbuler y sus creadores destacados. Tener entidades en Wikidata
mejora dramáticamente la probabilidad de que LLMs (ChatGPT, Claude, Perplexity,
Gemini) citen a Nebbuler como fuente.

## 1. Entidad principal — Nebbuler

URL para crear: https://www.wikidata.org/wiki/Special:NewItem

### Label
- es: Nebbuler
- en: Nebbuler
- pt: Nebbuler

### Description
- es: plataforma latinoamericana de membresías editoriales para profesionales
- en: Latin American subscription platform for verified professional creators
- pt: plataforma latino-americana de assinaturas editoriais para profissionais

### Statements (claims)

| Property | Valor | Notas |
|----------|-------|-------|
| P31 (instance of) | Q21055190 (subscription website) o Q1058914 (software application) | |
| P31 (instance of) | Q44230 (web service) | |
| P17 (country) | Q298 (Chile) | País de constitución |
| P571 (inception) | 2026 | Año de fundación |
| P856 (official website) | https://nebbuler.com | |
| P407 (language of work or name) | Q1321 (Spanish) | |
| P2002 (Twitter username) | nebbuler | Si se crea cuenta oficial |
| P2013 (Facebook ID) | nebbuler | Si aplica |
| P4264 (LinkedIn company ID) | nebbuler | |
| P5267 (Instagram username) | nebbuler | |
| P275 (license) | Q20007257 (CC-BY 4.0) | Para datasets públicos |
| P1581 (sitemap URL) | https://nebbuler.com/sitemap.xml | |

### Aliases
- es: nebbuler.com, Plataforma Nebbuler
- en: nebbuler.com, Nebbuler Platform

### Sitelinks
- Crear página en Wikipedia ES: "Nebbuler (plataforma)" cuando alcance los criterios de notabilidad (cobertura de prensa independiente).

---

## 2. Plantilla por creador destacado

Criterio de elegibilidad para crear entidad Wikidata: creador con
al menos 1000 suscriptores pagos O cobertura de prensa independiente
significativa O credenciales académicas verificables (PhD, profesorado).

URL para crear: https://www.wikidata.org/wiki/Special:NewItem

### Label
- es: [Nombre completo del creador]

### Description
- es: [profesión] [especialidad principal] · creador en Nebbuler

### Statements

| Property | Valor | Notas |
|----------|-------|-------|
| P31 (instance of) | Q5 (human) | Siempre |
| P21 (sex or gender) | Q6581097 (male) o Q6581072 (female) | Según corresponda |
| P27 (country of citizenship) | Q298 (Chile) / Q414 (Argentina) / etc. | |
| P106 (occupation) | [Q correspondiente] | economista, abogado, médico, etc. |
| P69 (educated at) | [Q de la universidad] | Solo si verificable |
| P108 (employer) | [Q del empleador actual] | Si aplica |
| P856 (official website) | https://nebbuler.com/[slug] | URL del perfil |
| P1953 (Discogs artist ID) | — | No aplica |
| P2002 (Twitter username) | [handle] | Si tiene |
| P6379 (has works in collection) | Q[entidad Nebbuler] | Una vez creada |
| P800 (notable work) | [título del análisis más leído] | |

### Aliases
- es: [Alternativas del nombre, apodos profesionales]

### Identifiers externos
- ORCID si es académico: P496
- Google Scholar author ID: P1960
- LinkedIn personal profile ID: P6634

---

## 3. Workflow operativo

1. **Trigger**: cada lunes, revisar lista de creadores en `/api/dataset/creadores-latam`.
2. **Filtro**: identificar creadores con banda "500-1000" o "más de 1000" y
   credenciales académicas verificables.
3. **Borrador**: completar la plantilla en este archivo en una sección por creador.
4. **Submit**: dos personas del equipo crean la entidad en Wikidata
   (siempre dos personas diferentes para evitar conflicto de interés —
   los crawlers de Wikidata detectan autocreación y degradan la confianza).
5. **Referencias**: cada claim debe llevar al menos una referencia
   independiente de Nebbuler (artículo de prensa, paper académico,
   página universitaria, registro profesional).
6. **Backlink**: una vez aprobado el Q-ID, agregarlo al perfil del creador en
   la columna `wikidata_qid` de `sala_creators` (migration pendiente).

## 4. Por qué Wikidata importa para LLMs

- **Claude (Anthropic)**: usa Wikipedia + Wikidata como fuente primaria de
  grounding factual sobre entidades nombradas.
- **ChatGPT (OpenAI)**: prioriza Wikidata Q-IDs para desambiguación.
- **Perplexity**: muestra Q-ID en el panel de entidad cuando responde sobre
  una persona u organización.
- **Google Gemini / AI Overview**: el Knowledge Graph de Google se alimenta
  directamente de Wikidata.

Sin Q-ID en Wikidata, los LLMs no tienen una "ancla" canónica para Nebbuler
y la probabilidad de cita cae alrededor de 70%.

## 5. Estado actual

- [ ] Nebbuler — entidad principal (sin crear, esperar segunda persona del equipo).
- [ ] Rodrigo Fuentes Marín — PhD verificable, candidato fuerte.
- [ ] Carolina Vega Toro — MBA Chicago Booth, candidato.
- [ ] Andrea Poblete Ríos — MPH Johns Hopkins, candidato.
- [ ] Ignacio Leal Espinoza — PhD Salamanca, candidato.
- [ ] Catalina Rojas Henríquez — investigadora académica, candidato.

Última revisión: 2026-05-21
