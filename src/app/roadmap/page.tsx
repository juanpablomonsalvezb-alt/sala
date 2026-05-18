import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Roadmap público — Nebbuler',
  description: 'Qué estamos construyendo, qué viene y por qué. Roadmap público de Nebbuler — la plataforma de membresías para creadores de América Latina.',
  alternates: { canonical: 'https://nebbuler.com/roadmap' },
  openGraph: {
    title: 'Roadmap público — Nebbuler',
    description: 'Qué estamos construyendo y qué viene.',
    url: 'https://nebbuler.com/roadmap',
    type: 'website',
  },
}

type RoadmapItem = {
  status: 'shipped' | 'in_progress' | 'planned' | 'considering'
  title: string
  category: string
  detail: string
  date?: string
}

const ROADMAP: RoadmapItem[] = [
  // Shipped
  { status: 'shipped', title: 'Pagos en moneda local LATAM via MercadoPago Connect', category: 'Pagos', date: 'Q1 2026', detail: 'Cobros en COP, MXN, ARS, PEN, CLP via el procesador local de cada país.' },
  { status: 'shipped', title: 'Stripe Connect para creadores fuera de LATAM', category: 'Pagos', date: 'Q1 2026', detail: 'Alternativa para creadores con audiencia mayoritariamente anglosajona.' },
  { status: 'shipped', title: 'Sistema de membresías con tarifa fija (0% comisión variable)', category: 'Modelo', date: 'Q1 2026', detail: 'Tarifa plataforma fija mensual — el creador conserva el 100% menos cargos del procesador.' },
  { status: 'shipped', title: 'Suite de páginas comparativas /vs/{competidor}', category: 'SEO', date: 'Q2 2026', detail: 'Páginas dedicadas Nebbuler vs Substack/Patreon/Beehiiv/Gumroad/Ko-fi/BuyMeACoffee/Memberful con FAQPage schema.' },
  { status: 'shipped', title: 'Calculadora interactiva de ingresos para creadores', category: 'Herramientas', date: 'Q2 2026', detail: 'Comparador en tiempo real Nebbuler vs Substack vs Patreon en 7 monedas locales.' },
  { status: 'shipped', title: 'AEO/GEO: llms.txt, Speakable, HowTo, Dataset, FAQPage schemas', category: 'SEO', date: 'Q2 2026', detail: 'Optimización para ChatGPT, Claude, Perplexity, Google AI Overview.' },
  { status: 'shipped', title: 'Guías paso a paso para migrar desde otras plataformas', category: 'Onboarding', date: 'Q2 2026', detail: '/migrar-desde/{substack,patreon,beehiiv,gumroad} con HowTo schema completo.' },
  { status: 'shipped', title: 'Informe abierto: Estado de la Creator Economy LATAM 2026', category: 'Contenido', date: 'Q2 2026', detail: 'Reporte con datos públicos y análisis original, citable bajo CC BY 4.0.' },
  { status: 'shipped', title: 'Webhooks idempotentes con estado processing→done', category: 'Confiabilidad', date: 'Q2 2026', detail: 'Cobros nunca se pierden por retries de MP/Stripe. TTL de 5min para recovery.' },
  { status: 'shipped', title: 'Tabla separada para tokens OAuth (sala_creator_secrets)', category: 'Seguridad', date: 'Q2 2026', detail: 'Tokens MP nunca accesibles vía API pública. RLS estricta con service_role.' },

  // In progress
  { status: 'in_progress', title: 'Refresh automático de tokens MercadoPago', category: 'Confiabilidad', detail: 'Cron diario que refresca tokens próximos a expirar antes de que las suscripciones queden zombi.' },
  { status: 'in_progress', title: 'Sistema de invitaciones/referidos nativo', category: 'Growth', detail: 'Cada suscriptor tiene link único para invitar — el invitado paga, ambos reciben beneficio.' },
  { status: 'in_progress', title: 'Embed widget para sitio propio del creador', category: 'Distribución', detail: 'JS embebible para que cualquier creador con sitio propio integre paywall Nebbuler.' },

  // Planned (Q3 2026)
  { status: 'planned', title: 'Encriptación pgcrypto de tokens en disco', category: 'Seguridad', detail: 'Defensa en profundidad: hoy los tokens están protegidos por RLS pero en plain text en disco.' },
  { status: 'planned', title: 'Rate limiting en endpoints de checkout', category: 'Confiabilidad', detail: 'Protección contra abuso/DOS en los endpoints sensibles.' },
  { status: 'planned', title: 'Dashboard analytics avanzado para creadores', category: 'Producto', detail: 'Cohort retention, MRR/ARR, churn por motivo, top posts.' },
  { status: 'planned', title: 'Tests de integración con MP/Stripe sandbox', category: 'Calidad', detail: 'Suite que verifica el flujo de cobro end-to-end antes de cada deploy.' },
  { status: 'planned', title: 'Onboarding multi-step con check-list', category: 'Activación', detail: 'Wizard que guía al nuevo creador desde registro hasta primer suscriptor paid.' },
  { status: 'planned', title: 'API pública con docs auto-generadas', category: 'Plataforma', detail: 'Endpoints REST para que desarrolladores extiendan Nebbuler.' },
  { status: 'planned', title: 'Cron de reconciliación BD vs MercadoPago', category: 'Confiabilidad', detail: 'Job diario que compara suscripciones activas en BD vs MP authorized. Discrepancias en alerta.' },

  // Considering (sin compromiso)
  { status: 'considering', title: 'Versión Brasil (portugués + Hotmart Connect)', category: 'Expansión', detail: 'Mercado distinto, requiere localización + competencia local fuerte.' },
  { status: 'considering', title: 'Comunidades cerradas (Discord-like) integradas', category: 'Producto', detail: 'Foro/chat dentro de la sala. Probablemente vía integración con Discord/Circle.' },
  { status: 'considering', title: 'Marketplace de plantillas / cursos del creador', category: 'Producto', detail: 'Venta de productos digitales únicos como complemento a la suscripción.' },
  { status: 'considering', title: 'White-label para medios independientes', category: 'B2B', detail: 'Versión enterprise para que medios use Nebbuler como infraestructura sin marca.' },
]

const STATUS_LABEL = {
  shipped: { label: 'Listo', color: '#15803d', bg: '#dcfce7' },
  in_progress: { label: 'En progreso', color: '#a16207', bg: '#fef3c7' },
  planned: { label: 'Planeado', color: '#1e40af', bg: '#dbeafe' },
  considering: { label: 'Considerando', color: '#6b7280', bg: '#f3f4f6' },
}

export default function RoadmapPage() {
  const grouped = {
    shipped: ROADMAP.filter((i) => i.status === 'shipped'),
    in_progress: ROADMAP.filter((i) => i.status === 'in_progress'),
    planned: ROADMAP.filter((i) => i.status === 'planned'),
    considering: ROADMAP.filter((i) => i.status === 'considering'),
  }

  return (
    <div className="min-h-screen bg-white">
      <header>
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold">NEBBULER</Link>
            <Link href="/abrir" className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515]">Abrir mi sala →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">Roadmap público</p>
        <h1 className="font-serif text-[2.5rem] font-bold leading-[1.1] mb-4">Qué estamos construyendo</h1>
        <p className="font-sans text-[17px] text-[#444] leading-relaxed mb-12">
          Todo lo que pensamos hacer, en qué orden, y por qué. Sin promesas — solo dirección.
          Si algo te interesa o te falta, escribinos a <a href="mailto:hola@nebbuler.com" className="text-[#C41C1C] underline">hola@nebbuler.com</a>.
        </p>

        {(['shipped', 'in_progress', 'planned', 'considering'] as const).map((status) => (
          <section key={status} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1"
                style={{ color: STATUS_LABEL[status].color, background: STATUS_LABEL[status].bg }}
              >
                {STATUS_LABEL[status].label}
              </span>
              <span className="text-[13px] text-[#999]">{grouped[status].length} ítems</span>
            </div>
            <ul className="space-y-5">
              {grouped[status].map((item, i) => (
                <li key={i} className="border-l-2 border-[#DEDEDE] pl-4">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="font-serif text-[1.05rem] font-bold">{item.title}</h3>
                    <span className="text-[11px] uppercase tracking-wider text-[#999]">{item.category}</span>
                  </div>
                  <p className="text-[14px] text-[#444] leading-relaxed">{item.detail}</p>
                  {item.date && <p className="text-[11px] text-[#999] mt-1">{item.date}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-12 pt-8 border-t border-[#DEDEDE] text-center text-[14px] text-[#666]">
          <p>
            ¿Falta algo importante? ¿Tenés feedback sobre prioridades?{' '}
            <a href="mailto:hola@nebbuler.com" className="text-[#C41C1C] underline">Escribinos</a>.
          </p>
        </section>
      </main>
    </div>
  )
}
