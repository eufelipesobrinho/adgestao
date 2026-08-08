import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/brand/Logo"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated, isPasswordRecovery, clearPasswordRecovery } =
    useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [waitingLink, setWaitingLink] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (isPasswordRecovery || isAuthenticated) {
      setWaitingLink(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setWaitingLink(false)
    }, 2500)

    return () => window.clearTimeout(timeout)
  }, [isLoading, isPasswordRecovery, isAuthenticated])

  const canReset = isPasswordRecovery || isAuthenticated

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.")
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)

    if (error) {
      toast.error(
        error.message.includes("same")
          ? "A nova senha deve ser diferente da senha atual."
          : "Não foi possível atualizar a senha. Solicite um novo link e tente novamente."
      )
      return
    }

    clearPasswordRecovery()
    toast.success("Senha redefinida com sucesso!")
    navigate("/dashboard", { replace: true })
  }

  if (isLoading || waitingLink) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Validando link de recuperação...</p>
      </div>
    )
  }

  if (!canReset) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="mb-10">
          <Logo size="xl" />
        </div>
        <Card className="w-full max-w-md border-border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Link inválido ou expirado</CardTitle>
            <CardDescription>
              Solicite um novo e-mail de recuperação na tela de login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="gold" className="w-full">
              <Link to="/">Voltar ao login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="mb-10">
        <Logo size="xl" />
      </div>

      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nova senha</CardTitle>
          <CardDescription>
            Defina uma nova senha para acessar o Contabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                Nova senha
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirmar senha
              </label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar nova senha"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
