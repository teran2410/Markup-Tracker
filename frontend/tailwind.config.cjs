/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#61EDDC",
        "primary-hover": "#4fdccb",
        "background-dark": "#031B20",
        "surface-dark": "#031B20",
        "surface-light": "#0C2E35",
        "border-dark": "#234242",
        "text-secondary": "#8AA8A7",
        "urgent": "#fa5538",
        "warning": "#eab308",
        "safe": "#61EDDC",
      },
    },
  },
  plugins: [],
}