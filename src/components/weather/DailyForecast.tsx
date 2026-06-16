import {
  Ellipsis,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  Wind,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatTemp, formatWeekday, WIND_UNIT_LABEL } from '@/lib/format'
import { navIconButton } from '@/lib/ui'
import { describeWeather, weatherIcon } from '@/lib/weather-codes'

function DayCard({
  day,
  index,
  minTemp,
  maxTemp,
  units,
}: {
  day: DailyForecast
  index: number
  minTemp: number
  maxTemp: number
  units: Units
}) {
  const Icon = weatherIcon(day.weatherCode)
  const tempRange = Math.max(maxTemp - minTemp, 1)
  const rangeStart = ((day.tempMin - minTemp) / tempRange) * 100
  const rangeWidth = ((day.tempMax - day.tempMin) / tempRange) * 100

  return (
    <div className="rounded-2xl border border-(--chip-line) bg-card p-4 transition hover:-translate-y-0.5 hover:bg-(--link-bg-hover) hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-sm">{index === 0 ? 'Today' : formatWeekday(day.date)}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {describeWeather(day.weatherCode)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--chip-bg) text-(--lagoon-deep)">
            <Icon className="size-5" />
          </span>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    aria-label="More details"
                    className={navIconButton}
                  >
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Day details</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                {index === 0 ? 'Today' : formatWeekday(day.date)} details
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <Thermometer className="size-3.5 text-(--lagoon-deep)" />
                <span>
                  Feels like {formatTemp(day.apparentTempMax)} /{' '}
                  {formatTemp(day.apparentTempMin)}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <Umbrella className="size-3.5 text-(--lagoon-deep)" />
                <span>Rain {Math.round(day.precipitationHours)}h</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <Wind className="size-3.5 text-(--lagoon-deep)" />
                <span>
                  Gusts {Math.round(day.windGustsMax)} {WIND_UNIT_LABEL[units.windSpeed]}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <Sun className="size-3.5 text-(--lagoon-deep)" />
                <span>Daylight {Math.round(day.daylightDuration / 3600)}h</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <Sunrise className="size-3.5 text-(--lagoon-deep)" />
                <span>
                  Sunrise{' '}
                  {day.sunrise.toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <Sunset className="size-3.5 text-(--lagoon-deep)" />
                <span>
                  Sunset{' '}
                  {day.sunset.toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Gauge className="size-3.5" />
                <span>
                  Wind {Math.round(day.windSpeedMax)} {WIND_UNIT_LABEL[units.windSpeed]}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-black text-2xl">{formatTemp(day.tempMax)}</p>
          <div className="text-right text-xs">
            <p className="text-muted-foreground">{formatTemp(day.tempMin)} low</p>
            <p className="text-muted-foreground">{formatTemp(day.tempMean)} avg</p>
          </div>
        </div>
        <div className="relative mt-3 h-2 rounded-full bg-(--sand)">
          <span
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-(--lagoon) to-(--palm)"
            style={{
              left: `${Math.min(Math.max(rangeStart, 0), 100)}%`,
              width: `${Math.max(rangeWidth, 8)}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <p className="rounded-xl bg-(--chip-bg) px-2 py-2 text-muted-foreground">
          Rain
          <span className="block font-bold text-(--sea-ink)">
            {Math.round(day.precipitationProbabilityMax)}%
          </span>
        </p>
        <p className="rounded-xl bg-(--chip-bg) px-2 py-2 text-muted-foreground">
          UV
          <span className="block font-bold text-(--sea-ink)">{Math.round(day.uvIndexMax)}</span>
        </p>
        <p className="rounded-xl bg-(--chip-bg) px-2 py-2 text-muted-foreground">
          Wind
          <span className="block font-bold text-(--sea-ink)">
            {Math.round(day.windSpeedMax)} {WIND_UNIT_LABEL[units.windSpeed]}
          </span>
        </p>
      </div>
    </div>
  )
}

export function DailyForecast({ days, units }: { days: DailyForecast[]; units: Units }) {
  const minTemp = Math.min(...days.map((d) => d.tempMin))
  const maxTemp = Math.max(...days.map((d) => d.tempMax))
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {days.map((day, index) => (
        <DayCard
          key={day.date.toISOString()}
          day={day}
          index={index}
          minTemp={minTemp}
          maxTemp={maxTemp}
          units={units}
        />
      ))}
    </div>
  )
}
