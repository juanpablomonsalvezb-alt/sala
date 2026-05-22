import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata, Viewport } from "next"
import { Libre_Baskerville, Public_Sans, Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GrowthStackProvider } from "@/components/providers/GrowthStackProvider"
import "./globals.css"

const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const UMAMI_ENABLED = process.env.NEXT_PUBLIC_SOCIAL_PROOF_ENABLED === 'true' && !!UMAMI_WEBSITE_ID

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
})

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
})

// Inter y Playfair Display se usan en el dashboard vía style={{fontFamily:'var(--font-inter)...'}}
// Antes no se cargaban → fallback silencioso a Georgia/sans-serif. Ahora sí cargan.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Nebbuler · Cobra por tu conocimiento en LATAM — 0% comisión",
    template: "%s · Nebbuler",
  },
  description:
    "Nebbuler es la plataforma donde profesionales de América Latina monetizan su expertise con membresías directas. Pagos en tu moneda, 0% comisión. Colombia, México, Argentina, Perú y más.",
  metadataBase: new URL("https://nebbuler.com"),
  alternates: { canonical: "https://nebbuler.com" },
  openGraph: {
    title: "Nebbuler · Cobra por tu conocimiento en LATAM — 0% comisión",
    description:
      "Abre tu sala y cobra membresías en tu moneda local. Sin algoritmos, sin comisión, con pagos directos en toda América Latina.",
    siteName: "Nebbuler",
    locale: "es_419",
    type: "website",
    url: "https://nebbuler.com",
    images: [
      { url: "/og-default.png", width: 1200, height: 630, alt: "Nebbuler — Lo que se piensa bien, dura." },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebbuler · Membresías para creadores LATAM — 0% comisión",
    description: "Cobra por tu conocimiento en tu moneda. Sin comisión. América Latina.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  other: {
    // RSS feed discoverable
    'application/rss+xml': '/rss.xml',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nebbuler",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
}

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nebbuler",
  alternateName: ["Nebbuler.com", "Nebbuler LATAM"],
  url: "https://nebbuler.com",
  logo: "https://nebbuler.com/nebbuler-logo.png",
  description: "Nebbuler es la plataforma de membresías para creadores de contenido y profesionales de América Latina. Permite cobrar por conocimiento en pesos colombianos, pesos mexicanos, pesos argentinos, soles peruanos y otras monedas locales, sin comisión variable. Es la alternativa a Substack, Patreon y Gumroad diseñada para el mercado hispanohablante.",
  foundingDate: "2026",
  areaServed: [
    { "@type": "Country", name: "Colombia" },
    { "@type": "Country", name: "México" },
    { "@type": "Country", name: "Argentina" },
    { "@type": "Country", name: "Perú" },
    { "@type": "Country", name: "Ecuador" },
    { "@type": "Country", name: "Venezuela" },
    { "@type": "Country", name: "Costa Rica" },
    { "@type": "Country", name: "Panamá" },
    { "@type": "Country", name: "Guatemala" },
    { "@type": "Country", name: "Honduras" },
    { "@type": "Country", name: "El Salvador" },
    { "@type": "Country", name: "Nicaragua" },
    { "@type": "Country", name: "República Dominicana" },
    { "@type": "Country", name: "Bolivia" },
    { "@type": "Country", name: "Uruguay" },
    { "@type": "Country", name: "Paraguay" },
    { "@type": "Country", name: "Chile" },
    { "@type": "Country", name: "Belice" },
  ],
  knowsAbout: [
    "Monetización de contenido en LATAM",
    "Membresías para creadores latinoamericanos",
    "Cobrar por conocimiento en español",
    "Pagos digitales en moneda local latinoamericana",
    "Alternativa a Substack en español",
    "Plataforma de creadores hispanohablantes",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hola@nebbuler.com",
      availableLanguage: ["Spanish"],
    },
    {
      "@type": "ContactPoint",
      contactType: "press",
      email: "prensa@nebbuler.com",
      availableLanguage: ["Spanish"],
    },
  ],
  sameAs: [
    "https://twitter.com/nebbuler",
    "https://linkedin.com/company/nebbuler",
  ],
}

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nebbuler",
  url: "https://nebbuler.com",
  inLanguage: "es",
  description: "Plataforma de membresías y monetización de contenido para profesionales de América Latina.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nebbuler.com/directorio?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const PLATFORM_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nebbuler",
  description: "Nebbuler es la plataforma donde profesionales y creadores de LATAM monetizan su conocimiento con membresías directas en moneda local. 0% comisión variable. Pagos en COP, MXN, ARS, PEN, CLP y más. Alternativa hispanohablante a Substack, Patreon y Gumroad.",
  url: "https://nebbuler.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "es",
  featureList: [
    "Pagos en moneda local latinoamericana",
    "0% comisión variable sobre suscripciones",
    "Sala de membresías personalizada",
    "Pagos directos al creador",
    "Disponible en 18 países de América Latina",
  ],
  offers: {
    "@type": "Offer",
    price: "19",
    priceCurrency: "USD",
    description: "Tarifa fija mensual — sin comisión sobre ingresos",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Organization",
    name: "Nebbuler",
  },
}

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es Nebbuler y para qué sirve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nebbuler es una plataforma de membresías para creadores de contenido y profesionales de América Latina. Permite cobrar suscripciones mensuales directas en moneda local (pesos colombianos, pesos mexicanos, pesos argentinos, soles peruanos, etc.) sin pagar comisión variable sobre los ingresos. El creador abre una 'sala' donde sus suscriptores pagan por acceso exclusivo a su conocimiento.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puede un creador latinoamericano monetizar su conocimiento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un creador latinoamericano puede monetizar su conocimiento en Nebbuler abriendo una sala de membresías: define un precio mensual en su moneda local, publica contenido exclusivo para suscriptores, y recibe pagos directos. No necesita tener miles de seguidores — con 10 a 50 suscriptores pagos ya puede generar ingresos significativos. El proceso tarda menos de 30 minutos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la mejor alternativa a Substack en español para LATAM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nebbuler es la principal alternativa a Substack para creadores hispanohablantes en América Latina. A diferencia de Substack, Nebbuler acepta pagos en monedas locales (COP, MXN, ARS, PEN, CLP), no cobra comisión variable sobre las suscripciones, y está diseñado para el mercado latinoamericano. Substack solo opera en dólares estadounidenses, lo que genera fricción con las audiencias de LATAM.",
      },
    },
    {
      "@type": "Question",
      name: "¿Nebbuler cobra comisión por cada suscriptor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Nebbuler cobra una tarifa fija mensual y el 100% de las suscripciones que recibe el creador son suyas, menos los cargos propios del procesador de pagos. No hay comisión variable. En comparación, Substack cobra el 10% de los ingresos y Patreon entre el 5% y el 12%.",
      },
    },
    {
      "@type": "Question",
      name: "¿En qué países de América Latina está disponible Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nebbuler está disponible en 18 países: Colombia, México, Argentina, Perú, Ecuador, Venezuela, Costa Rica, Panamá, Guatemala, Honduras, El Salvador, Nicaragua, República Dominicana, Bolivia, Uruguay, Paraguay, Chile y Belice. Los creadores pueden recibir pagos en la moneda local de cada país.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo cobrar por contenido digital en Colombia, México o Argentina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para cobrar por contenido digital en Colombia, México o Argentina, la forma más directa es crear una membresía en Nebbuler: registra tu sala, define el precio en pesos colombianos, pesos mexicanos o pesos argentinos, y comparte el enlace con tu audiencia. Los suscriptores pagan con tarjeta local y el dinero llega directamente a tu cuenta sin conversión a dólares.",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${publicSans.variable} ${libreBaskerville.variable} ${inter.variable} ${playfair.variable} h-full`}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Nebbuler RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Nebbuler Atom" href="/rss.xml" />
        {/* Hreflang para LATAM hispanohablante */}
        <link rel="alternate" hrefLang="es" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-419" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-AR" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-CL" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-CO" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-MX" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-PE" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-UY" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="es-EC" href="https://nebbuler.com" />
        <link rel="alternate" hrefLang="x-default" href="https://nebbuler.com" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#121212] font-sans antialiased">
        {UMAMI_ENABLED && (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={UMAMI_WEBSITE_ID}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(ORG_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(WEBSITE_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(PLATFORM_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
        />
        <GrowthStackProvider>
          {children}
        </GrowthStackProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
