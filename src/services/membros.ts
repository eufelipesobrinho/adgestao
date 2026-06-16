import { supabase } from "@/lib/supabase"
import type { Membro, MembroFormData } from "@/types/membro"

export async function fetchMembros(): Promise<Membro[]> {
  const { data, error } = await supabase
    .from("membros")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as Membro[]
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
      status: formData.status,
    })
    .select()
    .single()

  if (error) throw error
  return data as Membro
}
