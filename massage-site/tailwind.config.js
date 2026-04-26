/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald': '#1a4d3e',
        'dark-green': '#0f3d34',
        'gold': '#d4af37',
        'light-gold': '#f4e5c3',
      },
    },
  },
  plugins: [],
}
