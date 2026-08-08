import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"
import { registerSW } from "virtual:pwa-register"
import { AuthProvider } from "@/contexts/AuthContext"
import { PrivacyProvider } from "@/contexts/PrivacyContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { router } from "@/routes"
import "@/index.css"

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    // Força checagem de nova versão do service worker (ícones/manifesto)
    registration?.update()
    window.setInterval(() => {
      registration?.update()
    }, 60 * 60 * 1000)
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PrivacyProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </PrivacyProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
