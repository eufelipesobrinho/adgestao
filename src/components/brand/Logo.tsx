import { cva, type VariantProps } from "class-variance-authority"

import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

const logoVariants = cva("w-auto shrink-0 object-contain", {
  variants: {
    size: {
      sm: "h-14 max-w-[200px]",
      md: "h-20 max-w-[280px]",
      lg: "h-28 max-w-[360px]",
      xl: "h-36 max-w-[440px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type LogoSurface = "app" | "print"

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string
  /** app: PNG transparente por tema; print: PNG claro (papel) */
  surface?: LogoSurface
}

const LOGO_SRC = {
  light: "/assets/logo-contabs-transparent-light.png",
  dark: "/assets/logo-contabs-transparent-dark.png",
} as const

export function Logo({ size, className, surface = "app" }: LogoProps) {
  const { resolvedTheme } = useTheme()

  const src =
    surface === "print"
      ? LOGO_SRC.light
      : resolvedTheme === "dark"
        ? LOGO_SRC.dark
        : LOGO_SRC.light

  const alt =
    surface === "print"
      ? "Contabs - Instituições Religiosas"
      : "Contabs"

  return (
    <img
      src={src}
      alt={alt}
      className={cn(logoVariants({ size }), className)}
    />
  )
}
