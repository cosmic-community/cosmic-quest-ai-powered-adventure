/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nes-black': '#000000',
        'nes-white': '#FFFFFF',
        'nes-green': '#00FF00',
        'nes-dark-green': '#008000',
        'nes-blue': '#0000FF',
        'nes-red': '#FF0000',
        'nes-yellow': '#FFFF00',
        'nes-brown': '#8B4513',
        'nes-gray': '#808080',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'pixel-inset': 'inset 4px 4px 0px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}