import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Fixed port
    proxy: {
      '/api': 'http://localhost:5000' // Connect to backend
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Absolute imports
    }
  }
});