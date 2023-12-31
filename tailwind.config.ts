import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import { radixThemePreset } from 'radix-themes-tw';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        white: '#ffffff',
        black: '#000000',
      },
    },
  },
  presets: [radixThemePreset],
  plugins: [animate],
};

export default config;
