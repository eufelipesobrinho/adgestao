import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { getUserDisplayName } from "@/lib/user"
import { updateNomeUsuario } from "@/services/perfil-igreja"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"

export function UsuariosTab() {
  const { user } = useAuth()
  const [nomeUsuario, setNomeUsuario] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setNomeUsuario(getUserDisplayName(user))
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!nomeUsuario.trim()) {
      toast.error("Informe o nome de usuário.")
      return
    }

    if (nomeUsuario.trim().length > 30) {
      toast.error("O nome de usuário deve ter no máximo 30 caracteres.")
      return
    }

    setIsSaving(true)
    try {
      await updateNomeUsuario(nomeUsuario)
      toast.success("Nome de usuário atualizado com sucesso!")
    } catch (err) {
      toast.error(getSupabaseErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground">
            Identificação do Usuário
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Defina a sigla ou nome curto da igreja exibido na saudação do
            Dashboard.
          </p>
        </div>

        <div className="grid max-w-md gap-4">
          <FormField label="E-mail da Conta">
            <Input value={user?.email ?? ""} disabled />
          </FormField>

          <FormField
            label="Nome de Usuário (Sigla da Igreja)"
            htmlFor="nome_usuario"
            required
          >
            <Input
              id="nome_usuario"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              placeholder="Ex: ADCentral"
              maxLength={30}
            />
          </FormField>

          <p className="text-xs text-muted-foreground">
            Será exibido como &quot;Olá, {nomeUsuario.trim() || "Usuário"} 👋&quot;
            no Dashboard (máx. 10 caracteres visíveis).
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar nome de usuário
        </Button>
      </div>
    </form>
  )
}
