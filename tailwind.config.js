/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff0f5',
          100: '#ffe5f0',
          200: '#ffd4e5',
          300: '#ffa8c5',
          400: '#ff8fab',
          500: '#ff6b9d',
          600: '#ff4d8a',
          700: '#e63d77',
          800: '#cc2d64',
          900: '#b31d51',
        },
        primary: {
          DEFAULT: '#ff6b9d',
          light: '#ffa8c5',
          dark: '#e63d77',
        }
      },
      borderRadius: {
        'card': '1.25rem',
        'soft': '1rem',
      },
      boxShadow: {
        'card': '0 2px 16px -4px rgba(255, 107, 157, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 24px -4px rgba(255, 107, 157, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}

