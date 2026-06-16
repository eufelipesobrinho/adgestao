import { supabase } from "@/lib/supabase"
import type {
  Departamento,
  DepartamentoComMetricas,
  DepartamentoFormData,
} from "@/types/departamento"

function aggregateMetricas(
  transacoes: { departamento_id: string | null; tipo: string; valor: number }[]
) {
  const metrics = new Map<string, { entradas: number; saidas: number }>()

  for (const transacao of transacoes) {
    if (!transacao.departamento_id) continue

    const current = metrics.get(transacao.departamento_id) ?? {
      entradas: 0,
      saidas: 0,
    }

    if (transacao.tipo === "Entrada") {
      current.entradas += Number(transacao.valor)
    } else if (transacao.tipo === "Saída") {
      current.saidas += Number(transacao.valor)
    }

    metrics.set(transacao.departamento_id, current)
  }

  return metrics
}

export async function fetchDepartamentos(): Promise<Departamento[]> {
  const { data, error } = await supabase
    .from("departamentos")
    .select("*")
    .order("nome", { ascending: true })

  if (error) throw error
  return (data ?? []) as Departamento[]
}

export async function fetchDepartamentosComMetricas(): Promise<
  DepartamentoComMetricas[]
> {
  const [departamentosResult, transacoesResult] = await Promise.all([
    supabase.from("departamentos").select("*").order("nome", { ascending: true }),
    supabase
      .from("transacoes")
      .select("departamento_id, tipo, valor")
      .not("departamento_id", "is", null),
  ])

  if (departamentosResult.error) throw departamentosResult.error
  if (transacoesResult.error) throw transacoesResult.error

  const metrics = aggregateMetricas(transacoesResult.data ?? [])

  return ((departamentosResult.data ?? []) as Departamento[]).map((dep) => ({
    ...dep,
    totalArrecadado: metrics.get(dep.id)?.entradas ?? 0,
    totalSaidas: metrics.get(dep.id)?.saidas ?? 0,
  }))
}

export async function createDepartamento(
  formData: DepartamentoFormData,
  igrejaId: string
): Promise<Departamento> {
  const { data, error } = await supabase
    .from("departamentos")
    .insert({
      igreja_id: igrejaId,
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Departamento
}

export async function updateDepartamento(
  id: string,
  formData: DepartamentoFormData
): Promise<Departamento> {
  const { data, error } = await supabase
    .from("departamentos")
    .update({
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim() || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Departamento
}

export async function deleteDepartamento(id: string): Promise<void> {
  const { error } = await supabase.from("departamentos").delete().eq("id", id)
  if (error) throw error
}

export function departamentoToFormData(
  departamento: Departamento
): DepartamentoFormData {
  return {
    nome: departamento.nome,
    descricao: departamento.descricao ?? "",
  }
}
