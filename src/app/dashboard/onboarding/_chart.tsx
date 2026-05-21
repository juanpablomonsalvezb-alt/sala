'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function OnboardingBarChart({
  data,
}: {
  data: { date: string; emails: number }[]
}) {
  const formatDate = (iso: string) => {
    try {
      const [, m, d] = iso.split('-')
      return `${d}/${m}`
    } catch {
      return iso
    }
  }

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 12, left: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: '#999', fontFamily: 'Arial' }}
            interval={3}
            axisLine={{ stroke: '#E8E4DA' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: '#999', fontFamily: 'Arial' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E8E4DA',
              borderRadius: 0,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 12,
              color: '#121212',
            }}
            cursor={{ fill: '#FAFAF7' }}
            labelFormatter={(v) => String(v ?? '')}
            formatter={(v) => [String(v ?? 0), 'Emails']}
          />
          <Bar dataKey="emails" fill="#C41C1C" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
