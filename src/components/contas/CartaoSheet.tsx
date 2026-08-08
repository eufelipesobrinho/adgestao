import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import {
  createCreditCard,
  creditCardToFormData,
  updateCreditCard,
} from "@/services/contas"
import {
  CARTOES_BANDEIRAS,
  type CreditCard,
  type CreditCardFormData,
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

const initialFormData: CreditCardFormData = {
  nome_cartao: "",
  bandeira: "Visa",
  limite: "0",
  dia_fechamento: "1",
  dia_vencimento: "10",
}

interface CartaoSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  card?: CreditCard | null
}

export function CartaoSheet({
  open,
  onOpenChange,
  onSuccess,
  card,
}: CartaoSheetProps) {
  const isEditing = !!card
  const [formData, setFormData] = useState<CreditCardFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData(card ? creditCardToFormData(card) : initialFormData)
    }
  }, [open, card])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.nome_cartao.trim()) {
      toast.error("Informe o nome do cartão.")
      return
    }

    const fechamento = Number(formData.dia_fechamento)
    const vencimento = Number(formData.dia_vencimento)
    if (
      !Number.isInteger(fechamento) ||
      fechamento < 1 ||
      fechamento > 31 ||
      !Number.isInteger(vencimento) ||
      vencimento < 1 ||
      vencimento > 31
    ) {
      toast.error("Informe dias de fechamento e vencimento entre 1 e 31.")
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

      if (isEditing && card) {
        await updateCreditCard(card.id, formData)
        toast.success("Cartão atualizado com sucesso!")
      } else {
        await createCreditCard(formData, session.user.id)
        toast.success("Cartão cadastrado com sucesso!")
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
        <div className="border-b border-border bg-gradient-to-br from-brand/90 to-[hsl(210_100%_12%)] px-6 py-6 text-white">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl text-white">
              {isEditing ? "Editar Cartão" : "Novo Cartão"}
            </SheetTitle>
            <SheetDescription className="text-white/80">
              Cadastre cartões de crédito com limite e datas de ciclo.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <FormSection title="Dados do Cartão">
              <FormField label="Nome do Cartão" htmlFor="nome_cartao">
                <Input
                  id="nome_cartao"
                  value={formData.nome_cartao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nome_cartao: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  placeholder="Ex: Cartão Corporativo"
                  required
                />
              </FormField>
              <FormField label="Bandeira" htmlFor="bandeira">
                <Select
                  value={formData.bandeira}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, bandeira: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="bandeira">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CARTOES_BANDEIRAS.map((bandeira) => (
                      <SelectItem key={bandeira} value={bandeira}>
                        {bandeira}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Limite (R$)" htmlFor="limite">
                <Input
                  id="limite"
                  inputMode="decimal"
                  value={formData.limite}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, limite: e.target.value }))
                  }
                  disabled={isSubmitting}
                  placeholder="0,00"
                />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Dia de Fechamento" htmlFor="dia_fechamento">
                  <Input
                    id="dia_fechamento"
                    type="number"
                    min={1}
                    max={31}
                    value={formData.dia_fechamento}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dia_fechamento: e.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </FormField>
                <FormField label="Dia de Vencimento" htmlFor="dia_vencimento">
                  <Input
                    id="dia_vencimento"
                    type="number"
                    min={1}
                    max={31}
                    value={formData.dia_vencimento}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dia_vencimento: e.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
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
