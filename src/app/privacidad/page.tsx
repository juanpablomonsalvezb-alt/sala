import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y tratamiento de datos personales en Nebbuler. Cumplimiento Ley 19.628 y Ley 21.719 de Chile.',
  alternates: { canonical: 'https://nebbuler.com/privacidad' },
}

export default function PrivacidadPage() {
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
        <h1 className="font-serif text-[36px] font-bold text-[#121212] mb-2">Política de Privacidad</h1>
        <p className="font-sans text-[13px] text-[#999] mb-12">Última actualización: 11 de mayo de 2026 · Versión 1.0</p>

        <div className="max-w-none font-sans text-[15px] text-[#333] leading-relaxed space-y-10">

          <section>
            <p className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 text-[14px]">
              Esta política explica qué datos personales recopilamos, por qué los usamos, con quién los compartimos y qué derechos tienes sobre ellos.
              Si solo quieres saber lo esencial: <strong>no vendemos tus datos, no los usamos para publicidad de terceros, puedes pedir copia o eliminación cuando quieras.</strong>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">1. Responsable del tratamiento</h2>
            <p>El responsable del tratamiento de tus datos personales es <strong>Nebbuler</strong>, operador de la plataforma nebbuler.com. Para cualquier consulta relacionada con privacidad o ejercicio de derechos, contáctanos en <a href="mailto:hello@nebbuler.com" className="text-[#C41C1C] underline">hello@nebbuler.com</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">2. Datos que recopilamos</h2>
            <p className="mb-3">Solo recopilamos lo que necesitamos para operar la plataforma:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Datos de cuenta:</strong> nombre, correo electrónico, contraseña cifrada (o token de OAuth si te registras con Google/LinkedIn).</li>
              <li><strong>Perfil profesional (solo Creadores):</strong> especialidad, biografía, URL pública de LinkedIn, foto de perfil, país.</li>
              <li><strong>Contenido publicado:</strong> textos, imágenes y archivos que decidas publicar como Creador.</li>
              <li><strong>Datos de pago:</strong> procesados directamente por MercadoPago. Nebbuler nunca almacena tu número de tarjeta. Recibimos solo confirmación del pago e identificador anonimizado.</li>
              <li><strong>Datos de uso:</strong> direcciones IP, navegador, sistema operativo, páginas visitadas, fechas de acceso, conteo de vistas de posts.</li>
              <li><strong>Comunicaciones:</strong> correos que envíes a soporte y respuestas que recibas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">3. Finalidades del tratamiento</h2>
            <p className="mb-3">Usamos tus datos para:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Crear y mantener tu cuenta.</li>
              <li>Procesar suscripciones, cobros y emisión de comprobantes.</li>
              <li>Enviar notificaciones operativas (nuevas publicaciones, cancelaciones, etc).</li>
              <li>Brindar soporte al usuario.</li>
              <li>Mejorar la plataforma con base en métricas agregadas y anonimizadas.</li>
              <li>Cumplir con obligaciones legales, contables y tributarias.</li>
              <li>Prevenir fraude, abuso y violaciones a los Términos de Servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">4. Base legal</h2>
            <p className="mb-3">Tratamos tus datos sobre las siguientes bases jurídicas, conforme a la Ley N° 19.628 sobre Protección de la Vida Privada y la Ley N° 21.719 que actualiza el régimen de datos personales en Chile:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li><strong>Consentimiento</strong> que prestas al crear tu cuenta y aceptar esta política.</li>
              <li><strong>Ejecución contractual</strong> para prestarte el servicio que contrataste.</li>
              <li><strong>Cumplimiento de obligaciones legales</strong> (tributarias, contables, regulatorias).</li>
              <li><strong>Interés legítimo</strong> en mejorar el servicio y prevenir fraude, siempre que no prevalezcan tus derechos.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">5. Compartición con terceros (encargados de tratamiento)</h2>
            <p className="mb-3">Compartimos datos con proveedores que necesitamos para operar. Cada uno está sujeto a acuerdos contractuales que garantizan el tratamiento conforme a esta política:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Supabase</strong> (EE.UU. / UE) — base de datos y autenticación.</li>
              <li><strong>Vercel</strong> (EE.UU.) — hosting y CDN de la aplicación.</li>
              <li><strong>MercadoPago</strong> (Argentina / Chile) — procesamiento de pagos.</li>
              <li><strong>Resend</strong> (EE.UU.) — envío de correos transaccionales.</li>
              <li><strong>UploadThing</strong> (EE.UU.) — almacenamiento de archivos subidos por Creadores.</li>
              <li><strong>Google / LinkedIn</strong> — autenticación OAuth (solo si elegiste registrarte con ellos).</li>
            </ul>
            <p className="mt-3">No vendemos, alquilamos ni cedemos tus datos a terceros con fines publicitarios.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">6. Transferencia internacional</h2>
            <p>Algunos de nuestros proveedores procesan datos fuera de Chile (principalmente Estados Unidos y la Unión Europea). Estas transferencias se realizan con base en cláusulas contractuales estándar y bajo niveles de protección adecuados conforme a las leyes aplicables.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">7. Tiempo de conservación</h2>
            <p className="mb-3">Conservamos tus datos por el tiempo necesario para cumplir las finalidades descritas:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li><strong>Datos de cuenta y perfil:</strong> mientras tu cuenta esté activa.</li>
              <li><strong>Datos de facturación y transacciones:</strong> 7 años para cumplir obligaciones tributarias.</li>
              <li><strong>Contenido publicado por Creadores:</strong> mientras esté publicado y por un máximo de 90 días tras su eliminación.</li>
              <li><strong>Datos de uso analítico:</strong> hasta 24 meses, anonimizados después.</li>
              <li><strong>Comunicaciones de soporte:</strong> 3 años.</li>
            </ul>
            <p className="mt-3">Tras estos plazos eliminamos o anonimizamos los datos de forma irreversible.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">8. Tus derechos</h2>
            <p className="mb-3">Sobre tus datos personales tienes derecho a:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Acceso:</strong> solicitar copia de los datos que tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Cancelación o supresión:</strong> pedir la eliminación de tus datos cuando no sean necesarios.</li>
              <li><strong>Oposición:</strong> rechazar tratamientos basados en interés legítimo.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado para llevarlos a otra plataforma.</li>
              <li><strong>Limitación:</strong> pedir que restrinjamos el tratamiento mientras se resuelve una disputa.</li>
              <li><strong>Retiro del consentimiento</strong> en cualquier momento, sin afectar la legalidad del tratamiento previo.</li>
            </ul>
            <p className="mt-3">Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:hello@nebbuler.com" className="text-[#C41C1C] underline">hello@nebbuler.com</a> identificándote y especificando tu solicitud. Responderemos dentro de 15 días hábiles.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">9. Cookies y tecnologías similares</h2>
            <p className="mb-3">Usamos las siguientes cookies y mecanismos de almacenamiento:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Esenciales (sin consentimiento previo):</strong> mantienen tu sesión iniciada y aseguran el funcionamiento del sitio. Sin estas, la plataforma no opera.</li>
              <li><strong>De analítica agregada:</strong> nos permiten medir tráfico de forma anónima. No identifican usuarios individualmente.</li>
              <li><strong>De terceros:</strong> impuestas por Google y LinkedIn solo durante el flujo de autenticación OAuth (si eliges esa vía).</li>
            </ul>
            <p className="mt-3">Puedes configurar tu navegador para bloquear o eliminar cookies. Tener en cuenta que bloquear las cookies esenciales impedirá iniciar sesión.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">10. Menores de edad</h2>
            <p>Nebbuler está dirigido a mayores de 18 años. No recopilamos a sabiendas datos de menores. Si crees que un menor ha registrado cuenta, escríbenos para eliminarla.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">11. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos: cifrado en tránsito (HTTPS), cifrado de contraseñas, control de accesos por roles, auditoría de operaciones sensibles, copias de respaldo. Sin embargo, ningún sistema es absolutamente impenetrable; te pedimos cuidar tu contraseña y avisarnos de cualquier sospecha de acceso no autorizado.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">12. Brechas de seguridad</h2>
            <p>En caso de violación de seguridad que pueda afectar tus datos personales, te notificaremos por correo electrónico dentro de los plazos legales aplicables y reportaremos el incidente a las autoridades competentes cuando corresponda.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">13. Modificaciones a esta política</h2>
            <p>Podemos actualizar esta política cuando cambien nuestras prácticas o el marco legal. Te notificaremos cambios sustanciales por correo electrónico al menos 15 días antes de su entrada en vigencia.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">14. Autoridad de control</h2>
            <p>Si consideras que el tratamiento de tus datos vulnera la normativa aplicable, puedes recurrir a la <strong>Agencia de Protección de Datos Personales de Chile</strong> (autoridad de control creada por la Ley N° 21.719). Igualmente puedes acudir a la justicia ordinaria.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">15. Contacto</h2>
            <p>Para cualquier consulta de privacidad: <a href="mailto:hello@nebbuler.com" className="text-[#C41C1C] underline">hello@nebbuler.com</a></p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#DEDEDE]">
          <Link href="/" className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors">← Volver al inicio</Link>
        </div>
      </main>
    </div>
  )
}
