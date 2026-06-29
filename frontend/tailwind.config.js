/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0A0E17',
          card: 'rgba(17, 24, 39, 0.7)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#10B981', // emerald
          cyan: '#06B6D4',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          text: '#9CA3AF',
          heading: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.25)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
