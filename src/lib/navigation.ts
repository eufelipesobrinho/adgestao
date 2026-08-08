import {
  LayoutDashboard,
  Users,
  Wallet,
  Building2,
  FileText,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/membros", label: "Membros", icon: Users },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/contas", label: "Contas e Cartões", icon: CreditCard },
  { to: "/departamentos", label: "Departamentos", icon: Building2 },
  { to: "/relatorios", label: "Relatórios", icon: FileText },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
]
