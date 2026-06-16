import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"
import { registerSW } from "virtual:pwa-register"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { router } from "@/routes"
import "@/index.css"

registerSW({ immediate: true })

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
