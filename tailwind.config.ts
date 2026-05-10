import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
      colors: {
        "sala-white": "#FFFFFF",
        "sala-ink":   "#121212",
        "sala-gray":  "#666666",
        "sala-red":   "#C41C1C",
        "sala-rule":  "#DEDEDE",
        "sala-alt":   "#F7F7F7",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        sans:  ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        DEFAULT: "0",
      },
    },
  },
  plugins: [typography],
};

export default config;
