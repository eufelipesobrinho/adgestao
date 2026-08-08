import type {
  StoredNavStyle,
  StoredThemePreference,
} from "@/lib/ui-preferences"

export interface PerfilIgreja {
  igreja_id: string
  nome_igreja: string
  qtd_congregacoes: number
  tema?: string | null
  theme_preference?: StoredThemePreference | null
  nav_style?: StoredNavStyle | null
}

export interface PerfilIgrejaFormData {
  nome_igreja: string
  quantidade_congregacoes: string
}

export interface UiPreferences {
  theme_preference: StoredThemePreference
  nav_style: StoredNavStyle
}
