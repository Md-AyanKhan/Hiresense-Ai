/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#071016",
        panel: "rgba(12, 24, 31, 0.72)",
        line: "rgba(255, 255, 255, 0.12)",
        mint: "#4DE1C1",
        coral: "#FF7A76",
        amber: "#F6C85F",
        sky: "#63B3FF"
      },
      boxShadow: {
        glow: "0 0 45px rgba(77, 225, 193, 0.18)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "app-radial":
          "radial-gradient(circle at 15% 10%, rgba(77,225,193,.18), transparent 28%), radial-gradient(circle at 80% 5%, rgba(255,122,118,.14), transparent 25%), radial-gradient(circle at 50% 90%, rgba(246,200,95,.10), transparent 28%)"
      }
    }
  },
  plugins: []
};
