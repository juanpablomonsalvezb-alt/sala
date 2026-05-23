'use client'

import { useState, useMemo } from 'react'

const PAISES = [
  { code: 'CL', nombre: 'Chile', moneda: 'CLP', simbolo: '$', ejemplo: 1800000 },
  { code: 'CO', nombre: 'Colombia', moneda: 'COP', simbolo: '$', ejemplo: 8000000 },
  { code: 'MX', nombre: 'México', moneda: 'MXN', simbolo: '$', ejemplo: 45000 },
  { code: 'AR', nombre: 'Argentina', moneda: 'ARS', simbolo: '$', ejemplo: 1200000 },
  { code: 'PE', nombre: 'Perú', moneda: 'PEN', simbolo: 'S/', ejemplo: 5000 },
  { code: 'EC', nombre: 'Ecuador', moneda: 'USD', simbolo: '$', ejemplo: 2500 },
  { code: 'UY', nombre: 'Uruguay', moneda: 'UYU', simbolo: '$', ejemplo: 80000 },
  { code: 'BO', nombre: 'Bolivia', moneda: 'BOB', simbolo: 'Bs.', ejemplo: 15000 },
  { code: 'PY', nombre: 'Paraguay', moneda: 'PYG', simbolo: '₲', ejemplo: 12000000 },
  { code: 'VE', nombre: 'Venezuela', moneda: 'USD', simbolo: '$', ejemplo: 2000 },
  { code: 'GT', nombre: 'Guatemala', moneda: 'GTQ', simbolo: 'Q', ejemplo: 18000 },
  { code: 'CR', nombre: 'Costa Rica', moneda: 'CRC', simbolo: '₡', ejemplo: 1400000 },
  { code: 'PA', nombre: 'Panamá', moneda: 'USD', simbolo: '$', ejemplo: 3000 },
  { code: 'DO', nombre: 'Rep. Dominicana', moneda: 'DOP', simbolo: 'RD$', ejemplo: 90000 },
]

const PROFESIONES = [
  'Psicólogo/a',
  'Coach',
  'Consultor/a de negocios',
  'Nutricionista',
  'Abogado/a',
  'Contador/a',
  'Diseñador/a',
  'Periodista / Editor/a',
  'Médico/a (consulta privada)',
  'Terapeuta',
  'Arquitecto/a',
  'Ingeniero/a consultor/a',
  'Formador/a / Capacitador/a',
  'Otro',
]

function fmt(n: number, simbolo: string): string {
  if (n >= 1000000) {
    return `${simbolo}${(n / 1000000).toFixed(1)}M`
  }
  if (n >= 1000) {
    return `${simbolo}${Math.round(n).toLocaleString('es-CL')}`
  }
  return `${simbolo}${Math.round(n).toLocaleString('es-CL')}`
}

export default function TarifaHoraCalculator() {
  const [paisCode, setPaisCode] = useState('CL')
  const [ingresoObj, setIngresoObj] = useState('')
  const [overhead, setOverhead] = useState('')
  const [diasMes, setDiasMes] = useState('20')
  const [horasDia, setHorasDia] = useState('4')
  const [profesion, setProfesion] = useState('')

  const pais = PAISES.find((p) => p.code === paisCode) || PAISES[0]

  const resultado = useMemo(() => {
    const ingreso = parseFloat(ingresoObj.replace(/[.,\s]/g, '')) || 0
    const gasto = parseFloat(overhead.replace(/[.,\s]/g, '')) || 0
    const dias = parseInt(diasMes) || 20
    const horas = parseFloat(horasDia) || 4

    if (ingreso <= 0) return null

    const totalNecesario = ingreso + gasto
    const horasTotales = dias * horas

    if (horasTotales <= 0) return null

    const tarifaHora = totalNecesario / horasTotales

    return {
      tarifaHora,
      sesion60: tarifaHora,
      sesion90: tarifaHora * 1.5,
      sesion120: tarifaHora * 2,
      proyectoDia: tarifaHora * horas,
      retainerMensual: totalNecesario,
      horasTotales,
      totalNecesario,
    }
  }, [ingresoObj, overhead, diasMes, horasDia])

  const handlePaisChange = (code: string) => {
    setPaisCode(code)
    const p = PAISES.find((x) => x.code === code)
    if (p) setIngresoObj(p.ejemplo.toString())
  }

  return (
    <div className="space-y-8">

      {/* Inputs */}
      <div className="border border-[#DEDEDE] p-6">
        <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-6">
          Ingresa tus datos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* País */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              País
            </label>
            <select
              value={paisCode}
              onChange={(e) => handlePaisChange(e.target.value)}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] bg-white focus:outline-none focus:border-[#121212]"
            >
              {PAISES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.nombre} ({p.moneda})
                </option>
              ))}
            </select>
          </div>

          {/* Profesión */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              Profesión (opcional)
            </label>
            <select
              value={profesion}
              onChange={(e) => setProfesion(e.target.value)}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] bg-white focus:outline-none focus:border-[#121212]"
            >
              <option value="">Selecciona tu profesión</option>
              {PROFESIONES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Ingreso objetivo */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              Ingreso mensual que quieres recibir ({pais.moneda})
            </label>
            <div className="flex items-center border border-[#DEDEDE] focus-within:border-[#121212]">
              <span className="px-3 py-2.5 font-sans text-[14px] text-[#999] border-r border-[#DEDEDE] bg-[#F7F7F7]">
                {pais.simbolo}
              </span>
              <input
                type="number"
                value={ingresoObj}
                onChange={(e) => setIngresoObj(e.target.value)}
                placeholder={pais.ejemplo.toString()}
                className="flex-1 px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none bg-white"
              />
            </div>
            <p className="font-sans text-[11px] text-[#999] mt-1">
              Lo que quieres llevarte a casa cada mes
            </p>
          </div>

          {/* Gastos fijos */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              Gastos fijos mensuales ({pais.moneda})
            </label>
            <div className="flex items-center border border-[#DEDEDE] focus-within:border-[#121212]">
              <span className="px-3 py-2.5 font-sans text-[14px] text-[#999] border-r border-[#DEDEDE] bg-[#F7F7F7]">
                {pais.simbolo}
              </span>
              <input
                type="number"
                value={overhead}
                onChange={(e) => setOverhead(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none bg-white"
              />
            </div>
            <p className="font-sans text-[11px] text-[#999] mt-1">
              Arriendo consultorio, suscripciones, seguros, etc.
            </p>
          </div>

          {/* Días */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              Días de trabajo al mes
            </label>
            <input
              type="number"
              value={diasMes}
              onChange={(e) => setDiasMes(e.target.value)}
              min={1}
              max={30}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
            />
            <p className="font-sans text-[11px] text-[#999] mt-1">
              Considera días libres y vacaciones
            </p>
          </div>

          {/* Horas facturables */}
          <div>
            <label className="block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5">
              Horas facturables por día
            </label>
            <input
              type="number"
              value={horasDia}
              onChange={(e) => setHorasDia(e.target.value)}
              min={0.5}
              max={12}
              step={0.5}
              className="w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212]"
            />
            <p className="font-sans text-[11px] text-[#999] mt-1">
              Solo horas que cobras directamente a clientes (no incluir admin)
            </p>
          </div>

        </div>
      </div>

      {/* Resultado */}
      {resultado ? (
        <div className="border border-[#121212] bg-[#121212] text-white p-6">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-6">
            Tu tarifa recomendada
            {profesion ? ` — ${profesion}` : ''}
            {' '}en {pais.nombre}
          </p>

          {/* Tarifa hora destacada */}
          <div className="mb-8 pb-8 border-b border-[#333]">
            <p className="font-sans text-[12px] text-[#AAAAAA] mb-1">Tarifa por hora</p>
            <p className="font-serif text-[3rem] md:text-[4rem] font-bold text-white leading-none">
              {fmt(resultado.tarifaHora, pais.simbolo)}
            </p>
            <p className="font-sans text-[12px] text-[#AAAAAA] mt-1">
              {pais.moneda} / hora · basado en {resultado.horasTotales} horas facturables/mes
            </p>
          </div>

          {/* Precios sugeridos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#AAAAAA] mb-1">Sesión 60 min</p>
              <p className="font-serif text-[1.4rem] font-bold text-white">{fmt(resultado.sesion60, pais.simbolo)}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#AAAAAA] mb-1">Sesión 90 min</p>
              <p className="font-serif text-[1.4rem] font-bold text-white">{fmt(resultado.sesion90, pais.simbolo)}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#AAAAAA] mb-1">Día completo</p>
              <p className="font-serif text-[1.4rem] font-bold text-white">{fmt(resultado.proyectoDia, pais.simbolo)}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#AAAAAA] mb-1">Retainer mensual</p>
              <p className="font-serif text-[1.4rem] font-bold text-emerald-400">{fmt(resultado.retainerMensual, pais.simbolo)}</p>
            </div>
          </div>

          {/* Nota metodológica */}
          <p className="font-sans text-[11px] text-[#666] leading-relaxed">
            Cálculo: ({fmt(parseFloat(ingresoObj.replace(/[.,\s]/g, '')) || 0, pais.simbolo)} ingreso + {fmt(parseFloat(overhead.replace(/[.,\s]/g, '')) || 0, pais.simbolo)} gastos) ÷ {resultado.horasTotales} horas = {fmt(resultado.tarifaHora, pais.simbolo)}/hora. Esta es la tarifa mínima para alcanzar tu objetivo. Considera cobrar un 15-30% más para tener margen.
          </p>
        </div>
      ) : (
        <div className="border border-dashed border-[#DEDEDE] p-8 text-center">
          <p className="font-sans text-[14px] text-[#999]">
            Ingresa tu ingreso mensual objetivo para ver tu tarifa
          </p>
        </div>
      )}

    </div>
  )
}
