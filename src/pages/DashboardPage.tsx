import { useCallback, useEffect, useState } from "react"
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
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { formatCurrency, formatDateBR } from "@/lib/dates"
import {
  fetchDashboardStats,
  type DashboardStats,
} from "@/services/dashboard"
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

function formatToday(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

function CardSkeleton() {
  return (
    <div className="flex h-10 items-center">
      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const today = formatToday()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const loadStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchDashboardStats()
      setStats(data)
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const summaryCards = [
    {
      title: "Membros Ativos",
      value: stats ? String(stats.membrosAtivos) : "—",
      subtitle: undefined,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Entradas do Mês",
      value: stats ? formatCurrency(stats.entradasMes) : "—",
      subtitle: "Dízimos & Ofertas",
      icon: ArrowUpRight,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Saídas do Mês",
      value: stats ? formatCurrency(stats.saidasMes) : "—",
      subtitle: "Despesas operacionais",
      icon: ArrowDownRight,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    {
      title: "Saldo Atual",
      value: stats ? formatCurrency(stats.saldoAtual) : "—",
      subtitle: "Atualizado hoje",
      icon: Landmark,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
  ]

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
              {isLoading ? (
                <CardSkeleton />
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                  {card.subtitle && (
                    <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
                  )}
                </>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : !stats?.atividadesRecentes.length ? (
            <div className="py-16 text-center text-slate-500">
              Nenhuma transação registrada ainda.
            </div>
          ) : (
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
                {stats.atividadesRecentes.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.descricao ?? "—"}
                    </TableCell>
                    <TableCell>{activity.tipo}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        activity.tipo === "Entrada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {activity.tipo === "Entrada" ? "+" : "-"}
                      {formatCurrency(Number(activity.valor))}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatDateBR(activity.data_transacao)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
