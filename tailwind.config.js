/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        fhd: '1920px',
        '2k': '2048px',
      },
      colors: {
        'ocean-dark': '#001833',
        'ocean-blue': '#0A2A4A',
        'lighthouse-green': '#005517',
        'nav-dark': '#252424',
        'footer-gray': '#DFE2EC',
      },
      fontFamily: {
        'sawarabi': ['Sawarabi Mincho', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      textShadow: {
        'game': '4px 4px 4px rgba(0, 0, 0, 0.70)',
        'game-soft': '4px 4px 3px rgba(0, 0, 0, 0.80)',
      },
      boxShadow: {
        'logo': '4px 4px 10px 0 rgba(0, 0, 0, 0.70)',
        'button': '0 0 4px 5px rgba(255, 255, 255, 0.40)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-game': {
          textShadow: '4px 4px 4px rgba(0, 0, 0, 0.70)',
        },
        '.text-shadow-game-soft': {
          textShadow: '4px 4px 3px rgba(0, 0, 0, 0.80)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
