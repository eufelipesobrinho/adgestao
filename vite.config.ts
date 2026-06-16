import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["adgestao.jpg"],
      manifest: {
        name: "AD Gestão",
        short_name: "AD Gestão",
        description: "Sistema de Gestão Inteligente para Igrejas",
        theme_color: "#0f172a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/adgestao.jpg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/adgestao.jpg",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
