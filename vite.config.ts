import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

/** Incrementar este valor força refresh de manifesto/ícones em PWAs instaladas */
const PWA_ASSET_VERSION = "v20260813"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: `manifest-${PWA_ASSET_VERSION}.webmanifest`,
      includeAssets: [
        "assets/logo-contabs-final.jpg",
        "assets/logo-contabs-light-mode.jpg",
        "assets/logo-contabs-dark-mode.jpg",
        "assets/logo-contabs-transparent-light.png",
        "assets/logo-contabs-transparent-dark.png",
      ],
      manifest: {
        id: `/?homescreen=contabs-${PWA_ASSET_VERSION}`,
        name: "Contabs",
        short_name: "Contabs",
        description:
          "Sistema de gestão financeira e de secretaria para instituições religiosas",
        theme_color: "#001F3F",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/dashboard",
        scope: "/",
        lang: "pt-BR",
        icons: [
          {
            src: "/assets/logo-contabs-final.jpg",
            sizes: "192x192",
            type: "image/jpeg",
            purpose: "any maskable",
          },
          {
            src: "/assets/logo-contabs-final.jpg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2,webmanifest}",
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: "/index.html",
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
