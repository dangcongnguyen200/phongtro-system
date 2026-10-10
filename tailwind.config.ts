import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#060B17",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(6, 182, 212, 0.2)",
          cyan: "#06B6D4",
          emerald: "#10B981",
          accent: "#38BDF8",
          dark: "#030712",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
