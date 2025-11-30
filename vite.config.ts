import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  base: '/DarShana-traveler/',
  plugins: [react()],
  optimizeDeps: {
    // Prebundle face-api to avoid duplicate runtime packages and speed up dev
    include: ['face-api.js'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
