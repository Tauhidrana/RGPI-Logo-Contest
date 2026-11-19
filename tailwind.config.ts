import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        /* Contest identity palette */
        ink: {
          DEFAULT: "#0E2F33",
          50: "#eef6f5", 100: "#d3e8e5", 200: "#a8d1cc", 300: "#74b2ad",
          400: "#418d89", 500: "#256f6c", 600: "#1b5957", 700: "#194745",
          800: "#0E2F33", 900: "#0b2529",
        },
        sun: {
          DEFAULT: "#F9B825",
          50: "#fffaeb", 100: "#fef0c7", 200: "#fde28c", 300: "#fbd04d",
          400: "#f9bf24", 500: "#F9B825", 600: "#dd970b", 700: "#b87309",
          800: "#935a0e", 900: "#7a4a11",
        },
        brand: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563EB", 700: "#1d4ed8",
          800: "#1e40af", 900: "#1e3a8a",
        },
        leaf: {
          50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac",
          400: "#4ade80", 500: "#22c55e", 600: "#16A34A", 700: "#15803d",
          800: "#166534", 900: "#14532d",
        },
        lime: {
          50: "#f7fce8", 100: "#eaf8c4", 200: "#d8f08a", 300: "#bde354",
          400: "#A3CF3A", 500: "#8bb82a", 600: "#6e9422",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        bangla: ["var(--font-bangla)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "5px 5px 0 0 #0E2F33",
        card: "0 6px 24px -10px rgba(14, 47, 51, 0.18)",
        sticker: "5px 5px 0 0 #0E2F33",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-9px) rotate(2deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        float: "float 5s ease-in-out infinite",
        wiggle: "wiggle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
