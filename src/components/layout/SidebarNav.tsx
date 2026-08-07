import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Wallet,
  Building2,
  FileText,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/membros", label: "Membros", icon: Users },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/departamentos", label: "Departamentos", icon: Building2 },
  { to: "/relatorios", label: "Relatórios", icon: FileText },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
]

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
