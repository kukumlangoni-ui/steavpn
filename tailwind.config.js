/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stea: {
          primary: "#E88A1E",
          "primary-hover": "#F59E0B",
          "primary-dark": "#D97706",
        },
      },
    },
  },
  plugins: [],
};
