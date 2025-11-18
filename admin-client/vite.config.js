import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    port: process.env.ADMIN_CLIENT_PORT || 5173,
    hmr: {
      clientPort: process.env.ADMIN_CLIENT_PORT || 5173
    }
  }
})
