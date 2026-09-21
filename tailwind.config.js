/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat_400Regular"],
        medium: ["Montserrat_500Medium"],
        bold: ["Montserrat_700Bold"],
      },
      colors: {
        panel: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
