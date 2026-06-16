import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import {
  createMembro,
  membroToFormData,
  updateMembro,
} from "@/services/membros"
import {
  MEMBRO_STATUS_OPTIONS,
  type Membro,
  type MembroFormData,
  type MembroStatus,
} from "@/types/membro"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
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

const initialFormData: MembroFormData = {
  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  data_nascimento: "",
  status_dizimo: "Ativo",
}

interface MembroSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  membro?: Membro | null
}

export function MembroSheet({
  open,
  onOpenChange,
  onSuccess,
  membro,
}: MembroSheetProps) {
  const isEditing = !!membro
  const [formData, setFormData] = useState<MembroFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData(membro ? membroToFormData(membro) : initialFormData)
    }
  }, [open, membro])

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
      if (isEditing && membro) {
        await updateMembro(membro.id, formData)
        toast.success("Membro atualizado com sucesso!")
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user?.id) {
          toast.error("Sessão expirada. Faça login novamente.")
          return
        }

        await createMembro(formData, session.user.id)
        toast.success("Membro cadastrado com sucesso!")
      }

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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-hidden p-0">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-6">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl text-slate-900">
              {isEditing ? "Editar Membro" : "Adicionar Membro"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Atualize os dados do membro selecionado."
                : "Cadastre um novo membro com os dados da congregação."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
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
                  className="border-slate-200 bg-white"
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
                    className="border-slate-200 bg-white"
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
                    className="border-slate-200 bg-white"
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
                  className="border-slate-200 bg-white"
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
                  <SelectTrigger id="status_dizimo" className="border-slate-200 bg-white">
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
          </div>

          <div className="flex gap-2 border-t border-slate-100 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
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
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Salvar Membro"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
