import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Increase limit to 2MB (Spline library is large)
    rollupOptions: {
      output: {
        manualChunks: {
          'spline': ['@splinetool/react-spline'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
