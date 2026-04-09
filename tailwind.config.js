/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ethiopian: {
          green: '#078930',
          yellow: '#fcdd09',
          red: '#da121a',
          brown: '#8B4513',
          cream: '#FDF5E6'
        }
      }
    },
  },
  plugins: [],
}