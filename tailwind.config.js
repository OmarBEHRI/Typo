/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        'dark-gray': '#1e1e1e',
        'light-gray': '#2d2d2d',
        'highlight': '#3a3a3a',
        'text-normal': '#aaaaaa',
        'text-highlight': '#ffffff',
        'text-error': '#ff5555',
        'text-success': '#55ff55',
        'accent': '#2e7d32',
        'accent-dark': '#4338ca',
      }
    },
  },
  plugins: [],
}