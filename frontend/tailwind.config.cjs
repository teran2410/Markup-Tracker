/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — Dark Professional Theme (v0)
        background: "#0a0a0b",
        foreground: "#fafafa",
        card: { DEFAULT: "#111113", foreground: "#fafafa" },
        popover: { DEFAULT: "#111113", foreground: "#fafafa" },
        primary: { DEFAULT: "#3b82f6", foreground: "#ffffff" },
        secondary: { DEFAULT: "#1a1a1d", foreground: "#a1a1aa" },
        muted: { DEFAULT: "#18181b", foreground: "#71717a" },
        accent: { DEFAULT: "#1a1a1d", foreground: "#fafafa" },
        destructive: { DEFAULT: "#ef4444", foreground: "#fafafa" },
        border: "#27272a",
        input: "#27272a",
        ring: "#3b82f6",

        // Sidebar
        sidebar: {
          DEFAULT: "#0f0f10",
          foreground: "#fafafa",
          primary: "#3b82f6",
          "primary-foreground": "#ffffff",
          accent: "#1a1a1d",
          "accent-foreground": "#fafafa",
          border: "#27272a",
          ring: "#3b82f6",
        },

        // Status colors
        safe: "#10b981",
        warning: "#f59e0b",
        urgent: "#ef4444",
      },
      borderColor: {
        DEFAULT: "#27272a",
      },
    },
  },
  plugins: [],
}