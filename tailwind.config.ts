import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { canvas: "#0A0E29", surface: "#141833", raised: "#242842", border: "#272C49" },
        bp: { DEFAULT: "#0066FF", soft: "#4D8DFF", pale: "#8FB8FF" },
        success: "#21C45D",
        amber: "#F59A0A",
        ink: { DEFAULT: "#F1F5F9", dim: "#94A3B8", faint: "#64748B" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        grotesk: ["Space Grotesk", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
