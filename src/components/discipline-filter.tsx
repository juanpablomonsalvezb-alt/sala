'use client'

type DisciplineFilterProps = {
  disciplines: { id: string; name_es: string; icon?: string }[]
  selected: string
  onChange: (id: string) => void
}

const ALL_TAB = { id: 'all', name_es: 'Todos', icon: undefined }

export default function DisciplineFilter({
  disciplines,
  selected,
  onChange,
}: DisciplineFilterProps) {
  const tabs = [ALL_TAB, ...disciplines]

  return (
    <div className="flex gap-0 overflow-x-auto border-b border-[#DEDEDE]">
      {tabs.map((tab) => {
        const isActive = selected === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex items-center gap-1.5 px-4 py-3 text-[10px] font-sans font-bold tracking-[0.12em] uppercase whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-px',
              isActive
                ? 'border-[#121212] text-[#121212]'
                : 'border-transparent text-[#999] hover:text-[#121212]',
            ].join(' ')}
            type="button"
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            {tab.name_es}
          </button>
        )
      })}
    </div>
  )
}
