import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), viteSingleFile()],
  base: '/kontur/',
  build: {
    target: 'esnext',
    minify: 'esbuild',
    assetsInlineLimit: Infinity,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
