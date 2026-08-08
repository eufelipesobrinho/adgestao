export type CurrencyTone = "entrada" | "saida" | "saldo"

export function getCurrencyColorClass(
  tone: CurrencyTone,
  amount?: number
): string {
  if (tone === "entrada") return "text-emerald-600 dark:text-emerald-400"
  if (tone === "saida") return "text-red-600 dark:text-red-400"
  if (amount !== undefined && amount < 0) return "text-red-600 dark:text-red-400"
  return "text-emerald-600 dark:text-emerald-400"
}
