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
  const [year, month, day] = value.split("-")
  return { day: day ?? "", month: month ?? "", year: year ?? "" }
}

export function buildISODate(
  day: string,
  month: string,
  year: string
): string {
  if (!day || !month || !year) return ""
  return `${year}-${month}-${day.padStart(2, "0")}`
}

export function getDaysInMonth(month: string, year: string): number {
  if (!month || !year) return 31
  return new Date(Number(year), Number(month), 0).getDate()
}

export function formatDateBR(value: string): string {
  if (!value) return "—"
  const { day, month, year } = parseISODate(value)
  if (!day || !month || !year) return "—"
  return `${day.padStart(2, "0")}/${month}/${year}`
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
