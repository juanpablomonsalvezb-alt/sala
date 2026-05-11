'use client'

import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const INFLACION = [
  { mes: 'Ene 22', v: 7.7 }, { mes: 'Mar 22', v: 9.4 }, { mes: 'May 22', v: 11.5 },
  { mes: 'Jul 22', v: 13.1 }, { mes: 'Sep 22', v: 13.7 }, { mes: 'Nov 22', v: 12.8 },
  { mes: 'Ene 23', v: 11.7 }, { mes: 'Mar 23', v: 11.1 }, { mes: 'May 23', v: 8.7 },
  { mes: 'Jul 23', v: 6.5 }, { mes: 'Sep 23', v: 5.1 }, { mes: 'Nov 23', v: 4.8 },
  { mes: 'Ene 24', v: 3.8 }, { mes: 'May 24', v: 3.9 }, { mes: 'Sep 24', v: 4.1 },
  { mes: 'Ene 25', v: 3.2 }, { mes: 'May 25', v: 3.3 }, { mes: 'Ene 26', v: 3.1 },
]

const PIB = [
  { pais: 'Uruguay', v: 22653 },
  { pais: 'Chile', v: 17564 },
  { pais: 'Argentina', v: 13726 },
  { pais: 'México', v: 11497 },
  { pais: 'Brasil', v: 10720 },
  { pais: 'Perú', v: 7388 },
  { pais: 'Colombia', v: 7126 },
  { pais: 'Bolivia', v: 3691 },
]

const CAMBIO = [
  { f: 'Ene 23', v: 828 }, { f: 'May 23', v: 798 }, { f: 'Sep 23', v: 892 },
  { f: 'Ene 24', v: 958 }, { f: 'May 24', v: 934 }, { f: 'Sep 24', v: 936 },
  { f: 'Ene 25', v: 985 }, { f: 'May 25', v: 918 }, { f: 'Ene 26', v: 931 },
]

const DESEMPLEO = [
  { t: 'Q1 22', v: 7.8 }, { t: 'Q2 22', v: 7.2 }, { t: 'Q3 22', v: 7.9 }, { t: 'Q4 22', v: 7.7 },
  { t: 'Q1 23', v: 8.8 }, { t: 'Q2 23', v: 8.5 }, { t: 'Q3 23', v: 8.7 }, { t: 'Q4 23', v: 8.2 },
  { t: 'Q1 24', v: 8.6 }, { t: 'Q2 24', v: 8.3 }, { t: 'Q3 24', v: 7.9 }, { t: 'Q4 24', v: 8.1 },
  { t: 'Q1 25', v: 8.4 }, { t: 'Q2 25', v: 8.0 },
]

const tick = { fontSize: 11, fontFamily: 'Arial', fill: '#999' }
const tooltip = { border: '1px solid #DEDEDE', borderRadius: 0, fontFamily: 'Arial', fontSize: 12 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const n = (v: unknown) => v as any

export default function MacroChartsGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Inflación */}
      <div className="bg-white border border-[#EEEEEE] p-6">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">Fuente: INE Chile</p>
        <p className="font-serif text-[17px] font-bold text-[#121212] mb-4">Inflación anual Chile (%)</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={INFLACION} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="mes" tick={tick} tickLine={false} interval={2} />
            <YAxis tick={tick} tickLine={false} axisLine={false} unit="%" />
            <Tooltip contentStyle={tooltip} formatter={(v) => [`${n(v)}%`, 'IPC']} />
            <Line type="monotone" dataKey="v" stroke="#C41C1C" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PIB LATAM */}
      <div className="bg-white border border-[#EEEEEE] p-6">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">Fuente: Banco Mundial 2024</p>
        <p className="font-serif text-[17px] font-bold text-[#121212] mb-4">PIB per cápita LATAM (USD)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={PIB} layout="vertical" margin={{ top: 0, right: 20, left: 55, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
            <XAxis type="number" tick={tick} tickLine={false} tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="pais" tick={{ fontSize: 12, fontFamily: 'Georgia', fill: '#121212' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltip} formatter={(v) => [`$${Number(n(v)).toLocaleString()}`, 'PIB p/c']} />
            <Bar dataKey="v" radius={[0, 2, 2, 0]} maxBarSize={20}>
              {PIB.map((entry, i) => (
                <Cell key={i} fill={entry.pais === 'Chile' ? '#C41C1C' : '#DEDEDE'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tipo de cambio */}
      <div className="bg-white border border-[#EEEEEE] p-6">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">Fuente: Banco Central de Chile</p>
        <p className="font-serif text-[17px] font-bold text-[#121212] mb-4">Tipo de cambio USD/CLP</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={CAMBIO} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="clpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C41C1C" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#C41C1C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="f" tick={tick} tickLine={false} />
            <YAxis tick={tick} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip contentStyle={tooltip} formatter={(v) => [`$${n(v)} CLP`, '1 USD']} />
            <Area type="monotone" dataKey="v" stroke="#C41C1C" strokeWidth={2} fill="url(#clpGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Desempleo */}
      <div className="bg-white border border-[#EEEEEE] p-6">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">Fuente: INE Chile</p>
        <p className="font-serif text-[17px] font-bold text-[#121212] mb-4">Desempleo Chile — tasa trimestral (%)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={DESEMPLEO} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="t" tick={{ ...tick, fontSize: 10 }} tickLine={false} interval={1} />
            <YAxis tick={tick} tickLine={false} axisLine={false} unit="%" domain={[0, 12]} />
            <Tooltip contentStyle={tooltip} formatter={(v) => [`${n(v)}%`, 'Desempleo']} />
            <Bar dataKey="v" fill="#121212" radius={[2, 2, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
