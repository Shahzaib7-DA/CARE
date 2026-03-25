/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'foreground': '#1e293b',
        'border': '#e2e8f0',
        'medical-blue': '#2563eb',     // Primary AI Blue
        'clinical-slate': '#64748b',
        'primary': '#2563eb',
        'primary-dark': '#1d4ed8',
        'accent': '#14b8a6',           // Teal Monitoring
        'success': '#22c55e',          // Stable Green
        'warning': '#f59e0b',          // Warning Amber
        'danger': '#ef4444',           // Critical Red

        // Semantic risk aliases mapping to the unified system
        'risk-green': '#22c55e',
        'risk-yellow': '#f59e0b',
        'risk-red': '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)',
        'gradient-ai': 'linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #14b8a6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'bg-pan': 'bg-pan 15s linear infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'bg-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
    },
  },
  plugins: [],
}
