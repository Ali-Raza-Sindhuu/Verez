/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A1210",
        surface: "#0F1B19",
        card: "#132420",
        cream: "#F6F4EE",
        teal: {
          DEFAULT: "#1EC2BC",
          dim: "#14847F",
          glow: "#5CF2E8",
        },
        clay: "#E7714A",
        slate: {
          text: "#A9B8B4",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-dots": "radial-gradient(circle, rgba(30,194,188,0.18) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 60px rgba(30,194,188,0.25)",
      },
    },
  },
  plugins: [],
};
