import type { Config } from "tailwindcss";

export default {
   darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          300: "#86efac",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        neutral: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          400: "#a1a1aa",
          600: "#52525b",
          800: "#27272a",
          900: "#18181b",
        },
        success: "#16a34a",
        warning: "#d97706",
        error: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
