import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

interface PrivacyContextValue {
  valuesHidden: boolean
  toggleValuesHidden: () => void
  setValuesHidden: (hidden: boolean) => void
}

const STORAGE_KEY = "contabs-hide-values"

const PrivacyContext = createContext<PrivacyContextValue | null>(null)

function getStoredHidden(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEY) === "true"
}

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [valuesHidden, setValuesHiddenState] = useState(getStoredHidden)

  const setValuesHidden = useCallback((hidden: boolean) => {
    setValuesHiddenState(hidden)
    localStorage.setItem(STORAGE_KEY, String(hidden))
  }, [])

  const toggleValuesHidden = useCallback(() => {
    setValuesHiddenState((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ valuesHidden, toggleValuesHidden, setValuesHidden }),
    [valuesHidden, toggleValuesHidden, setValuesHidden]
  )

  return (
    <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (!context) {
    throw new Error("usePrivacy deve ser usado dentro de PrivacyProvider")
  }
  return context
}
