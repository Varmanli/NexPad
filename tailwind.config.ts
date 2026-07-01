// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "rgb(var(--background-rgb) / <alpha-value>)",
          soft: "rgb(var(--background-soft-rgb) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface-rgb) / <alpha-value>)",
          soft: "rgb(var(--surface-soft-rgb) / <alpha-value>)",
          hover: "rgb(var(--surface-hover-rgb) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border-rgb) / <alpha-value>)",
          soft: "var(--border-soft)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          soft: "var(--text-soft)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          hover: "var(--primary-hover)",
          soft: "var(--primary-soft)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-rgb) / <alpha-value>)",
          hover: "var(--secondary-hover)",
          soft: "var(--secondary-soft)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          soft: "var(--accent-soft)",
        },
        danger: "var(--danger)",
        warning: "var(--warning)",
        success: "var(--success)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
