import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMonthLabel } from "@/lib/dates"
import { Button } from "@/components/ui/button"

interface MonthNavigatorProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

export function MonthNavigator({ month, year, onChange }: MonthNavigatorProps) {
  const goToPrevious = () => {
    if (month === 1) onChange(12, year - 1)
    else onChange(month - 1, year)
  }

  const goToNext = () => {
    if (month === 12) onChange(1, year + 1)
    else onChange(month + 1, year)
  }

  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <Button variant="ghost" size="icon" onClick={goToPrevious}>
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Mês anterior</span>
      </Button>
      <span className="min-w-[180px] text-center text-sm font-semibold capitalize text-slate-900 sm:text-base">
        {getMonthLabel(month, year)}
      </span>
      <Button variant="ghost" size="icon" onClick={goToNext}>
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Próximo mês</span>
      </Button>
    </div>
  )
}
