import { useNavigate } from "react-router-dom"
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  ChevronDown,
  UserPlus,
  Plus,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const summaryCards = [
  {
    title: "Membros Ativos",
    value: "248",
    icon: Users,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Entradas do Mês",
    subtitle: "Dízimos & Ofertas",
    value: "R$ 18.450,00",
    icon: ArrowUpRight,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  {
    title: "Saídas do Mês",
    subtitle: "Despesas operacionais",
    value: "R$ 7.230,00",
    icon: ArrowDownRight,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
  },
  {
    title: "Saldo Atual",
    subtitle: "Atualizado hoje",
    value: "R$ 11.220,00",
    icon: Landmark,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
]

const recentActivities = [
  {
    transacao: "Dízimo",
    categoria: "Dízimos",
    valor: "R$ 350,00",
    data: "16/06/2026",
    tipo: "entrada" as const,
  },
  {
    transacao: "Oferta de Missões",
    categoria: "Ofertas",
    valor: "R$ 120,00",
    data: "16/06/2026",
    tipo: "entrada" as const,
  },
  {
    transacao: "Conta de Luz",
    categoria: "Despesas Fixas",
    valor: "R$ 890,00",
    data: "15/06/2026",
    tipo: "saida" as const,
  },
  {
    transacao: "Dízimo",
    categoria: "Dízimos",
    valor: "R$ 500,00",
    data: "15/06/2026",
    tipo: "entrada" as const,
  },
  {
    transacao: "Manutenção do Som",
    categoria: "Manutenção",
    valor: "R$ 450,00",
    data: "14/06/2026",
    tipo: "saida" as const,
  },
  {
    transacao: "Oferta Especial",
    categoria: "Ofertas",
    valor: "R$ 2.300,00",
    data: "14/06/2026",
    tipo: "entrada" as const,
  },
]

function formatToday(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

export function DashboardPage() {
  const navigate = useNavigate()
  const today = formatToday()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Olá, Secretaria 👋
          </h1>
          <p className="mt-1 capitalize text-slate-500">{today}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="gold">
              Novo Registro
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/membros")}>
              <UserPlus className="h-4 w-4" />
              Novo Membro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/financeiro")}>
              <Plus className="h-4 w-4" />
              Nova Entrada
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/financeiro")}>
              <Minus className="h-4 w-4" />
              Nova Saída
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {card.title}
              </CardTitle>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}
              >
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              {card.subtitle && (
                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transação</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {activity.transacao}
                  </TableCell>
                  <TableCell>{activity.categoria}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      activity.tipo === "entrada"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {activity.tipo === "entrada" ? "+" : "-"}
                    {activity.valor}
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {activity.data}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
