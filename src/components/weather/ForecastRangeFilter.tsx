import { CalendarDays, RotateCcw } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  addDays,
  dateInputValue,
  defaultDateRange,
  FORECAST_RANGE_PRESETS,
  MAX_FORECAST_DAYS,
  MAX_PAST_DAYS,
} from '@/constants/data'
import { useWeatherApp } from '@/context'
import { cn } from '@/lib/utils'

export function ForecastRangeFilter() {
  const { dateRange, setDateRange } = useWeatherApp()
  const today = startOfDay(new Date())
  const maxDate = addDays(today, MAX_FORECAST_DAYS - 1)
  const minDate = addDays(today, -(MAX_PAST_DAYS - 1))

  function applyDays(days: number) {
    setDateRange({
      startDate: dateInputValue(today),
      endDate: dateInputValue(addDays(today, days - 1)),
    })
  }

  function selectRange(range: DateRange | undefined) {
    if (!range?.from) return
    setDateRange({
      startDate: dateInputValue(range.from),
      endDate: dateInputValue(range.to || range.from),
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={`Forecast date range, currently ${dateLabel(dateRange)}`}
          className="h-11 w-full justify-start gap-2 rounded-xl border-(--chip-line) bg-(--chip-bg) px-3 font-semibold text-(--sea-ink) shadow-[0_1px_0_var(--inset-glint)_inset] hover:bg-(--link-bg-hover) sm:w-auto"
        >
          <CalendarDays className="size-4 shrink-0 text-(--lagoon-deep)" aria-hidden="true" />
          <span className="truncate">{dateLabel(dateRange)}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[min(calc(100vw-2rem),46rem)] overflow-hidden p-0"
      >
        <div className="grid md:grid-cols-[12rem_1fr]">
          <aside className="border-border border-b bg-muted/40 p-3 md:border-r md:border-b-0">
            <div className="mb-3">
              <p className="font-bold text-sm">Forecast API</p>
              <p className="text-muted-foreground text-xs">
                Past {MAX_PAST_DAYS} days through a {MAX_FORECAST_DAYS}-day forecast.
              </p>
            </div>

            <div className="grid gap-1">
              {FORECAST_RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyDays(preset.days)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-left font-semibold text-sm transition hover:bg-background',
                    presetActive(dateRange, preset.days)
                      ? 'bg-primary text-primary-foreground hover:bg-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setDateRange(defaultDateRange())}
              className="mt-3 h-9 w-full justify-start gap-2 rounded-lg"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </aside>

          <div className="min-w-0 overflow-auto p-3">
            <Calendar
              mode="range"
              captionLayout="dropdown"
              selected={toCalendarRange(dateRange)}
              onSelect={selectRange}
              numberOfMonths={2}
              startMonth={minDate}
              endMonth={maxDate}
              disabled={{ before: minDate, after: maxDate }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toCalendarRange(dateRange: ForecastDateRange): DateRange {
  return {
    from: new Date(`${dateRange.startDate}T00:00:00`),
    to: new Date(`${dateRange.endDate}T00:00:00`),
  }
}

function presetActive(dateRange: ForecastDateRange, days: number) {
  const today = startOfDay(new Date())
  return (
    dateRange.startDate === dateInputValue(today) &&
    dateRange.endDate === dateInputValue(addDays(today, days - 1))
  )
}

function dateLabel(dateRange: ForecastDateRange) {
  const from = new Date(`${dateRange.startDate}T00:00:00`)
  const to = new Date(`${dateRange.endDate}T00:00:00`)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${from.toLocaleDateString(undefined, options)} - ${to.toLocaleDateString(undefined, options)}`
}
