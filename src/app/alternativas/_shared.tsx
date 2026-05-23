import Link from 'next/link'

// ─── Datos compartidos entre las páginas /alternativas/* ────────────────────
// No exportar como page (no es un route) — solo helpers/componentes.

export const ALTERNATIVES = [
  {
    slug: 'substack-en-espanol',
    competitor: 'Substack',
    title: 'La mejor alternativa a Substack en español para 2026',
    h1: 'La mejor alternativa a Substack en español',
    kicker: 'SUBSTACK EN ESPAÑOL',
    summary:
      'Si publicas un newsletter pago en español o creas comunidades en LATAM, Substack te cobra 10% de comisión sobre cada suscripción y obliga a cobrar en dólares. Nebbuler reemplaza ese modelo con tarifa fija mensual y pagos en pesos, soles y reales.',
    description:
      'Comparativa completa entre Nebbuler y Substack para creadores hispanohablantes. Pricing real, monedas locales, soporte LATAM, calculadora de ahorro.',
  },
  {
    slug: 'patreon-en-latam',
    competitor: 'Patreon',
    title: 'Alternativa a Patreon para creadores en Latinoamérica',
    h1: 'Alternativa a Patreon para creadores en Latinoamérica',
    kicker: 'PATREON LATAM',
    summary:
      'Patreon cobra entre 8% y 12% de comisión variable según el plan, más procesamiento. Para creadores LATAM con audiencia local, esto se traduce en pérdidas reales de cientos de dólares al mes. Nebbuler ofrece tarifa fija de US$19/mes con 0% de comisión variable.',
    description:
      'Comparativa Nebbuler vs Patreon con calculadora real de comisiones. Por qué Nebbuler conviene desde los 50 suscriptores.',
  },
  {
    slug: 'medium-pago-espanol',
    competitor: 'Medium Partner',
    title: 'Cómo cobrar por escribir en español sin depender de Medium',
    h1: 'Cómo cobrar por escribir en español sin depender de Medium',
    kicker: 'MEDIUM PARTNER PROGRAM',
    summary:
      'Medium Partner Program paga por tiempo leído, y el algoritmo prioriza lectores en inglés. La mediana de ingresos para escritores hispanohablantes ronda los USD 10–50 al mes, sin importar la calidad. Nebbuler te permite cobrar directamente por tu trabajo, en tu moneda.',
    description:
      'Por qué Medium Partner Program no funciona para escritores en español. Cómo monetizar mejor con membresías recurrentes.',
  },
  {
    slug: 'beehiiv-en-espanol',
    competitor: 'Beehiiv',
    title: 'Beehiiv en español: la alternativa nativa para LATAM',
    h1: 'Beehiiv en español: la alternativa nativa para LATAM',
    kicker: 'BEEHIIV EN ESPAÑOL',
    summary:
      'Beehiiv es excelente para newsletters en inglés, pero su interfaz, su soporte y su sistema de pagos están diseñados para el mercado anglo. Para audiencias LATAM significa fricción: USD obligatorio, soporte solo en inglés, planes que escalan rápido a US$99/mes.',
    description:
      'Comparativa Beehiiv vs Nebbuler. Por qué un newsletter pago en español necesita una plataforma LATAM nativa.',
  },
  {
    slug: 'gumroad-para-creadores-latam',
    competitor: 'Gumroad',
    title: 'Gumroad para creadores LATAM: la alternativa de membresías',
    h1: 'Gumroad para creadores LATAM: la alternativa de membresías',
    kicker: 'GUMROAD LATAM',
    summary:
      'Gumroad es una herramienta sólida para vender productos digitales one-shot, pero cobra 10% por venta y no está pensado para membresías recurrentes. Para creadores LATAM que quieren ingresos predecibles, Nebbuler ofrece un modelo de suscripción con 0% de comisión variable.',
    description:
      'Comparativa Gumroad vs Nebbuler. Por qué las membresías recurrentes ganan a las ventas one-shot a largo plazo.',
  },
  {
    slug: 'convertkit-en-espanol',
    competitor: 'ConvertKit',
    title: 'ConvertKit en español: la alternativa LATAM para creadores',
    h1: 'ConvertKit en español: la alternativa para creadores LATAM',
    kicker: 'CONVERTKIT EN ESPAÑOL',
    summary:
      'ConvertKit es excelente para email marketing en inglés, pero su pricing escala rápido ($29+ USD/mes) y su sistema de pagos solo opera en USD vía Stripe. Para creadores hispanohablantes que quieren cobrar membresías en pesos, Nebbuler es la alternativa nativa LATAM.',
    description:
      'Comparativa ConvertKit vs Nebbuler para creadores hispanohablantes. Pricing, monedas locales, comisiones y por qué Nebbuler conviene para LATAM.',
  },
  {
    slug: 'kajabi-para-latam',
    competitor: 'Kajabi',
    title: 'Alternativa a Kajabi para creadores en Latinoamérica',
    h1: 'Alternativa a Kajabi para creadores en Latinoamérica',
    kicker: 'KAJABI LATAM',
    summary:
      'Kajabi cuesta desde $149 USD/mes (~$141.000 CLP) y está diseñada para coaches anglosajones con ingresos consolidados en dólares. Para el profesional latinoamericano en etapa de crecimiento, Nebbuler ofrece las mismas funcionalidades editoriales core a US$19/mes con pagos en moneda local.',
    description:
      'Comparativa Kajabi vs Nebbuler. Por qué los $149 USD/mes de Kajabi no tienen sentido para creadores LATAM.',
  },
  {
    slug: 'ghost-en-espanol',
    competitor: 'Ghost',
    title: 'Ghost en español: la alternativa sin servidor para LATAM',
    h1: 'Ghost en español: la alternativa sin servidor para LATAM',
    kicker: 'GHOST EN ESPAÑOL',
    summary:
      'Ghost es un CMS open-source poderoso, pero requiere conocimientos técnicos para self-hosting o pagar Ghost Pro ($9-$199 USD/mes). Para profesionales LATAM que quieren publicar y cobrar sin configurar servidores, Nebbuler ofrece la misma lógica editorial con pagos en pesos.',
    description:
      'Comparativa Ghost vs Nebbuler para creadores hispanohablantes. Editor, pricing, pagos locales y por qué no necesitas administrar servidores.',
  },
  {
    slug: 'ko-fi-alternativa-latam',
    competitor: 'Ko-fi',
    title: 'Ko-fi alternativa LATAM: de propinas a membresía profesional',
    h1: 'Ko-fi alternativa LATAM: de propinas a membresía profesional',
    kicker: 'KO-FI ALTERNATIVA LATAM',
    summary:
      'Ko-fi sirve para recibir donaciones simbólicas en dólares, pero no está diseñado para construir un negocio de membresías profesional. Nebbuler transforma el modelo "invítame un café" en una membresía real con contenido exclusivo, pagos recurrentes en moneda local y herramientas editoriales serias.',
    description:
      'Comparativa Ko-fi vs Nebbuler. Por qué las donaciones en USD no escalan y las membresías en pesos sí.',
  },
  {
    slug: 'hotmart-vs-nebbuler',
    competitor: 'Hotmart',
    title: 'Hotmart vs Nebbuler: comisiones, membresías y LATAM',
    h1: 'Hotmart vs Nebbuler: comisiones, membresías y control total',
    kicker: 'HOTMART VS NEBBULER',
    summary:
      'Hotmart cobra ~10% de comisión por cada venta y está diseñada para lanzamientos masivos de cursos. Para el profesional independiente que quiere cobrar mensualmente por su análisis y conocimiento sin comisión variable ni modelo de afiliados, Nebbuler es la alternativa directa.',
    description:
      'Comparativa Hotmart vs Nebbuler. Comisiones, modelo de negocio y por qué las membresías editoriales superan al modelo de lanzamientos.',
  },
  {
    slug: 'teachable-en-espanol',
    competitor: 'Teachable',
    title: 'Teachable en español: alternativa LATAM para profesionales',
    h1: 'Teachable en español: alternativa LATAM para profesionales',
    kicker: 'TEACHABLE EN ESPAÑOL',
    summary:
      'Teachable cobra desde $59 USD/mes + 5% de comisión en su plan Basic, y está orientada a cursos en video para el mercado anglosajón. Para profesionales LATAM que publican contenido editorial recurrente, Nebbuler ofrece US$19/mes con 0% comisión y pagos en moneda local.',
    description:
      'Comparativa Teachable vs Nebbuler. Pricing real, comisiones y por qué Nebbuler es mejor para contenido editorial LATAM.',
  },
] as const

export type AlternativeSlug = (typeof ALTERNATIVES)[number]['slug']

export function getOtherAlternatives(currentSlug: AlternativeSlug) {
  return ALTERNATIVES.filter((a) => a.slug !== currentSlug)
}

// ─── Componentes UI compartidos ─────────────────────────────────────────────

export function PageHero({
  kicker,
  h1,
  summary,
  competitor,
}: {
  kicker: string
  h1: string
  summary: string
  competitor: string
}) {
  return (
    <section className="border-b border-[#DEDEDE] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="section-label mb-3">{kicker}</p>
        <hr className="nyt-rule mb-6" />
        <h1 className="font-serif text-[44px] md:text-[60px] font-bold text-[#121212] leading-[1.04] tracking-[-0.02em] mb-6">
          {h1}
        </h1>
        <p className="font-serif text-[20px] md:text-[22px] italic text-[#444] leading-[1.55] mb-5">
          {summary}
        </p>
        <p className="font-sans text-[14px] uppercase tracking-[0.14em] text-[#888]">
          Nebbuler · vs · {competitor} · 2026
        </p>
      </div>
    </section>
  )
}

export function FinalCta({
  competitor,
}: {
  competitor: string
}) {
  return (
    <section className="border-b border-[#DEDEDE] py-16 px-6 text-center bg-[#F7F7F7]">
      <div className="max-w-xl mx-auto">
        <span className="section-label mb-3 inline-block">CIERRE</span>
        <hr className="nyt-rule mb-6 max-w-xs mx-auto" />
        <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-[#121212] italic mb-4 tracking-[-0.01em] leading-[1.1]">
          Deja de pagar comisiones a {competitor}.
        </h2>
        <p className="font-sans text-[14px] text-[#555] mb-7 max-w-md mx-auto leading-[1.6]">
          Prueba Nebbuler gratis durante 30 días. Sin tarjeta de crédito. Configuración en menos de
          15 minutos.
        </p>
        <Link
          href="/registro"
          className="inline-block font-sans text-[13px] font-medium px-10 py-4 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors duration-150 uppercase tracking-[0.08em]"
        >
          Probar Nebbuler gratis 30 días →
        </Link>
        <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.1em] text-[#999]">
          US$19/mes · 0% comisión variable · Pagos en moneda local
        </p>
      </div>
    </section>
  )
}

export function RelatedAlternatives({
  currentSlug,
}: {
  currentSlug: AlternativeSlug
}) {
  const others = getOtherAlternatives(currentSlug)
  return (
    <section className="border-b border-[#DEDEDE] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <span className="section-label mb-3 inline-block">OTRAS COMPARATIVAS</span>
        <hr className="nyt-rule mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {others.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternativas/${alt.slug}`}
              className="block border border-[#DEDEDE] bg-white p-5 hover:border-[#121212] transition-colors duration-150"
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#C41C1C] mb-2">
                vs {alt.competitor}
              </p>
              <h3 className="font-serif text-[18px] font-bold text-[#121212] leading-[1.2]">
                {alt.h1}
              </h3>
            </Link>
          ))}
        </div>
        <p className="mt-8 font-sans text-[12px] text-[#666]">
          ¿Buscas algo más específico?{' '}
          <Link href="/comparar" className="underline hover:text-[#C41C1C]">
            Ver comparativa general
          </Link>{' '}
          ·{' '}
          <Link href="/migrar-desde" className="underline hover:text-[#C41C1C]">
            Guías de migración
          </Link>
        </p>
      </div>
    </section>
  )
}

export function PageFooter() {
  return (
    <footer className="border-t border-[#DEDEDE] py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]">
          NEBBULER · CHILE · 2026
        </span>
        <a
          href="mailto:hello@nebbuler.com"
          className="font-sans text-[11px] text-[#888] hover:text-[#121212] transition-colors"
        >
          hello@nebbuler.com
        </a>
      </div>
    </footer>
  )
}

export function BreadcrumbsBar({ competitor }: { competitor: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-[#EAEAEA] py-3 px-6 bg-[#FAFAF7]"
    >
      <div className="max-w-3xl mx-auto font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]">
        <Link href="/" className="hover:text-[#121212]">
          Inicio
        </Link>{' '}
        <span className="px-2 text-[#CCC]">›</span>
        <Link href="/alternativas" className="hover:text-[#121212]">
          Alternativas
        </Link>{' '}
        <span className="px-2 text-[#CCC]">›</span>
        <span className="text-[#121212]">vs {competitor}</span>
      </div>
    </nav>
  )
}
