import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  readStoredTheme,
  writeStoredTheme,
  type StoredThemePreference,
} from "@/lib/ui-preferences"

export type ThemePreference = StoredThemePreference

interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
  resolvedTheme: "light" | "dark"
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyResolvedTheme(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark")
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    const preference = readStoredTheme()
    return preference === "system" ? getSystemTheme() : preference
  })

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    setThemeState(nextTheme)
    writeStoredTheme(nextTheme)
  }, [])

  const resetTheme = useCallback(() => {
    setThemeState("system")
    const resolved = getSystemTheme()
    setResolvedTheme(resolved)
    applyResolvedTheme(resolved)
  }, [])

  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyResolvedTheme(resolved)
  }, [theme])

  useEffect(() => {
    if (theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyResolvedTheme(resolved)
    }

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [theme])

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme, resetTheme }),
    [theme, setTheme, resolvedTheme, resetTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider")
  }
  return context
}
