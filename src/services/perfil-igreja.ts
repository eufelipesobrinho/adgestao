import { supabase } from "@/lib/supabase"
import type {
  StoredNavStyle,
  StoredThemePreference,
} from "@/lib/ui-preferences"
import type {
  PerfilIgreja,
  PerfilIgrejaFormData,
  UiPreferences,
} from "@/types/perfil-igreja"

async function getIgrejaId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const igrejaId = session?.user?.id
  if (!igrejaId) {
    throw new Error("Sessão inválida. Faça login novamente.")
  }

  return igrejaId
}

export async function fetchPerfilIgreja(): Promise<PerfilIgreja | null> {
  const igrejaId = await getIgrejaId()

  const { data, error } = await supabase
    .from("perfil_igreja")
    .select("*")
    .eq("igreja_id", igrejaId)
    .maybeSingle()

  if (error) throw error
  return (data as PerfilIgreja | null) ?? null
}

export async function upsertPerfilIgreja(
  formData: PerfilIgrejaFormData
): Promise<PerfilIgreja> {
  const igrejaId = await getIgrejaId()
  const quantidade = Number.parseInt(formData.quantidade_congregacoes, 10)

  const { data, error } = await supabase
    .from("perfil_igreja")
    .upsert(
      {
        igreja_id: igrejaId,
        nome_igreja: formData.nome_igreja.trim(),
        qtd_congregacoes: Number.isFinite(quantidade) ? quantidade : 0,
      },
      { onConflict: "igreja_id" }
    )
    .select()
    .single()

  if (error) throw error
  return data as PerfilIgreja
}

export async function saveUiPreferences(prefs: UiPreferences): Promise<void> {
  const igrejaId = await getIgrejaId()
  const existing = await fetchPerfilIgreja()

  if (existing) {
    const { error } = await supabase
      .from("perfil_igreja")
      .update({
        theme_preference: prefs.theme_preference,
        tema: prefs.theme_preference,
        nav_style: prefs.nav_style,
      })
      .eq("igreja_id", igrejaId)

    if (error) throw error
    return
  }

  const { error } = await supabase.from("perfil_igreja").insert({
    igreja_id: igrejaId,
    nome_igreja: "Minha Igreja",
    qtd_congregacoes: 1,
    theme_preference: prefs.theme_preference,
    tema: prefs.theme_preference,
    nav_style: prefs.nav_style,
  })

  if (error) throw error
}

export function resolveThemeFromPerfil(
  perfil: PerfilIgreja | null
): StoredThemePreference | null {
  const value = perfil?.theme_preference || perfil?.tema
  if (value === "light" || value === "dark" || value === "system") {
    return value
  }
  return null
}

export function resolveNavStyleFromPerfil(
  perfil: PerfilIgreja | null
): StoredNavStyle | null {
  if (perfil?.nav_style === "top" || perfil?.nav_style === "sidebar") {
    return perfil.nav_style
  }
  return null
}

export async function updateNomeUsuario(nomeUsuario: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    data: { nome_usuario: nomeUsuario.trim() },
  })

  if (error) throw error
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}
