import { supabase } from "@/lib/supabase"
import type { Membro, MembroFormData } from "@/types/membro"

export async function fetchMembros(): Promise<Membro[]> {
  const { data, error } = await supabase
    .from("membros")
    .select("*")
    .order("data_cadastro", { ascending: false })

  if (error) throw error
  return (data ?? []) as Membro[]
}

export async function fetchMembrosOptions(): Promise<
  Pick<Membro, "id" | "nome">[]
> {
  const { data, error } = await supabase
    .from("membros")
    .select("id, nome")
    .order("nome", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createMembro(
  formData: MembroFormData,
  igrejaId: string
): Promise<Membro> {
  const { data, error } = await supabase
    .from("membros")
    .insert({
      igreja_id: igrejaId,
      nome: formData.nome.trim(),
      email: formData.email.trim() || null,
      telefone: formData.telefone.trim() || null,
      endereco: formData.endereco.trim() || null,
      data_nascimento: formData.data_nascimento || null,
      status_dizimo: formData.status_dizimo,
    })
    .select()
    .single()

  if (error) throw error
  return data as Membro
}

export async function updateMembro(
  id: string,
  formData: MembroFormData
): Promise<Membro> {
  const { data, error } = await supabase
    .from("membros")
    .update({
      nome: formData.nome.trim(),
      email: formData.email.trim() || null,
      telefone: formData.telefone.trim() || null,
      endereco: formData.endereco.trim() || null,
      data_nascimento: formData.data_nascimento || null,
      status_dizimo: formData.status_dizimo,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Membro
}

export async function deleteMembro(id: string): Promise<void> {
  const { error } = await supabase.from("membros").delete().eq("id", id)
  if (error) throw error
}

export function membroToFormData(membro: Membro): MembroFormData {
  const dataNascimento = membro.data_nascimento
    ? membro.data_nascimento.split("T")[0]
    : ""

  return {
    nome: membro.nome,
    email: membro.email ?? "",
    telefone: membro.telefone ?? "",
    endereco: membro.endereco ?? "",
    data_nascimento: dataNascimento,
    status_dizimo: membro.status_dizimo,
  }
}
