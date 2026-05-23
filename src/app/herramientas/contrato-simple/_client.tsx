'use client'

import { useState, useMemo } from 'react'

const PAISES = [
  { code: 'CL', nombre: 'Chile', moneda: 'CLP', simbolo: '$' },
  { code: 'CO', nombre: 'Colombia', moneda: 'COP', simbolo: '$' },
  { code: 'MX', nombre: 'México', moneda: 'MXN', simbolo: '$' },
  { code: 'AR', nombre: 'Argentina', moneda: 'ARS', simbolo: '$' },
  { code: 'PE', nombre: 'Perú', moneda: 'PEN', simbolo: 'S/' },
  { code: 'EC', nombre: 'Ecuador', moneda: 'USD', simbolo: '$' },
  { code: 'UY', nombre: 'Uruguay', moneda: 'UYU', simbolo: '$' },
  { code: 'PA', nombre: 'Panamá', moneda: 'USD', simbolo: '$' },
  { code: 'DO', nombre: 'Rep. Dominicana', moneda: 'DOP', simbolo: 'RD$' },
  { code: 'GT', nombre: 'Guatemala', moneda: 'GTQ', simbolo: 'Q' },
  { code: 'CR', nombre: 'Costa Rica', moneda: 'CRC', simbolo: '₡' },
  { code: 'BO', nombre: 'Bolivia', moneda: 'BOB', simbolo: 'Bs.' },
  { code: 'PY', nombre: 'Paraguay', moneda: 'PYG', simbolo: '₲' },
]

const PROFESIONES = [
  'Psicología',
  'Coaching',
  'Consultoría de negocios',
  'Nutrición y dietética',
  'Asesoría legal',
  'Contabilidad y finanzas',
  'Diseño gráfico',
  'Desarrollo de software',
  'Periodismo y redacción',
  'Arquitectura',
  'Ingeniería',
  'Formación y capacitación',
  'Marketing y comunicaciones',
  'Otro',
]

function hoy(): string {
  return new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ContratoSimpleGenerator() {
  const [paisCode, setPaisCode] = useState('CL')
  const [provNombre, setProvNombre] = useState('')
  const [provProfesion, setProvProfesion] = useState('')
  const [clienteNombre, setClienteNombre] = useState('')
  const [servicio, setServicio] = useState('')
  const [duracion, setDuracion] = useState('')
  const [valor, setValor] = useState('')
  const [formaPago, setFormaPago] = useState('transferencia bancaria')
  const [copiado, setCopiado] = useState(false)

  const pais = PAISES.find((p) => p.code === paisCode) || PAISES[0]

  const contrato = useMemo(() => {
    if (!provNombre || !clienteNombre || !servicio) return null

    return `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

Lugar y fecha: ${pais.nombre}, ${hoy()}

PARTES

Prestador de servicios: ${provNombre}${provProfesion ? `, profesional en ${provProfesion}` : ''}, en adelante "el Prestador".

Cliente: ${clienteNombre}, en adelante "el Cliente".

OBJETO DEL CONTRATO

El Prestador se compromete a prestar los siguientes servicios profesionales al Cliente:

${servicio}

DURACIÓN Y ALCANCE

${duracion || 'Las partes acordarán el plazo y alcance de cada entrega de común acuerdo.'}

HONORARIOS Y FORMA DE PAGO

${valor ? `El Cliente pagará al Prestador la suma de ${pais.simbolo}${valor} ${pais.moneda}` : 'Los honorarios serán los acordados entre las partes'} mediante ${formaPago}.

El pago se realizará según lo acordado entre las partes antes del inicio de cada servicio o en las fechas convenidas.

CONFIDENCIALIDAD

Las partes se comprometen a mantener confidencialidad respecto a toda información que intercambien en el marco de este contrato.

PROPIEDAD INTELECTUAL

Los entregables generados durante la prestación de servicios serán de propiedad del Cliente una vez recibido el pago total de los honorarios pactados.

RESOLUCIÓN DEL CONTRATO

Cualquiera de las partes puede resolver el contrato con un aviso previo de 15 días corridos. En caso de resolución unilateral sin aviso, la parte que resuelve deberá indemnizar a la otra parte por los servicios prestados hasta esa fecha.

LEGISLACIÓN APLICABLE

Este contrato se rige por las leyes de ${pais.nombre}. Cualquier controversia será sometida a los tribunales competentes de ${pais.nombre}.

──────────────────────────────────────

FIRMA DEL PRESTADOR

Nombre: ${provNombre}
Firma: ___________________________
Fecha: ___________________________

FIRMA DEL CLIENTE

Nombre: ${clienteNombre}
Firma: ___________________________
Fecha: ___________________________`
  }, [provNombre, provProfesion, clienteNombre, servicio, duracion, valor, formaPago, pais])

  const copiar = async () => {
    if (!contrato) return
    await navigator.clipboard.writeText(contrato)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="space-y-8">

      {/* Inputs */}
      <div className="border border-[#DEDEDE] p-6">
        <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-6">
          Datos del contrato
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* País */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">País</label>
            <select
              value={paisCode}
              onChange={(e) => setPaisCode(e.target.value)}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] bg-white focus:outline-none focus:border-[#121212]"
            >
              {PAISES.map((p) => (
                <option key={p.code} value={p.code}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Profesión */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">Tu profesión</label>
            <select
              value={provProfesion}
              onChange={(e) => setProvProfesion(e.target.value)}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] bg-white focus:outline-none focus:border-[#121212]"
            >
              <option value="">Selecciona</option>
              {PROFESIONES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Tu nombre */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">Tu nombre completo</label>
            <input
              type="text"
              value={provNombre}
              onChange={(e) => setProvNombre(e.target.value)}
              placeholder="María González"
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
            />
          </div>

          {/* Nombre del cliente */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">Nombre del cliente</label>
            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Carlos Pérez"
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
            />
          </div>

          {/* Descripción del servicio */}
          <div className="sm:col-span-2">
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">Descripción del servicio</label>
            <textarea
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              placeholder="Ej: 8 sesiones de coaching ejecutivo de 60 minutos cada una, orientadas al desarrollo de liderazgo y comunicación efectiva."
              rows={3}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212] resize-none"
            />
          </div>

          {/* Duración */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">Duración / alcance (opcional)</label>
            <input
              type="text"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              placeholder="Ej: 2 meses, 8 sesiones semanales"
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
            />
          </div>

          {/* Honorarios */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              Honorarios ({pais.moneda}, opcional)
            </label>
            <div className="flex items-center border border-[#DEDEDE] focus-within:border-[#121212]">
              <span className="px-3 py-2.5 font-sans text-[14px] text-[#999] border-r border-[#DEDEDE] bg-[#F7F7F7]">
                {pais.simbolo}
              </span>
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="150.000"
                className="flex-1 px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Forma de pago */}
          <div className="sm:col-span-2">
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">Forma de pago</label>
            <select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] bg-white focus:outline-none focus:border-[#121212]"
            >
              <option value="transferencia bancaria">Transferencia bancaria</option>
              <option value="plataforma Nebbuler">Plataforma Nebbuler</option>
              <option value="efectivo">Efectivo</option>
              <option value="cheque">Cheque</option>
              <option value="las partes acordarán">A acordar entre las partes</option>
            </select>
          </div>

        </div>
      </div>

      {/* Contrato generado */}
      {contrato ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[18px] font-bold text-[#121212]">
              Tu contrato
            </h2>
            <button
              onClick={copiar}
              className="font-sans text-[12px] font-semibold uppercase tracking-[0.06em] px-4 py-2 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
            >
              {copiado ? '✓ Copiado' : 'Copiar texto'}
            </button>
          </div>
          <pre className="border border-[#DEDEDE] bg-[#F7F7F7] p-6 font-mono text-[12px] text-[#333] leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {contrato}
          </pre>
          <p className="font-sans text-[11px] text-[#999] mt-2 leading-relaxed">
            Este contrato es una plantilla de referencia. Para operaciones de alto valor o con implicancias legales importantes, consulta a un abogado en tu país.
          </p>
        </div>
      ) : (
        <div className="border border-dashed border-[#DEDEDE] p-8 text-center">
          <p className="font-sans text-[14px] text-[#999]">
            Completa tu nombre, el nombre del cliente y el servicio para generar el contrato
          </p>
        </div>
      )}

    </div>
  )
}
