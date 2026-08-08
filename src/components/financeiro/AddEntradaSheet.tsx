import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import { fetchDepartamentos } from "@/services/departamentos"
import { fetchMembrosOptions } from "@/services/membros"
import { createEntrada } from "@/services/transacoes"
import {
  ENTRADA_SUBTIPOS,
  type EntradaFormData,
  type EntradaSubtipo,
} from "@/types/transacao"
import { PaymentMethodSelect } from "@/components/financeiro/PaymentMethodSelect"
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

const initialFormData: EntradaFormData = {
  subtipo: "Dízimo",
  valor: "",
  data_transacao: "",
  descricao: "",
  membro_id: "",
  departamento_id: "",
  bank_account_id: "",
  credit_card_id: "",
}

interface AddEntradaSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddEntradaSheet({
  open,
  onOpenChange,
  onSuccess,
}: AddEntradaSheetProps) {
  const [formData, setFormData] = useState<EntradaFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [membros, setMembros] = useState<{ id: string; nome: string }[]>([])
  const [departamentos, setDepartamentos] = useState<
    { id: string; nome: string }[]
  >([])

  const isDizimo = formData.subtipo === "Dízimo"

  useEffect(() => {
    if (!open) return

    const loadOptions = async () => {
      setIsLoadingOptions(true)
      try {
        const [membrosData, departamentosData] = await Promise.all([
          fetchMembrosOptions(),
          fetchDepartamentos(),
        ])
        setMembros(membrosData)
        setDepartamentos(departamentosData)
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

  const handleSubtipoChange = (value: EntradaSubtipo) => {
    setFormData((prev) => ({
      ...prev,
      subtipo: value,
      membro_id: value === "Oferta" ? "" : prev.membro_id,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.valor || !formData.data_transacao || !formData.descricao.trim()) {
      toast.error("Preencha tipo, valor, data e descrição.")
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

      await createEntrada(formData, session.user.id)
      toast.success("Entrada registrada com sucesso!")
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
        <div className="border-b border-emerald-200/60 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-6 py-6 dark:border-emerald-900/40 dark:from-emerald-950 dark:via-[hsl(210_100%_10%)] dark:to-[hsl(210_100%_12%)]">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl font-semibold text-emerald-950 dark:text-white">
              Nova Entrada
            </SheetTitle>
            <SheetDescription className="text-emerald-900/80 dark:text-emerald-100/85">
              Registre dízimos, ofertas ou outras entradas financeiras.
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
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <FormSection title="Dados da Entrada">
                <FormField label="Tipo" htmlFor="subtipo" required>
                  <Select
                    value={formData.subtipo}
                    onValueChange={handleSubtipoChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="subtipo" className="border-border bg-card">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENTRADA_SUBTIPOS.map((subtipo) => (
                        <SelectItem key={subtipo} value={subtipo}>
                          {subtipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

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
                      className="border-border bg-card"
                      required
                    />
                  </FormField>

                  <AnimatePresence mode="wait">
                    {isDizimo && (
                      <motion.div
                        key="membro-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <FormField label="Membro" htmlFor="membro_id">
                          <Select
                            value={formData.membro_id || undefined}
                            onValueChange={(value) =>
                              setFormData((prev) => ({ ...prev, membro_id: value }))
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="membro_id" className="border-border bg-card">
                              <SelectValue placeholder="Selecione o membro" />
                            </SelectTrigger>
                            <SelectContent>
                              {membros.map((membro) => (
                                <SelectItem key={membro.id} value={membro.id}>
                                  {membro.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                    <SelectTrigger id="departamento_id" className="border-border bg-card">
                      <SelectValue placeholder="Selecione o departamento" />
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
                    placeholder="Ex: Dízimo de João Silva"
                    disabled={isSubmitting}
                    className="border-border bg-card"
                    required
                  />
                </FormField>

                <PaymentMethodSelect
                  bankAccountId={formData.bank_account_id}
                  creditCardId={formData.credit_card_id}
                  disabled={isSubmitting}
                  onChange={({ bank_account_id, credit_card_id }) =>
                    setFormData((prev) => ({
                      ...prev,
                      bank_account_id,
                      credit_card_id,
                    }))
                  }
                />
              </FormSection>
            )}
          </div>

          <div className="flex gap-2 border-t border-border bg-card px-6 py-4">
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
                "Salvar Entrada"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
