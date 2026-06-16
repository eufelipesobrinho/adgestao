export type MembroStatus = "Ativo" | "Inadimplente"

export interface Membro {
  id: string
  igreja_id: string
  nome: string
  email: string | null
  telefone: string | null
  endereco: string | null
  data_nascimento: string | null
  status: MembroStatus
  created_at: string
}

export interface MembroFormData {
  nome: string
  email: string
  telefone: string
  endereco: string
  data_nascimento: string
  status: MembroStatus
}

export const MEMBRO_STATUS_OPTIONS: MembroStatus[] = ["Ativo", "Inadimplente"]
