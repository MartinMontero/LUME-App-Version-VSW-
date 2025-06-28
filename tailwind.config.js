/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lume: {
          deep: '#0a0f1c',
          ocean: '#1a2332',
          mist: '#2a3441',
          light: '#f8fafc',
          glow: '#3b82f6',
          soft: '#60a5fa',
          warm: '#fbbf24',
          spark: '#f59e0b',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};