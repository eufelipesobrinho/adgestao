import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
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

export type TransacaoTipo = "entrada" | "saida"

export interface TransacaoFormData {
  descricao: string
  categoria: string
  valor: string
  data: string
}

const CATEGORIAS_ENTRADA = ["Dízimos", "Ofertas", "Ofertas Especiais", "Missões"]
const CATEGORIAS_SAIDA = [
  "Despesas Fixas",
  "Manutenção",
  "Salários",
  "Eventos",
  "Outros",
]

const initialFormData: TransacaoFormData = {
  descricao: "",
  categoria: "",
  valor: "",
  data: "",
}

interface AddTransacaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipo: TransacaoTipo
}

export function AddTransacaoDialog({
  open,
  onOpenChange,
  tipo,
}: AddTransacaoDialogProps) {
  const [formData, setFormData] = useState<TransacaoFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEntrada = tipo === "entrada"
  const categorias = isEntrada ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA

  const resetForm = () => setFormData(initialFormData)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.descricao.trim() || !formData.categoria || !formData.valor) {
      toast.error("Preencha descrição, categoria e valor.")
      return
    }

    setIsSubmitting(true)

    // Integração Supabase será conectada na próxima etapa do módulo financeiro.
    await new Promise((resolve) => setTimeout(resolve, 600))

    toast.success(
      isEntrada
        ? "Entrada registrada com sucesso!"
        : "Saída registrada com sucesso!"
    )
    resetForm()
    onOpenChange(false)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 p-0 sm:max-w-xl">
        <div
          className={`border-b px-6 py-5 ${
            isEntrada
              ? "border-green-100 bg-green-50/60"
              : "border-red-100 bg-red-50/60"
          }`}
        >
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl text-slate-900">
              {isEntrada ? "Nova Entrada" : "Nova Saída"}
            </DialogTitle>
            <DialogDescription>
              {isEntrada
                ? "Registre dízimos, ofertas ou outras entradas financeiras."
                : "Registre despesas e saídas operacionais da igreja."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <FormSection
            title="Detalhes da Transação"
            description="Informações principais do lançamento"
          >
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
                placeholder={
                  isEntrada ? "Ex: Dízimo de João Silva" : "Ex: Conta de Luz"
                }
                disabled={isSubmitting}
                className="bg-white"
                required
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Categoria" htmlFor="categoria" required>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoria: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="categoria" className="bg-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

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
                  className="bg-white"
                  required
                />
              </FormField>
            </div>

            <DatePicker
              id="data_transacao"
              label="Data da Transação"
              value={formData.data}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, data: value }))
              }
              disabled={isSubmitting}
              yearRange={5}
            />
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
                `Salvar ${isEntrada ? "Entrada" : "Saída"}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
