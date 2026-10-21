/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          950: '#041710',
          900: '#08231A',
          850: '#0C2E22',
          800: '#113B2C',
          700: '#195540',
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
          300: '#6EE7B7',
          200: '#A7F3D0',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        clinic: {
          bg: '#F6F9F7',
          card: '#FFFFFF',
          border: '#E2ECE6',
          textMuted: '#587368',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
