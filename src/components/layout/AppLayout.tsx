import { useState } from "react"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Loader2, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Logo } from "@/components/brand/Logo"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { PwaPrompt } from "@/components/pwa/PwaPrompt"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function SidebarFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="border-t border-sidebar-border p-3">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <LogOut className="h-5 w-5 shrink-0" />
        Sair
      </button>
    </div>
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, isPasswordRecovery, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    setIsSigningOut(true)
    await signOut()
    setMobileOpen(false)
    navigate("/", { replace: true })
    setIsSigningOut(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isPasswordRecovery) {
    return <Navigate to="/redefinir-senha" replace />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-background print:bg-white">
      <aside className="no-print hidden w-80 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-32 items-center justify-center border-b border-sidebar-border px-4 py-3">
          <Logo size="lg" />
        </div>
        <div className="flex-1 py-6">
          <SidebarNav />
        </div>
        <SidebarFooter onLogout={handleLogout} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="no-print sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between border-b border-border bg-card px-3 lg:hidden">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-80 flex-col border-sidebar-border bg-sidebar p-0 text-sidebar-foreground [&>button]:text-sidebar-muted [&>button]:hover:text-sidebar-foreground"
              >
                <SheetHeader className="border-b border-sidebar-border px-4 py-4">
                  <SheetTitle className="flex justify-center text-left">
                    <Logo size="lg" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 py-6">
                  <SidebarNav onNavigate={() => setMobileOpen(false)} />
                </div>
                <SidebarFooter onLogout={handleLogout} />
              </SheetContent>
            </Sheet>
            <Logo size="md" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 md:p-8 print:overflow-visible print:p-0">
          <Outlet />
        </main>
        <PwaPrompt />
      </div>
    </div>
  )
}
