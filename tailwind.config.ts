import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1717",
        wine: {
          50: "#fbf4f4",
          100: "#f5e2e3",
          200: "#ecc8ca",
          300: "#dea1a5",
          400: "#cb6e74",
          500: "#b5474f",
          600: "#9b313b",
          700: "#7f2530",
          800: "#651e28",
          900: "#4a1620",
          950: "#2e0b12",
        },
        gold: {
          50: "#fcf9ef",
          100: "#f7f0d9",
          200: "#eeddb0",
          300: "#e3c47f",
          400: "#d8aa53",
          500: "#c7913a",
          600: "#ad722d",
          700: "#8f5527",
          800: "#754426",
          900: "#623923",
          950: "#381d10",
        },
        cream: "#faf6ec",
        paper: "#fffdf8",
        stone: {
          DEFAULT: "#7b7168",
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(74, 22, 32, 0.25)",
        card: "0 12px 35px -20px rgba(29, 23, 23, 0.25)",
      },
      backgroundImage: {
        "cross-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.035'%3E%3Cpath d='M28 10h4v12h12v4H32v12h-4V26H16v-4h12V10z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fadeUp .8s cubic-bezier(.2,.7,.2,1) both",
        "soft-in": "softIn 1.2s ease both",
        marquee: "marquee 38s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        softIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
