/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0E17',
          900: '#141B2D',
          850: '#1C2541',
          800: '#1e293b',
          700: '#2a3554',
        },
        accent: {
          DEFAULT: '#C9553B',
          hover: '#D9604A',
          light: '#FDEEEB',
        },
        warm: {
          paper: '#FAF8F5',
          linen: '#EFEC E6',
          cream: '#FFFFFF',
        },
        slate: {
          850: '#1a1a2e',
          750: '#2d2d44',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
