import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "components": path.resolve(__dirname, "src/components"),
      "views": path.resolve(__dirname, "src/views"), 
      "config": path.resolve(__dirname, "src/config"), 
      "services": path.resolve(__dirname, "src/services"), 
      // Lägga till flera paths med samma syntax
    }},
    server: {
      host: "0.0.0.0",
      port: process.env.ADMIN_CLIENT_PORT || 5173,
      hmr: {
        clientPort: process.env.ADMIN_CLIENT_PORT || 5173,
      },
    },
});
