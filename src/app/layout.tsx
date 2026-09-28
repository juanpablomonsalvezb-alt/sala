import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata, Viewport } from "next"
import { Libre_Baskerville, Public_Sans, Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GrowthStackProvider } from "@/components/providers/GrowthStackProvider"
import { ExitIntentPopup } from "@/components/exit-intent-popup"
import { AuthWelcomeToast } from "@/components/auth-welcome-toast"
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
    default: "Nebbuler · Expertos de LATAM, sin filtros",
    template: "%s · Nebbuler",
  },
  description:
    "Economistas, abogados, médicos y arquitectos de América Latina que publican lo que realmente saben. Autores verificados, sin algoritmos.",
  metadataBase: new URL("https://nebbuler.com"),
  alternates: {
    canonical: "https://nebbuler.com",
    languages: {
      'es': 'https://nebbuler.com',
      'es-CL': 'https://nebbuler.com',
      'es-MX': 'https://nebbuler.com',
      'es-CO': 'https://nebbuler.com',
      'es-AR': 'https://nebbuler.com',
      'es-PE': 'https://nebbuler.com',
      'x-default': 'https://nebbuler.com',
    },
  },
  openGraph: {
    title: "Nebbuler · Expertos de LATAM, sin filtros",
    description:
      "Economistas, abogados, médicos y arquitectos de América Latina que publican lo que realmente saben. Autores verificados, sin algoritmos.",
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
    title: "Nebbuler · Expertos de LATAM, sin filtros",
    description: "Economistas, abogados, médicos y arquitectos de América Latina que publican lo que realmente saben. Autores verificados, sin algoritmos.",
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
  description: "Nebbuler es una plataforma en línea de contenido experto de América Latina: newsletters y análisis sobre economía, derecho, impuestos, negocios y salud, escritos por profesionales de la región. Cada autor publica con su nombre, y un sello distingue a los autores verificados que escriben sin IA. Los profesionales también pueden abrir su propio espacio para publicar.",
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
    "Economía de América Latina",
    "Derecho y regulación en América Latina",
    "Impuestos y tributación en América Latina",
    "Negocios y finanzas corporativas en LATAM",
    "Salud pública en América Latina",
    "Newsletters de análisis profesional en español",
    "Contenido escrito sin inteligencia artificial",
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
  description: "Contenido experto de América Latina sobre economía, derecho, impuestos, negocios y salud, escrito por profesionales de la región.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nebbuler.com/explorar?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://nebbuler.com" },
    { "@type": "ListItem", position: 2, name: "Calculadora", item: "https://nebbuler.com/cuanto-te-quitan" },
    { "@type": "ListItem", position: 3, name: "Mundial", item: "https://nebbuler.com/mundial" },
    { "@type": "ListItem", position: 4, name: "Datos", item: "https://nebbuler.com/datos" },
    { "@type": "ListItem", position: 5, name: "Precios", item: "https://nebbuler.com/precios" },
    { "@type": "ListItem", position: 6, name: "Explorar", item: "https://nebbuler.com/explorar" },
    { "@type": "ListItem", position: 7, name: "Blog", item: "https://nebbuler.com/blog" },
    { "@type": "ListItem", position: 8, name: "Salarios", item: "https://nebbuler.com/salario" },
    { "@type": "ListItem", position: 9, name: "Comparar", item: "https://nebbuler.com/comparar" },
  ],
}

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nebbuler es una plataforma en línea de contenido experto de América Latina: newsletters y análisis sobre economía, derecho, impuestos, negocios y salud, escritos por profesionales de la región. Cada autor publica con su nombre, y un sello distingue a los autores verificados que escriben sin IA.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué temas cubre Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Economía, derecho, impuestos, negocios, finanzas y salud, con foco en América Latina. Los autores son profesionales de cada área —economistas, abogados, contadores, médicos, arquitectos— que publican análisis y newsletters sobre su especialidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo sé si un texto de Nebbuler fue escrito con IA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los autores verificados por Nebbuler llevan el sello «Escrito por un profesional verificado · Sin IA». Para obtenerlo, Nebbuler verifica su identidad y trayectoria, y el autor se compromete por escrito a no publicar textos generados con inteligencia artificial; si incumple, el sello se retira. Un perfil sin sello no ha pasado por esta verificación. Más información en nebbuler.com/sin-ia.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo sigo o me suscribo a un autor en Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entra al directorio en nebbuler.com/directorio, abre el perfil del autor y suscríbete desde su página. Parte del contenido es gratuito y parte es exclusivo para suscriptores; cada autor define qué publica abierto.",
      },
    },
    {
      "@type": "Question",
      name: "¿En qué países está disponible Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En toda América Latina, incluidos Chile, Colombia, México, Argentina, Perú, Uruguay y Ecuador. El contenido está en español.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo publicar mi propio contenido en Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Los profesionales pueden abrir su propio espacio en nebbuler.com/abrir para publicar análisis y newsletters y ofrecer suscripciones a sus lectores. Las condiciones están en nebbuler.com/precios.",
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
        {/* AI discoverability meta tags */}
        <meta name="ai-content-declaration" content="Nebbuler is an online platform for expert content from Latin America: newsletters and analysis on economics, law, taxes, business and health, written by professionals from the region. Verified authors who write without AI carry a «Sin IA» (no AI) badge; see https://nebbuler.com/sin-ia." />
        <meta name="ai-purpose" content="Nebbuler helps readers in Latin America find trustworthy expert analysis — economics, law, taxes, business, health — written by named professionals, and lets them tell human-written content apart from AI-generated content. Professionals can also open their own space to publish." />
        <meta name="ai-keywords" content="análisis económico LATAM, newsletter de economía en español, derecho y regulación América Latina, impuestos Chile Colombia México, contenido experto en español, escrito sin IA, newsletters profesionales LATAM, expert analysis latin america, human-written content" />
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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(BREADCRUMB_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
        />
        <GrowthStackProvider>
          {children}
          <ExitIntentPopup />
          <AuthWelcomeToast />
        </GrowthStackProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
