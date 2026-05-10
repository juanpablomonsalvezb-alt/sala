import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y tratamiento de datos personales en Nebbuler.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#B31C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">Legal</p>
        <h1 className="font-serif text-[36px] font-bold text-[#121212] mb-2">Política de Privacidad</h1>
        <p className="font-sans text-[13px] text-[#999] mb-12">Última actualización: mayo 2026</p>

        <div className="prose prose-sm max-w-none font-sans text-[15px] text-[#333] leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">1. Información que recopilamos</h2>
            <p>Recopilamos información que nos proporcionas al crear una cuenta: nombre, correo electrónico. También recopilamos datos de uso para mejorar el servicio.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">2. Uso de la información</h2>
            <p>Usamos tu información para operar la plataforma, procesar pagos, enviarte comunicaciones sobre tu cuenta y mejorar el servicio. No vendemos tu información a terceros.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">3. Procesadores de pago</h2>
            <p>Los pagos son procesados por MercadoPago. Tu información de pago no es almacenada en nuestros servidores. Consulta la política de privacidad de MercadoPago para más detalles.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">4. Cookies y tecnologías similares</h2>
            <p>Usamos cookies para mantener tu sesión activa y mejorar tu experiencia. Puedes configurar tu navegador para rechazarlas, aunque esto puede afectar el funcionamiento del sitio.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">5. Tus derechos</h2>
            <p>Tienes derecho a acceder, rectificar y eliminar tus datos personales. Para ejercer estos derechos, contáctanos en <a href="mailto:hello@nebbuler.com" className="text-[#B31C1C] underline">hello@nebbuler.com</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">6. Seguridad</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información. La autenticación usa Supabase con cifrado de extremo a extremo.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">7. Contacto</h2>
            <p>Para consultas de privacidad: <a href="mailto:hello@nebbuler.com" className="text-[#B31C1C] underline">hello@nebbuler.com</a></p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#DEDEDE]">
          <Link href="/" className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors">← Volver al inicio</Link>
        </div>
      </main>
    </div>
  )
}
