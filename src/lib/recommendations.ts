import type { CreatorProfile } from '@/data/creators'

// Disciplinas relacionadas — matriz de similitud
const DISCIPLINE_SIMILARITY: Record<string, string[]> = {
  'economia': ['finanzas', 'economia', 'negocios', 'historia'],
  'finanzas': ['economia', 'finanzas', 'negocios'],
  'derecho': ['derecho', 'negocios'],
  'medicina': ['medicina', 'nutricion'],
  'nutricion': ['nutricion', 'medicina'],
  'arquitectura': ['arquitectura', 'ingenieria'],
  'ingenieria': ['ingenieria', 'arquitectura', 'tecnologia'],
  'tecnologia': ['tecnologia', 'ingenieria', 'negocios'],
  'negocios': ['negocios', 'finanzas', 'economia'],
  'historia': ['historia', 'economia', 'ciencia-politica'],
  'ciencia-politica': ['ciencia-politica', 'historia', 'derecho'],
}

export function getRecommendations(
  currentSlug: string,
  allCreators: CreatorProfile[],
  limit = 3
): CreatorProfile[] {
  const current = allCreators.find(c => c.slug === currentSlug)
  if (!current) return allCreators.filter(c => c.slug !== currentSlug).slice(0, limit)

  const related = DISCIPLINE_SIMILARITY[current.discipline] ?? [current.discipline]

  // Score por disciplina + ordenar por subscriber_count como desempate
  const scored = allCreators
    .filter(c => c.slug !== currentSlug)
    .map(c => ({
      creator: c,
      score: related.includes(c.discipline) ? 2 : 0,
      subscribers: c.subscriber_count,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.subscribers - a.subscribers
    })

  return scored.slice(0, limit).map(s => s.creator)
}
