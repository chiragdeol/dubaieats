import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api/google-places": {
        target: "https://places.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-places/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const key = process.env.VITE_GOOGLE_PLACES_API_KEY;
            if (key) proxyReq.setHeader("X-Goog-Api-Key", key);
          });
        },
      },
      "/api/google-maps": {
        target: "https://maps.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-maps/, ""),
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    react(),
  ],
});
