import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080810",
        accent: "#0098EA",
        "accent-hover": "#007bc4",
        surface: "rgba(255,255,255,0.05)",
        "surface-border": "rgba(255,255,255,0.08)",
        "text-primary": "#F0F4FF",
        "text-secondary": "#8B9CBF",
        "green-yield": "#00E090",
      },
      borderRadius: {
        card: "18px",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
