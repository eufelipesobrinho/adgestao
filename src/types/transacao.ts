export type TransacaoTipo = "Entrada" | "Saída"
export type EntradaSubtipo = "Dízimo" | "Oferta"

export interface Transacao {
  id: string
  igreja_id: string
  tipo: string
  valor: number
  descricao: string | null
  data_transacao: string
  membro_id: string | null
  departamento_id: string | null
  membros?: { nome: string } | null
  departamentos?: { nome: string } | null
}

export interface EntradaFormData {
  subtipo: EntradaSubtipo
  valor: string
  data_transacao: string
  descricao: string
  membro_id: string
  departamento_id: string
}

export interface SaidaFormData {
  valor: string
  data_transacao: string
  descricao: string
  departamento_id: string
}

export const ENTRADA_SUBTIPOS: EntradaSubtipo[] = ["Dízimo", "Oferta"]
