import { useEffect, useState } from "react"
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

interface DateParts {
  day: string
  month: string
  year: string
}

interface DatePickerProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  yearRange?: number
  className?: string
}

function partsFromValue(value: string): DateParts {
  return parseISODate(value)
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
  const [parts, setParts] = useState<DateParts>(() => partsFromValue(value))

  useEffect(() => {
    setParts(partsFromValue(value))
  }, [value])

  const monthOptions = getMonthOptions()
  const yearOptions = getYearOptions(yearRange)
  const dayOptions = getDayOptions(parts.month, parts.year)

  const updateParts = (next: Partial<DateParts>) => {
    const merged = { ...parts, ...next }

    if (merged.day && merged.month && merged.year) {
      const maxDay = getDayOptions(merged.month, merged.year).length
      if (Number(merged.day) > maxDay) {
        merged.day = String(maxDay).padStart(2, "0")
      }
    }

    setParts(merged)

    if (merged.day && merged.month && merged.year) {
      onChange(buildISODate(merged.day, merged.month, merged.year))
    }
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
            value={parts.day || undefined}
            onValueChange={(nextDay) => updateParts({ day: nextDay })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Dia" />
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
            value={parts.month || undefined}
            onValueChange={(nextMonth) => updateParts({ month: nextMonth })}
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
            value={parts.year || undefined}
            onValueChange={(nextYear) => updateParts({ year: nextYear })}
            disabled={disabled}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Ano" />
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
