import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.USER_CLIENT_PORT || 5174,
    hmr: {
      clientPort: process.env.USER_CLIENT_PORT || 5174
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },

})
