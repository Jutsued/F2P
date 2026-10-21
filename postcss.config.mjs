// postcss.config.mjs
// Tailwind v4 runs as a PostCSS plugin. This is the only config Tailwind needs;
// there's no tailwind.config.js anymore in v4.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
