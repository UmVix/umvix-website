import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-brand)", "system-ui", "sans-serif"],
        headline: ["var(--font-headline)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          red: "var(--brand-red)",
          "red-dark": "var(--brand-red-dark)",
          black: "var(--brand-black)",
          "black-soft": "var(--brand-black-soft)",
          white: "var(--brand-white)",
          gray: "var(--brand-gray)",
          "gray-muted": "var(--brand-gray-muted)",
        },
      },
      backgroundImage: {
        "brand-gradient": "var(--brand-gradient)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "thinking-bounce": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
      animation: {
        marquee: "marquee linear infinite",
        "thinking-bounce": "thinking-bounce 1.4s ease-in-out infinite",
        scan: "scan 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
