import { TOPICS } from '@/data/seo-topics'
import { GUIDES } from '@/data/seo-guides'
import { MARKETS } from '@/data/seo-matrix'

export interface RelatedContent {
  guides: Array<{ slug: string; title: string; description: string }>
  analyses: Array<{ slug: string; topic: string; market: string }>
  faqs: Array<{ slug: string; title: string }>
  caseStudies: Array<{ slug: string; title: string; country: string }>
}

export function getRelatedGuides(currentSlug: string, limit = 3): RelatedContent['guides'] {
  return GUIDES.filter(g => g.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
}

export function getRelatedAnalyses(
  topicSlug?: string,
  marketSlug?: string,
  limit = 3
): Array<{ slug: string; topic: string; market: string }> {
  const topic = TOPICS.find(t => t.slug === topicSlug)
  const market = MARKETS.find(m => m.slug === marketSlug)

  if (!topic || !market) return []

  // Return other markets for same topic + other topics for same market
  const otherMarkets = MARKETS.filter(m => m.slug !== marketSlug)
    .slice(0, Math.ceil(limit / 2))
  const otherTopics = TOPICS.filter(t => t.slug !== topicSlug)
    .slice(0, Math.floor(limit / 2))

  return [
    ...otherMarkets.map(m => ({ slug: `${topicSlug}/${m.slug}`, topic: topic.label, market: m.label })),
    ...otherTopics.map(t => ({ slug: `${t.slug}/${marketSlug}`, topic: t.label, market: market.label })),
  ].slice(0, limit)
}

export function getRelatedByDiscipline(discipline: string, limit = 4) {
  const guides = GUIDES.slice(0, limit)
  const topics = TOPICS.filter(t => t.discipline === discipline).slice(0, 2)
  return { guides, topics }
}

export function getRelatedByProfession(profession: string, limit = 3) {
  return GUIDES.filter(g => g.profession === profession)
    .slice(0, limit)
}

// Generate breadcrumb data for structured schema
export function generateBreadcrumb(path: string) {
  const parts = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
  ]

  let currentPath = 'https://nebbuler.com'
  parts.forEach((part, index) => {
    currentPath += `/${part}`
    const names: Record<string, string> = {
      analisis: 'Análisis',
      guia: 'Guías',
      faq: 'FAQ',
      'caso-estudio': 'Casos de Estudio',
      directorio: 'Directorio',
      prensa: 'Prensa',
    }
    breadcrumbs.push({
      position: index + 2,
      name: names[part] || part,
      item: currentPath,
    })
  })

  return breadcrumbs
}

// Get search-friendly URL for related content
export function getLinkUrl(type: 'guide' | 'analysis' | 'faq' | 'case', slug: string, extra?: string): string {
  switch (type) {
    case 'guide':
      return `/guia/${slug}`
    case 'analysis':
      return `/analisis/${slug}${extra ? `/${extra}` : ''}`
    case 'faq':
      return `/faq/${slug}`
    case 'case':
      return `/caso-estudio/${slug}`
    default:
      return '/'
  }
}
