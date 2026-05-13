import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 3600 // ISR: revalidate every hour

interface TrendingKeyword {
  id: string
  keyword: string
  country_code: string
  search_volume: number
  monthly_growth: number
  status: string
  created_at: string
}

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina',
  BR: 'Brasil',
  CL: 'Chile',
  CO: 'Colombia',
  MX: 'México',
  PE: 'Perú',
  UY: 'Uruguay',
}

export default async function TrendingPage() {
  const supabase = await createClient()

  const { data: keywords = [] } = await supabase
    .from('trending_keywords')
    .select('*')
    .eq('status', 'generated')
    .order('monthly_growth', { ascending: false })
    .limit(50)

  const groupedByCountry = (keywords as TrendingKeyword[]).reduce(
    (acc, kw) => {
      if (!acc[kw.country_code]) {
        acc[kw.country_code] = []
      }
      acc[kw.country_code].push(kw)
      return acc
    },
    {} as Record<string, TrendingKeyword[]>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e0e0e0] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Tendencias profesionales
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] mb-4">
            Noticias que importan a tu profesión
          </h1>
          <p className="font-sans text-base text-[#666] max-w-2xl leading-relaxed">
            Seguimiento automático de tendencias en tus mercados. Artículos profesionales generados en tiempo real desde fuentes de cada país.
          </p>
        </div>
      </div>

      {/* Trends by Country */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {Object.entries(groupedByCountry).map(([countryCode, countryKeywords]) => (
          <div key={countryCode} className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#121212] mb-6 pb-4 border-b border-[#e0e0e0]">
              {COUNTRY_NAMES[countryCode] || countryCode}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countryKeywords.map(kw => (
                <Link
                  key={kw.id}
                  href={`/tendencia/${encodeURIComponent(kw.keyword.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="block p-4 border border-[#e0e0e0] hover:border-[#121212] hover:bg-[#f5f5f5] transition-all"
                >
                  <h3 className="font-sans font-semibold text-[#121212] mb-2 capitalize">
                    {kw.keyword}
                  </h3>
                  <div className="flex justify-between text-xs text-[#999] font-sans">
                    <span>📈 {kw.monthly_growth}% crecimiento</span>
                    <span>🔍 {kw.search_volume} búsquedas</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {(keywords || []).length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-[#999]">
              Aún no hay tendencias generadas. El sistema estará detectando noticias automáticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
