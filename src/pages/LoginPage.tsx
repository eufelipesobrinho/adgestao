import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Church, Loader2 } from "lucide-react"
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

function translateAuthError(message: string): string {
  const errors: Record<string, string> = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
  }
  return errors[message] ?? "Não foi possível entrar. Tente novamente."
}

export function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (signInError) {
      setError(translateAuthError(signInError.message))
      return
    }

    navigate("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 flex items-center gap-2">
        <Church className="h-8 w-8 text-slate-900" />
        <span className="text-2xl font-bold text-slate-900">AD Gestão</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login da Igreja</CardTitle>
          <CardDescription>
            Acesse o painel de gestão da sua congregação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="secretaria@igreja.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
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
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-700 hover:underline">
          Voltar para a página inicial
        </Link>
      </p>
    </div>
  )
}
