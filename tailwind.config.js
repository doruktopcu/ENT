/** @type {import('tailwindcss').Config} */

// Every palette entry resolves through a CSS custom property holding a bare
// "R G B" triplet. `index.css` swaps those triplets between `html.dark` and
// `html.light`, which is what makes Light Mode work: the components can keep
// writing `bg-slate-900` / `text-amber-300` and still flip with the theme,
// instead of needing a `dark:` variant on ~1000 class names.
const themed = (name, shades) =>
  Object.fromEntries(
    shades.map((shade) => [shade, `rgb(var(--c-${name}-${shade}) / <alpha-value>)`])
  );

const NEUTRAL_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const ACCENT_SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export default {
  content: ['./index.html', './popup.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: themed('slate', NEUTRAL_SHADES),
        amber: themed('amber', ACCENT_SHADES),
        yellow: themed('yellow', ACCENT_SHADES),
        emerald: themed('emerald', ACCENT_SHADES),
        indigo: themed('indigo', ACCENT_SHADES),
        rose: themed('rose', ACCENT_SHADES),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        serif: ['var(--font-serif)'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
};
