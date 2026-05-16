// Listmonk client — NEWSLETTER_ENABLED=true/false
// Listmonk runs as a separate Docker service (see docker-compose.listmonk.yml)

const NEWSLETTER_ENABLED = process.env.NEWSLETTER_ENABLED === 'true'
const LISTMONK_URL = process.env.LISTMONK_URL ?? ''
const LISTMONK_API_KEY = process.env.LISTMONK_API_KEY ?? ''

// Default list ID for public subscribers — set via Listmonk dashboard
const DEFAULT_LIST_ID = parseInt(process.env.LISTMONK_DEFAULT_LIST_ID ?? '1', 10)

interface ListmonkSubscriberPayload {
  email: string
  name?: string
  lists: number[]
  status: 'enabled'
  preconfirm_subscriptions: boolean
}

interface SubscribeResult {
  ok: boolean
  error?: string
  alreadySubscribed?: boolean
}

export async function subscribeToNewsletter(
  email: string,
  name?: string,
  listIds?: number[]
): Promise<SubscribeResult> {
  if (!NEWSLETTER_ENABLED || !LISTMONK_URL || !LISTMONK_API_KEY) {
    return { ok: false, error: 'Newsletter not configured' }
  }

  const payload: ListmonkSubscriberPayload = {
    email,
    name: name ?? email.split('@')[0],
    lists: listIds ?? [DEFAULT_LIST_ID],
    status: 'enabled',
    preconfirm_subscriptions: false,
  }

  try {
    const res = await fetch(`${LISTMONK_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${LISTMONK_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (res.status === 409) return { ok: true, alreadySubscribed: true }
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: text }
    }

    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}
