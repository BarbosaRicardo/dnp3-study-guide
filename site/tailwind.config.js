/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0D2137', 700: '#0D2137', 800: '#081829', 600: '#1a3a5c' },
        mblue:  { DEFAULT: '#1565C0', 50: '#eff6ff', 100: '#dbeafe', 400: '#42a5f5', 500: '#1e88e5', 600: '#1565C0', 700: '#0d47a1' },
        mcyan:  { DEFAULT: '#0097A7', 400: '#26c6da', 500: '#00acc1' },
        morange:{ DEFAULT: '#E65100', 400: '#ff7043', 500: '#f4511e' },
        mgreen: { DEFAULT: '#2E7D32', 400: '#66bb6a', 500: '#43a047', 50: '#f0fdf4' },
        mred:   { DEFAULT: '#C62828', 400: '#ef5350', 500: '#e53935', 50: '#fef2f2' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to:   { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
