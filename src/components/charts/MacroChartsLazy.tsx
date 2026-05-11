'use client'

import dynamic from 'next/dynamic'

const MacroChartsGrid = dynamic(() => import('./MacroChartsGrid'), { ssr: false })

export default function MacroChartsLazy() {
  return (
    <>
      <div className="h-[280px] bg-[#F7F7F7] animate-pulse hidden [.charts-loaded_&]:hidden" />
      <MacroChartsGrid />
    </>
  )
}
