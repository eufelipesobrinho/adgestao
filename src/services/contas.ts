import { supabase } from "@/lib/supabase"
import { parseCurrencyInput } from "@/lib/dates"
import type {
  BankAccount,
  BankAccountFormData,
  CreditCard,
  CreditCardFormData,
} from "@/types/conta"

export async function fetchBankAccounts(): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .order("nome_banco", { ascending: true })

  if (error) throw error
  return (data ?? []) as BankAccount[]
}

export async function createBankAccount(
  formData: BankAccountFormData,
  igrejaId: string
): Promise<BankAccount> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      igreja_id: igrejaId,
      nome_banco: formData.nome_banco.trim(),
      tipo: formData.tipo,
      agencia: formData.agencia.trim() || null,
      conta: formData.conta.trim() || null,
      saldo_inicial: parseCurrencyInput(formData.saldo_inicial) || 0,
    })
    .select()
    .single()

  if (error) throw error
  return data as BankAccount
}

export async function updateBankAccount(
  id: string,
  formData: BankAccountFormData
): Promise<BankAccount> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .update({
      nome_banco: formData.nome_banco.trim(),
      tipo: formData.tipo,
      agencia: formData.agencia.trim() || null,
      conta: formData.conta.trim() || null,
      saldo_inicial: parseCurrencyInput(formData.saldo_inicial) || 0,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as BankAccount
}

export async function deleteBankAccount(id: string): Promise<void> {
  const { error } = await supabase.from("bank_accounts").delete().eq("id", id)
  if (error) throw error
}

export async function fetchCreditCards(): Promise<CreditCard[]> {
  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .order("nome_cartao", { ascending: true })

  if (error) throw error
  return (data ?? []) as CreditCard[]
}

export async function createCreditCard(
  formData: CreditCardFormData,
  igrejaId: string
): Promise<CreditCard> {
  const { data, error } = await supabase
    .from("credit_cards")
    .insert({
      igreja_id: igrejaId,
      nome_cartao: formData.nome_cartao.trim(),
      bandeira: formData.bandeira,
      limite: parseCurrencyInput(formData.limite) || 0,
      dia_fechamento: Number(formData.dia_fechamento),
      dia_vencimento: Number(formData.dia_vencimento),
    })
    .select()
    .single()

  if (error) throw error
  return data as CreditCard
}

export async function updateCreditCard(
  id: string,
  formData: CreditCardFormData
): Promise<CreditCard> {
  const { data, error } = await supabase
    .from("credit_cards")
    .update({
      nome_cartao: formData.nome_cartao.trim(),
      bandeira: formData.bandeira,
      limite: parseCurrencyInput(formData.limite) || 0,
      dia_fechamento: Number(formData.dia_fechamento),
      dia_vencimento: Number(formData.dia_vencimento),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as CreditCard
}

export async function deleteCreditCard(id: string): Promise<void> {
  const { error } = await supabase.from("credit_cards").delete().eq("id", id)
  if (error) throw error
}

export function bankAccountToFormData(account: BankAccount): BankAccountFormData {
  return {
    nome_banco: account.nome_banco,
    tipo: account.tipo,
    agencia: account.agencia ?? "",
    conta: account.conta ?? "",
    saldo_inicial: String(account.saldo_inicial ?? 0),
  }
}

export function creditCardToFormData(card: CreditCard): CreditCardFormData {
  return {
    nome_cartao: card.nome_cartao,
    bandeira: card.bandeira,
    limite: String(card.limite ?? 0),
    dia_fechamento: String(card.dia_fechamento),
    dia_vencimento: String(card.dia_vencimento),
  }
}
