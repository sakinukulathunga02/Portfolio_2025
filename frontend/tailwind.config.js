/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
        
      animation: {
        'fade-in-down-about': 'fade-in-down-about 1s ease-out forwards',
        'slide-in-up-education': 'slide-in-up-education 0.8s ease-out forwards',
      },
      keyframes: {
        'fade-in-down-about': {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-up-education': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [ require('tailwind-scrollbar'),],}