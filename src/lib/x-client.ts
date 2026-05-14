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
}

function score(t: Tweet): number {
  return (t.replies ?? 0) * 3 + (t.retweets ?? 0) * 2 + (t.likes ?? 0)
}

const PROFESSIONAL_HASHTAGS = [
  '#economista', '#abogado', '#medico', '#contador', '#arquitecto',
  '#psicologo', '#ingeniero', '#finanzas', '#salud', '#contabilidad',
]

function tweetToPost(tweet: Tweet): XPost {
  return {
    id: tweet.id ?? '',
    text: tweet.text ?? '',
    authorHandle: tweet.username ?? '',
    authorFollowers: 0,
    replyCount: tweet.replies ?? 0,
    retweetCount: tweet.retweets ?? 0,
    likeCount: tweet.likes ?? 0,
    url: tweet.permanentUrl ?? `https://x.com/${tweet.username}/status/${tweet.id}`,
  }
}

export async function searchProfessionalOpportunities(): Promise<XPost[]> {
  const scraper = await getScraper()
  const results: XPost[] = []
  const seen = new Set<string>()

  for (const tag of PROFESSIONAL_HASHTAGS.slice(0, 5)) {
    try {
      const gen = scraper.searchTweets(`${tag} lang:es -is:retweet min_faves:50`, 20, SearchMode.Latest)
      for await (const tweet of gen) {
        if (!tweet.id || seen.has(tweet.id) || tweet.isRetweet) continue
        seen.add(tweet.id)
        results.push(tweetToPost(tweet))
      }
    } catch {
      // continúa con el siguiente hashtag
    }
  }

  return results.sort((a, b) => score(b as unknown as Tweet) - score(a as unknown as Tweet)).slice(0, 10)
}

export async function searchViralOpportunities(): Promise<XPost[]> {
  const scraper = await getScraper()
  const results: XPost[] = []
  const seen = new Set<string>()

  const queries = [
    'lang:es -is:retweet min_replies:200',
    '#Mundial2026 lang:es -is:retweet min_faves:500',
  ]

  for (const q of queries) {
    try {
      const gen = scraper.searchTweets(q, 15, SearchMode.Latest)
      for await (const tweet of gen) {
        if (!tweet.id || seen.has(tweet.id) || tweet.isRetweet) continue
        seen.add(tweet.id)
        results.push(tweetToPost(tweet))
      }
    } catch {
      // continúa
    }
  }

  return results
    .filter(t => t.replyCount > 500 || t.likeCount > 2000)
    .sort((a, b) => (b.replyCount * 3 + b.likeCount) - (a.replyCount * 3 + a.likeCount))
    .slice(0, 10)
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
