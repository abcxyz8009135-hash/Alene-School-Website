import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alene Blue / Indigo — taken from the crest. Science, knowledge,
        // interaction: buttons, links, STEM, icons, active states.
        brand: {
          50: "#F3F1FF",
          100: "#E7E2FD",
          200: "#D0C6FA",
          300: "#AF9FF2",
          400: "#8670E3",
          500: "#5E44CC",
          600: "#3B2499",
          700: "#321F82",
          800: "#28196A",
          900: "#1E1352",
          950: "#130B36",
        },
        // Alene Red — institution and identity: navbar, footer, section
        // labels, occasional large brand moments. Use sparingly (~10%).
        crimson: {
          50: "#FDF2F4",
          100: "#FBE4E8",
          200: "#F5C2CB",
          300: "#EC94A3",
          400: "#DD5B71",
          500: "#C7344D",
          600: "#A71930",
          700: "#8C1428",
          800: "#741224",
          900: "#5F1222",
          950: "#35060F",
        },
        // Dark ink #172033 for text, with a cool neutral ramp. ink-50 is the
        // "soft gray" surface #F6F7F9.
        ink: {
          50: "#F6F7F9",
          100: "#EEF0F3",
          200: "#E1E4EA",
          300: "#C9CED8",
          400: "#9AA2B1",
          500: "#646C7E",
          600: "#4D5568",
          700: "#353D50",
          800: "#242C3F",
          900: "#172033",
          950: "#0D1322",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1240px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 32, 51, 0.04), 0 8px 24px -16px rgba(23, 32, 51, 0.18)",
        nav: "0 6px 20px -12px rgba(53, 6, 15, 0.55)",
      },
      keyframes: {
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "drawer-in": "drawer-in 280ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
