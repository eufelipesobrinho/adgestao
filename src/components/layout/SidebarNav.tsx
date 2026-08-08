import { NavLink } from "react-router-dom"
import { NAV_ITEMS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
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
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
