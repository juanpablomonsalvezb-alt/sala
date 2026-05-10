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
    default: "Nebbuler — El conocimiento que antes no se vendía.",
    template: "%s | Nebbuler",
  },
  description:
    "Nebbuler es la plataforma donde economistas, médicos, abogados y expertos de dominio cobran por saber lo que tú necesitas entender.",
  metadataBase: new URL("https://nebbuler.com"),
  openGraph: {
    title: "Nebbuler — El conocimiento que antes no se vendía.",
    description:
      "La plataforma donde economistas, médicos, abogados y expertos de dominio cobran por saber lo que tú necesitas entender.",
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
    title: "Nebbuler — El conocimiento que antes no se vendía.",
    description:
      "La plataforma donde economistas, médicos, abogados y expertos de dominio cobran por saber lo que tú necesitas entender.",
    images: ["/og-default.png"],
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
