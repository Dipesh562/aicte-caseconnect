/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#070d18',
          900: '#0b1528',
          850: '#0e1e38',
          800: '#13274a',
          700: '#1e3a5f',
        },
        command: {
          cyan: '#0284c7', // refined sky-600
          azure: '#0ea5e9',
          crimson: '#e11d48', // refined rose-600
          amber: '#d97706', // refined amber-600
          emerald: '#059669', // refined emerald-600
          gold: '#d97706',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -4px rgba(0, 229, 255, 0.35)',
        'glow-cyan-sm': '0 0 10px rgba(0, 229, 255, 0.25)',
        'glow-crimson': '0 0 24px -2px rgba(255, 51, 102, 0.45)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'beacon': 'beacon 2s infinite',
        'danger-pulse': 'dangerPulse 1.8s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        beacon: {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 229, 255, 0.7)' },
          '70%': { boxShadow: '0 0 0 8px rgba(0, 229, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 229, 255, 0)' },
        },
        dangerPulse: {
          'from': { borderColor: 'rgba(255, 51, 102, 0.4)', boxShadow: '0 0 10px rgba(255, 51, 102, 0.2)' },
          'to': { borderColor: 'rgba(255, 51, 102, 0.9)', boxShadow: '0 0 25px rgba(255, 51, 102, 0.45)' },
        },
      },
    },
  },
  plugins: [],
}
