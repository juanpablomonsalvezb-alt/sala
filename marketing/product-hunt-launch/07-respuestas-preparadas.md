# Respuestas Preparadas — Top 10 Preguntas Probables

**Reglas de respuesta:**
- Tiempo máximo de respuesta: 5 minutos durante peak hours
- Tono: directo, sin BS, agradecido pero no servil
- Longitud: 80-200 palabras por respuesta (legible sin scroll en mobile)
- Cada respuesta debe agradecer la pregunta + responder + opcional invitar a profundizar

---

## 1. "Why not just use Substack?"

> Gran pregunta. Si vivís en USA y tu audiencia paga en USD, Substack es perfecto.
>
> El problema es para los que no:
>
> - Si sos creator chileno y tu audiencia paga en pesos, Substack convierte CLP → USD → tu cuenta. Pierdes 3-7% en conversión + 30% retención fiscal por no-residente USA + 10% comisión Substack = ~40% de tu ingreso evaporado.
> - Substack no procesa MercadoPago, PIX, Khipu ni Webpay. Tu audiencia tiene que tener tarjeta internacional.
> - El soporte responde en inglés en horario USA.
>
> Nebbuler cobra en moneda local, deposita en tu banco local (sin convertir), procesa con rails locales (sin fricción para tu audiencia), y tiene atención en español.
>
> Si sos americano: usá Substack, es excelente. Si no: probá Nebbuler.

---

## 2. "How is this different from Patreon?"

> Tres diferencias concretas:
>
> 1. **Pagos LATAM nativos.** Patreon procesa solo con tarjetas internacionales. En Chile, ~40% de las tarjetas son débito locales que NO pagan internacional. Tu audiencia potencial se reduce. Nebbuler procesa Webpay (rail chileno) que acepta cualquier tarjeta chilena.
>
> 2. **Sin "Patreon-style" descubrimiento.** Patreon es marketplace — Patreon te puede mostrar otro creator. Nebbuler es publishing platform — tu audiencia es tuya, exportable, sin algoritmo robándote atención.
>
> 3. **Pricing simple.** Patreon va de 8% a 12% según plan. Nebbuler es 0% los primeros 6 meses, después 5% flat. Sin "Premium" tier.
>
> Patreon hace bien la parte "comunidad + tiers + posts". Nosotros nos enfocamos en publishing serio (newsletters + posts pagos + email a base de subs) con la infra de pagos correcta.

---

## 3. "What about Lemonsqueezy / Beehiiv / Memberful?"

> Cada uno resuelve algo distinto:
>
> - **Lemonsqueezy:** excelente para SaaS y productos digitales one-off. No optimizado para membresías recurrentes con contenido publicado.
> - **Beehiiv:** newsletter platform fuerte, foco en growth y referidos. Pero opera principalmente con Stripe USA → mismo problema fiscal para LATAM.
> - **Memberful:** te conectas a tu propio sitio (WordPress, etc.), no provee CMS. Buen producto, también Stripe-USA dependiente.
>
> Nebbuler combina:
> - CMS para publicar (como Substack)
> - Membresías con tiers (como Patreon)
> - Procesamiento local LATAM nativo (único en el espacio)
> - Atención en español
>
> El diferencial no es feature-by-feature, es la combinación + el rail de pagos local.

---

## 4. "How do you handle taxes in LATAM?"

> Esta pregunta merece respuesta larga porque es la #1 razón por la que existimos.
>
> Cada país tiene reglas distintas. Resumen:
>
> - **Chile:** emitimos boleta de honorarios electrónica integrada con SII para el creator. El creator declara como ingreso propio.
> - **México:** integración con CFDI 4.0 vía facturación.mx. Generamos factura por la suscripción.
> - **Argentina:** monotributo amigable, no retenemos. El creator declara.
> - **Brasil:** integración con NFS-e, emisión automática.
> - **Colombia:** factura electrónica DIAN.
> - **Perú:** comprobante de pago electrónico SUNAT.
> - **España:** factura con IVA + IRPF según corresponda.
>
> En todos los casos: **0% retención fiscal Nebbuler.** No somos withholding agent. El creator es responsable de su declaración, pero le damos los documentos automáticos para hacerlo en 5 minutos.
>
> Para comparar: Substack retiene 30% por defecto a no-residentes USA (forma W-8BEN) y devuelve solo via tratado tributario, proceso que toma 6-18 meses.

---

## 5. "What payment methods do you support?"

> Por país, al 21-mayo-2026:
>
> - **Chile:** Webpay (todas las tarjetas chilenas), Khipu (transferencia bancaria), MACH, MercadoPago
> - **Argentina:** MercadoPago, transferencia CBU
> - **México:** MercadoPago, OXXO Pay, SPEI
> - **Brasil:** PIX, MercadoPago, boleto bancário
> - **Colombia:** PSE, Nequi, Bancolombia transferencia
> - **Perú:** Yape, Plin, PagoEfectivo
> - **Uruguay:** Mercadopago, Abitab
> - **España:** Bizum, transferencia SEPA, tarjeta
> - **Internacional:** Stripe (todas las tarjetas), PayPal, Apple Pay
>
> Roadmap próximas 8 semanas:
> - Venezuela: Pago Móvil + Reserve
> - Bolivia: QR Simple
> - Ecuador: integración bancos locales
>
> El stack de pagos es modular — agregar un país nuevo nos toma ~2 semanas de integración.

---

## 6. "Is this open source?"

> No, Nebbuler es cerrado. Razones:
>
> 1. **Compliance financiero:** procesamos pagos reales con compliance KYC/AML específico por país. Open source haría imposible mantener compliance auditable.
> 2. **Modelo de negocio:** somos comisión sobre pagos. Open source no funciona para este modelo (no es licenciamiento).
>
> Lo que SÍ hacemos open:
> - Componentes UI (la lib de componentes está en GitHub como `nebbuler/ui`)
> - SDK de integración para developers
> - Documentación API pública: docs.nebbuler.com
> - Postmortems técnicos y blog de ingeniería
>
> Si pensás que algo específico debería ser open source, decime cuál y por qué — ajustamos roadmap basado en feedback.

---

## 7. "Why 0% commission only 6 months?"

> Honestidad: porque tenemos que pagar la infra y a mí mismo.
>
> Estructura:
> - **0% primeros 6 meses** para los primeros 100 creators
> - **5% flat** después, para siempre (vs Substack 10%, Patreon 8-12%)
> - **+ 2.9% + $0.30 de procesador** (Stripe, Webpay, MercadoPago — esto NO se queda con Nebbuler, va al rail de pagos)
>
> Esos 6 meses los pensamos como:
> - Tiempo suficiente para que un creator construya tracción real
> - Demostrarles que el producto funciona antes de cobrarles
> - Compensar la fricción de migrar desde otra plataforma
>
> Después de 6 meses, el creator promedio que llegó a $500 USD/mes paga $25/mes a Nebbuler. Comparable: Substack le cobraría $50, Patreon ~$60.
>
> Y siempre podés exportar tu audiencia + cancelar, sin lock-in.

---

## 8. "Pricing details?"

> Simple, dos preguntas:
>
> **¿Cuánto paga el creator?**
> - 0% comisión primeros 6 meses (creator queda 100% menos fees de procesador)
> - Después 5% flat sobre ingresos
> - + fees del procesador de pagos (2.9% + ~$0.30, varía por método/país)
> - Sin mensualidad fija. Sin "Premium" tier escondido.
>
> **¿Cuánto paga el suscriptor?**
> - Lo que defina el creator. Mínimo $1 USD/mes equivalente.
> - Sin fees adicionales al suscriptor.
>
> **Ejemplo concreto:** Creator chileno con 100 suscriptores pagando $5.000 CLP/mes = $500.000 CLP brutos mensuales. Después de los 6 meses:
> - 5% Nebbuler = $25.000 CLP
> - ~3.5% procesador (Webpay) = $17.500 CLP
> - **Creator recibe: $457.500 CLP** (91.5%)
>
> Mismo caso en Substack (CLP → USD → CLP con doble conversión + retención): creator recibe ~58%.

---

## 9. "What's your moat?"

> Pregunta justa. Soy honesto: no tengo "moat" tipo network effect billion-dollar (todavía).
>
> Lo que tengo:
>
> 1. **Integraciones de pago locales.** Construir Webpay + Khipu + MercadoPago + PIX + 10 más con compliance toma 12-18 meses. Cualquier competidor empezando desde cero queda atrás 1 año mínimo.
>
> 2. **Conocimiento regulatorio LATAM.** SII chileno, CFDI mexicano, DIAN colombiano, NFS-e brasileño. No es código difícil, es burocracia difícil. Ya navegada.
>
> 3. **Comunidad de creators beta.** 93 creators que están dándome feedback diario. Cuando lleguemos a 1.000, el feedback loop es defensa real.
>
> 4. **Pricing structural.** Como no levanto VC, no necesito 10x return. Puedo operar con 5% comisión sustentable. Un competidor con $20M de Series A NECESITA cobrar 10-15%.
>
> El "moat" no es uno solo, es que la combinación de los 4 hace muy poco atractivo para un competidor copiar — porque tendría que ir a un mercado más chico que USA, con regulación más compleja, y márgenes más bajos.

---

## 10. "Founder background?"

> Juan Pablo Monsalvez, 32, Santiago de Chile.
>
> Trayectoria:
> - Ingeniero civil informático, Universidad de Chile (2014)
> - 4 años en banca digital (BancoEstado) construyendo APIs de pagos
> - 3 años en fintech B2B (no nombro por NDA) construyendo infraestructura de checkout
> - 2 años freelance haciendo integraciones de pago para e-commerce LATAM
> - 14 meses construyendo Nebbuler full-time
>
> No es mi primer rodeo con pagos. Sí es mi primera empresa propia.
>
> Sin cofundador (busqué 6 meses, no encontré match). Sin inversores externos (decisión consciente — Nebbuler no necesita escala VC). Ahorros personales cubren hasta diciembre 2027.
>
> Cualquier pregunta más profunda sobre el background o decisiones de producto, abro mi DM en X (@jpmonsalvez) o un Calendly de 15min aquí: [link].

---

## Patrones generales de respuesta

### Cuando alguien dice "ya existe X que hace lo mismo":
- Reconocer el competidor con respeto
- Explicar diferencia concreta (no genérica)
- Reconocer cuándo el otro producto sería mejor para ese caso

### Cuando alguien critica tono o naming:
- Agradecer sinceramente
- No defender — preguntar más
- Compartir el reasoning del proceso si aplica

### Cuando alguien dice "esto no va a funcionar porque..."
- Validar la preocupación
- Compartir data que muestre lo contrario, si tenemos
- Si no tenemos data, decir "es un riesgo real, estamos midiéndolo así..."

### Cuando alguien pide feature que no tenemos:
- "Excelente sugerencia, no está hoy"
- Si está en roadmap: "está planeado para Q[X]"
- Si no está: "tomo nota, ¿qué problema concreto resolvería para ti?"

### Cuando alguien promociona su propio producto:
- Responder con un genuino "interesante, voy a ver" + 1 frase específica
- No engancharse en debate competitivo público

### Reglas absolutas:
- NUNCA borrar comments negativos
- NUNCA responder con sarcasmo
- NUNCA dejar pregunta sin responder >2h durante peak
- SIEMPRE agradecer al final
