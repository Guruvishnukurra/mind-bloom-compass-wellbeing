/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          teal: '#1A7A77',
          lavender: '#ACBCF4',
          sage: '#C2D6C5',
        },
        secondary: {
          peach: '#FFBC97',
          mauve: '#D4ADCF',
        },
        neutral: {
          white: '#F8FAFC',
          gray: '#E2E8F0',
          blue: '#334155',
        },
        functional: {
          success: '#4AD295',
          alert: '#F9B44A',
          focus: '#8B5CF6',
        },
      },
      fontFamily: {
        primary: ['Lexend', 'sans-serif'],
        accent: ['Martel Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'ripple': 'ripple 1s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} 