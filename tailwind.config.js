/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chesskid: {
          blue: "#1ba3e1",
          blueHover: "#168ec6",
          orange: "#f37820",
          orangeDark: "#df6510",
          green: "#4ca922",
          darkGreen: "#1c4a27",
          borderBlue: "#32aae5",
          grayText: "#555555",
          headerDark: "#1a3821",
        }
      }
    },
  },
  plugins: [],
}

