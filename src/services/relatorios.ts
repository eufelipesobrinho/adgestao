import { supabase } from "@/lib/supabase"
import type { Departamento } from "@/types/departamento"
import type { Transacao } from "@/types/transacao"

export interface RelatorioMensalData {
  transacoes: Transacao[]
  departamentos: Departamento[]
}

async function getIgrejaId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const igrejaId = session?.user?.id
  if (!igrejaId) {
    throw new Error("Sessão inválida. Faça login novamente.")
  }

  return igrejaId
}

export async function fetchRelatorioMensal(
  start: string,
  end: string
): Promise<RelatorioMensalData> {
  const igrejaId = await getIgrejaId()

  const [transacoesResult, departamentosResult] = await Promise.all([
    supabase
      .from("transacoes")
      .select("*, departamentos(nome)")
      .eq("igreja_id", igrejaId)
      .gte("data_transacao", start)
      .lte("data_transacao", end)
      .order("data_transacao", { ascending: true }),
    supabase
      .from("departamentos")
      .select("*")
      .eq("igreja_id", igrejaId)
      .order("nome", { ascending: true }),
  ])

  if (transacoesResult.error) throw transacoesResult.error
  if (departamentosResult.error) throw departamentosResult.error

  return {
    transacoes: (transacoesResult.data ?? []) as Transacao[],
    departamentos: (departamentosResult.data ?? []) as Departamento[],
  }
}
