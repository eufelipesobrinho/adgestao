import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import {
  createDepartamento,
  departamentoToFormData,
  updateDepartamento,
} from "@/services/departamentos"
import type { Departamento, DepartamentoFormData } from "@/types/departamento"
import { Button } from "@/components/ui/button"
import { FormField, FormSection } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const initialFormData: DepartamentoFormData = {
  nome: "",
  descricao: "",
}

interface DepartamentoSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  departamento?: Departamento | null
}

export function DepartamentoSheet({
  open,
  onOpenChange,
  onSuccess,
  departamento,
}: DepartamentoSheetProps) {
  const isEditing = !!departamento
  const [formData, setFormData] = useState<DepartamentoFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData(
        departamento ? departamentoToFormData(departamento) : initialFormData
      )
    }
  }, [open, departamento])

  const resetForm = () => setFormData(initialFormData)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      toast.error("O nome do departamento é obrigatório.")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && departamento) {
        await updateDepartamento(departamento.id, formData)
        toast.success("Departamento atualizado com sucesso!")
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user?.id) {
          toast.error("Sessão expirada. Faça login novamente.")
          return
        }

        await createDepartamento(formData, session.user.id)
        toast.success("Departamento criado com sucesso!")
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
              {isEditing ? "Editar Departamento" : "Novo Departamento"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Atualize as informações do departamento."
                : "Cadastre um novo departamento ou ministério da igreja."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <FormSection title="Informações do Departamento">
              <FormField label="Nome do Departamento" htmlFor="nome" required>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  placeholder="Ex: Jovens, Missões, Louvor"
                  disabled={isSubmitting}
                  className="border-slate-200 bg-white"
                  required
                />
              </FormField>

              <FormField label="Descrição" htmlFor="descricao">
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Breve descrição do departamento..."
                  disabled={isSubmitting}
                  rows={4}
                  className={cn(
                    "flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
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
                "Criar Departamento"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
