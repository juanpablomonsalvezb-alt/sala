const LS_API = 'https://api.lemonsqueezy.com/v1'

function getApiKey(): string {
  const key = process.env.LEMONSQUEEZY_API_KEY
  if (!key) throw new Error('LEMONSQUEEZY_API_KEY no configurado')
  return key
}

export async function createCheckout(params: {
  variantId: string
  email: string
  userId: string
  creatorId: string
  redirectUrl: string
}): Promise<string> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID
  if (!storeId) throw new Error('LEMONSQUEEZY_STORE_ID no configurado')

  const res = await fetch(`${LS_API}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: params.email,
            custom: {
              user_id: params.userId,
              creator_id: params.creatorId,
            },
          },
          product_options: {
            redirect_url: params.redirectUrl,
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: storeId } },
          variant: { data: { type: 'variants', id: params.variantId } },
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`LemonSqueezy checkout error ${res.status}: ${body}`)
  }

  const json = await res.json()
  const url: string = json?.data?.attributes?.url
  if (!url) throw new Error('LemonSqueezy no devolvió URL de checkout')
  return url
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) return true // dev sin secret
  const crypto = require('crypto') as typeof import('crypto')
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))
}
