export const THEME_STORAGE_KEY = "contabs-theme"
export const THEME_LEGACY_STORAGE_KEY = "ad-gestao-theme"
export const NAV_STYLE_STORAGE_KEY = "contabs-nav-style"

export type StoredThemePreference = "light" | "dark" | "system"
export type StoredNavStyle = "sidebar" | "top"

export function clearUiPreferencesStorage() {
  localStorage.removeItem(THEME_STORAGE_KEY)
  localStorage.removeItem(THEME_LEGACY_STORAGE_KEY)
  localStorage.removeItem(NAV_STYLE_STORAGE_KEY)
}

export function readStoredTheme(): StoredThemePreference {
  const stored =
    localStorage.getItem(THEME_STORAGE_KEY) ??
    localStorage.getItem(THEME_LEGACY_STORAGE_KEY)
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored
  }
  return "system"
}

export function writeStoredTheme(theme: StoredThemePreference) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function readStoredNavStyle(): StoredNavStyle {
  return localStorage.getItem(NAV_STYLE_STORAGE_KEY) === "top" ? "top" : "sidebar"
}

export function writeStoredNavStyle(style: StoredNavStyle) {
  localStorage.setItem(NAV_STYLE_STORAGE_KEY, style)
}
