import { Monitor, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { useTheme, type ThemePreference } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

const themeOptions: {
  value: ThemePreference
  label: string
  description: string
  icon: typeof Sun
}[] = [
  {
    value: "light",
    label: "Claro",
    description: "Fundo claro em todo o sistema",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Reduz o brilho em ambientes com pouca luz",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistema",
    description: "Segue a preferência do seu dispositivo",
    icon: Monitor,
  },
]

export function AparenciaTab() {
  const { theme, setTheme } = useTheme()

  const handleSelect = (value: ThemePreference) => {
    setTheme(value)
    toast.success("Tema atualizado com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground">Tema</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha como o AD Gestão deve ser exibido. Sua preferência é salva
            automaticamente neste dispositivo.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isActive = theme === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">
                  {option.label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Tema atual:{" "}
        <span className="font-medium text-foreground">
          {themeOptions.find((option) => option.value === theme)?.label}
        </span>
      </div>
    </div>
  )
}
