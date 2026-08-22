import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./content/**/*.mdx",
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
      // Prose styling for MDX blog posts, mapped onto the brand tokens.
      typography: {
        brand: {
          css: {
            "--tw-prose-body": "var(--brand-gray)",
            "--tw-prose-headings": "var(--brand-white)",
            "--tw-prose-lead": "var(--brand-gray)",
            "--tw-prose-links": "var(--brand-red)",
            "--tw-prose-bold": "var(--brand-white)",
            "--tw-prose-counters": "var(--brand-gray-muted)",
            "--tw-prose-bullets": "var(--brand-red)",
            "--tw-prose-hr": "rgba(255,255,255,0.08)",
            "--tw-prose-quotes": "var(--brand-white)",
            "--tw-prose-quote-borders": "var(--brand-red)",
            "--tw-prose-captions": "var(--brand-gray-muted)",
            "--tw-prose-code": "var(--brand-white)",
            "--tw-prose-pre-code": "var(--brand-gray)",
            "--tw-prose-pre-bg": "rgba(255,255,255,0.04)",
            "--tw-prose-th-borders": "rgba(255,255,255,0.14)",
            "--tw-prose-td-borders": "rgba(255,255,255,0.08)",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
