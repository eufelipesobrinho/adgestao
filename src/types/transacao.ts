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
  bank_account_id: string | null
  credit_card_id: string | null
  membros?: { nome: string } | null
  departamentos?: { nome: string } | null
  bank_accounts?: { nome_banco: string } | null
  credit_cards?: { nome_cartao: string } | null
}

export interface EntradaFormData {
  subtipo: EntradaSubtipo
  valor: string
  data_transacao: string
  descricao: string
  membro_id: string
  departamento_id: string
  bank_account_id: string
  credit_card_id: string
}

export interface SaidaFormData {
  valor: string
  data_transacao: string
  descricao: string
  departamento_id: string
  bank_account_id: string
  credit_card_id: string
}

export const ENTRADA_SUBTIPOS: EntradaSubtipo[] = ["Dízimo", "Oferta"]
