import type { Config } from "tailwindcss";

/**
 * Sala — Tailwind CSS v4 config
 *
 * En Tailwind v4 la fuente de verdad es @theme en globals.css.
 * Este archivo sirve para IDE autocompletion, plugins opcionales
 * y cualquier herramienta que espere un tailwind.config.
 */
const config: Config = {
  darkMode: false,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── Paleta Sala — Minimalismo Técnico ──────────────────────── */
      colors: {
        "sala-bg":           "#F8F8F8",
        "sala-surface":      "#FFFFFF",
        "sala-text":         "#0A0A0A",
        "sala-muted":        "#6B7280",
        "sala-accent":       "#0066FF",
        "sala-accent-hover": "#0052CC",
        "sala-border":       "#E5E7EB",
        "sala-border-hover": "#D1D5DB",
      },

      /* ─── Tipografía — solo Inter ─────────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },

      /* ─── Animaciones ─────────────────────────────────────────────── */
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-8px)" },
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
        "fade-in":    "fadeIn 0.35s ease forwards",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in":   "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer":    "shimmer 2s linear infinite",
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
        "2xs":         ["0.625rem",  { lineHeight: "0.875rem" }],
        "display-xs":  ["1.5rem",    { lineHeight: "1.2",  letterSpacing: "-0.02em" }],
        "display-sm":  ["1.875rem",  { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md":  ["2.25rem",   { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-lg":  ["3rem",      { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-xl":  ["3.75rem",   { lineHeight: "1",    letterSpacing: "-0.03em" }],
        "display-2xl": ["4.5rem",    { lineHeight: "0.95", letterSpacing: "-0.035em" }],
      },

      /* ─── Border radius ───────────────────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      /* ─── Sombras sutiles ─────────────────────────────────────────── */
      boxShadow: {
        "sala-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.06)",
        "sala-md": "0 4px 12px 0 rgba(0, 0, 0, 0.08)",
        "sala-lg": "0 8px 24px 0 rgba(0, 0, 0, 0.10)",
        "sala-xl": "0 16px 48px 0 rgba(0, 0, 0, 0.12)",
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
