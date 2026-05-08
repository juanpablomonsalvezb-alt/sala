import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* ─── Fuente ─────────────────────────────────────────────────────────────── */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    "Sala es una plataforma de conocimiento profesional. Recursos, comunidad y aprendizaje de alta calidad.",
  metadataBase: new URL("https://sala.com"),
  openGraph: {
    title: "Sala — Conocimiento que vale",
    description:
      "Plataforma de conocimiento profesional. Recursos, comunidad y aprendizaje de alta calidad.",
    siteName: "Sala",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sala — Conocimiento que vale",
    description:
      "Plataforma de conocimiento profesional. Recursos, comunidad y aprendizaje de alta calidad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F8F8",
  colorScheme: "light",
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
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#F8F8F8] text-[#0A0A0A] font-sans">
        {children}
      </body>
    </html>
  );
}
