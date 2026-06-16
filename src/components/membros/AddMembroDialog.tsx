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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  status: "Ativo",
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Membro</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo membro da igreja.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nome: e.target.value }))
              }
              placeholder="Nome completo"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="email@exemplo.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, telefone: e.target.value }))
              }
              placeholder="(86) 99999-9999"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endereco: e.target.value }))
              }
              placeholder="Rua, número, bairro"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  data_nascimento: e.target.value,
                }))
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: MembroStatus) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
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
          </div>

          <DialogFooter>
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
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
