import type { PostgrestError } from "@supabase/supabase-js"

export function getSupabaseErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const postgrestError = error as PostgrestError
    if (postgrestError.code === "42501") {
      return "Você não tem permissão para realizar esta ação."
    }
    return postgrestError.message
  }
  if (error instanceof Error) return error.message
  return "Ocorreu um erro inesperado. Tente novamente."
}
