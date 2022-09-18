// @ts-check
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['winter', 'night'],
  },
};
