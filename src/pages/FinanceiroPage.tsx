import { useCallback, useEffect, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { formatCurrency, formatDateBR, getMonthRange } from "@/lib/dates"
import { fetchTransacoesByMonth } from "@/services/transacoes"
import type { Transacao } from "@/types/transacao"
import { AddEntradaDialog } from "@/components/financeiro/AddEntradaDialog"
import { AddSaidaDialog } from "@/components/financeiro/AddSaidaDialog"
import { MonthNavigator } from "@/components/financeiro/MonthNavigator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function FinanceiroPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [entradaOpen, setEntradaOpen] = useState(false)
  const [saidaOpen, setSaidaOpen] = useState(false)

  const loadTransacoes = useCallback(async () => {
    setIsLoading(true)
    try {
      const { start, end } = getMonthRange(month, year)
      const data = await fetchTransacoesByMonth(start, end)
      setTransacoes(data)
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    loadTransacoes()
  }, [loadTransacoes])

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  const totalEntradas = transacoes
    .filter((t) => t.tipo === "Entrada")
    .reduce((acc, t) => acc + Number(t.valor), 0)

  const totalSaidas = transacoes
    .filter((t) => t.tipo === "Saída")
    .reduce((acc, t) => acc + Number(t.valor), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Financeiro
          </h1>
          <p className="mt-1 text-slate-500">
            Controle entradas, saídas e o fluxo de caixa da igreja
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="gold" onClick={() => setEntradaOpen(true)}>
            <ArrowUpRight className="h-4 w-4" />
            Nova Entrada
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => setSaidaOpen(true)}
          >
            <ArrowDownRight className="h-4 w-4" />
            Nova Saída
          </Button>
        </div>
      </div>

      <MonthNavigator month={month} year={year} onChange={handleMonthChange} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Entradas do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalEntradas)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Saídas do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalSaidas)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Movimentações do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : transacoes.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Nenhuma movimentação neste período.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Membro</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoes.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell className="font-medium">
                      {transacao.descricao ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transacao.tipo === "Entrada" ? "success" : "destructive"
                        }
                      >
                        {transacao.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transacao.membros?.nome ?? "—"}
                    </TableCell>
                    <TableCell>
                      {transacao.departamentos?.nome ?? "—"}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transacao.tipo === "Entrada"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transacao.tipo === "Entrada" ? "+" : "-"}
                      {formatCurrency(Number(transacao.valor))}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {formatDateBR(transacao.data_transacao)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddEntradaDialog
        open={entradaOpen}
        onOpenChange={setEntradaOpen}
        onSuccess={loadTransacoes}
      />
      <AddSaidaDialog
        open={saidaOpen}
        onOpenChange={setSaidaOpen}
        onSuccess={loadTransacoes}
      />
    </div>
  )
}
