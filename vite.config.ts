import tailwindcss from '@tailwindcss/postcss'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/listen-next/' : '/',
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  plugins: [tsconfigPaths(), react(), nodePolyfills()],
  worker: {
    plugins: () => [tsconfigPaths(), nodePolyfills()],
    format: 'es',
  },
})
