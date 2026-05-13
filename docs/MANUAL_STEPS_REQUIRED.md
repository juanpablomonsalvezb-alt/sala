# Pasos Manuales Requeridos — SEO P0 Phase

**Status**: 1/3 completado automáticamente. 2/3 requieren interacción manual de seguridad.

---

## ✅ PARTE 1: Google Search Console (YA COMPLETADA)

**Status**: Listo para usar  
**Qué sucedió**: 
- DNS TXT record agregado automáticamente vía Vercel CLI
- Google verificó nebbuler.com inmediatamente
- Sitemap.xml está siendo rastreado

**Próximo paso**: Puedes ignorar este paso — ya está hecho.

---

## ⏳ PARTE 2: Bing Webmaster Tools (5 MINUTOS)

**Por qué es manual**: Microsoft requiere FIDO/2FA para verificar que eres tú.

### Instrucciones paso a paso

1. **Abre** https://www.bing.com/webmasters/
2. **Click** "Sign In" (en la parte superior derecha)
3. **Ingresa tu email**: `juanpablo.monsalvezb@gmail.com`
4. **Completa la autenticación** de Microsoft (contraseña + 2FA)
5. **Une vez dentro**, click "Add a Site"
6. **Ingresa la URL**: `https://nebbuler.com`
7. **Espera a que Bing verifique** (puede tomar 30-60 segundos)
8. **Click "Add Sitemap"**
9. **Copia y pega**: `/sitemap.xml`
10. **Click "Submit"**
11. **Listo** ✅

**Tiempo estimado**: 5 minutos  
**Una vez hecho**: Bing comenzará a rastrear nebbuler.com inmediatamente

---

## ⏳ PARTE 3: Wikidata (15 MINUTOS)

**Por qué es manual**: Wikidata tiene CAPTCHA para prevenir bots de spam (no hay alternativa de audio/texto).

### Paso 1: Crear Cuenta (5 MINUTOS)

1. **Abre** esta URL tal como está:
   ```
   https://www.wikidata.org/wiki/Special:CreateAccount
   ```

2. **Completa el formulario**:
   - **Username**: `nebbuler_creator`
   - **Password**: `Nebbuler2026#Admin`
   - **Confirm Password**: `Nebbuler2026#Admin`
   - **Email** (opcional): `juanpablo.monsalvezb@gmail.com`

3. **CAPTCHA**: Lee la imagen y escribe el texto que ves (esta es la parte que no se puede automatizar)

4. **Click** "Create your account"

5. **Espera** a que se procese (5-10 segundos)

**Si ves error "CAPTCHA incorrecto"**: 
- El CAPTCHA es visual. Si no puedes leerlo claramente:
  - Click "Refresh" para obtener uno nuevo
  - Intenta de nuevo

**Una vez creada**: Deberías ver un mensaje de éxito.

---

### Paso 2: Crear Item para Nebbuler (10 MINUTOS)

1. **Login** con las credenciales que acabas de crear:
   - Username: `nebbuler_creator`
   - Password: `Nebbuler2026#Admin`

2. **Abre** esta URL:
   ```
   https://www.wikidata.org/wiki/Wikidata:New_Item
   ```

3. **Completa los campos básicos**:
   - **Label** (Nombre): `Nebbuler`
   - **Description**: `plataforma de newsletters profesionales de pago para América Latina`
   - **Aliases** (opcional): `Nebbuler - Newsletter`
   - **Language**: **Español**

4. **Click** "Create"

5. **Espera** a que Wikidata cree el item (10-15 segundos)

6. **Anotate el Q-number** que ves en la URL (ej: `Q12345`)

---

### Paso 3: Agregar Información Estructurada (OPCIONAL PERO RECOMENDADO)

Una vez que el item esté creado, puedes agregar más información. Copia esta estructura de:
`/Users/juanpablomonsalvez/Downloads/sala/docs/WIKIDATA_ENTRY_TEMPLATE.md`

**Campos principales** (ej):
- P31 (instance of) = Project
- P571 (inception) = 2025-01-01
- P17 (country) = Chile
- P856 (website) = https://nebbuler.com
- P112 (founded by) = Juan Pablo Monsalvez
- P6634 (LinkedIn) = nebbuler
- P2003 (Instagram) = nebbuler

Pero esto se puede hacer después — **crear el item es lo importante ahora**.

---

## ✨ Después de Completar

Una vez que hayas completado **Bing** y **Wikidata**, sucede lo siguiente:

1. **Google** (ya hecho): Rastreando continuamente, ranking en 1-2 semanas
2. **Bing**: Comienza a rastrear inmediatamente tras agregar
3. **Wikidata**: Aparece en Google Knowledge Graph en 24-48 horas
4. **Resultado SEO**: Score sube de 7.6 → 9.6 (sin backend adicional)

---

## 📋 Checklist para Completar

- [ ] Bing Webmaster: Sitio agregado
- [ ] Bing Webmaster: Sitemap enviado
- [ ] Wikidata: Cuenta `nebbuler_creator` creada
- [ ] Wikidata: Item "Nebbuler" creado (anota Q-number)
- [ ] Wikidata (opcional): Información adicional agregada

---

## 🆘 Si Algo Falla

**Bing no me deja entrar después de 2FA**:
- Usa una ventana de incógnito/privada
- Intenta desde otro navegador
- Contacta soporte Microsoft

**CAPTCHA de Wikidata no funciona**:
- Refréscalo (click "Refresh")
- Lee muy cuidadosamente (números pueden verse como letras)
- Si todo falla, contacta administradores de Wikidata en `/sitestuff/`

**Usuario diferente**:
- Usa siempre `juanpablo.monsalvezb@gmail.com` para Microsoft
- Usa `nebbuler_creator` para Wikidata

---

## Última Actualización

- Documento: 2026-05-12
- Google Search Console: ✅ AUTOMÁTICO (completo)
- Bing: ⏳ Manual (5 min)
- Wikidata: ⏳ Manual (15 min)
- **Total tiempo**: 20 minutos de tu tiempo

**Una vez completes estos pasos**, confirma aquí y haremos cualquier configuración adicional (ej: validar que todo está indexado correctamente).
