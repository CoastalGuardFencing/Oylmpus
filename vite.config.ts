import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Explicitly set output dir to match firebase.json
  },
  define: {
    global: 'globalThis', // Fix for some Node.js globals
  },
  server: {
    port: 5173,
    host: true
  }
})
