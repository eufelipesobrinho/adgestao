const MONTHS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
]

export function parseISODate(value: string): {
  day: string
  month: string
  year: string
} {
  if (!value) return { day: "", month: "", year: "" }
  const datePart = value.includes("T") ? value.split("T")[0] : value.split(" ")[0]
  const [year, month, day] = datePart.split("-")
  return {
    day: day?.padStart(2, "0") ?? "",
    month: month ?? "",
    year: year ?? "",
  }
}

export function buildISODate(
  day: string,
  month: string,
  year: string
): string {
  if (!day || !month || !year) return ""
  const paddedDay = day.padStart(2, "0")
  const maxDay = getDaysInMonth(month, year)
  const clampedDay = String(Math.min(Number(paddedDay), maxDay)).padStart(2, "0")
  return `${year}-${month}-${clampedDay}`
}

export function getDaysInMonth(month: string, year: string): number {
  if (!month || !year) return 31
  return new Date(Number(year), Number(month), 0).getDate()
}

export function formatDateBR(value: string): string {
  if (!value) return "—"
  const { day, month, year } = parseISODate(value)
  if (!day || !month || !year) return "—"
  return `${day}/${month}/${year}`
}

export function getMonthOptions() {
  return MONTHS
}

export function getYearOptions(range = 100): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: range }, (_, index) => {
    const year = String(currentYear - index)
    return { value: year, label: year }
  })
}

export function getDayOptions(month: string, year: string) {
  const totalDays = getDaysInMonth(month, year)
  return Array.from({ length: totalDays }, (_, index) => {
    const day = String(index + 1).padStart(2, "0")
    return { value: day, label: day }
  })
}

export function getMonthLabel(month: number, year: number): string {
  const date = new Date(year, month - 1, 1)
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date)
}

export function getMonthRange(month: number, year: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = getDaysInMonth(String(month).padStart(2, "0"), String(year))
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  return { start, end }
}

export function getCurrentMonthRange() {
  const now = new Date()
  return getMonthRange(now.getMonth() + 1, now.getFullYear())
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function parseCurrencyInput(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}
