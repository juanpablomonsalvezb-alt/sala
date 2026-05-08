import type { Config } from "tailwindcss";

/**
 * Sala — Tailwind CSS v4 config
 *
 * En Tailwind v4 la fuente de verdad es @theme en globals.css.
 * Este archivo sirve para IDE autocompletion, plugins opcionales
 * y cualquier herramienta que espere un tailwind.config.
 *
 * Los tokens definitivos están en src/app/globals.css (@theme inline).
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── Paleta Sala ────────────────────────────────────────────── */
      colors: {
        "sala-black":   "#0A0A0A",
        "sala-surface": "#111111",
        "sala-cream":   "#F5F0E8",
        "sala-gold":    "#C9A96E",
        "sala-muted":   "#8A8070",
        "sala-border":  "#1E1E1E",
        "sala-hover":   "#141414",
      },

      /* ─── Tipografías ─────────────────────────────────────────────── */
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },

      /* ─── Animaciones ─────────────────────────────────────────────── */
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in": "slideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer":  "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },

      /* ─── Espaciados adicionales ──────────────────────────────────── */
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },

      /* ─── Tamaños de fuente ───────────────────────────────────────── */
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "display-xs": ["1.5rem",   { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-lg": ["3rem",     { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-xl": ["3.75rem",  { lineHeight: "1",    letterSpacing: "-0.03em" }],
        "display-2xl":["4.5rem",   { lineHeight: "0.95", letterSpacing: "-0.035em" }],
      },

      /* ─── Border radius ───────────────────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      /* ─── Sombras ─────────────────────────────────────────────────── */
      boxShadow: {
        "sala-sm":  "0 1px 3px 0 rgba(0, 0, 0, 0.4)",
        "sala-md":  "0 4px 16px 0 rgba(0, 0, 0, 0.5)",
        "sala-lg":  "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "sala-xl":  "0 16px 64px 0 rgba(0, 0, 0, 0.7)",
        "gold-glow":"0 0 24px 0 rgba(201, 169, 110, 0.12)",
      },

      /* ─── Transiciones ────────────────────────────────────────────── */
      transitionTimingFunction: {
        "sala": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
