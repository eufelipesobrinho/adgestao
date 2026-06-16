export type CurrencyTone = "entrada" | "saida" | "saldo"

export function getCurrencyColorClass(
  tone: CurrencyTone,
  amount?: number
): string {
  if (tone === "entrada") return "text-emerald-600"
  if (tone === "saida") return "text-red-500"
  if (amount !== undefined && amount < 0) return "text-red-500"
  return "text-emerald-600"
}
