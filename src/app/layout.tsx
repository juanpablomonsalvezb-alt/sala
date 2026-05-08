import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

/* ─── Fuentes ────────────────────────────────────────────────────────────── */

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: true,
});

/* ─── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: "Sala — Conocimiento que vale",
    template: "%s | Sala",
  },
  description:
    "Sala es una plataforma de conocimiento profesional premium. Recursos, comunidad y aprendizaje editorial de alta calidad.",
  metadataBase: new URL("https://sala.com"),
  openGraph: {
    title: "Sala — Conocimiento que vale",
    description:
      "Plataforma de conocimiento profesional premium. Recursos, comunidad y aprendizaje editorial de alta calidad.",
    siteName: "Sala",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sala — Conocimiento que vale",
    description:
      "Plataforma de conocimiento profesional premium. Recursos, comunidad y aprendizaje editorial de alta calidad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* ─── Layout raíz ────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F0E8] font-sans">
        {children}
      </body>
    </html>
  );
}
