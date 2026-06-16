import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/adgestao.jpg"
      alt="Logo AD Gestão"
      className={cn("h-8 w-auto object-contain rounded-md", className)}
    />
  )
}
