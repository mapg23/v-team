import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // port: process.env.USER_CLIENT_PORT || 5174
    watch: {
      usePolling: true,
    },
    port: 5174,

    proxy: {
      "/api": {
        target: "http://api:9091",
        changeOrigin: true
      },

      "/socket.io": {
        target: "http://api:9091",
        ws: false,
        changeOrigin: true,
      }
    },

    allowedHosts: [
      "localhost",
      ".ngrok-free.app"
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },

})
