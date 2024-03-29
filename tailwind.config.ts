import { radixThemePreset } from 'radix-themes-tw';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

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
  corePlugins: {
    preflight: false,
  },
};

export default config;
