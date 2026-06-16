import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "ad-gestao-pwa-dismissed"

export function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "true") return

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleInstalled = () => {
      setIsVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsVisible(false)
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true")
    setIsVisible(false)
    setDeferredPrompt(null)
  }

  if (!isVisible || !deferredPrompt) return null

  return (
    <div className="no-print fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 shadow-lg md:left-auto md:right-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">Instalar AD Gestão</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione o app à tela inicial para acesso rápido, como um aplicativo
            nativo.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={handleInstall}>
              Instalar aplicação
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              Agora não
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
          aria-label="Fechar aviso de instalação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
