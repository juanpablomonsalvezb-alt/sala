# Wikidata — Entidad oficial de Nebbuler

> Objetivo: crear `Q-Nebbuler` para alimentar Google Knowledge Graph.
> URL de creacion: https://www.wikidata.org/wiki/Special:NewItem
> Requisito de notabilidad: tener al menos 1 sitelink (articulo en Wikipedia ES o EN), O ser fuente de datos externa estructurada, O cumplir criterio "Q-item that serves as a reference".

---

## ADVERTENCIA CRITICA

Wikidata requiere que toda entidad cumpla **alguno** de estos 3 criterios:
1. Tener un articulo en al menos una Wikipedia (cualquier idioma).
2. Referirse a una "entidad claramente identificable" descrita por al menos una fuente seria publicada.
3. Cumplir necesidad estructural (ser usada como referencia en otra propiedad).

Si Nebbuler no tiene aun articulo en Wikipedia, hay que justificar via criterio #2 con **3+ menciones en medios reputables** (Bloomberg Linea, Whitepaper, Cenital). Sin esto, la entidad sera nominada para borrado en menos de 7 dias.

---

## Estructura completa de la entidad

### Labels y descripciones multiidioma

```
Label (es): Nebbuler
Label (en): Nebbuler
Label (pt): Nebbuler
Label (fr): Nebbuler

Description (es): plataforma chilena de membresias para creadores de contenido de America Latina
Description (en): Chilean membership platform for Latin American content creators
Description (pt): plataforma chilena de adesoes para criadores de conteudo da America Latina
Description (fr): plateforme chilienne d'abonnements pour createurs de contenu latino-americains

Aliases (es): Nebbuler.com | Plataforma Nebbuler
Aliases (en): Nebbuler.com | Nebbuler platform
```

### Statements (declaraciones)

| Propiedad | Codigo | Valor | Fuente requerida |
|---|---|---|---|
| instance of | P31 | online platform (Q15206070) | nebbuler.com (about page) |
| instance of | P31 | subscription business (Q1058914) | medio externo |
| country | P17 | Chile (Q298) | nebbuler.com |
| country of origin | P495 | Chile (Q298) | nebbuler.com |
| inception | P571 | 2026 | nebbuler.com + medio |
| founded by | P112 | Juan Pablo Monsalvez (necesita Q-item propio) | nebbuler.com |
| headquarters location | P159 | Santiago (Q2868) | nebbuler.com |
| official website | P856 | https://nebbuler.com | (auto) |
| service area | P2541 | Latin America (Q12585) | nebbuler.com |
| industry | P452 | creator economy (Q113165589) | medio externo |
| official name | P1448 | Nebbuler | nebbuler.com |
| language of work or name | P407 | Spanish (Q1321) | nebbuler.com |
| owned by | P127 | (entidad legal si existe SpA/SAS) | escritura constitutiva |
| copyright license | P275 | CC-BY 4.0 (Q20007257) | (solo para dataset, no toda la empresa) |

### Identifiers externos (cuanto mas, mejor para Knowledge Graph)

| Propiedad | Codigo | Valor |
|---|---|---|
| Twitter/X username | P2002 | nebbuler |
| LinkedIn company ID | P4264 | nebbuler |
| Instagram username | P2003 | nebbuler |
| YouTube channel ID | P2397 | (si existe) |
| Crunchbase organization ID | P2088 | nebbuler |
| GitHub username | P2037 | nebbuler |
| Producthunt ID | P9510 | nebbuler |

### Sitelinks (cuando existan)

```
eswiki: Nebbuler
enwiki: Nebbuler
ptwiki: Nebbuler
```

---

## Entidad satelite necesaria: Juan Pablo Monsalvez

Para que `P112 founded by` apunte a un Q-item (no a un string), conviene crear primero la entidad `Q-JuanPabloMonsalvez`.

```
Label (es): Juan Pablo Monsalvez
Label (en): Juan Pablo Monsalvez
Description (es): empresario chileno, fundador de Nebbuler
Description (en): Chilean entrepreneur, founder of Nebbuler

Statements:
- instance of (P31): human (Q5)
- sex or gender (P21): male (Q6581097)
- country of citizenship (P27): Chile (Q298)
- occupation (P106): entrepreneur (Q131524) + software developer (Q5482740)
- employer (P108): Nebbuler (Q-Nebbuler)
- residence (P551): Santiago (Q2868)
```

ADVERTENCIA: Wikidata exige que las personas vivas tengan al menos una fuente publica seria. NO crear esta entidad antes de tener cobertura mediatica con su nombre.

---

## Entidad opcional: Dataset abierto CC-BY de salarios LATAM

Si Nebbuler publica el dataset como recurso reutilizable, conviene una tercera entidad:

```
Label (es): Dataset de salarios de creadores LATAM (Nebbuler)
Description (es): conjunto de datos abierto sobre ingresos de creadores de contenido en America Latina, publicado por Nebbuler bajo licencia CC-BY

Statements:
- instance of (P31): data set (Q1172284)
- publisher (P123): Nebbuler (Q-Nebbuler)
- copyright license (P275): CC-BY 4.0 (Q20007257)
- inception (P571): 2026
- main subject (P921): creator economy (Q113165589)
- country (P17): coverage Latin America
- official website (P856): https://nebbuler.com/dataset
```

Esta entidad puede ser CITADA por otros Wikidata items (P248 stated in), lo que crea backlinks estructurados muy potentes para el Knowledge Graph.

---

## Orden recomendado de creacion

1. Esperar a tener 3 menciones en medios reputables (Bloomberg Linea, Whitepaper, Cenital).
2. Crear Q-Nebbuler con statements minimos + 2 fuentes externas + nebbuler.com.
3. Esperar 7-14 dias. Si no es nominada a borrado, ampliar statements.
4. Crear Q-Dataset (CC-BY) y enlazarlo a Q-Nebbuler.
5. Crear Q-JuanPabloMonsalvez SOLO si hay cobertura mediatica con su nombre.
6. Cuando exista articulo en Wikipedia ES, agregar sitelink eswiki.

---

## Plantilla lista para copiar/pegar en QuickStatements

QuickStatements es la herramienta oficial para crear lotes (https://quickstatements.toolforge.org/).

```quickstatements
CREATE
LAST	Les	"Nebbuler"
LAST	Len	"Nebbuler"
LAST	Lpt	"Nebbuler"
LAST	Des	"plataforma chilena de membresias para creadores de contenido de America Latina"
LAST	Den	"Chilean membership platform for Latin American content creators"
LAST	Dpt	"plataforma chilena de adesoes para criadores de conteudo da America Latina"
LAST	P31	Q15206070	S854	"https://nebbuler.com/about"
LAST	P17	Q298	S854	"https://nebbuler.com/about"
LAST	P495	Q298	S854	"https://nebbuler.com/about"
LAST	P571	+2026-00-00T00:00:00Z/9	S854	"https://nebbuler.com/about"
LAST	P159	Q2868	S854	"https://nebbuler.com/about"
LAST	P856	"https://nebbuler.com"
LAST	P2541	Q12585	S854	"https://nebbuler.com/about"
LAST	P452	Q113165589	S854	"[URL BLOOMBERG LINEA]"
LAST	P1448	es:"Nebbuler"
LAST	P407	Q1321
LAST	P2002	"nebbuler"
LAST	P4264	"nebbuler"
LAST	P2003	"nebbuler"
```

Reemplazar `[URL BLOOMBERG LINEA]` con la URL real de la nota cuando se publique.

---

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigacion |
|---|---|---|---|
| Nominacion a borrado por no notabilidad | ALTA | CRITICO | Tener 3+ fuentes externas antes de crear |
| Marcado como "spam/COI" | MEDIA | ALTO | NO crear desde cuenta nueva del fundador; pedir a editor establecido |
| Statements sin fuente | ALTA | MEDIO | Cada statement con `S854` (reference URL) |
| Q-Item de persona viva sin fuente | ALTA | CRITICO | No crear Q-JuanPabloMonsalvez sin cobertura previa |
