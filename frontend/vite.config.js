import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      // For GitHub Codespaces
      clientPort: 443,
      host: process.env.CODESPACE_NAME ? `${process.env.CODESPACE_NAME}-5173.app.github.dev` : 'localhost'
    },
    // Allow connections from all origins
    cors: true,
    // Listen on all interfaces
    host: '0.0.0.0',
    // Use port 5173 by default
    port: 5173
  }
})