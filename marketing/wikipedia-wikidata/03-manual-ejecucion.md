# Manual de ejecucion — Wikipedia ES + Wikidata para Nebbuler

> Audiencia: Juan Pablo Monsalvez (fundador).
> Riesgo principal: Conflict of Interest (COI). Wikipedia tiene moderadores agresivos que detectan auto-promocion en minutos y revierten + banean cuentas.
> Estrategia: **NO editar directamente desde cuenta con nombre real del fundador**. Usar via voluntaria (editores externos) o cuenta secundaria con disclosure formal.

---

## Decision raiz: ?Quien edita?

### Opcion A (RECOMENDADA): editor voluntario externo

Identificar 3-5 editores de Wikipedia ES activos en temas de economia, tecnologia o periodismo, contactarlos por su pagina de discusion y proponerles cubrir el tema "economia del creador en LATAM". NO ofrecer dinero (Wikipedia lo prohibe). Ofrecer: dataset CC-BY, acceso a entrevistas, contexto exclusivo.

Como encontrarlos:
1. Ir a https://es.wikipedia.org/wiki/Especial:CambiosRecientes filtrado por categoria "Economia" o "Internet".
2. Ver quien edito articulos como Patreon, Substack, Crowdfunding en los ultimos 6 meses.
3. Revisar su perfil — si tienen 500+ ediciones y >1 ano de antiguedad, son "editores establecidos".
4. Contactar via su pagina de discusion (NUNCA por email) con mensaje publico y transparente.

Plantilla del mensaje:

```
== Propuesta de articulo: Economia del creador en LATAM ==

Hola [usuario], soy [Juan Pablo], fundador de Nebbuler, una plataforma chilena de membresias para creadores. Vi que editas activamente temas de economia digital y queria proponer que el articulo "Economia del creador" (que no existe en Wikipedia ES) podria interesarte. Tengo material publico que podria servir como fuente: un dataset CC-BY de salarios de creadores LATAM (URL) y cobertura en Bloomberg Linea (URL).

No pretendo editar yo mismo por conflicto de interes evidente, pero ofrezco el material como fuente. ?Te interesaria evaluarlo? Saludos.
~~~~
```

Ventajas: cero COI, mayor probabilidad de supervivencia del articulo.
Desventajas: dependes del editor; puede tardar semanas o ignorarte.

### Opcion B (ALTERNATIVA): cuenta propia con disclosure formal

Wikipedia permite editar con COI si **declaras formalmente** la relacion en tu pagina de usuario. Esto se llama "Paid contribution disclosure" (incluso si no es paga; aplica para fundadores).

Pasos:
1. Crear cuenta con nombre real (ej. `Usuario:JuanPMonsalvez`).
2. En tu pagina de usuario poner literalmente:
   ```wiki
   == Declaracion de conflicto de interes ==
   Soy Juan Pablo Monsalvez, fundador de [[Nebbuler]]. Declaro este conflicto de interes en cumplimiento de [[WP:COI]]. No edito directamente el articulo de mi empresa; solo propongo cambios en la pagina de discusion correspondiente.
   ```
3. NUNCA editar el articulo de Nebbuler directamente. Solo proponer cambios via `Discusion:Nebbuler`.
4. Para articulos colaterales (Substack, Patreon, etc.), declarar el COI en cada edicion via comentario de resumen: `(declaracion COI: soy fundador de Nebbuler, ver mi pagina de usuario)`.

Ventajas: control directo.
Desventajas: cualquier edicion sera escrutada al detalle; un solo paso en falso = revert + posible bloqueo.

---

## Paso 1 — Crear cuenta de Wikipedia

1. Ir a https://es.wikipedia.org/w/index.php?title=Especial:CrearCuenta
2. Nombre de usuario: usar nombre real (`JuanPMonsalvez`), NO `NebbulerOficial` ni nada corporativo (Wikipedia bloquea nombres de empresas).
3. Email: usar uno personal verificable.
4. Confirmar email.

---

## Paso 2 — Construir reputacion ANTES de tocar Nebbuler

Wikipedia rastrea historial de edicion. Una cuenta nueva editando articulos comerciales = revert automatico.

Plan de 30 dias para llegar a "autoconfirmado" (50 ediciones, 4 dias):

| Semana | Actividad | Objetivo |
|---|---|---|
| 1 | 15 ediciones menores: corregir tildes, enlaces rotos, formato en articulos NO relacionados (musica chilena, geografia LATAM, etc.) | Demostrar editor de buena fe |
| 2 | 15 ediciones medias: ampliar parrafos cortos con fuentes, traducir secciones de en.wiki a es.wiki en temas neutros | Subir calidad de aportes |
| 3 | 10 ediciones en articulos tangenciales a tu industria (sin mencionar Nebbuler): Substack, Patreon, Crowdfunding, agregando informacion general no auto-referencial | Establecer expertise tematico |
| 4 | 10 ediciones mas + ahora si: declarar COI publicamente y empezar a proponer cambios en discusion sobre Nebbuler | Llegada legitima |

Para el dia 30 deberias tener:
- 50+ ediciones (autoconfirmado: si)
- Cero reverts (idealmente)
- Pagina de usuario con declaracion de COI
- Reputacion limpia

---

## Paso 3 — Insertar menciones en articulos colaterales

Orden recomendado (de menor a mayor riesgo):

1. **Suscripcion** (riesgo bajo) — agregar oracion sobre economia del creador.
2. **Micromecenazgo** (riesgo bajo) — agregar Nebbuler a lista de plataformas.
3. **Boletin informativo** (riesgo bajo) — subseccion newsletters de pago.
4. **Periodismo deportivo** (riesgo medio) — angulo Mundial 2026 + Programa La Sombra.
5. **Influencer** (riesgo medio) — monetizacion directa.
6. **Substack** (riesgo medio-alto) — esperar a que ya haya 3 inserciones aprobadas.
7. **Patreon** (riesgo alto) — solo despues de todo lo anterior.

Reglas de oro entre ediciones:
- Minimo **48-72 horas** entre ediciones del mismo tema.
- NUNCA dos ediciones consecutivas que mencionen Nebbuler.
- Cada edicion con resumen de cambio claro: `Anadida mencion de Nebbuler como plataforma LATAM equivalente, con fuente Bloomberg Linea (declaracion COI: ver pagina de usuario)`.
- Si revierten una, NO re-insertar inmediatamente. Abrir hilo en la pagina de discusion del articulo y argumentar con politicas (WP:V, WP:RS, WP:NPOV).

---

## Paso 4 — Crear entidad Wikidata

PRE-REQUISITO: tener **3 fuentes externas** publicadas (Bloomberg Linea, Whitepaper, Cenital).

Paso a paso:

1. Crear cuenta en https://www.wikidata.org (la misma cuenta de Wikipedia sirve).
2. Ir a https://www.wikidata.org/wiki/Special:NewItem
3. Llenar:
   - Label en espanol: `Nebbuler`
   - Description en espanol: `plataforma chilena de membresias para creadores de contenido de America Latina`
4. Guardar. Te asigna un Q-numero (ej. Q123456789).
5. En la nueva entidad, ir agregando statements uno por uno usando los datos de `02-wikidata-entity.md`.
6. CRITICO: cada statement debe llevar referencia (`+ add reference` → `stated in` o `reference URL`).
7. Despues de crear la entidad, dejarla "reposar" 7-14 dias antes de agregar masivamente. Si la nominan a borrado, defenderla en `Wikidata:Requests for deletions` argumentando notabilidad con las 3 fuentes externas.

Alternativa para lote completo: usar QuickStatements con el script ya preparado en `02-wikidata-entity.md`. Requiere conectar cuenta via OAuth.

---

## Paso 5 — Sitelink a Wikipedia ES (cuando exista articulo)

Si en algun momento se logra crear articulo "Nebbuler" en Wikipedia ES (riesgo alto, ver opcion A arriba), agregar sitelink:

1. En la entidad Q-Nebbuler, scroll abajo a "Wikipedia".
2. Click "edit" → seleccionar `eswiki` → escribir `Nebbuler`.
3. Esto crea el puente bidireccional Wikipedia ↔ Wikidata, que es lo que alimenta directamente al Google Knowledge Graph.

---

## Paso 6 — Monitoreo permanente

Despues de cada edicion o creacion:

1. Agregar el articulo/entidad a tu **lista de seguimiento** de Wikipedia (estrella en la esquina superior).
2. Activar notificaciones por email para reverts.
3. Revisar diariamente durante las primeras 2 semanas.
4. Si alguien revierte, NO entrar en guerra de ediciones. Ir a la pagina de discusion y argumentar.
5. Si te acusan de COI, responder transparentemente citando tu declaracion publica.

---

## Errores fatales que terminan en baneo permanente

- Crear cuenta con nombre de la empresa (`Nebbuler`, `NebbulerOficial`).
- Editar el articulo de Nebbuler directamente (si llega a existir) sin declarar COI.
- Reinsertar contenido revertido sin discutir.
- Usar multiples cuentas (sockpuppeting) para apoyarse a si mismo.
- Pagar a editores externos (esta prohibido y se detecta).
- Insertar enlace a nebbuler.com como unica fuente (Wikipedia no acepta auto-publicaciones como fuente primaria).
- Tono promocional con palabras prohibidas: "innovador", "pionero", "revolucionario", "lider", "unico".

---

## Resumen ejecutivo (TL;DR)

1. **Semana 0**: conseguir 3 menciones en medios reputables (Bloomberg, Whitepaper, Cenital). Sin esto, no avanzar.
2. **Semanas 1-4**: crear cuenta, construir reputacion con 50 ediciones neutrales.
3. **Semana 5**: declarar COI publicamente. Empezar inserciones en orden de menor riesgo.
4. **Semana 6**: crear entidad Wikidata con QuickStatements.
5. **Semanas 7-10**: continuar inserciones con 48-72h de gap.
6. **Mes 3+**: evaluar si pedir a editor externo crear articulo "Economia del creador" (sin mencionar Nebbuler como protagonista).
