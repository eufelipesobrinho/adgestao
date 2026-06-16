import { supabase } from "@/lib/supabase"
import { getCurrentMonthRange } from "@/lib/dates"
import type { Transacao } from "@/types/transacao"

export interface DashboardStats {
  membrosAtivos: number
  entradasMes: number
  saidasMes: number
  saldoAtual: number
  atividadesRecentes: Transacao[]
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { start, end } = getCurrentMonthRange()

  const [
    membrosResult,
    entradasMesResult,
    saidasMesResult,
    entradasTotalResult,
    saidasTotalResult,
    recentesResult,
  ] = await Promise.all([
    supabase
      .from("membros")
      .select("id", { count: "exact", head: true })
      .eq("status_dizimo", "Ativo"),
    supabase
      .from("transacoes")
      .select("valor")
      .eq("tipo", "Entrada")
      .gte("data_transacao", start)
      .lte("data_transacao", end),
    supabase
      .from("transacoes")
      .select("valor")
      .eq("tipo", "Saída")
      .gte("data_transacao", start)
      .lte("data_transacao", end),
    supabase.from("transacoes").select("valor").eq("tipo", "Entrada"),
    supabase.from("transacoes").select("valor").eq("tipo", "Saída"),
    supabase
      .from("transacoes")
      .select("*")
      .order("data_transacao", { ascending: false })
      .limit(5),
  ])

  if (membrosResult.error) throw membrosResult.error
  if (entradasMesResult.error) throw entradasMesResult.error
  if (saidasMesResult.error) throw saidasMesResult.error
  if (entradasTotalResult.error) throw entradasTotalResult.error
  if (saidasTotalResult.error) throw saidasTotalResult.error
  if (recentesResult.error) throw recentesResult.error

  const sumValues = (rows: { valor: number }[] | null) =>
    (rows ?? []).reduce((acc, row) => acc + Number(row.valor), 0)

  const entradasMes = sumValues(entradasMesResult.data)
  const saidasMes = sumValues(saidasMesResult.data)
  const entradasTotal = sumValues(entradasTotalResult.data)
  const saidasTotal = sumValues(saidasTotalResult.data)

  return {
    membrosAtivos: membrosResult.count ?? 0,
    entradasMes,
    saidasMes,
    saldoAtual: entradasTotal - saidasTotal,
    atividadesRecentes: (recentesResult.data ?? []) as Transacao[],
  }
}
