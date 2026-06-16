import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const logoVariants = cva("w-auto shrink-0 object-contain rounded-md", {
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

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string
}

export function Logo({ size, className }: LogoProps) {
  return (
    <img
      src="/adgestao.jpg"
      alt="AD Gestão"
      className={cn(logoVariants({ size }), className)}
    />
  )
}
