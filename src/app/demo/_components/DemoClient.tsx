'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Contenido de ejemplo ─────────────────────────────────────────────────────

const DEMO_TITLE = 'La tasa terminal que el mercado no está leyendo bien'
const DEMO_CREATOR = 'Rodrigo Fuentes Marín'
const DEMO_SPECIALTY = 'MACROECONOMÍA Y POLÍTICA MONETARIA'
const DEMO_DATE = '14 de octubre de 2025'
const DEMO_READ_TIME = 7
const DEMO_PRICE = '$9.990'

const DEMO_CONTENT_HTML = `
<p>Hay un número que aparece en casi todos los informes de renta fija que circulan en Santiago: la tasa terminal del ciclo actual. El consenso de mercado la ubica consistentemente entre 4,5% y 5,0%. Creo que ese rango está mal, y voy a explicar por qué.</p>

<h2>El error de diagnóstico</h2>

<p>El problema no es el modelo. El problema es el supuesto de inflación subyacente que alimenta ese modelo. La mayoría de los analistas está usando expectativas de inflación a dos años que implican una convergencia al 3% mucho más rápida de lo que los datos de servicios justifican.</p>

<p>La inflación de bienes en Chile ya convergió. Eso es cierto. El IPC de bienes transables lleva tres trimestres dentro del rango meta. Pero la inflación de servicios —que el Banco Central monitorea con mayor atención de lo que comunica públicamente— sigue mostrando rigidez.</p>

<blockquote>Una tasa terminal de 4,5% asume condiciones que los datos de servicios y mercado laboral no respaldan todavía.</blockquote>

<h2>Lo que los datos de mercado laboral están diciendo</h2>

<p>El mercado laboral formal en Chile tiene una tasa de desempleo que parece benigna en el titular pero esconde una composición preocupante. El empleo asalariado formal crece lento. El empleo por cuenta propia —históricamente el refugio en ciclos recesivos— está creciendo de forma anómala para un momento de expansión moderada.</p>

<p>Eso sugiere que la brecha de producto está siendo <strong>subestimada por los modelos estándar</strong> del Banco Central. Y si la brecha de producto es mayor, el espacio para bajar la tasa sin riesgo inflacionario es menor de lo que el consenso asume.</p>
`

const DEMO_PREVIEW_HTML = `
<p>Hay un número que aparece en casi todos los informes de renta fija que circulan en Santiago: la tasa terminal del ciclo actual. El consenso de mercado la ubica consistentemente entre 4,5% y 5,0%. Creo que ese rango está mal, y voy a explicar por qué.</p>

<h2>El error de diagnóstico</h2>

<p>El problema no es el modelo. El problema es el supuesto de inflación subyacente que alimenta ese modelo. La mayoría de los analistas está usando expectativas de inflación a dos años que implican una convergencia al 3% mucho más rápida de lo que los datos de servicios justifican.</p>
`

// ─── Editor mockup ────────────────────────────────────────────────────────────

function EditorView() {
  return (
    <div className="flex flex-col h-full">

      {/* Toolbar del editor */}
      <div className="bg-white border-b border-[#DEDEDE] px-4 py-2.5 flex items-center gap-1 flex-shrink-0">
        {[
          { label: 'N', title: 'Normal' },
          { label: 'H2', title: 'Título' },
          { label: 'H3', title: 'Subtítulo' },
          { label: 'B', title: 'Negrita', bold: true },
          { label: 'I', title: 'Cursiva', italic: true },
          { label: '"', title: 'Cita' },
          { label: '🔗', title: 'Link' },
          { label: '—', title: 'Separador' },
        ].map((btn) => (
          <button key={btn.label} title={btn.title}
            className="px-2.5 py-1 text-[12px] font-sans text-[#666] hover:bg-[#F7F7F7] hover:text-[#121212] border border-transparent hover:border-[#DEDEDE] transition-all"
            style={{ fontWeight: btn.bold ? 700 : btn.italic ? 400 : 500, fontStyle: btn.italic ? 'italic' : 'normal' }}>
            {btn.label}
          </button>
        ))}
        <div className="mx-2 w-px h-4 bg-[#DEDEDE]" />
        <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-sans font-medium bg-[#F7F7F7] border border-[#DEDEDE] text-[#666] hover:border-[#121212] transition-all">
          + Imagen
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-sans font-medium bg-[#F7F7F7] border border-[#DEDEDE] text-[#666] hover:border-[#121212] transition-all">
          + YouTube
        </button>
      </div>

      {/* Área del editor */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-2xl mx-auto">

          {/* Título */}
          <div className="mb-6">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#999] mb-3">TÍTULO</p>
            <div className="text-[28px] font-serif font-bold text-[#121212] leading-tight border-b-2 border-[#C41C1C] pb-2">
              {DEMO_TITLE}
            </div>
          </div>

          {/* Opciones */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-[#DEDEDE]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#121212] bg-[#121212] flex items-center justify-center">
                <div className="w-2 h-2 bg-white" />
              </div>
              <span className="text-[12px] font-sans font-medium text-[#121212]">Solo suscriptores</span>
            </div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-4 h-4 border-2 border-[#DEDEDE]" />
              <span className="text-[12px] font-sans text-[#666]">Entrada gratuita</span>
            </div>
            <div className="ml-auto">
              <button className="bg-[#121212] text-white text-[12px] font-sans font-semibold px-5 py-2 hover:bg-[#2a2a2a] transition-colors">
                Publicar →
              </button>
            </div>
          </div>

          {/* Contenido del editor */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-[#121212] prose-headings:font-bold
              prose-h2:text-[20px] prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-[16px] prose-p:leading-[1.75] prose-p:text-[#121212] prose-p:mb-4
              prose-strong:font-bold prose-strong:text-[#121212]
              prose-blockquote:border-l-[3px] prose-blockquote:border-[#C41C1C] prose-blockquote:pl-4
              prose-blockquote:italic prose-blockquote:text-[#444]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: DEMO_CONTENT_HTML }}
          />

          {/* Cursor parpadeante al final */}
          <div className="mt-2 flex items-center">
            <span className="inline-block w-0.5 h-5 bg-[#121212] animate-pulse" />
          </div>

        </div>
      </div>

      {/* Footer del editor */}
      <div className="bg-[#F7F7F7] border-t border-[#DEDEDE] px-6 py-2 flex items-center justify-between flex-shrink-0">
        <span className="text-[11px] font-sans text-[#999]">482 palabras · ~{DEMO_READ_TIME} min de lectura</span>
        <span className="text-[11px] font-sans text-[#999]">Guardado automáticamente</span>
      </div>
    </div>
  )
}

// ─── Vista del lector ─────────────────────────────────────────────────────────

function ReaderView({ showPaywall }: { showPaywall: boolean }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">

      {/* Nav del post */}
      <div className="border-b border-[#DEDEDE] px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-[3px] w-6 bg-[#C41C1C]" />
          <span className="font-serif text-[14px] font-bold text-[#121212]">NEBBULER</span>
        </div>
        <span className="text-[11px] font-sans text-[#999] uppercase tracking-wide">{DEMO_SPECIALTY}</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 w-full">

        {/* Header del post */}
        <header className="mb-8">
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#C41C1C] mb-3">{DEMO_SPECIALTY}</p>
          <h1 className="font-serif text-[28px] font-bold text-[#121212] leading-tight mb-4" style={{ letterSpacing: '-0.01em' }}>
            {DEMO_TITLE}
          </h1>
          <div className="flex items-center gap-4 py-4 border-t border-b border-[#DEDEDE]">
            <div className="w-8 h-8 bg-[#121212] flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">RF</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#121212] font-sans">{DEMO_CREATOR}</p>
              <p className="text-[11px] text-[#999] font-sans">{DEMO_DATE} · {DEMO_READ_TIME} min de lectura</p>
            </div>
          </div>
        </header>

        {/* Contenido */}
        {!showPaywall ? (
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-[#121212] prose-headings:font-bold
              prose-h2:text-[22px] prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-[#121212] prose-p:mb-6
              prose-strong:font-bold
              prose-blockquote:border-l-[3px] prose-blockquote:border-[#C41C1C] prose-blockquote:pl-6
              prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#444] prose-blockquote:text-[18px]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: DEMO_CONTENT_HTML }}
          />
        ) : (
          <>
            <div
              className="prose prose-lg max-w-none
                prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-[#121212] prose-p:mb-6
                prose-h2:font-serif prose-h2:text-[22px] prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: DEMO_PREVIEW_HTML }}
            />

            {/* Fade out */}
            <div className="relative h-24 -mt-8 mb-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, white)' }} />

            {/* Paywall */}
            <div className="border border-[#DEDEDE] bg-white p-8 text-center">
              <div className="h-[3px] bg-[#C41C1C] w-12 mx-auto mb-6" />
              <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#999] mb-3">
                Contenido exclusivo para suscriptores
              </p>
              <h3 className="font-serif text-[22px] font-bold text-[#121212] mb-3 leading-tight">
                Para leer el análisis completo
              </h3>
              <p className="font-sans text-[14px] text-[#666] mb-6 leading-relaxed">
                Suscríbete a <strong>{DEMO_CREATOR}</strong> y accede a todos sus artículos por {DEMO_PRICE}/mes.
                Cancela cuando quieras.
              </p>
              <button className="bg-[#009EE3] hover:bg-[#007AB8] text-white font-sans text-[14px] font-semibold px-8 py-3.5 transition-colors w-full">
                Suscribirme con MercadoPago · {DEMO_PRICE}/mes
              </button>
              <p className="text-[11px] font-sans text-[#999] mt-3">Pago seguro vía MercadoPago.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────────────────────────────────────

export default function DemoClient() {
  const [activeTab, setActiveTab] = useState<'editor' | 'lector' | 'paywall'>('editor')

  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <div className="h-[3px] bg-[#C41C1C] w-full" />

      {/* Header */}
      <header className="bg-white border-b border-[#DEDEDE] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-[20px] font-bold text-[#121212]" style={{ letterSpacing: '-0.01em' }}>
          NEBBULER
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#999]">Cómo funciona</span>
          <Link href="/registro" className="bg-[#C41C1C] text-white font-sans text-[12px] font-semibold px-4 py-2 hover:bg-[#a01515] transition-colors">
            Abrir mi sala →
          </Link>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#C41C1C] mb-3">Demo interactiva</p>
        <h1 className="font-serif text-[36px] font-bold text-[#121212] mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
          Así funciona Nebbuler
        </h1>
        <p className="font-sans text-[16px] text-[#666] max-w-xl mx-auto leading-relaxed">
          Un profesional escribe su análisis, define que es exclusivo para suscriptores, y publica. Sus lectores reciben el artículo por email y lo leen en su sala personal.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mb-0">
        <div className="flex border-b border-[#DEDEDE]">
          {([
            { id: 'editor',  label: '① El creador escribe' },
            { id: 'lector',  label: '② El lector lo ve (suscrito)' },
            { id: 'paywall', label: '③ Sin suscripción' },
          ] as const).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-sans text-[13px] font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#C41C1C] text-[#121212]'
                  : 'border-transparent text-[#999] hover:text-[#666]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del tab */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="border border-[#DEDEDE] bg-white overflow-hidden" style={{ height: '640px' }}>
          {activeTab === 'editor'  && <EditorView />}
          {activeTab === 'lector'  && <ReaderView showPaywall={false} />}
          {activeTab === 'paywall' && <ReaderView showPaywall={true} />}
        </div>

        {/* Descripción del tab */}
        <div className="mt-4 px-1">
          {activeTab === 'editor' && (
            <p className="font-sans text-[13px] text-[#666] leading-relaxed">
              <strong className="text-[#121212]">El editor</strong> — El creador escribe con formato completo: títulos, negritas, citas, imágenes y videos de YouTube. Elige si el artículo es exclusivo para suscriptores o de entrada libre. El borrador se guarda automáticamente.
            </p>
          )}
          {activeTab === 'lector' && (
            <p className="font-sans text-[13px] text-[#666] leading-relaxed">
              <strong className="text-[#121212]">Vista del suscriptor</strong> — Un lector con suscripción activa ve el artículo completo. Diseño editorial limpio, tipografía legible, sin publicidad ni distracciones. El artículo también llega directamente a su correo electrónico.
            </p>
          )}
          {activeTab === 'paywall' && (
            <p className="font-sans text-[13px] text-[#666] leading-relaxed">
              <strong className="text-[#121212]">Sin suscripción</strong> — El visitante ve las primeras líneas del artículo y luego el muro de suscripción. El precio lo define el propio creador. El pago es via MercadoPago en la moneda local.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 border border-[#DEDEDE] bg-white p-8 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-[22px] font-bold text-[#121212] mb-1">¿Listo para abrir tu sala?</h3>
            <p className="font-sans text-[14px] text-[#666]">Configura tu perfil en 15 minutos. Sin código.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/explorar" className="font-sans text-[13px] font-medium text-[#666] hover:text-[#121212] transition-colors">
              Ver creadores →
            </Link>
            <Link href="/registro" className="bg-[#C41C1C] text-white font-sans text-[13px] font-semibold px-6 py-3 hover:bg-[#a01515] transition-colors">
              Abrir mi sala gratis →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
