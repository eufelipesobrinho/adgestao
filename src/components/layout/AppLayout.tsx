import { useState } from "react"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Loader2, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Logo } from "@/components/brand/Logo"
import { SidebarNav } from "@/components/layout/SidebarNav"
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
    <div className="border-t border-slate-800 p-3">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <LogOut className="h-5 w-5 shrink-0" />
        Sair
      </button>
    </div>
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    setIsSigningOut(true)
    await signOut()
    setMobileOpen(false)
    navigate("/login", { replace: true })
    setIsSigningOut(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background print:bg-white">
      <aside className="no-print hidden w-64 shrink-0 flex-col bg-slate-900 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Logo size="md" />
        </div>
        <div className="flex-1 py-6">
          <SidebarNav />
        </div>
        <SidebarFooter onLogout={handleLogout} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="no-print flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div className="flex items-center">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-64 flex-col bg-slate-900 p-0">
                <SheetHeader className="border-b border-slate-800 px-6 py-4">
                  <SheetTitle className="text-left">
                    <Logo size="md" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 py-6">
                  <SidebarNav onNavigate={() => setMobileOpen(false)} />
                </div>
                <SidebarFooter onLogout={handleLogout} />
              </SheetContent>
            </Sheet>
            <Logo size="sm" className="ml-3" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="text-slate-600"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
