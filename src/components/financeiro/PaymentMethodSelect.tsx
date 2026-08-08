import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { fetchBankAccounts, fetchCreditCards } from "@/services/contas"
import type { BankAccount, CreditCard } from "@/types/conta"
import { FormField } from "@/components/ui/form-field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const NONE = "none"
const ACCOUNT_PREFIX = "account:"
const CARD_PREFIX = "card:"

interface PaymentMethodSelectProps {
  bankAccountId: string
  creditCardId: string
  onChange: (value: { bank_account_id: string; credit_card_id: string }) => void
  disabled?: boolean
}

export function PaymentMethodSelect({
  bankAccountId,
  creditCardId,
  onChange,
  disabled,
}: PaymentMethodSelectProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [cards, setCards] = useState<CreditCard[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [accountsData, cardsData] = await Promise.all([
          fetchBankAccounts(),
          fetchCreditCards(),
        ])
        setAccounts(accountsData)
        setCards(cardsData)
      } catch (err) {
        toast.error(getSupabaseErrorMessage(err))
      }
    }
    load()
  }, [])

  const selectValue = bankAccountId
    ? `${ACCOUNT_PREFIX}${bankAccountId}`
    : creditCardId
      ? `${CARD_PREFIX}${creditCardId}`
      : NONE

  const handleChange = (value: string) => {
    if (value === NONE) {
      onChange({ bank_account_id: "", credit_card_id: "" })
      return
    }
    if (value.startsWith(ACCOUNT_PREFIX)) {
      onChange({
        bank_account_id: value.slice(ACCOUNT_PREFIX.length),
        credit_card_id: "",
      })
      return
    }
    if (value.startsWith(CARD_PREFIX)) {
      onChange({
        bank_account_id: "",
        credit_card_id: value.slice(CARD_PREFIX.length),
      })
    }
  }

  return (
    <FormField label="Conta ou Cartão (opcional)" htmlFor="payment_method">
      <Select value={selectValue} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger id="payment_method">
          <SelectValue placeholder="Nenhuma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Nenhuma</SelectItem>
          {accounts.length > 0 && (
            <SelectGroup>
              <SelectLabel>Contas bancárias</SelectLabel>
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={`${ACCOUNT_PREFIX}${account.id}`}
                >
                  {account.nome_banco} · {account.tipo}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {cards.length > 0 && (
            <SelectGroup>
              <SelectLabel>Cartões</SelectLabel>
              {cards.map((card) => (
                <SelectItem key={card.id} value={`${CARD_PREFIX}${card.id}`}>
                  {card.nome_cartao} · {card.bandeira}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </FormField>
  )
}
