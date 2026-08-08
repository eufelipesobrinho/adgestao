import { useEffect, useRef } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { NAV_ITEMS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export function TopNavBar() {
  const location = useLocation()
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    const active = NAV_ITEMS.find(
      (item) =>
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`)
    )
    if (!active) return
    itemRefs.current[active.to]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [location.pathname])

  return (
    <nav
      aria-label="Navegação principal"
      className="no-print sticky top-16 z-30 shrink-0 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:top-14"
    >
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto whitespace-nowrap px-3 py-2.5 sm:px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            ref={(el) => {
              itemRefs.current[item.to] = el
            }}
            className={({ isActive }) =>
              cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                isActive
                  ? "bg-brand font-medium text-brand-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
