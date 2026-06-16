import { supabase } from "@/lib/supabase"
import { parseCurrencyInput } from "@/lib/dates"
import type {
  EntradaFormData,
  SaidaFormData,
  Transacao,
} from "@/types/transacao"

export async function fetchTransacoesByMonth(
  start: string,
  end: string
): Promise<Transacao[]> {
  const { data, error } = await supabase
    .from("transacoes")
    .select(
      "*, membros(nome), departamentos(nome)"
    )
    .gte("data_transacao", start)
    .lte("data_transacao", end)
    .order("data_transacao", { ascending: false })

  if (error) throw error
  return (data ?? []) as Transacao[]
}

export async function createEntrada(
  formData: EntradaFormData,
  igrejaId: string
): Promise<Transacao> {
  const { data, error } = await supabase
    .from("transacoes")
    .insert({
      igreja_id: igrejaId,
      tipo: "Entrada",
      valor: parseCurrencyInput(formData.valor),
      descricao: `[${formData.subtipo}] ${formData.descricao.trim()}`,
      data_transacao: formData.data_transacao,
      membro_id: formData.membro_id || null,
      departamento_id: formData.departamento_id || null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Transacao
}

export async function createSaida(
  formData: SaidaFormData,
  igrejaId: string
): Promise<Transacao> {
  const { data, error } = await supabase
    .from("transacoes")
    .insert({
      igreja_id: igrejaId,
      tipo: "Saída",
      valor: parseCurrencyInput(formData.valor),
      descricao: formData.descricao.trim(),
      data_transacao: formData.data_transacao,
      membro_id: null,
      departamento_id: formData.departamento_id || null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Transacao
}
