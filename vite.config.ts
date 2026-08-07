import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "pwa-icon.svg",
        "assets/logo-contabs-light-mode.jpg",
        "assets/logo-contabs-dark-mode.jpg",
        "assets/logo-contabs-transparent-light.png",
        "assets/logo-contabs-transparent-dark.png",
      ],
      manifest: {
        name: "Contabs - Instituições Religiosas",
        short_name: "Contabs",
        description:
          "Sistema de gestão financeira e de secretaria para instituições religiosas",
        theme_color: "#001F3F",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/dashboard",
        icons: [
          {
            src: "/pwa-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/pwa-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
          {
            src: "/assets/logo-contabs-light-mode.jpg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any",
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
