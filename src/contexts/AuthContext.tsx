import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { clearUiPreferencesStorage } from "@/lib/ui-preferences"

interface AuthContextValue {
  session: Session | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isPasswordRecovery: boolean
  clearPasswordRecovery: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      setIsLoading(false)

      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true)
      }

      if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false)
        clearUiPreferencesStorage()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false)
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    clearUiPreferencesStorage()
    setSession(null)
    setIsPasswordRecovery(false)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      isLoading,
      isPasswordRecovery,
      clearPasswordRecovery,
      signOut,
    }),
    [session, isLoading, isPasswordRecovery, clearPasswordRecovery, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
