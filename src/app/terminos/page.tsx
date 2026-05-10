import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Términos y condiciones de uso de Nebbuler.',
}

export default function TerminosPage() {
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
        <h1 className="font-serif text-[36px] font-bold text-[#121212] mb-2">Términos de Servicio</h1>
        <p className="font-sans text-[13px] text-[#999] mb-12">Última actualización: mayo 2026</p>

        <div className="prose prose-sm max-w-none font-sans text-[15px] text-[#333] leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">1. Aceptación de los términos</h2>
            <p>Al acceder y usar Nebbuler (nebbuler.com), aceptas estos Términos de Servicio. Si no estás de acuerdo, por favor no uses la plataforma.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">2. El servicio</h2>
            <p>Nebbuler es una plataforma que permite a profesionales publicar newsletters de pago y a lectores suscribirse a ellos. Operamos en Chile y América Latina.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">3. Cuentas de usuario</h2>
            <p>Eres responsable de mantener la seguridad de tu cuenta. Notifícanos inmediatamente si detectas uso no autorizado. No compartimos tu información con terceros salvo lo necesario para procesar pagos.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">4. Creadores de contenido</h2>
            <p>Los creadores son responsables del contenido que publican. Nebbuler no cobra comisión sobre los ingresos de suscripciones. Los pagos se procesan a través de MercadoPago.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">5. Suscripciones y pagos</h2>
            <p>Las suscripciones se renuevan mensualmente. Puedes cancelar en cualquier momento desde tu cuenta. Los reembolsos se evaluarán caso a caso según la política de MercadoPago.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">6. Contenido prohibido</h2>
            <p>No está permitido publicar contenido ilegal, difamatorio, que infrinja derechos de terceros, o que promueva actividades dañinas. Nebbuler puede remover contenido que viole estas condiciones.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">7. Contacto</h2>
            <p>Para consultas legales: <a href="mailto:hello@nebbuler.com" className="text-[#B31C1C] underline">hello@nebbuler.com</a></p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#DEDEDE]">
          <Link href="/" className="font-sans text-[13px] text-[#666] hover:text-[#121212] transition-colors">← Volver al inicio</Link>
        </div>
      </main>
    </div>
  )
}
