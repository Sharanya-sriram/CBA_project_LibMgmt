/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
          800: '#312e81',
          900: '#1e1b4b',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in-right': 'slideInFromRight 0.5s ease-out',
        'slide-in-left': 'slideInFromLeft 0.5s ease-out',
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-gentle': 'pulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  safelist: [
    // Color variants that might be generated dynamically
    'bg-indigo-100',
    'bg-emerald-100', 
    'bg-amber-100',
    'bg-purple-100',
    'bg-red-100',
    'bg-blue-100',
    'dark:bg-indigo-900/20',
    'dark:bg-emerald-900/20',
    'dark:bg-amber-900/20', 
    'dark:bg-purple-900/20',
    'dark:bg-red-900/20',
    'dark:bg-blue-900/20',
    'text-indigo-600',
    'text-emerald-600',
    'text-amber-600',
    'text-purple-600',
    'text-red-600',
    'text-blue-600',
    'dark:text-indigo-400',
    'dark:text-emerald-400',
    'dark:text-amber-400',
    'dark:text-purple-400',
    'dark:text-red-400',
    'dark:text-blue-400',
  ],
}