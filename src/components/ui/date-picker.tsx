import {
  buildISODate,
  getDayOptions,
  getMonthOptions,
  getYearOptions,
  parseISODate,
} from "@/lib/dates"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  yearRange?: number
  className?: string
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  disabled = false,
  yearRange = 100,
  className,
}: DatePickerProps) {
  const { day, month, year } = parseISODate(value)
  const dayOptions = getDayOptions(month, year)
  const monthOptions = getMonthOptions()
  const yearOptions = getYearOptions(yearRange)

  const updateDate = (next: Partial<{ day: string; month: string; year: string }>) => {
    const nextDay = next.day ?? day
    const nextMonth = next.month ?? month
    const nextYear = next.year ?? year
    onChange(buildISODate(nextDay, nextMonth, nextYear))
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div
        id={id}
        className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2"
      >
        <div className="space-y-1">
          <span className="px-1 text-xs font-medium text-slate-500">Dia</span>
          <Select
            value={day}
            onValueChange={(nextDay) => updateDate({ day: nextDay })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="DD" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <span className="px-1 text-xs font-medium text-slate-500">Mês</span>
          <Select
            value={month}
            onValueChange={(nextMonth) => updateDate({ month: nextMonth })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <span className="px-1 text-xs font-medium text-slate-500">Ano</span>
          <Select
            value={year}
            onValueChange={(nextYear) => updateDate({ year: nextYear })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="AAAA" />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {yearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
