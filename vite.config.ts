import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // align with backend CORS allowlist
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://clubapplicationplatform-server.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
