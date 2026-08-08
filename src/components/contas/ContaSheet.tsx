import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import {
  bankAccountToFormData,
  createBankAccount,
  updateBankAccount,
} from "@/services/contas"
import {
  CONTA_TIPOS,
  type BankAccount,
  type BankAccountFormData,
  type ContaBancariaTipo,
} from "@/types/conta"
import { Button } from "@/components/ui/button"
import { FormField, FormSection } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const initialFormData: BankAccountFormData = {
  nome_banco: "",
  tipo: "Conta Corrente",
  agencia: "",
  conta: "",
  saldo_inicial: "0",
}

interface ContaSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  account?: BankAccount | null
}

export function ContaSheet({
  open,
  onOpenChange,
  onSuccess,
  account,
}: ContaSheetProps) {
  const isEditing = !!account
  const [formData, setFormData] = useState<BankAccountFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData(account ? bankAccountToFormData(account) : initialFormData)
    }
  }, [open, account])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.nome_banco.trim()) {
      toast.error("Informe o nome do banco.")
      return
    }

    setIsSubmitting(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        toast.error("Sessão expirada. Faça login novamente.")
        return
      }

      if (isEditing && account) {
        await updateBankAccount(account.id, formData)
        toast.success("Conta atualizada com sucesso!")
      } else {
        await createBankAccount(formData, session.user.id)
        toast.success("Conta cadastrada com sucesso!")
      }
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-hidden p-0">
        <div className="border-b border-border bg-gradient-to-br from-[hsl(210_100%_12%)] to-[hsl(210_70%_22%)] px-6 py-6 text-white">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl text-white">
              {isEditing ? "Editar Conta" : "Nova Conta"}
            </SheetTitle>
            <SheetDescription className="text-white/75">
              Cadastre contas correntes, poupança ou o caixa da igreja.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <FormSection title="Dados da Conta">
              <FormField label="Nome do Banco" htmlFor="nome_banco">
                <Input
                  id="nome_banco"
                  value={formData.nome_banco}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome_banco: e.target.value }))
                  }
                  disabled={isSubmitting}
                  placeholder="Ex: Banco do Brasil"
                  required
                />
              </FormField>
              <FormField label="Tipo" htmlFor="tipo">
                <Select
                  value={formData.tipo}
                  onValueChange={(value: ContaBancariaTipo) =>
                    setFormData((prev) => ({ ...prev, tipo: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTA_TIPOS.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Agência" htmlFor="agencia">
                  <Input
                    id="agencia"
                    value={formData.agencia}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, agencia: e.target.value }))
                    }
                    disabled={isSubmitting}
                    placeholder="0000"
                  />
                </FormField>
                <FormField label="Conta" htmlFor="conta">
                  <Input
                    id="conta"
                    value={formData.conta}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, conta: e.target.value }))
                    }
                    disabled={isSubmitting}
                    placeholder="00000-0"
                  />
                </FormField>
              </div>
              <FormField label="Saldo Inicial (R$)" htmlFor="saldo_inicial">
                <Input
                  id="saldo_inicial"
                  inputMode="decimal"
                  value={formData.saldo_inicial}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      saldo_inicial: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  placeholder="0,00"
                />
              </FormField>
            </FormSection>
          </div>
          <div className="flex gap-2 border-t border-border bg-card px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gold" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
