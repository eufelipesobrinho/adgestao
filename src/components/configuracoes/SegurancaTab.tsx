import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseErrorMessage } from "@/lib/errors"
import { updatePassword } from "@/services/perfil-igreja"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"

export function SegurancaTab() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.")
      return
    }

    setIsSaving(true)
    try {
      await updatePassword(newPassword)
      toast.success("Senha alterada com sucesso!")
      setNewPassword("")
      setConfirmPassword("")
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
            Alterar Senha
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Defina uma nova senha de acesso à sua conta.
          </p>
        </div>

        <div className="grid max-w-md gap-4">
          <FormField label="Nova Senha" htmlFor="new_password" required>
            <Input
              id="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              autoComplete="new-password"
            />
          </FormField>

          <FormField
            label="Confirmar Nova Senha"
            htmlFor="confirm_password"
            required
          >
            <Input
              id="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Atualizar senha
        </Button>
      </div>
    </form>
  )
}
