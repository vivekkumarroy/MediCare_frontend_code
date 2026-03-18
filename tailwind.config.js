/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a9ead',
          50:  '#f0f9fb',
          100: '#d9f0f4',
          200: '#b3e1e9',
          300: '#7dcadb',
          400: '#4ab0c5',
          500: '#4a9ead',
          600: '#3a8a99',
          700: '#2f7080',
          800: '#285c6a',
          900: '#1e4550',
        },
        accent: '#4a9ead',
        success: '#10b981',
        danger:  '#ef4444',
        warning: '#f59e0b',
        navy:    '#1a2e3b',
        dark:    '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgb(0 0 0 / .06)',
        'card-hover': '0 8px 24px -4px rgb(0 0 0 / .1)',
        glow: '0 0 20px rgb(74 158 173 / .3)',
      },
    },
  },
  plugins: [],
}
