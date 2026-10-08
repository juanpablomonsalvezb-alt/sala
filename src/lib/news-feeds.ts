// Feeds RSS de ecosistema de startups y negocios (global + Latam) usados por
// los crons de noticias y de borradores de contenido.

import Parser from 'rss-parser'

const parser = new Parser({ timeout: 8000 })

export const STARTUP_BUSINESS_FEEDS = [
  'https://techcrunch.com/category/startups/feed/',
  'https://techcrunch.com/feed/',
  'https://contxto.com/en/feed/',
  'https://www.xataka.com/feedburner.xml',
  'https://www.merca20.com/feed/',
]

export interface FeedArticle {
  title: string
  link: string
  summary: string
  source: string
}

async function fetchFeed(url: string): Promise<FeedArticle[]> {
  try {
    const feed = await parser.parseURL(url)
    const source = feed.title || new URL(url).hostname
    return (feed.items || []).slice(0, 8).map((item) => ({
      title: item.title || '',
      link: item.link || '',
      summary: (item.contentSnippet || item.description || '').slice(0, 300),
      source,
    }))
  } catch (error) {
    console.warn(`news-feeds: failed to fetch ${url}`, error instanceof Error ? error.message : error)
    return []
  }
}

export async function fetchStartupBusinessArticles(): Promise<FeedArticle[]> {
  const results = await Promise.allSettled(STARTUP_BUSINESS_FEEDS.map(fetchFeed))
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
}

export function formatArticlesForPrompt(articles: FeedArticle[]): string {
  return articles
    .map((a, i) => `${i + 1}. [${a.source}] ${a.title}\n${a.summary}\n${a.link}`)
    .join('\n\n')
}
