import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// npm install -D vite-plugin-pwa
//
// This handles the manifest.json + service worker generation for you —
// no separate public/manifest.json file needed, it's all defined here
// and built at compile time.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "KaziFlow Dashboard",
        short_name: "KaziFlow",
        description: "Manage your KaziFlow store — products, orders, and settings.",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#0a0f1a",
        theme_color: "#0a0f1a",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Cache dashboard shell + assets so it opens instantly even on
        // a flaky connection — Supabase calls still go over the
        // network as normal, this just caches the app itself.
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
