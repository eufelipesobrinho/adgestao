export type StoredThemePreference = "light" | "dark" | "system"
export type StoredNavStyle = "sidebar" | "top"

export const THEME_STORAGE_KEY = "contabs-theme"
export const NAV_STYLE_STORAGE_KEY = "contabs-nav-style"

const THEME_VALUES: StoredThemePreference[] = ["light", "dark", "system"]
const NAV_VALUES: StoredNavStyle[] = ["sidebar", "top"]

export function readStoredTheme(): StoredThemePreference {
  if (typeof window === "undefined") return "system"
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (value && THEME_VALUES.includes(value as StoredThemePreference)) {
      return value as StoredThemePreference
    }
  } catch {
    // ignore
  }
  return "system"
}

export function writeStoredTheme(theme: StoredThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // ignore
  }
}

export function readStoredNavStyle(): StoredNavStyle {
  if (typeof window === "undefined") return "sidebar"
  try {
    const value = window.localStorage.getItem(NAV_STYLE_STORAGE_KEY)
    if (value && NAV_VALUES.includes(value as StoredNavStyle)) {
      return value as StoredNavStyle
    }
  } catch {
    // ignore
  }
  return "sidebar"
}

export function writeStoredNavStyle(style: StoredNavStyle): void {
  try {
    window.localStorage.setItem(NAV_STYLE_STORAGE_KEY, style)
  } catch {
    // ignore
  }
}

export function clearUiPreferencesStorage(): void {
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY)
    window.localStorage.removeItem(NAV_STYLE_STORAGE_KEY)
  } catch {
    // ignore
  }
}
