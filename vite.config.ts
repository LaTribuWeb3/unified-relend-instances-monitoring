import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true,
    strictPort: true, // Exit if port is already in use
    hmr: {
      port: 3001, // Use a different port for HMR
    },
    watch: {
      usePolling: true, // Enable polling for file changes (helps with some systems)
      interval: 300, // Check for changes every 300ms
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Ensure dependencies are properly externalized for faster HMR
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}) 