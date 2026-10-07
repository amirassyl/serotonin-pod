import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Stance Studio wellness colors
        sanctuary: {
          blue: "hsl(var(--sanctuary-blue))",
        },
        sage: {
          green: "hsl(var(--sage-green))",
        },
        warm: {
          yellow: "hsl(var(--warm-yellow))",
        },
        // Plutchik emotion colors
        emotion: {
          joy: { DEFAULT: "hsl(var(--emotion-joy))", light: "hsl(var(--emotion-joy-light))" },
          trust: { DEFAULT: "hsl(var(--emotion-trust))", light: "hsl(var(--emotion-trust-light))" },
          fear: { DEFAULT: "hsl(var(--emotion-fear))", light: "hsl(var(--emotion-fear-light))" },
          surprise: { DEFAULT: "hsl(var(--emotion-surprise))", light: "hsl(var(--emotion-surprise-light))" },
          sadness: { DEFAULT: "hsl(var(--emotion-sadness))", light: "hsl(var(--emotion-sadness-light))" },
          disgust: { DEFAULT: "hsl(var(--emotion-disgust))", light: "hsl(var(--emotion-disgust-light))" },
          anger: { DEFAULT: "hsl(var(--emotion-anger))", light: "hsl(var(--emotion-anger-light))" },
          anticipation: { DEFAULT: "hsl(var(--emotion-anticipation))", light: "hsl(var(--emotion-anticipation-light))" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'elevated-lg': '0 8px 30px -4px rgba(0, 0, 0, 0.12)',
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "float": "float 4s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
