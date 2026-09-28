import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sello «Sin IA»',
  description: 'Qué significa el sello «Escrito por un profesional verificado · Sin IA» en Nebbuler y cómo se otorga.',
  alternates: { canonical: 'https://nebbuler.com/sin-ia' },
}

export default function SinIaPage() {
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
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">Transparencia</p>
        <h1 className="font-serif text-[36px] font-bold text-[#121212] mb-12">Sello «Sin IA»</h1>

        <div className="font-sans text-[15px] text-[#333] leading-relaxed space-y-10">
          <section>
            <p className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-4 text-[14px]">
              En Nebbuler quieres saber quién escribió lo que lees o pagas. El sello
              «Escrito por un profesional verificado · Sin IA» existe para que puedas distinguirlo de un vistazo.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">Qué significa</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Nebbuler verificó la identidad y la trayectoria profesional del autor.</li>
              <li>El autor se comprometió por escrito a no publicar textos generados con inteligencia artificial.</li>
              <li>Si se detecta un incumplimiento, el sello se retira del perfil.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">Dónde aparece</h2>
            <p>
              Solo en los perfiles de autores que cumplen las condiciones anteriores. Un perfil sin sello no ha
              pasado por esta verificación. Los perfiles marcados como «Perfil de demostración» son ejemplos
              que muestran cómo funciona la plataforma: no corresponden a personas reales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4">¿Eres autor?</h2>
            <p>
              Si publicas en Nebbuler y quieres el sello, escríbenos a{' '}
              <a href="mailto:hello@nebbuler.com" className="underline hover:text-[#C41C1C]">hello@nebbuler.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
