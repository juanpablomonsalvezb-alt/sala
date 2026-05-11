'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// ─── Datos curados ─────────────────────────────────────────────────────────────
// Fuentes: INE Chile, Banco Central de Chile, Banco Mundial

const INFLACION_MENSUAL = [
  { mes: 'Ene 22', ipc: 7.7 },
  { mes: 'Mar 22', ipc: 9.4 },
  { mes: 'May 22', ipc: 11.5 },
  { mes: 'Jul 22', ipc: 13.1 },
  { mes: 'Sep 22', ipc: 13.7 },
  { mes: 'Nov 22', ipc: 12.8 },
  { mes: 'Ene 23', ipc: 11.7 },
  { mes: 'Mar 23', ipc: 11.1 },
  { mes: 'May 23', ipc: 8.7 },
  { mes: 'Jul 23', ipc: 6.5 },
  { mes: 'Sep 23', ipc: 5.1 },
  { mes: 'Nov 23', ipc: 4.8 },
  { mes: 'Ene 24', ipc: 3.8 },
  { mes: 'Mar 24', ipc: 3.7 },
  { mes: 'May 24', ipc: 3.9 },
  { mes: 'Jul 24', ipc: 4.6 },
  { mes: 'Sep 24', ipc: 4.1 },
  { mes: 'Nov 24', ipc: 3.4 },
  { mes: 'Ene 25', ipc: 3.2 },
  { mes: 'Mar 25', ipc: 3.5 },
  { mes: 'May 25', ipc: 3.3 },
  { mes: 'Ene 26', ipc: 3.1 },
]

const PIB_PER_CAPITA_LATAM = [
  { pais: 'Uruguay', pib: 22653, color: '#444' },
  { pais: 'Chile', pib: 17564, color: '#C41C1C' },
  { pais: 'Argentina', pib: 13726, color: '#444' },
  { pais: 'México', pib: 11497, color: '#444' },
  { pais: 'Brasil', pib: 10720, color: '#444' },
  { pais: 'Perú', pib: 7388, color: '#444' },
  { pais: 'Colombia', pib: 7126, color: '#444' },
  { pais: 'Bolivia', pib: 3691, color: '#444' },
]

const TIPO_CAMBIO = [
  { fecha: 'Ene 23', usdclp: 828 },
  { fecha: 'Mar 23', usdclp: 815 },
  { fecha: 'May 23', usdclp: 798 },
  { fecha: 'Jul 23', usdclp: 839 },
  { fecha: 'Sep 23', usdclp: 892 },
  { fecha: 'Nov 23', usdclp: 876 },
  { fecha: 'Ene 24', usdclp: 958 },
  { fecha: 'Mar 24', usdclp: 967 },
  { fecha: 'May 24', usdclp: 934 },
  { fecha: 'Jul 24', usdclp: 912 },
  { fecha: 'Sep 24', usdclp: 936 },
  { fecha: 'Nov 24', usdclp: 964 },
  { fecha: 'Ene 25', usdclp: 985 },
  { fecha: 'Mar 25', usdclp: 942 },
  { fecha: 'May 25', usdclp: 918 },
  { fecha: 'Ene 26', usdclp: 931 },
]

const DESEMPLEO_CHILE = [
  { trimestre: 'Q1 22', tasa: 7.8 },
  { trimestre: 'Q2 22', tasa: 7.2 },
  { trimestre: 'Q3 22', tasa: 7.9 },
  { trimestre: 'Q4 22', tasa: 7.7 },
  { trimestre: 'Q1 23', tasa: 8.8 },
  { trimestre: 'Q2 23', tasa: 8.5 },
  { trimestre: 'Q3 23', tasa: 8.7 },
  { trimestre: 'Q4 23', tasa: 8.2 },
  { trimestre: 'Q1 24', tasa: 8.6 },
  { trimestre: 'Q2 24', tasa: 8.3 },
  { trimestre: 'Q3 24', tasa: 7.9 },
  { trimestre: 'Q4 24', tasa: 8.1 },
  { trimestre: 'Q1 25', tasa: 8.4 },
  { trimestre: 'Q2 25', tasa: 8.0 },
]

// ─── Tooltip style compartido ─────────────────────────────────────────────────

const tooltipStyle = {
  border: '1px solid #DEDEDE',
  borderRadius: 0,
  fontFamily: 'Arial, sans-serif',
  fontSize: 12,
  color: '#121212',
}

// ─── Componentes ──────────────────────────────────────────────────────────────

export function InflacionChart() {
  return (
    <div>
      <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">
        Fuente: INE Chile
      </p>
      <p className="font-serif text-[18px] font-bold text-[#121212] mb-5">
        Inflación anual Chile (%)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={INFLACION_MENSUAL}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
            axisLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={tooltipStyle}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`${v}%`, 'IPC anual']}
          />
          <Line
            type="monotone"
            dataKey="ipc"
            stroke="#C41C1C"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#C41C1C' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PibLatamChart() {
  return (
    <div>
      <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">
        Fuente: Banco Mundial 2024
      </p>
      <p className="font-serif text-[18px] font-bold text-[#121212] mb-5">
        PIB per cápita LATAM (USD)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={PIB_PER_CAPITA_LATAM}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F0F0F0"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="pais"
            tick={{ fontSize: 12, fontFamily: 'Georgia, serif', fill: '#121212' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`$${Number(v).toLocaleString('es-CL')}`, 'PIB per cápita']}
          />
          <Bar dataKey="pib" radius={[0, 2, 2, 0]}>
            {PIB_PER_CAPITA_LATAM.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TipoCambioChart() {
  return (
    <div>
      <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">
        Fuente: Banco Central de Chile
      </p>
      <p className="font-serif text-[18px] font-bold text-[#121212] mb-5">
        Tipo de cambio USD/CLP
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={TIPO_CAMBIO}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="clpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C41C1C" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#C41C1C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 11, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`$${v} CLP`, '1 USD']}
          />
          <Area
            type="monotone"
            dataKey="usdclp"
            stroke="#C41C1C"
            strokeWidth={2}
            fill="url(#clpGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DesempleoChart() {
  return (
    <div>
      <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">
        Fuente: INE Chile
      </p>
      <p className="font-serif text-[18px] font-bold text-[#121212] mb-5">
        Desempleo Chile — tasa trimestral (%)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={DESEMPLEO_CHILE}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis
            dataKey="trimestre"
            tick={{ fontSize: 10, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Arial, sans-serif', fill: '#999' }}
            tickLine={false}
            axisLine={false}
            unit="%"
            domain={[0, 12]}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`${v}%`, 'Desempleo']}
          />
          <Bar dataKey="tasa" fill="#121212" radius={[2, 2, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
