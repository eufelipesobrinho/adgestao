import { useCallback, useEffect, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { formatCurrency, formatDateBR, getMonthRange } from "@/lib/dates"
import { fetchTransacoesByMonth } from "@/services/transacoes"
import type { Transacao } from "@/types/transacao"
import { AddEntradaSheet } from "@/components/financeiro/AddEntradaSheet"
import { AddSaidaSheet } from "@/components/financeiro/AddSaidaSheet"
import { MonthNavigator } from "@/components/financeiro/MonthNavigator"
import { TransacaoDestinoBadge } from "@/components/financeiro/TransacaoDestinoBadge"
import { MobileCard, MobileDetailRow } from "@/components/mobile/mobile-list"
import { getCurrencyColorClass } from "@/lib/finance-ui"
import { PrivacyToggle } from "@/components/privacy/PrivacyToggle"
import {
  SensitiveText,
  SensitiveValue,
} from "@/components/privacy/SensitiveValue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, AnimatedTableRow } from "@/components/ui/motion"
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Table, TableBody } from "@/components/ui/table"

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
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Financeiro
            </h1>
            <p className="mt-1 text-muted-foreground">
              Controle entradas, saídas e o fluxo de caixa da igreja
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrivacyToggle />
            <Button variant="gold" onClick={() => setEntradaOpen(true)}>
              <ArrowUpRight className="h-4 w-4" />
              Nova Entrada
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
              onClick={() => setSaidaOpen(true)}
            >
              <ArrowDownRight className="h-4 w-4" />
              Nova Saída
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <MonthNavigator month={month} year={year} onChange={handleMonthChange} />
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FadeIn delay={0.1}>
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entradas do Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <p className={`text-2xl font-bold ${getCurrencyColorClass("entrada")}`}>
                  <SensitiveValue>{formatCurrency(totalEntradas)}</SensitiveValue>
                </p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saídas do Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <p className={`text-2xl font-bold ${getCurrencyColorClass("saida")}`}>
                  <SensitiveValue>{formatCurrency(totalSaidas)}</SensitiveValue>
                </p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Movimentações do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : transacoes.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                Nenhuma movimentação neste período.
              </div>
            ) : (
              <>
                <div className="hidden w-full overflow-x-auto md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Membro</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transacoes.map((transacao, index) => (
                        <AnimatedTableRow key={transacao.id} index={index}>
                          <TableCell className="font-medium">
                            <SensitiveText>
                              {transacao.descricao ?? "—"}
                            </SensitiveText>
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
                            <TransacaoDestinoBadge transacao={transacao} />
                          </TableCell>
                          <TableCell>{transacao.membros?.nome ?? "—"}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${getCurrencyColorClass(
                              transacao.tipo === "Entrada" ? "entrada" : "saida"
                            )}`}
                          >
                            <SensitiveValue
                              prefix={transacao.tipo === "Entrada" ? "+" : "-"}
                            >
                              {formatCurrency(Number(transacao.valor))}
                            </SensitiveValue>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatDateBR(transacao.data_transacao)}
                          </TableCell>
                        </AnimatedTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col gap-3 md:hidden">
                  {transacoes.map((transacao) => (
                    <MobileCard key={transacao.id}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 flex-1 text-base font-semibold leading-snug text-foreground">
                          <SensitiveText>
                            {transacao.descricao ?? "—"}
                          </SensitiveText>
                        </p>
                        <p
                          className={`shrink-0 text-lg font-bold ${getCurrencyColorClass(
                            transacao.tipo === "Entrada" ? "entrada" : "saida"
                          )}`}
                        >
                          <SensitiveValue
                            prefix={transacao.tipo === "Entrada" ? "+" : "-"}
                          >
                            {formatCurrency(Number(transacao.valor))}
                          </SensitiveValue>
                        </p>
                      </div>
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        <MobileDetailRow label="Tipo">
                          <Badge
                            variant={
                              transacao.tipo === "Entrada" ? "success" : "destructive"
                            }
                          >
                            {transacao.tipo}
                          </Badge>
                        </MobileDetailRow>
                        <MobileDetailRow label="Destino">
                          <TransacaoDestinoBadge transacao={transacao} />
                        </MobileDetailRow>
                        <MobileDetailRow label="Membro">
                          {transacao.membros?.nome ?? "—"}
                        </MobileDetailRow>
                        <MobileDetailRow label="Data">
                          {formatDateBR(transacao.data_transacao)}
                        </MobileDetailRow>
                      </div>
                    </MobileCard>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <AddEntradaSheet
        open={entradaOpen}
        onOpenChange={setEntradaOpen}
        onSuccess={loadTransacoes}
      />
      <AddSaidaSheet
        open={saidaOpen}
        onOpenChange={setSaidaOpen}
        onSuccess={loadTransacoes}
      />
    </div>
  )
}
