/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-900": "#0d0a14",
        "brand-800": "#120c1c",
        "brand-700": "#1a1026",
        "brand-600": "#211a30",
        "brand-accent": "#7C5CFF",
        "brand-teal": "#2dd4bf",
        "brand-gold": "#F7C948"
      },
      boxShadow: {
        "card-glow": "0 12px 30px rgba(0,0,0,0.35)"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px"
      }
    }
  },
  plugins: []
};
