export type ContaBancariaTipo =
  | "Conta Corrente"
  | "Poupança"
  | "Caixa da Igreja"

export const CONTA_TIPOS: ContaBancariaTipo[] = [
  "Conta Corrente",
  "Poupança",
  "Caixa da Igreja",
]

export const CARTOES_BANDEIRAS = [
  "Visa",
  "Mastercard",
  "Elo",
  "Amex",
  "Hipercard",
  "Outra",
] as const

export type CartaoBandeira = (typeof CARTOES_BANDEIRAS)[number]

export interface BankAccount {
  id: string
  igreja_id: string
  nome_banco: string
  tipo: ContaBancariaTipo
  agencia: string | null
  conta: string | null
  saldo_inicial: number
  created_at: string
}

export interface CreditCard {
  id: string
  igreja_id: string
  nome_cartao: string
  bandeira: string
  limite: number
  dia_fechamento: number
  dia_vencimento: number
  created_at: string
}

export interface BankAccountFormData {
  nome_banco: string
  tipo: ContaBancariaTipo
  agencia: string
  conta: string
  saldo_inicial: string
}

export interface CreditCardFormData {
  nome_cartao: string
  bandeira: string
  limite: string
  dia_fechamento: string
  dia_vencimento: string
}
