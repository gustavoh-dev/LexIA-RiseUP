/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('/public/Images/background.jpg')", // exemplo de fundo
      },
      colors: {
        primary: '#1E40AF', // azul escuro
        secondary: '#FBBF24', // amarelo
      },
    },
  },
  plugins: [],
}
