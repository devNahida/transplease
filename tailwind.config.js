/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1E2B2F',
        },
        secondary: {
          green: '#2D4C43',
        },
        accent: {
          gold: '#D6B15F',
        },
        text: {
          light: '#FFFFFF',
          grey: '#A7A7A7',
        },
        divider: {
          grey: '#3F3F3F',
        },
      },
    },
  },
  plugins: [],
};
