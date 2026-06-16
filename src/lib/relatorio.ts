import type { Departamento } from "@/types/departamento"
import type { Transacao } from "@/types/transacao"

export interface CaixaGeralResumo {
  totalEntradas: number
  totalSaidas: number
  saldoFinal: number
}

export interface DepartamentoResumoMensal {
  id: string
  nome: string
  totalArrecadado: number
  totalGasto: number
}

export interface RelatorioProcessado {
  caixaGeral: CaixaGeralResumo
  departamentos: DepartamentoResumoMensal[]
  transacoesCronologicas: Transacao[]
  hasMovimentacoes: boolean
}

export function processarRelatorioMensal(
  transacoes: Transacao[],
  departamentos: Departamento[]
): RelatorioProcessado {
  const caixaGeralEntradas = transacoes
    .filter((t) => t.tipo === "Entrada" && !t.departamento_id)
    .reduce((acc, t) => acc + Number(t.valor), 0)

  const caixaGeralSaidas = transacoes
    .filter((t) => t.tipo === "Saída" && !t.departamento_id)
    .reduce((acc, t) => acc + Number(t.valor), 0)

  const deptMetrics = new Map<string, { arrecadado: number; gasto: number }>()

  for (const transacao of transacoes) {
    if (!transacao.departamento_id) continue

    const current = deptMetrics.get(transacao.departamento_id) ?? {
      arrecadado: 0,
      gasto: 0,
    }

    if (transacao.tipo === "Entrada") {
      current.arrecadado += Number(transacao.valor)
    } else if (transacao.tipo === "Saída") {
      current.gasto += Number(transacao.valor)
    }

    deptMetrics.set(transacao.departamento_id, current)
  }

  const departamentosResumo = departamentos.map((dep) => ({
    id: dep.id,
    nome: dep.nome,
    totalArrecadado: deptMetrics.get(dep.id)?.arrecadado ?? 0,
    totalGasto: deptMetrics.get(dep.id)?.gasto ?? 0,
  }))

  const transacoesCronologicas = [...transacoes].sort((a, b) => {
    const dateCompare = a.data_transacao.localeCompare(b.data_transacao)
    if (dateCompare !== 0) return dateCompare
    return a.id.localeCompare(b.id)
  })

  return {
    caixaGeral: {
      totalEntradas: caixaGeralEntradas,
      totalSaidas: caixaGeralSaidas,
      saldoFinal: caixaGeralEntradas - caixaGeralSaidas,
    },
    departamentos: departamentosResumo,
    transacoesCronologicas,
    hasMovimentacoes: transacoes.length > 0,
  }
}
