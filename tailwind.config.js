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
          950: '#17110E',
          900: '#201913',
          850: '#291F19',
          800: '#211913',
          700: '#2D221C',
        },
        accent: {
          DEFAULT: '#2860F5',
          hover: '#1F50D4',
          light: 'rgba(40, 96, 245, 0.14)',
        },
        cream: {
          DEFAULT: '#EAE0CC',
          muted: 'rgba(234, 224, 204, 0.72)',
          subtle: 'rgba(234, 224, 204, 0.48)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
