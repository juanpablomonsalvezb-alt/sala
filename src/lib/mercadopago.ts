export const MP_API = 'https://api.mercadopago.com'

export function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export function isMPConfigured(): boolean {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
  return token.startsWith('APP_USR-') || token.startsWith('TEST-')
}
