export type MembroStatus = "Ativo" | "Inadimplente"

export interface Membro {
  id: string
  igreja_id: string
  nome: string
  email: string | null
  telefone: string | null
  endereco: string | null
  data_nascimento: string | null
  status_dizimo: MembroStatus
  data_cadastro: string
}

export interface MembroFormData {
  nome: string
  email: string
  telefone: string
  endereco: string
  data_nascimento: string
  status_dizimo: MembroStatus
}

export const MEMBRO_STATUS_OPTIONS: MembroStatus[] = ["Ativo", "Inadimplente"]
