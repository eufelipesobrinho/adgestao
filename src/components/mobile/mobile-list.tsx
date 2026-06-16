import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function MobileCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick()
            }
          : undefined
      }
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm",
        onClick && "cursor-pointer active:scale-[0.99] transition-transform",
        className
      )}
    >
      {children}
    </div>
  )
}

export function MobileDetailRow({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 text-sm", className)}>
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium text-foreground">{children}</span>
    </div>
  )
}
