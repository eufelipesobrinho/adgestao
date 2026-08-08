import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, Printer } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/brand/Logo"
import { MonthNavigator } from "@/components/financeiro/MonthNavigator"
import { MobileCard, MobileDetailRow } from "@/components/mobile/mobile-list"
import {
  SensitiveText,
  SensitiveValue,
} from "@/components/privacy/SensitiveValue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/ui/motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateBR, getMonthLabel, getMonthRange } from "@/lib/dates"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { getCurrencyColorClass } from "@/lib/finance-ui"
import { processarRelatorioMensal } from "@/lib/relatorio"
import { fetchRelatorioMensal } from "@/services/relatorios"
import type { Departamento } from "@/types/departamento"
import type { Transacao } from "@/types/transacao"

function formatGeneratedAt(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())
}

function getDepartamentoLabel(transacao: Transacao): string {
  if (!transacao.departamento_id) return "Caixa Geral"
  return transacao.departamentos?.nome ?? "Departamento"
}

export function RelatoriosPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRelatorio = useCallback(async () => {
    setIsLoading(true)
    try {
      const { start, end } = getMonthRange(month, year)
      const data = await fetchRelatorioMensal(start, end)
      setTransacoes(data.transacoes)
      setDepartamentos(data.departamentos)
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    loadRelatorio()
  }, [loadRelatorio])

  const relatorio = useMemo(
    () => processarRelatorioMensal(transacoes, departamentos),
    [transacoes, departamentos]
  )

  const periodoLabel = getMonthLabel(month, year)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="print:hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Relatório Financeiro Mensal
            </h1>
            <p className="mt-1 text-muted-foreground">
              Dossiê executivo para prestação de contas ao Pastor
            </p>
          </div>
          <Button onClick={handlePrint} className="shrink-0">
            <Printer className="h-4 w-4" />
            Imprimir Relatório
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="print:hidden">
          <MonthNavigator
            month={month}
            year={year}
            onChange={(newMonth, newYear) => {
              setMonth(newMonth)
              setYear(newYear)
            }}
          />
        </div>
      </FadeIn>

      <div className="relatorio-document mx-auto max-w-5xl space-y-8 rounded-xl border border-border bg-card p-6 shadow-sm md:p-10 print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none print:text-slate-900">
        <header className="border-b border-border pb-6 print:break-inside-avoid">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Logo size="lg" className="print:hidden" />
            <Logo
              size="lg"
              surface="print"
              className="hidden print:block print:h-20"
            />
            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Prestação de Contas
              </p>
              <h2 className="mt-1 text-xl font-bold capitalize text-foreground md:text-2xl">
                {periodoLabel}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerado em {formatGeneratedAt()}
              </p>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 print:hidden">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <section className="print:break-inside-avoid">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Destaques — Caixa Geral
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border shadow-none print:border print:shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total de Entradas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-2xl font-bold ${getCurrencyColorClass("entrada")}`}
                    >
                      <SensitiveValue>
                        {formatCurrency(relatorio.caixaGeral.totalEntradas)}
                      </SensitiveValue>
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none print:border print:shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total de Saídas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-2xl font-bold ${getCurrencyColorClass("saida")}`}
                    >
                      <SensitiveValue>
                        {formatCurrency(relatorio.caixaGeral.totalSaidas)}
                      </SensitiveValue>
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-none print:border print:shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Saldo Final do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-2xl font-bold ${getCurrencyColorClass(
                        "saldo",
                        relatorio.caixaGeral.saldoFinal
                      )}`}
                    >
                      <SensitiveValue>
                        {formatCurrency(relatorio.caixaGeral.saldoFinal)}
                      </SensitiveValue>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {!relatorio.hasMovimentacoes ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/50 py-16 text-center print:break-inside-avoid print:border-solid print:bg-white">
                <p className="text-base font-medium text-foreground">
                  Nenhuma movimentação registrada neste período.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Selecione outro mês ou registre transações no módulo Financeiro.
                </p>
              </div>
            ) : (
              <>
                <section className="print:break-inside-avoid">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Resumo de Departamentos
                  </h3>
                  {relatorio.departamentos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum departamento cadastrado.
                    </p>
                  ) : (
                    <>
                      <div className="hidden w-full overflow-x-auto md:block print:block">
                        <Table className="print:text-sm">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Departamento</TableHead>
                              <TableHead className="text-right">
                                Total Arrecadado
                              </TableHead>
                              <TableHead className="text-right">Total Gasto</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {relatorio.departamentos.map((dep) => (
                              <TableRow key={dep.id}>
                                <TableCell className="font-medium">{dep.nome}</TableCell>
                                <TableCell
                                  className={`text-right font-medium ${getCurrencyColorClass("entrada")}`}
                                >
                                  <SensitiveValue>
                                    {formatCurrency(dep.totalArrecadado)}
                                  </SensitiveValue>
                                </TableCell>
                                <TableCell
                                  className={`text-right font-medium ${getCurrencyColorClass("saida")}`}
                                >
                                  <SensitiveValue>
                                    {formatCurrency(dep.totalGasto)}
                                  </SensitiveValue>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex flex-col gap-3 md:hidden print:hidden">
                        {relatorio.departamentos.map((dep) => (
                          <MobileCard key={dep.id}>
                            <p className="text-base font-semibold text-foreground">
                              {dep.nome}
                            </p>
                            <div className="mt-3 space-y-2 border-t border-border pt-3">
                              <MobileDetailRow label="Arrecadado">
                                <span className={getCurrencyColorClass("entrada")}>
                                  <SensitiveValue>
                                    {formatCurrency(dep.totalArrecadado)}
                                  </SensitiveValue>
                                </span>
                              </MobileDetailRow>
                              <MobileDetailRow label="Gasto">
                                <span className={getCurrencyColorClass("saida")}>
                                  <SensitiveValue>
                                    {formatCurrency(dep.totalGasto)}
                                  </SensitiveValue>
                                </span>
                              </MobileDetailRow>
                            </div>
                          </MobileCard>
                        ))}
                      </div>
                    </>
                  )}
                </section>

                <section>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Detalhamento de Transações
                  </h3>
                  <>
                    <div className="hidden w-full overflow-x-auto md:block print:block">
                      <Table className="print:text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dia</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Departamento</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorio.transacoesCronologicas.map((transacao) => (
                            <TableRow key={transacao.id}>
                              <TableCell className="whitespace-nowrap text-muted-foreground">
                                {formatDateBR(transacao.data_transacao)}
                              </TableCell>
                              <TableCell>{transacao.tipo}</TableCell>
                              <TableCell className="max-w-[200px] truncate sm:max-w-none">
                                <SensitiveText>
                                  {transacao.descricao ?? "—"}
                                </SensitiveText>
                              </TableCell>
                              <TableCell>{getDepartamentoLabel(transacao)}</TableCell>
                              <TableCell
                                className={`text-right font-medium whitespace-nowrap ${getCurrencyColorClass(
                                  transacao.tipo === "Entrada" ? "entrada" : "saida"
                                )}`}
                              >
                                <SensitiveValue
                                  prefix={transacao.tipo === "Entrada" ? "+" : "-"}
                                >
                                  {formatCurrency(Number(transacao.valor))}
                                </SensitiveValue>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex flex-col gap-3 md:hidden print:hidden">
                      {relatorio.transacoesCronologicas.map((transacao) => (
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
                            <MobileDetailRow label="Data">
                              {formatDateBR(transacao.data_transacao)}
                            </MobileDetailRow>
                            <MobileDetailRow label="Tipo">{transacao.tipo}</MobileDetailRow>
                            <MobileDetailRow label="Departamento">
                              {getDepartamentoLabel(transacao)}
                            </MobileDetailRow>
                          </div>
                        </MobileCard>
                      ))}
                    </div>
                  </>
                </section>
              </>
            )}

            <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground print:break-inside-avoid">
              Documento gerado automaticamente pelo Contabs — uso exclusivo para
              prestação de contas interna.
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
