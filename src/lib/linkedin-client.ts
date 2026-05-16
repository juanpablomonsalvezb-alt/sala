export interface LinkedInPost {
  id: string
  text: string
  authorHandle: string
  authorFollowers: number
  likeCount: number
  commentCount: number
  shareCount: number
  url: string
}

async function linkedInFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  return fetch(`https://api.linkedin.com/v2${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      ...(options.headers ?? {}),
    },
  })
}

export async function getLinkedInFeed(): Promise<LinkedInPost[]> {
  try {
    const res = await linkedInFetch('/ugcPosts?q=authors&authors=List(' + encodeURIComponent(process.env.LINKEDIN_PERSON_URN!) + ')&count=20')
    if (!res.ok) return []
    const data = await res.json()
    return (data.elements ?? []).map((el: Record<string, unknown>) => ({
      id: el.id as string,
      text: (((el.specificContent as Record<string, unknown>)?.['com.linkedin.ugc.ShareContent'] as Record<string, unknown>)?.shareCommentary as Record<string, unknown>)?.text as string ?? '',
      authorHandle: '',
      authorFollowers: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      url: `https://www.linkedin.com/feed/update/${el.id}`,
    }))
  } catch {
    return []
  }
}

export async function publishLinkedInPost(text: string, imageUrl?: string): Promise<void> {
  // Usa perfil personal (w_member_social) — para página empresa necesita w_organization_social
  const personUrn = process.env.LINKEDIN_PERSON_URN!
  const body: Record<string, unknown> = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
        ...(imageUrl ? {
          media: [{
            status: 'READY',
            description: { text: 'Nebbuler' },
            media: imageUrl,
            title: { text: 'Nebbuler' },
          }]
        } : {}),
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  }

  const res = await linkedInFetch('/ugcPosts', { method: 'POST', body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LinkedIn publish failed: ${err}`)
  }
}
