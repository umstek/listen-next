import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [tsconfigPaths(), react(), nodePolyfills()],
  worker: {
    format: 'es',
  },
});
