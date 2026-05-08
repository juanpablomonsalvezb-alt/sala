import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${publicSans.variable} ${libreBaskerville.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-[#121212] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
