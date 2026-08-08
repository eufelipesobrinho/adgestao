import { Menu, PanelTop } from "lucide-react"
import { toast } from "sonner"
import { useNavStyle, type NavStyle } from "@/contexts/NavStyleContext"
import { cn } from "@/lib/utils"

const options: {
  value: NavStyle
  label: string
  description: string
  icon: typeof Menu
}[] = [
  {
    value: "sidebar",
    label: "Menu Hambúrguer (Lateral)",
    description:
      "Menu lateral no desktop e ícone de hambúrguer no celular — padrão clássico.",
    icon: Menu,
  },
  {
    value: "top",
    label: "Menu Horizontal no Topo",
    description:
      "Abas/pílulas com scroll horizontal no topo, em qualquer tamanho de tela.",
    icon: PanelTop,
  },
]

export function NavegacaoTab() {
  const { navStyle, setNavStyle } = useNavStyle()

  const handleSelect = (value: NavStyle) => {
    setNavStyle(value)
    toast.success("Estilo de navegação atualizado!")
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground">
            Estilo de navegação
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha como deseja navegar entre as páginas do Contabs. A preferência
            é salva neste dispositivo.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon
            const isActive = navStyle === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex h-10 w-10 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{option.label}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
