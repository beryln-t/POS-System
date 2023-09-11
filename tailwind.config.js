/** @type {import('tailwindcss').Config} */
export default {
  content: ["light", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: "corporate",
  },
};
