import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Términos y condiciones de uso de Nebbuler. Plataforma de newsletters profesionales de pago en Chile y LATAM.',
  alternates: { canonical: 'https://nebbuler.com/terminos' },
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">Legal</p>
        <h1 className="font-serif text-[36px] font-bold text-[#121212] mb-2">Términos de Servicio</h1>
        <p className="font-sans text-[13px] text-[#999] mb-12">Última actualización: 11 de mayo de 2026 · Versión 1.0</p>

        <div className="max-w-none font-sans text-[15px] text-[#333] leading-relaxed space-y-10">

          <section>
            <p className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 text-[14px]">
              Estos términos rigen tu uso de Nebbuler. Léelos completos. Al crear una cuenta o usar la plataforma confirmas que los aceptaste.
              Si publicas o cobras suscripciones, hay obligaciones adicionales para ti como creador.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">1. Definiciones</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Nebbuler</strong> (también &quot;nosotros&quot;): la plataforma operada bajo el dominio nebbuler.com.</li>
              <li><strong>Plataforma</strong>: el sitio web, aplicaciones y servicios provistos por Nebbuler.</li>
              <li><strong>Usuario</strong>: cualquier persona que accede a la Plataforma, ya sea como Lector o Creador.</li>
              <li><strong>Creador</strong>: usuario que publica contenido profesional y cobra suscripciones a sus Lectores.</li>
              <li><strong>Lector</strong>: usuario que se suscribe a uno o más Creadores para acceder a su contenido.</li>
              <li><strong>Contenido</strong>: textos, imágenes, audios, archivos y cualquier otro material publicado por un Creador.</li>
              <li><strong>Suscripción</strong>: relación de pago recurrente entre un Lector y un Creador para acceder a su Contenido.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">2. Aceptación y modificaciones</h2>
            <p className="mb-3">Al crear una cuenta o usar la Plataforma aceptas estos términos en su totalidad. Si no estás de acuerdo, no debes usar Nebbuler.</p>
            <p>Podemos modificar estos términos. Te notificaremos cambios sustanciales por correo electrónico al menos 15 días antes de su entrada en vigencia. Continuar usando la Plataforma tras una modificación implica aceptación.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">3. Cuentas de usuario</h2>
            <p className="mb-3">Para usar la mayoría de funciones debes crear una cuenta. Te comprometes a:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Proporcionar información veraz, exacta y actualizada.</li>
              <li>Mantener la confidencialidad de tus credenciales de acceso.</li>
              <li>Ser responsable de toda actividad ocurrida bajo tu cuenta.</li>
              <li>Notificarnos de inmediato cualquier uso no autorizado.</li>
            </ul>
            <p className="mt-3">Solo personas naturales mayores de 18 años pueden crear cuenta. Los Creadores deben verificar su identidad profesional mediante LinkedIn o documentación equivalente.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">4. El servicio</h2>
            <p className="mb-3">Nebbuler es una plataforma que conecta profesionales (Creadores) con personas interesadas en su conocimiento (Lectores) mediante newsletters de pago. Operamos en Chile y otros países de Latinoamérica.</p>
            <p>Nebbuler actúa como <strong>intermediario tecnológico</strong>. El contenido es producido y publicado por los Creadores bajo su responsabilidad. Nebbuler no garantiza la exactitud, integridad ni utilidad del contenido publicado por terceros.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">5. Suscripciones de Lectores</h2>
            <p className="mb-3">El precio de cada suscripción es definido por el Creador y se cobra mensualmente de forma automática a través de MercadoPago.</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>El cobro se realiza el mismo día de cada mes desde la fecha de inicio.</li>
              <li>Puedes cancelar la renovación en cualquier momento desde tu cuenta. La cancelación surte efecto al cierre del ciclo de pago en curso.</li>
              <li>Tras la cancelación mantienes acceso hasta el día anterior a la siguiente fecha de cobro.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">6. Plan de Creadores</h2>
            <p className="mb-3">Los Creadores pagan a Nebbuler una tarifa fija mensual de <strong>$29.990 CLP</strong> (o su equivalente en moneda local) por uso de la Plataforma. Esta tarifa es independiente del precio que el Creador cobra a sus Lectores.</p>
            <p><strong>Nebbuler no cobra comisión sobre las suscripciones cobradas por los Creadores.</strong> El 100% del precio que un Lector paga llega íntegramente al Creador, descontados únicamente los cargos del procesador de pagos (MercadoPago).</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">7. Derecho de retracto</h2>
            <p className="mb-3">De acuerdo con la <strong>Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</strong>, en compras a distancia tienes derecho a retractar tu suscripción dentro de los 10 días siguientes a su contratación, salvo que el servicio haya sido enteramente prestado o consumido.</p>
            <p>Para ejercer este derecho, escríbenos a <a href="mailto:hello@nebbuler.com" className="text-[#C41C1C] underline">hello@nebbuler.com</a> dentro del plazo legal indicando tu intención de retracto. Procesaremos el reembolso del último cobro dentro de 10 días hábiles.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">8. Cancelaciones y reembolsos</h2>
            <p className="mb-3">Puedes cancelar cualquier suscripción cuando quieras desde tu cuenta. No se requiere justificación ni período de aviso.</p>
            <p className="mb-3">Los reembolsos fuera del plazo de retracto se evaluarán caso a caso. En general no se reembolsan ciclos ya iniciados, salvo en los siguientes casos:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Cobro duplicado o erróneo imputable a Nebbuler o al procesador de pagos.</li>
              <li>Falta de prestación del servicio por causa imputable al Creador (ej. no publica más).</li>
              <li>Suspensión de la cuenta del Creador por motivos disciplinarios graves.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">9. Propiedad intelectual del contenido</h2>
            <p className="mb-3">El Contenido publicado por cada Creador pertenece exclusivamente a su autor. Al publicar en Nebbuler, el Creador otorga a la Plataforma una <strong>licencia no exclusiva, mundial, libre de regalías</strong>, limitada a las acciones técnicas necesarias para hospedar, mostrar, distribuir por correo electrónico y dar acceso al Contenido a los Lectores suscriptos.</p>
            <p>Esta licencia termina cuando el Creador elimina el Contenido o cierra su cuenta, salvo respecto de copias previamente entregadas a Lectores activos.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">10. Contenido prohibido</h2>
            <p className="mb-3">No está permitido publicar Contenido que:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Infrinja derechos de propiedad intelectual o industrial de terceros.</li>
              <li>Sea difamatorio, injurioso o calumnioso.</li>
              <li>Constituya competencia desleal o publicidad engañosa.</li>
              <li>Contenga datos personales de terceros sin consentimiento.</li>
              <li>Promueva discriminación, violencia, terrorismo o actividades ilegales.</li>
              <li>Incluya material sexual explícito, especialmente con menores de edad.</li>
              <li>Constituya asesoría profesional formal sin que el Creador esté habilitado para ello.</li>
              <li>Spam, esquemas piramidales o estafas financieras.</li>
            </ul>
            <p className="mt-3">Nebbuler puede remover Contenido que infrinja estas reglas y suspender o cerrar cuentas reincidentes, sin perjuicio de las acciones legales que correspondan.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">11. Verificación de identidad del Creador</h2>
            <p>Los Creadores se verifican mediante autenticación OAuth con LinkedIn u otro mecanismo equivalente. Esta verificación busca dar confianza a los Lectores sobre la identidad profesional del autor, pero no constituye certificación de credenciales, títulos ni resultados.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">12. Suspensión y terminación de cuentas</h2>
            <p className="mb-3">Podemos suspender o cerrar tu cuenta si:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Incumples estos términos.</li>
              <li>Realizas fraude, abuso de pagos o suplantación de identidad.</li>
              <li>Recibes denuncias verificadas de otros usuarios.</li>
              <li>Cesa el cobro de la tarifa mensual (en el caso de Creadores).</li>
            </ul>
            <p className="mt-3">Puedes cerrar tu cuenta cuando quieras desde la configuración. Al hacerlo, tus suscripciones activas se cancelan al fin del ciclo en curso. Los datos se eliminan o anonimizan según la Política de Privacidad.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">13. Limitación de responsabilidad</h2>
            <p className="mb-3">Nebbuler se proporciona &quot;tal cual&quot;. En la máxima medida permitida por la ley aplicable:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>No garantizamos disponibilidad ininterrumpida del servicio.</li>
              <li>No somos responsables por las opiniones, afirmaciones, recomendaciones, ni cualquier consecuencia derivada del Contenido publicado por los Creadores.</li>
              <li>No somos responsables por daños indirectos, incidentales o consecuenciales.</li>
              <li>Nuestra responsabilidad máxima frente a un Usuario está limitada al valor de las suscripciones pagadas en los últimos 12 meses.</li>
            </ul>
            <p className="mt-3">Lo anterior no limita los derechos irrenunciables que las leyes de protección al consumidor te reconocen.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">14. Propiedad intelectual de Nebbuler</h2>
            <p>La marca &quot;Nebbuler&quot;, el dominio, el diseño de la Plataforma, su código y todos los elementos distintivos son propiedad de Nebbuler. No se otorga ningún derecho de uso comercial sobre estos elementos por el solo hecho de tener cuenta.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">15. Privacidad y datos personales</h2>
            <p>El tratamiento de tus datos personales se rige por nuestra <Link href="/privacidad" className="text-[#C41C1C] underline">Política de Privacidad</Link>, que es parte integrante de estos términos.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">16. Resolución de controversias y jurisdicción</h2>
            <p className="mb-3">Estos términos se rigen por las leyes de la República de Chile. Las controversias que surjan de su interpretación o aplicación se someterán a los tribunales ordinarios de justicia de la ciudad de Santiago de Chile.</p>
            <p>Lo anterior es sin perjuicio del derecho del consumidor a recurrir al <strong>Servicio Nacional del Consumidor (SERNAC)</strong> para mediación o reclamo.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">17. Contacto</h2>
            <p>Para cualquier consulta sobre estos términos: <a href="mailto:hello@nebbuler.com" className="text-[#C41C1C] underline">hello@nebbuler.com</a></p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#DEDEDE]">
          <Link href="/" className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors">← Volver al inicio</Link>
        </div>
      </main>
    </div>
  )
}
