import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultEmail?: string
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  defaultEmail = "",
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSent(false)
      setIsSubmitting(false)
    } else {
      setEmail(defaultEmail)
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const redirectTo = `${window.location.origin}/redefinir-senha`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    })

    setIsSubmitting(false)

    if (error) {
      toast.error(
        error.message.includes("rate limit")
          ? "Muitas tentativas. Aguarde alguns minutos e tente novamente."
          : "Não foi possível enviar o e-mail de recuperação. Verifique o endereço e tente novamente."
      )
      return
    }

    setSent(true)
    toast.success("Link de recuperação enviado!")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            {sent
              ? "Se existir uma conta com este e-mail, enviamos um link para redefinir sua senha. Verifique também a pasta de spam."
              : "Informe o e-mail da sua conta. Enviaremos um link seguro para criar uma nova senha."}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <DialogFooter className="sm:justify-end">
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Entendi
            </Button>
          </DialogFooter>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="recovery-email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="secretaria@igreja.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
