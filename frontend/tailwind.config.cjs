/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul Profesional
        "primary": "#2563EB", 
        "primary-hover": "#1D4ED8",
        
        // Estructura Clara
        "background-dark": "#F1F5F9", // Fondo gris claro
        "surface-dark": "#FFFFFF",    // Cards/Sidebar blanco
        "surface-light": "#F8FAFC",   // Hovers/inputs
        "border-dark": "#E2E8F0",     // Bordes suaves
        
        // Tipografía y Estados
        "text-secondary": "#64748B",  // Gris medio
        "urgent": "#DC2626",          // Rojo profesional
        "warning": "#D97706",         // Ámbar oscuro
        "safe": "#059669",            // Verde esmeralda
      },
    },
  },
  plugins: [],
}