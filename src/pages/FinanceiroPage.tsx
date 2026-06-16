import { useState } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { AddTransacaoDialog } from "@/components/financeiro/AddTransacaoDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FinanceiroPage() {
  const [entradaOpen, setEntradaOpen] = useState(false)
  const [saidaOpen, setSaidaOpen] = useState(false)

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lançamentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
            Nenhum lançamento registrado ainda. Use os botões acima para
            adicionar entradas ou saídas.
          </div>
        </CardContent>
      </Card>

      <AddTransacaoDialog
        open={entradaOpen}
        onOpenChange={setEntradaOpen}
        tipo="entrada"
      />
      <AddTransacaoDialog
        open={saidaOpen}
        onOpenChange={setSaidaOpen}
        tipo="saida"
      />
    </div>
  )
}
