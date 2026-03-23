/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul Ejecutivo (Cielo)
        "primary": "#0EA5E9", 
        "primary-hover": "#0284C7",
        
        // Estructura (Slate/Pizarra)
        "background-dark": "#020617", // Casi negro, muy profundo
        "surface-dark": "#0F172A",    // Gris azulado para Sidebar/Cards
        "surface-light": "#1E293B",   // Gris medio para hovers/inputs
        "border-dark": "#334155",     // Líneas finas y discretas
        
        // Tipografía y Estados
        "text-secondary": "#94A3B8",  // Gris legible
        "urgent": "#EF4444",          // Rojo coral profesional
        "warning": "#F59E0B",         // Ámbar ejecutivo
        "safe": "#10B981",            // Esmeralda 
      },
    },
  },
  plugins: [],
}