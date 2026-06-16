import type { User } from "@supabase/supabase-js"

export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return "Usuário"

  const metadataName = user.user_metadata?.nome_usuario
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim()
  }

  if (user.email) {
    return user.email.split("@")[0]
  }

  return "Usuário"
}

export function formatGreetingName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return "Usuário"
  if (trimmed.length <= 10) return trimmed
  return `${trimmed.slice(0, 10)}...`
}
