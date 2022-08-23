/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        'black': "#00000",
        'soft-black': '#27272a',
        'white-body': '#f1f5f9',
        'white': '#fff'
      }
    },
    
    extend: {},
  },
  plugins: [],
}