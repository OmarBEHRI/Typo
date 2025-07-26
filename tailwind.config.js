/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#1a1a1a',
        'light-gray': '#2a2a2a',
        'accent': '#2e7d32',
        'text-normal': '#d1d5db',
        'text-highlight': '#f3f4f6',
        'text-success': '#4caf50',
      },
      fontFamily: {
        'sans': ['Courier New', 'monospace'],
        'roboto': ['Courier New', 'monospace'],
      },
      keyframes: {
        sparkle: {
          '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
          '50%': { transform: 'translate(20px, -20px) scale(1)', opacity: 0.5 },
          '100%': { transform: 'translate(40px, -40px) scale(0)', opacity: 0 }
        },
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        }
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'fadeInLeft': 'fadeInLeft 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
}