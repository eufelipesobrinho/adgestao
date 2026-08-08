import type { ReactNode } from "react"
import { usePrivacy } from "@/contexts/PrivacyContext"
import { cn } from "@/lib/utils"

interface SensitiveProps {
  children: ReactNode
  className?: string
  /** Prefixo opcional (ex: "+" / "-") */
  prefix?: string
}

/** Oculta valores e textos sensíveis com blur (mantém layout; impressão mostra original). */
export function SensitiveValue({ children, className, prefix }: SensitiveProps) {
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
          "inline select-none blur-[6px] print:hidden",
          className
        )}
        aria-label="Conteúdo oculto"
      >
        {prefix}
        {children}
      </span>
      <span className={cn("hidden print:inline", className)}>
        {prefix}
        {children}
      </span>
    </>
  )
}

/** Alias semântico para descrições / rótulos financeiros. */
export function SensitiveText(props: SensitiveProps) {
  return <SensitiveValue {...props} />
}
