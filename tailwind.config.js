/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F2EAE0",
          100: "#B4D3D9",
          200: "#BDA6CE",
          300: "#9B8EC7",
          600: "#BDA6CE",
          700: "#9B8EC7",
          900: "#9B8EC7"
        }
      }
    }
  },
  plugins: []
};
