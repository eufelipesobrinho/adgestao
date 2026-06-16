import { motion } from "framer-motion"
import {
  ArrowDownRight,
  ArrowUpRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import { formatCurrency } from "@/lib/dates"
import { getCurrencyColorClass } from "@/lib/finance-ui"
import { staggerDelay } from "@/lib/motion"
import type { DepartamentoComMetricas } from "@/types/departamento"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DepartamentoCardProps {
  departamento: DepartamentoComMetricas
  index: number
  onEdit: (departamento: DepartamentoComMetricas) => void
  onDelete: (departamento: DepartamentoComMetricas) => void
}

export function DepartamentoCard({
  departamento,
  index,
  onEdit,
  onDelete,
}: DepartamentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: staggerDelay(index, 0.06) }}
    >
      <Card className="border-slate-200/80 shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {departamento.nome}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-slate-500"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opções do departamento</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(departamento)}>
                <Pencil className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(departamento)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm text-slate-500">
            {departamento.descricao || "Sem descrição cadastrada."}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-50/80 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Total Arrecadado
              </div>
              <p
                className={`mt-1 text-sm font-bold ${getCurrencyColorClass("entrada")}`}
              >
                {formatCurrency(departamento.totalArrecadado)}
              </p>
            </div>
            <div className="rounded-lg bg-red-50/80 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                <ArrowDownRight className="h-3.5 w-3.5" />
                Total Saídas
              </div>
              <p
                className={`mt-1 text-sm font-bold ${getCurrencyColorClass("saida")}`}
              >
                {formatCurrency(departamento.totalSaidas)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
