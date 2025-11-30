import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
// Use '/' for Vercel, '/DarShana-traveler/' for GitHub Pages
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/DarShana-traveler/' : '/',
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
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB to avoid warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'map-vendor': ['leaflet'],
        },
      },
    },
  },
})
