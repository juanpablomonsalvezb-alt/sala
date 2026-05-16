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
    // Title con keywords reales + slogan editorial
    default: "Nebbuler · Plataforma de newsletters profesionales de pago",
    template: "%s · Nebbuler",
  },
  description:
    "Nebbuler es la plataforma donde los profesionales cobran por su conocimiento. Suscripciones mensuales directas, 0% de comisión. América Latina.",
  metadataBase: new URL("https://nebbuler.com"),
  alternates: { canonical: "https://nebbuler.com" },
  openGraph: {
    title: "Nebbuler · Plataforma de newsletters profesionales de pago",
    description:
      "Cobra por tu conocimiento. Newsletters profesionales con suscripción mensual directa, 0% comisión.",
    siteName: "Nebbuler",
    locale: "es_CL",
    type: "website",
    url: "https://nebbuler.com",
    images: [
      { url: "/og-default.png", width: 1200, height: 630, alt: "Nebbuler — Lo que se piensa bien, dura." },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebbuler · Newsletters profesionales de pago",
    description: "Cobra por tu conocimiento. 0% comisión. América Latina.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
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
  alternateName: "Nebbuler.com",
  url: "https://nebbuler.com",
  logo: "https://nebbuler.com/nebbuler-logo.png",
  description: "Plataforma de suscripción directa para profesionales verificados. 0% comisión. Monetización de expertise en 18 países latinoamericanos.",
  foundingDate: "2026",
  areaServed: [
    { "@type": "Country", name: "Chile" },
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
    { "@type": "Country", name: "Belice" },
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
  description: "Plataforma de suscripción directa para profesionales. Monetiza tu expertise sin comisión.",
  url: "https://nebbuler.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "29990",
    priceCurrency: "CLP",
    description: "Tarifa fija mensual",
  },
  author: {
    "@type": "Organization",
    name: "Nebbuler",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${publicSans.variable} ${libreBaskerville.variable} ${inter.variable} ${playfair.variable} h-full`}
    >
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
        <GrowthStackProvider>
          {children}
        </GrowthStackProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
