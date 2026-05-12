# Wikidata Integration Guide para Nebbuler

Esta guía documenta cómo crear y mantener la entrada de Wikidata para Nebbuler como organización, basada en la información estructurada en schema.org.

## 1. Propiedades Wikidata Requeridas

### Información Fundamental
- **P31** (instance of): `Q41710` (Project) o `Q6881511` (Software)
- **P17** (country): `Q298` (Chile)
- **P131** (located in the administrative territory): `Q2474` (Region Metropolitana)
- **P625** (coordinate location): `-33.4489, -70.6693` (Santiago)

### Identidad y Nombres
- **P1813** (short name): `Nebbuler`
- **P1448** (official name): `Nebbuler - Plataforma de Newsletters Profesionales`
- **P1566** (GeoNames ID): [obtener de GeoNames]
- **P6058** (use in language/context): valor para español

### Información de Fundación
- **P571** (inception): `2025-01-01`
- **P112** (founded by): Enlace a Juan Pablo Monsalvez (crear como elemento Person)
- **P577** (publication date): `2025-01-01`

### Datos de la Organización
- **P856** (official website): `https://nebbuler.com`
- **P585** (point in time): `2025-01-01`
- **P1566** (GeoNames ID): Identificador de Santiago
- **P300** (language): `Q1321` (Spanish)
- **P276** (location): `Q2887` (Santiago, Chile)

### Clasificación y Servicios
- **P641** (sport/activity): `Q7881270` (professional education)
- **P2047** (duration): Para newsletter frecuencia
- **P680** (genre): `Q4418383` (newsletter)
- **P495** (country of origin): `Q298` (Chile)

### Identidad en Línea
- **P2003** (Instagram username): `nebbuler`
- **P2013** (Facebook ID): Nebbuler page
- **P4264** (official Twitter account): `@nebbuler`
- **P6634** (LinkedIn company ID): `nebbuler`
- **P1324** (URL of page using this item): `https://nebbuler.com`

### Cobertura Geográfica
- **P625** (coordinate location): `-33.4489, -70.6693` (base)
- **P1366** (replaced by): N/A (no anterior)
- **P527** (has part): Podrían listar países de cobertura

## 2. Estructura de Datos para Juan Pablo Monsalvez

Antes de crear el elemento de Nebbuler, necesitas crear una entrada para el fundador:

### Elemento Person (Juan Pablo Monsalvez)
- **P31** (instance of): `Q5` (Human)
- **P569** (date of birth): [si público]
- **P19** (place of birth): [si conocido]
- **P27** (country of citizenship): `Q298` (Chile)
- **P106** (occupation): `Q4853732` (tech entrepreneur)
- **P108** (employer): Nebbuler (una vez creado)
- **P570** (date of death): N/A
- **P856** (official website): Dominio personal si existe
- **P2003** (Instagram username): Juan Pablo Monsalvez en Instagram
- **P4264** (official Twitter account): Si existe

## 3. Mapeo: schema.org → Wikidata

| schema.org | Wikidata | Descripción |
|-----------|----------|------------|
| name | P1813/P1448 | Nombre de la organización |
| foundingDate | P571 | Fecha de fundación |
| founder | P112 | Fundador(es) |
| url | P856 | Sitio web oficial |
| areaServed | P625 (coord) | Ubicación y cobertura |
| description | Descripción en Wikidata | Resumen |
| knowsAbout | P680/P641 | Géneros/actividades |
| sameAs (LinkedIn) | P6634 | Cuenta LinkedIn |
| sameAs (Instagram) | P2003 | Cuenta Instagram |

## 4. Instrucciones Paso a Paso para Crear la Entrada

### Paso 1: Verificar si existe entrada
1. Ir a https://www.wikidata.org/wiki/Wikidata:Main_Page
2. Buscar "Nebbuler" en la caja de búsqueda
3. Si no existe, proceder a crear

### Paso 2: Crear el elemento (Item)
1. Click en "Create a new Item"
2. Llenar "Label" (nombre): `Nebbuler`
3. Llenar "Description": `Plataforma de newsletters profesionales de América Latina`
4. Seleccionar idioma: Español
5. Click "Create"

### Paso 3: Agregar Afirmaciones Principales (Statements)

#### Grupo 1: Identificación
1. Click "+ add statement"
2. Property: `instance of (P31)`
3. Value: Buscar y seleccionar `Project (Q41710)`
4. Click "Publish"

#### Grupo 2: Ubicación
1. Property: `country (P17)`
2. Value: `Chile (Q298)`
3. Property: `located in administrative territory (P131)`
4. Value: `Metropolitan Region of Santiago (Q2474)`

#### Grupo 3: Fundación
1. Property: `inception (P571)`
2. Date: `2025-01-01`
3. Qualifier: `calendar model` → `proleptic Gregorian calendar`

#### Grupo 4: Información Web
1. Property: `official website (P856)`
2. URL: `https://nebbuler.com`
3. Property: `URL (P1324)`
4. URL: `https://nebbuler.com`

#### Grupo 5: Redes Sociales
```
LinkedIn company ID (P6634): nebbuler
Instagram username (P2003): nebbuler
```

#### Grupo 6: Fundador
1. Property: `founded by (P112)`
2. Value: Crear/buscar elemento para Juan Pablo Monsalvez
3. Crear item separado si no existe

### Paso 4: Agregar Referencias (Sources)
Para cada statement importante:
1. Click el ícono de "cita" (reference)
2. Property: `stated in (P248)`
3. Value: `https://nebbuler.com/sobre`
4. Property: `retrieved (P813)`
5. Date: Fecha actual

### Paso 5: Agregar Descripciones Multilingües
1. Click "add label" en inglés:
   - Label: `Nebbuler`
   - Description: `professional newsletter platform for Latin America`

2. Para portugués (si aplica):
   - Label: `Nebbuler`
   - Description: `plataforma de newsletters profissionais para América Latina`

## 5. Información Adicional para Wikidata

### Categorías Recomendadas
- `Q6881511` (Online service)
- `Q7881270` (Professional education)
- `Q8134` (Website)
- `Q4418383` (Newsletter)

### Propiedades Opcionales Avanzadas

**Métricas y Alcance:**
- **P1082** (population): Número de usuarios activos (si público)
- **P1448** (type of item): Especificar si es plataforma SaaS

**Información Comercial:**
- **P2128** (employees): Número de empleados
- **P1197** (company formation): Más detalles del registro

**Información de Contenido:**
- **P407** (language of work or name): `Q1321` (Spanish)
- **P6269** (type of official journal): Si se publica regularmente

## 6. Validación y Control de Calidad

### Antes de publicar:
1. Verificar todas las propiedades P31 tengan valores
2. Confirmar que P571 (inception) es consistente con datos públicos
3. Verificar enlaces web son válidos y actualizados
4. Asegurar P112 (founded by) apunta a elemento de Person válido
5. Revisar ortografía en labels y descripciones

### Después de publicar:
1. Esperar aprobación si hay configuraciones de protección
2. Monitorear cambios no autorizados
3. Agregar referencias adicionales según sea necesario
4. Actualizar propiedades cuando hay cambios en la organización

## 7. Mantenimiento Continuo

### Actualizar cuando:
- Cambios en ubicación o presencia geográfica
- Actualizaciones de información de contacto
- Nuevos servicios o productos
- Cambios en el equipo fundador
- Hitos significativos o expansiones

### Cómo actualizar:
1. Ir a la entrada de Nebbuler en Wikidata
2. Click "Edit" en la propiedad a actualizar
3. Hacer cambios
4. Agregar referencia a la fuente
5. Click "Publish changes"

## 8. Integración con schema.org (ya completada)

La información en `/app/sobre/page.tsx` ya incluye structured data que:
- ✅ Define Organization con nombre, URL, logo
- ✅ Lista founder como Person (Juan Pablo Monsalvez)
- ✅ Especifica areaServed con 19 países
- ✅ Incluye contactPoints multilingües
- ✅ Define knowsAbout (áreas de expertise)
- ✅ Incluye links sociales (sameAs)

Este schema.org se renderiza automáticamente como `<script type="application/ld+json">` en el HTML, permitiendo que motores de búsqueda, Wikidata y otros sistemas estructuren correctamente la información.

## 9. Referencias Externas

- **Wikidata Property Browser**: https://www.wikidata.org/wiki/Special:ListProperties
- **Wikidata Item Creation**: https://www.wikidata.org/wiki/Help:Items
- **Wikidata for Organizations**: https://www.wikidata.org/wiki/Help:Items/Organization
- **schema.org Organization**: https://schema.org/Organization
- **OpenAlex Integration**: https://www.wikidata.org/wiki/Help:OpenAlex

---

**Nota**: Este documento es una guía de referencia. Wikidata tiene políticas de edición comunitarias. Se recomienda revisar las políticas actuales antes de crear o editar elementos.
