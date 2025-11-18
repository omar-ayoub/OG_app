/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all your React files
  ],
  darkMode: "class", // From your design
  theme: {
    extend: {
      colors: {
        // Primary brand color
        "primary": "#5590f7",

        // Background colors
        "background-light": "#f5f6f8",
        "background-dark": "#101622",

        // Card/Surface colors
        "card-light": "#ffffff",
        "card-dark": "#1b2332",

        // Input/Form colors
        "input-light": "#f0f2f5",
        "input-dark": "#151e2f",

        // Text colors
        "text-light-primary": "#1f2937",
        "text-dark-primary": "#f0f2f5",
        "text-light-secondary": "#6b7280",
        "text-dark-secondary": "#9ca3af",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px",
      },
      boxShadow: {
        // Card shadows
        "card": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-dark": "0 2px 8px rgba(0, 0, 0, 0.3)",
        // FAB shadow
        "fab": "0 4px 12px rgba(85, 144, 247, 0.3)",
        // General shadows
        "sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "md": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
      transitionDuration: {
        "base": "200ms",
        "fast": "150ms",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
}