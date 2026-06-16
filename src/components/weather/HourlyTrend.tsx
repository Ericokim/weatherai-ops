import { animated, type SpringValues, useSprings } from '@react-spring/web'
import { Droplets, ShieldCheck, Wind } from 'lucide-react'
import { formatHour, formatTemp, WIND_UNIT_LABEL } from '@/lib/format'
import { describeWeather, weatherIcon } from '@/lib/weather-codes'

export function HourlyTrend({ hours, units }: { hours: HourlyForecast[]; units: Units }) {
  const temps = hours.map((hour) => hour.temperature)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const range = max - min || 1
  const springs = useSprings(
    hours.length,
    hours.map((hour) => ({
      from: { height: '0%' },
      to: { height: `${24 + ((hour.temperature - min) / range) * 76}%` },
      config: { tension: 220, friction: 22 },
    }))
  )

  return (
    <div className="weather-scroll max-w-full min-w-0 overflow-x-auto overscroll-x-contain px-1 pb-2">
      <div className="flex w-max min-w-full items-stretch gap-2">
        {hours.map((hour, index) => (
          <HourlyPoint
            key={hour.time.toISOString()}
            hour={hour}
            units={units}
            barStyle={springs[index]}
          />
        ))}
      </div>
    </div>
  )
}

function HourlyPoint({
  hour,
  units,
  barStyle,
}: {
  hour: HourlyForecast
  units: Units
  barStyle: SpringValues<{ height: string }>
}) {
  const Icon = weatherIcon(hour.weatherCode)

  return (
    <animated.div className="flex w-[106px] shrink-0 flex-col justify-between rounded-2xl border border-(--chip-line) bg-card px-3 py-3 shadow-sm transition-colors hover:bg-(--link-bg-hover) hover:ring-2 hover:ring-(--lagoon-deep)/20">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-sm">{formatHour(hour.time)}</span>
          <Icon className="size-4 text-(--lagoon-deep)" />
        </div>
        <p className="mt-1 line-clamp-2 min-h-8 text-muted-foreground text-xs">
          {describeWeather(hour.weatherCode)}
        </p>
      </div>

      <div className="mt-3 flex h-32 items-end justify-center">
        <animated.div
          style={barStyle}
          className="w-3 rounded-full bg-gradient-to-t from-(--lagoon-deep) to-(--lagoon)"
        />
      </div>

      <div className="mt-3 space-y-1 text-xs">
        <p className="font-extrabold text-card-foreground text-lg">
          {formatTemp(hour.temperature)}
        </p>
        <p className="text-muted-foreground">Feels {formatTemp(hour.apparentTemperature)}</p>
        <p className="inline-flex items-center gap-1 text-muted-foreground">
          <Droplets className="size-3" />
          {Math.round(hour.precipitationProbability)}%
        </p>
        <p className="flex items-center gap-1 text-muted-foreground">
          <Wind className="size-3" />
          {Math.round(hour.windSpeed)} {WIND_UNIT_LABEL[units.windSpeed]}
        </p>
        <p className="flex items-center gap-1 text-muted-foreground">
          <ShieldCheck className="size-3" />
          UV {Math.round(hour.uvIndex)}
        </p>
      </div>
    </animated.div>
  )
}
