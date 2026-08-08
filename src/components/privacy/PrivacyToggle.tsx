import { Eye, EyeOff } from "lucide-react"
import { usePrivacy } from "@/contexts/PrivacyContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PrivacyToggleProps {
  className?: string
}

export function PrivacyToggle({ className }: PrivacyToggleProps) {
  const { valuesHidden, toggleValuesHidden } = usePrivacy()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleValuesHidden}
      aria-label={valuesHidden ? "Exibir valores financeiros" : "Ocultar valores financeiros"}
      title={valuesHidden ? "Exibir valores" : "Ocultar valores"}
      className={cn("no-print shrink-0", className)}
    >
      {valuesHidden ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  )
}
