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
      fontFamily: {
        sans: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      spacing: {
        "section-y": "4.5rem",
        "section-x": "1.5rem"
      },
      backgroundImage: {
        "brand-hero":
          "radial-gradient(circle at top, rgba(74, 19, 138, 0.95) 0%, rgba(36, 7, 61, 0.85) 45%, rgba(18, 2, 31, 1) 100%)",
        "brand-orb":
          "radial-gradient(circle, rgba(124, 92, 255, 0.35) 0%, rgba(124, 92, 255, 0) 70%)"
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
