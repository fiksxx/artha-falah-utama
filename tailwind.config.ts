import type { Config } from "tailwindcss";

/**
 * Semua warna dibaca dari CSS variables di `src/app/globals.css`.
 * Ganti brand color resmi cukup di satu tempat (globals.css), tidak perlu sentuh komponen.
 */
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
    },
    extend: {
      colors: {
        brand: {
          50: withOpacity("--color-brand-50"),
          100: withOpacity("--color-brand-100"),
          200: withOpacity("--color-brand-200"),
          300: withOpacity("--color-brand-300"),
          400: withOpacity("--color-brand-400"),
          500: withOpacity("--color-brand-500"),
          600: withOpacity("--color-brand-600"),
          700: withOpacity("--color-brand-700"),
          800: withOpacity("--color-brand-800"),
          900: withOpacity("--color-brand-900"),
          950: withOpacity("--color-brand-950"),
        },
        accent: {
          50: withOpacity("--color-accent-50"),
          100: withOpacity("--color-accent-100"),
          200: withOpacity("--color-accent-200"),
          300: withOpacity("--color-accent-300"),
          400: withOpacity("--color-accent-400"),
          500: withOpacity("--color-accent-500"),
          600: withOpacity("--color-accent-600"),
          700: withOpacity("--color-accent-700"),
        },
        ink: {
          DEFAULT: withOpacity("--color-ink"),
          muted: withOpacity("--color-ink-muted"),
          subtle: withOpacity("--color-ink-subtle"),
          invert: withOpacity("--color-ink-invert"),
        },
        surface: {
          DEFAULT: withOpacity("--color-surface"),
          muted: withOpacity("--color-surface-muted"),
          strong: withOpacity("--color-surface-strong"),
        },
        line: {
          DEFAULT: withOpacity("--color-line"),
          strong: withOpacity("--color-line-strong"),
        },
        /** State error form. Satu-satunya merah di website - jangan pakai `red-*` bawaan. */
        danger: {
          50: withOpacity("--color-danger-50"),
          100: withOpacity("--color-danger-100"),
          200: withOpacity("--color-danger-200"),
          400: withOpacity("--color-danger-400"),
          600: withOpacity("--color-danger-600"),
          700: withOpacity("--color-danger-700"),
          900: withOpacity("--color-danger-900"),
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["clamp(2.5rem, 1.6rem + 3.4vw, 4rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display": ["clamp(2rem, 1.4rem + 2.4vw, 3rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "heading": ["clamp(1.5rem, 1.2rem + 1.2vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        content: "72ch",
        shell: "80rem",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        // Bayangan memakai token --color-shadow (hijau sangat gelap) agar
        // menyatu dengan palet, bukan abu-abu kebiruan bawaan.
        card: "0 1px 2px rgb(var(--color-shadow) / 0.05), 0 4px 12px rgb(var(--color-shadow) / 0.05)",
        "card-hover":
          "0 2px 4px rgb(var(--color-shadow) / 0.07), 0 12px 28px rgb(var(--color-shadow) / 0.10)",
        nav: "0 1px 0 rgb(var(--color-shadow) / 0.06), 0 6px 20px rgb(var(--color-shadow) / 0.05)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0, 12px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        // Durasi di-override per komponen lewat inline style `--marquee-duration`
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
