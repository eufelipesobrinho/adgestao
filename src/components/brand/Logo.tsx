import { cva, type VariantProps } from "class-variance-authority"

import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

const logoVariants = cva("w-auto shrink-0 object-contain", {
  variants: {
    size: {
      sm: "h-12 max-w-[160px]",
      md: "h-16 max-w-[220px]",
      lg: "h-20 max-w-[280px]",
      xl: "h-24 max-w-[320px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type LogoSurface = "login" | "app" | "print"

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string
  /** login: JPG claro; app: PNG transparente por tema; print: PNG claro */
  surface?: LogoSurface
}

const LOGO_SRC = {
  login: "/assets/logo-contabs-light-mode.jpg",
  light: "/assets/logo-contabs-transparent-light.png",
  dark: "/assets/logo-contabs-transparent-dark.png",
} as const

export function Logo({ size, className, surface = "app" }: LogoProps) {
  const { resolvedTheme } = useTheme()

  const src =
    surface === "login"
      ? LOGO_SRC.login
      : surface === "print"
        ? LOGO_SRC.light
        : resolvedTheme === "dark"
          ? LOGO_SRC.dark
          : LOGO_SRC.light

  const alt =
    surface === "login" || surface === "print"
      ? "Contabs - Instituições Religiosas"
      : "Contabs"

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        logoVariants({ size }),
        surface === "login" && "rounded-md",
        className
      )}
    />
  )
}
