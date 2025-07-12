/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#008000',
      },
      fontFamily: {
        'sans': ['Poppins-Regular'],
        'medium': ['Poppins-Medium'],
        'bold': ['Poppins-Bold'],
      },
    },
  },
  plugins: [],
};
