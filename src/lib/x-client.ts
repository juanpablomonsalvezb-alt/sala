import { Scraper, SearchMode, type Tweet } from 'agent-twitter-client'

let _scraper: Scraper | null = null

async function getScraper(): Promise<Scraper> {
  if (_scraper) return _scraper
  const scraper = new Scraper()
  await scraper.login(
    process.env.X_USERNAME!,
    process.env.X_PASSWORD!,
    process.env.X_EMAIL!
  )
  _scraper = scraper
  return scraper
}

export interface XPost {
  id: string
  text: string
  authorHandle: string
  authorFollowers: number
  replyCount: number
  retweetCount: number
  likeCount: number
  url: string
  engagementScore: number
}

// Score compuesto: replies pesan más (muestran debate real)
function score(t: Tweet): number {
  const replies = t.replies ?? 0
  const retweets = t.retweets ?? 0
  const likes = t.likes ?? 0
  const views = t.views ?? 0
  return replies * 5 + retweets * 3 + likes + Math.floor(views / 100)
}

// 35 hashtags profesionales en español — amplia cobertura LATAM
const PROFESSIONAL_QUERIES = [
  '#economista lang:es -is:retweet min_faves:30',
  '#abogado lang:es -is:retweet min_faves:30',
  '#medico lang:es -is:retweet min_faves:30',
  '#contador lang:es -is:retweet min_faves:30',
  '#arquitecto lang:es -is:retweet min_faves:30',
  '#psicologo lang:es -is:retweet min_faves:30',
  '#ingeniero lang:es -is:retweet min_faves:30',
  '#derecho lang:es -is:retweet min_faves:50',
  '#finanzas lang:es -is:retweet min_faves:50',
  '#salud lang:es -is:retweet min_faves:30',
  '#contabilidad lang:es -is:retweet min_faves:20',
  '#marketing lang:es -is:retweet min_faves:50',
  '#emprendedor lang:es -is:retweet min_faves:50',
  '#consultor lang:es -is:retweet min_faves:20',
  '#coach lang:es -is:retweet min_faves:30',
  '#nutricionista lang:es -is:retweet min_faves:20',
  '#odontologia lang:es -is:retweet min_faves:20',
  '#veterinaria lang:es -is:retweet min_faves:20',
  '#fisioterapia lang:es -is:retweet min_faves:15',
  'monetizar conocimiento lang:es -is:retweet min_faves:20',
  'creador de contenido profesional lang:es -is:retweet min_faves:30',
  'cursos online lang:es -is:retweet min_faves:50',
  'newsletter lang:es -is:retweet min_faves:30',
  'membresía lang:es -is:retweet min_faves:20',
]

const VIRAL_QUERIES = [
  'lang:es -is:retweet min_replies:300 -filter:links',
  'lang:es -is:retweet min_replies:500',
  '#Mundial2026 lang:es -is:retweet min_faves:200',
  '#Chile lang:es -is:retweet min_replies:100 min_faves:500',
  '#Argentina lang:es -is:retweet min_replies:100 min_faves:500',
  '#Mexico lang:es -is:retweet min_replies:100 min_faves:500',
  '#Colombia lang:es -is:retweet min_replies:100 min_faves:500',
]

function tweetToPost(tweet: Tweet): XPost {
  const s = score(tweet)
  return {
    id: tweet.id ?? '',
    text: tweet.text ?? '',
    authorHandle: tweet.username ?? '',
    authorFollowers: 0,
    replyCount: tweet.replies ?? 0,
    retweetCount: tweet.retweets ?? 0,
    likeCount: tweet.likes ?? 0,
    url: tweet.permanentUrl ?? `https://x.com/${tweet.username}/status/${tweet.id}`,
    engagementScore: s,
  }
}

export async function searchProfessionalOpportunities(limit = 15): Promise<XPost[]> {
  const scraper = await getScraper()
  const results: XPost[] = []
  const seen = new Set<string>()

  // Rotamos por los primeros 8 queries para no saturar la sesión
  const queries = PROFESSIONAL_QUERIES.slice(0, 8)
  for (const q of queries) {
    try {
      const gen = scraper.searchTweets(q, 10, SearchMode.Latest)
      for await (const tweet of gen) {
        if (!tweet.id || seen.has(tweet.id) || tweet.isRetweet) continue
        if (!tweet.text) continue
        seen.add(tweet.id)
        results.push(tweetToPost(tweet))
      }
    } catch {
      // continúa con el siguiente
    }
  }

  return results
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, limit)
}

export async function searchViralOpportunities(limit = 15): Promise<XPost[]> {
  const scraper = await getScraper()
  const results: XPost[] = []
  const seen = new Set<string>()

  for (const q of VIRAL_QUERIES.slice(0, 4)) {
    try {
      const gen = scraper.searchTweets(q, 15, SearchMode.Latest)
      for await (const tweet of gen) {
        if (!tweet.id || seen.has(tweet.id) || tweet.isRetweet) continue
        if (!tweet.text) continue
        const s = score(tweet)
        if (s < 200) continue
        seen.add(tweet.id)
        results.push(tweetToPost(tweet))
      }
    } catch {
      // continúa
    }
  }

  return results
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, limit)
}

export async function replyToTweet(tweetId: string, text: string): Promise<void> {
  const scraper = await getScraper()
  await scraper.sendTweet(text, tweetId)
}

export async function getAccountFollowers(handle: string): Promise<number> {
  try {
    const scraper = await getScraper()
    const profile = await scraper.getProfile(handle)
    return profile.followersCount ?? 0
  } catch {
    return 0
  }
}
