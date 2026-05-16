'use client'

// Search widget — SEARCH_ENABLED=true/false
// Add as a standalone element in any page. Never modifies existing listing components.

import { useState, useCallback, useRef } from 'react'

interface SearchResult {
  id: string
  type: 'post' | 'creator'
  title?: string
  name?: string
  body?: string
  specialty?: string
  creatorName?: string
  url: string
}

interface SearchResponse {
  results: SearchResult[]
  query: string
}

export default function SearchWidget({ placeholder = 'Buscar contenido y creadores...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
        if (res.ok) {
          const data = await res.json() as SearchResponse
          setResults(data.results)
          setOpen(data.results.length > 0)
        }
      } catch {
        // Graceful failure
      } finally {
        setLoading(false)
      }
    }, 250)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    search(val)
  }

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#C41C1C] focus:outline-none focus:ring-1 focus:ring-[#C41C1C]"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {loading ? (
            <svg className="h-4 w-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg">
          <ul className="divide-y divide-gray-50 py-1">
            {results.map((r) => (
              <li key={`${r.type}-${r.id}`}>
                <a
                  href={r.url}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                    r.type === 'creator' ? 'bg-red-50 text-[#C41C1C]' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {r.type === 'creator' ? 'Creador' : 'Post'}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {r.title ?? r.name}
                    </p>
                    {r.creatorName && (
                      <p className="truncate text-xs text-gray-500">{r.creatorName}</p>
                    )}
                    {r.specialty && (
                      <p className="truncate text-xs text-gray-500">{r.specialty}</p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
