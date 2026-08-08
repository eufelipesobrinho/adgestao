import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  readStoredNavStyle,
  writeStoredNavStyle,
  type StoredNavStyle,
} from "@/lib/ui-preferences"

export type NavStyle = StoredNavStyle

interface NavStyleContextValue {
  navStyle: NavStyle
  setNavStyle: (style: NavStyle) => void
  resetNavStyle: () => void
}

const NavStyleContext = createContext<NavStyleContextValue | null>(null)

export function NavStyleProvider({ children }: { children: ReactNode }) {
  const [navStyle, setNavStyleState] = useState<NavStyle>(readStoredNavStyle)

  const setNavStyle = useCallback((style: NavStyle) => {
    setNavStyleState(style)
    writeStoredNavStyle(style)
  }, [])

  const resetNavStyle = useCallback(() => {
    setNavStyleState("sidebar")
  }, [])

  const value = useMemo(
    () => ({ navStyle, setNavStyle, resetNavStyle }),
    [navStyle, setNavStyle, resetNavStyle]
  )

  return (
    <NavStyleContext.Provider value={value}>{children}</NavStyleContext.Provider>
  )
}

export function useNavStyle() {
  const context = useContext(NavStyleContext)
  if (!context) {
    throw new Error("useNavStyle deve ser usado dentro de NavStyleProvider")
  }
  return context
}
