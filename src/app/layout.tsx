import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Sala — Conocimiento profesional",
    template: "%s | Sala",
  },
  description:
    "Economistas, abogados, médicos y consultores publican análisis que no aparecen en los medios. Sus lectores más comprometidos pagan por ello.",
  metadataBase: new URL("https://sala.lat"),
  openGraph: {
    title: "Sala — Conocimiento profesional",
    description:
      "El lugar donde los profesionales comparten lo que realmente saben.",
    siteName: "Sala",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sala — Conocimiento profesional",
    description:
      "El lugar donde los profesionales comparten lo que realmente saben.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-[#121212] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
