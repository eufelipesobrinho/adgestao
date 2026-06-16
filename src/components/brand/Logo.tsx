import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const logoVariants = cva("w-auto object-contain rounded-md", {
  variants: {
    size: {
      sm: "h-8 max-w-[120px]",
      md: "h-10 max-w-[150px]",
      lg: "h-12 max-w-[180px]",
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
      alt="Logo AD Gestão"
      className={cn(logoVariants({ size }), className)}
    />
  )
}
