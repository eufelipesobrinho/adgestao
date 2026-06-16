import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import { fetchDepartamentos } from "@/services/departamentos"
import { createSaida } from "@/services/transacoes"
import type { SaidaFormData } from "@/types/transacao"
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

const initialFormData: SaidaFormData = {
  valor: "",
  data_transacao: "",
  descricao: "",
  departamento_id: "",
}

interface AddSaidaSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddSaidaSheet({
  open,
  onOpenChange,
  onSuccess,
}: AddSaidaSheetProps) {
  const [formData, setFormData] = useState<SaidaFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [departamentos, setDepartamentos] = useState<
    { id: string; nome: string }[]
  >([])

  useEffect(() => {
    if (!open) return

    const loadOptions = async () => {
      setIsLoadingOptions(true)
      try {
        const data = await fetchDepartamentos()
        setDepartamentos(data)
      } catch (err) {
        toast.error(getSupabaseErrorMessage(err))
      } finally {
        setIsLoadingOptions(false)
      }
    }

    loadOptions()
  }, [open])

  const resetForm = () => setFormData(initialFormData)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.valor || !formData.data_transacao || !formData.descricao.trim()) {
      toast.error("Preencha valor, data e descrição.")
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

      await createSaida(formData, session.user.id)
      toast.success("Saída registrada com sucesso!")
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
        <div className="border-b border-red-100 bg-gradient-to-r from-red-50/60 to-white px-6 py-6">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl text-slate-900">Nova Saída</SheetTitle>
            <SheetDescription>
              Registre despesas e saídas operacionais da igreja.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {isLoadingOptions ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <FormSection title="Dados da Saída">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Valor (R$)" htmlFor="valor" required>
                    <Input
                      id="valor"
                      inputMode="decimal"
                      value={formData.valor}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, valor: e.target.value }))
                      }
                      placeholder="0,00"
                      disabled={isSubmitting}
                      className="border-slate-200 bg-white"
                      required
                    />
                  </FormField>

                  <FormField label="Departamento" htmlFor="departamento_id">
                    <Select
                      value={formData.departamento_id || undefined}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          departamento_id: value,
                        }))
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="departamento_id" className="border-slate-200 bg-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id}>
                            {dep.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <DatePicker
                  id="data_transacao"
                  label="Data"
                  value={formData.data_transacao}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, data_transacao: value }))
                  }
                  disabled={isSubmitting}
                  yearRange={5}
                />

                <FormField label="Descrição" htmlFor="descricao" required>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    placeholder="Ex: Conta de Luz"
                    disabled={isSubmitting}
                    className="border-slate-200 bg-white"
                    required
                  />
                </FormField>
              </FormSection>
            )}
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
            <Button
              type="submit"
              variant="gold"
              className="flex-1"
              disabled={isSubmitting || isLoadingOptions}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Saída"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
