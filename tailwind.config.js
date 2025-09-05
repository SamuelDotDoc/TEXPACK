/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bronze: {
          medium: '#8B5E3C',
          light: '#B07A4B',
        },
        gold: {
          soft: '#C9A94B',
        },
        silver: {
          soft: '#C0C6C9',
        },
        dark: {
          neutral: '#1E1B18',
          surface: '#2A2520',
        },
        light: {
          text: '#F5F3F1',
        },
        accent: {
          hover: '#E6C27A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}