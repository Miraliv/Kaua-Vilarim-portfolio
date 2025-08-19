// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // garante suporte a dark: quando você adicionar class="dark" no <html>
  content: ['./src/**/*.{html,js}'], // escaneia seus arquivos HTML/JS dentro de src
  theme: {
    extend: {},
  },
  plugins: [],
}
