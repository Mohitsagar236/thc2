/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6467f2",
        blue: {
          dark: "#2E3B55",
        },
        golden: "#C4A752",
      },
    },
  },
  plugins: [],
};
