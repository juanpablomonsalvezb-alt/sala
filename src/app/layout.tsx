import type { Metadata, Viewport } from "next"
import { Libre_Baskerville, Public_Sans, Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

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
  url: "https://nebbuler.com",
  logo: "https://nebbuler.com/nebbuler-logo.png",
  description: "Plataforma de newsletters profesionales de pago. Suscripciones mensuales directas, 0% comisión.",
  foundingDate: "2026",
  areaServed: ["CL", "AR", "BR", "MX", "CO", "PE", "UY"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@nebbuler.com",
    availableLanguage: ["Spanish"],
  },
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${publicSans.variable} ${libreBaskerville.variable} ${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#121212] font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
