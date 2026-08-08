import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type NavStyle = "sidebar" | "top"

interface NavStyleContextValue {
  navStyle: NavStyle
  setNavStyle: (style: NavStyle) => void
}

const STORAGE_KEY = "contabs-nav-style"

const NavStyleContext = createContext<NavStyleContextValue | null>(null)

function getStoredNavStyle(): NavStyle {
  if (typeof window === "undefined") return "sidebar"
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === "top" ? "top" : "sidebar"
}

export function NavStyleProvider({ children }: { children: ReactNode }) {
  const [navStyle, setNavStyleState] = useState<NavStyle>(getStoredNavStyle)

  const setNavStyle = useCallback((style: NavStyle) => {
    setNavStyleState(style)
    localStorage.setItem(STORAGE_KEY, style)
  }, [])

  const value = useMemo(
    () => ({ navStyle, setNavStyle }),
    [navStyle, setNavStyle]
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
