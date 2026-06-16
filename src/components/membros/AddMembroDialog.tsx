import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import { createMembro } from "@/services/membros"
import {
  MEMBRO_STATUS_OPTIONS,
  type MembroFormData,
  type MembroStatus,
} from "@/types/membro"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormField, FormSection } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialFormData: MembroFormData = {
  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  data_nascimento: "",
  status_dizimo: "Ativo",
}

interface AddMembroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddMembroDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddMembroDialogProps) {
  const [formData, setFormData] = useState<MembroFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => setFormData(initialFormData)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast.error("O nome do membro é obrigatório.")
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

      await createMembro(formData, session.user.id)
      toast.success("Membro cadastrado com sucesso!")
      resetForm()
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 p-0 sm:max-w-xl">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl text-slate-900">
              Adicionar Membro
            </DialogTitle>
            <DialogDescription>
              Cadastre um novo membro com os dados da congregação.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <FormSection
            title="Dados Pessoais"
            description="Informações básicas do membro"
          >
            <FormField label="Nome" htmlFor="nome" required>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Nome completo"
                disabled={isSubmitting}
                className="bg-white"
                required
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="E-mail" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@exemplo.com"
                  disabled={isSubmitting}
                  className="bg-white"
                />
              </FormField>

              <FormField label="Telefone" htmlFor="telefone">
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      telefone: e.target.value,
                    }))
                  }
                  placeholder="(86) 99999-9999"
                  disabled={isSubmitting}
                  className="bg-white"
                />
              </FormField>
            </div>

            <DatePicker
              id="data_nascimento"
              label="Data de Nascimento"
              value={formData.data_nascimento}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, data_nascimento: value }))
              }
              disabled={isSubmitting}
            />
          </FormSection>

          <FormSection
            title="Endereço e Situação"
            description="Localização e status financeiro do membro"
          >
            <FormField label="Endereço" htmlFor="endereco">
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endereco: e.target.value }))
                }
                placeholder="Rua, número, bairro"
                disabled={isSubmitting}
                className="bg-white"
              />
            </FormField>

            <FormField label="Status do Dízimo" htmlFor="status_dizimo">
              <Select
                value={formData.status_dizimo}
                onValueChange={(value: MembroStatus) =>
                  setFormData((prev) => ({ ...prev, status_dizimo: value }))
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="status_dizimo" className="bg-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBRO_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormSection>

          <DialogFooter className="gap-2 border-t border-slate-200 pt-4 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Membro"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
