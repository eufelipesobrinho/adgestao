import type { ReactNode } from "react"
import { usePrivacy } from "@/contexts/PrivacyContext"
import { cn } from "@/lib/utils"

interface SensitiveValueProps {
  children: ReactNode
  className?: string
  /** Prefixo opcional (ex: "+" / "-") exibido junto ao valor */
  prefix?: string
}

const MASK = "R$ ••••••"

export function SensitiveValue({
  children,
  className,
  prefix,
}: SensitiveValueProps) {
  const { valuesHidden } = usePrivacy()

  if (!valuesHidden) {
    return (
      <span className={className}>
        {prefix}
        {children}
      </span>
    )
  }

  return (
    <>
      <span
        className={cn(
          "select-none tracking-wider blur-[5px] print:hidden",
          className
        )}
        aria-label="Valor oculto"
      >
        {MASK}
      </span>
      <span className={cn("hidden print:inline", className)}>
        {prefix}
        {children}
      </span>
    </>
  )
}
