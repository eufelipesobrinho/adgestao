import { useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavStyle } from "@/contexts/NavStyleContext"
import { useTheme } from "@/contexts/ThemeContext"
import {
  fetchPerfilIgreja,
  resolveNavStyleFromPerfil,
  resolveThemeFromPerfil,
  saveUiPreferences,
} from "@/services/perfil-igreja"
import {
  readStoredNavStyle,
  readStoredTheme,
  writeStoredNavStyle,
  writeStoredTheme,
} from "@/lib/ui-preferences"

/**
 * Hidrata tema/navegação do perfil no login e persiste alterações no banco.
 * localStorage continua como cache local para abertura instantânea do PWA.
 */
export function PreferencesSync() {
  const { isAuthenticated, isLoading } = useAuth()
  const { theme, setTheme, resetTheme } = useTheme()
  const { navStyle, setNavStyle, resetNavStyle } = useNavStyle()
  const hydratedRef = useRef(false)
  const skipNextPersistRef = useRef(false)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      hydratedRef.current = false
      resetTheme()
      resetNavStyle()
      return
    }

    let cancelled = false

    const hydrate = async () => {
      try {
        const perfil = await fetchPerfilIgreja()
        if (cancelled) return

        const dbTheme = resolveThemeFromPerfil(perfil)
        const dbNav = resolveNavStyleFromPerfil(perfil)
        const localTheme = readStoredTheme()
        const localNav = readStoredNavStyle()

        skipNextPersistRef.current = true

        if (dbTheme) {
          setTheme(dbTheme)
          writeStoredTheme(dbTheme)
        }

        if (dbNav) {
          setNavStyle(dbNav)
          writeStoredNavStyle(dbNav)
        }

        if (!dbTheme || !dbNav) {
          await saveUiPreferences({
            theme_preference: dbTheme ?? localTheme,
            nav_style: dbNav ?? localNav,
          })
          if (!dbTheme) {
            setTheme(localTheme)
            writeStoredTheme(localTheme)
          }
          if (!dbNav) {
            setNavStyle(localNav)
            writeStoredNavStyle(localNav)
          }
        }

        hydratedRef.current = true
      } catch {
        hydratedRef.current = true
      }
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [
    isAuthenticated,
    isLoading,
    setTheme,
    setNavStyle,
    resetTheme,
    resetNavStyle,
  ])

  useEffect(() => {
    if (!isAuthenticated || !hydratedRef.current) return

    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false
      return
    }

    const timeout = window.setTimeout(() => {
      void saveUiPreferences({
        theme_preference: theme,
        nav_style: navStyle,
      }).catch(() => {
        // localStorage já está atualizado
      })
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [theme, navStyle, isAuthenticated])

  return null
}
