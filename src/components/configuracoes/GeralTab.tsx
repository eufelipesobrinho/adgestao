import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import {
  fetchPerfilIgreja,
  upsertPerfilIgreja,
} from "@/services/perfil-igreja"
import type { PerfilIgrejaFormData } from "@/types/perfil-igreja"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"

const initialFormData: PerfilIgrejaFormData = {
  nome_igreja: "",
  quantidade_congregacoes: "1",
}

export function GeralTab() {
  const [formData, setFormData] = useState<PerfilIgrejaFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadPerfil = async () => {
      setIsLoading(true)
      try {
        const perfil = await fetchPerfilIgreja()
        if (perfil) {
          setFormData({
            nome_igreja: perfil.nome_igreja,
            quantidade_congregacoes: String(perfil.qtd_congregacoes),
          })
        }
      } catch (err) {
        toast.error(getSupabaseErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadPerfil()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.nome_igreja.trim()) {
      toast.error("Informe o nome da igreja.")
      return
    }

    setIsSaving(true)
    try {
      await upsertPerfilIgreja(formData)
      toast.success("Perfil da igreja atualizado com sucesso!")
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground">
            Dados da Igreja
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Informações gerais utilizadas em relatórios e identificação do
            sistema.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nome da Igreja" htmlFor="nome_igreja" required>
            <Input
              id="nome_igreja"
              value={formData.nome_igreja}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nome_igreja: e.target.value,
                }))
              }
              placeholder="Ex: Assembleia de Deus Central"
            />
          </FormField>

          <FormField
            label="Quantidade de Congregações"
            htmlFor="quantidade_congregacoes"
            required
          >
            <Input
              id="quantidade_congregacoes"
              type="number"
              min={1}
              value={formData.quantidade_congregacoes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantidade_congregacoes: e.target.value,
                }))
              }
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}
