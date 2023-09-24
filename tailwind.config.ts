import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import colors from 'tailwindcss/colors';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        p: colors.sky,
        s: colors.indigo,
      },
    },
  },
  plugins: [animate],
  corePlugins: {
    preflight: false,
  },
};

export default config;
