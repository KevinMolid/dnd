/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        paper: {
          100: "#f9f6e9",
          200: "#eae3ca",
          400: "#c0b9a0",
          800: "#5c5440",
        },
        gold: {
          400: "#baab7a"
        }
      },
      fontFamily: {
        serif: ["Noto Serif", "serif"],
      }
    },
  },
  plugins: [],
}

