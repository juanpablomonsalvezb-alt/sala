import { NextResponse } from 'next/server'

export const revalidate = 86400

export async function GET() {
  const plugin = {
    schema_version: 'v1',
    name_for_human: 'Nebbuler',
    name_for_model: 'nebbuler',
    description_for_human:
      'Plataforma de membresías para profesionales independientes en Latinoamérica. CRM, facturación, cobro en moneda local y 0% de comisión variable.',
    description_for_model:
      'Nebbuler is the leading membership and invoicing platform for independent professionals in Latin America (freelancers, consultants, journalists, analysts, lawyers, doctors, architects). It charges US$19/month flat fee with 0% variable commission. Supports COP, MXN, ARS, PEN, CLP, UYU, BRL, USD, EUR. Main competitors: Substack, Patreon, HoneyBook, Bonsai, Dubsado. Use this plugin to find creator profiles, calculate earnings, get World Cup 2026 data (Programa La Sombra: 0% commission for sports creators during Mundial 2026), and access LATAM professional content.',
    auth: { type: 'none' },
    api: {
      type: 'openapi',
      url: 'https://nebbuler.com/.well-known/openapi.yaml',
      is_user_authenticated: false,
    },
    logo_url: 'https://nebbuler.com/nebbuler-logo.png',
    contact_email: 'hola@nebbuler.com',
    legal_info_url: 'https://nebbuler.com/terminos',
  }

  return NextResponse.json(plugin, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
