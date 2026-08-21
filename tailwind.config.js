/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          iceBlue: '#a3d2ca',
          frostWhite: '#f0f5f5',
          forestGreen: '#234e3d',
          spiceOrange: '#d35930',
          charcoal: '#1a1d1e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
