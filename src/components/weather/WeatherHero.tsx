import { animated, useSpring } from '@react-spring/web'
import { CloudRain, Droplets, Sunrise, Sunset, ThermometerSun, Wind } from 'lucide-react'
import { formatTemp, WIND_UNIT_LABEL } from '@/lib/format'
import { describeWeather, weatherIcon } from '@/lib/weather-codes'

export function WeatherHero({ forecast, units }: { forecast: Forecast; units: Units }) {
  const { current, location, daily } = forecast
  const Icon = weatherIcon(current.weatherCode, current.isDay)
  const place = [location.name, location.admin1, location.country].filter(Boolean).join(', ')
  const today = daily[0]
  const daylightHours = Math.round(today.daylightDuration / 3600)
  const rangePosition =
    ((current.temperature - today.tempMin) / Math.max(today.tempMax - today.tempMin, 1)) * 100
  const iconSpring = useSpring({
    from: { transform: 'scale(0.92) rotate(-4deg)', opacity: 0 },
    to: { transform: 'scale(1) rotate(0deg)', opacity: 1 },
    config: { tension: 180, friction: 18 },
  })

  const details = [
    {
      label: 'Rain today',
      value: `${Math.round(today.precipitationProbabilityMax)}%`,
      icon: CloudRain,
    },
    { label: 'Humidity', value: `${Math.round(current.humidity)}%`, icon: Droplets },
    {
      label: 'Wind',
      value: `${Math.round(current.windSpeed)} ${WIND_UNIT_LABEL[units.windSpeed]}`,
      icon: Wind,
    },
    {
      label: 'Sunrise',
      value: today.sunrise.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }),
      icon: Sunrise,
    },
    {
      label: 'Sunset',
      value: today.sunset.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
      icon: Sunset,
    },
    { label: 'Daylight', value: `${daylightHours}h`, icon: ThermometerSun },
  ]

  return (
    <div className="island-shell relative grid min-w-0 gap-4 overflow-hidden rounded-[28px] p-4 text-card-foreground lg:grid-cols-[0.82fr_1fr_1fr]">
      <div className="relative min-w-0 overflow-hidden rounded-3xl bg-gradient-to-br from-(--sea-ink) via-(--lagoon-deep) to-(--palm) p-5 text-white">
        <animated.div style={iconSpring}>
          <Icon className="-right-4 -bottom-5 pointer-events-none absolute size-44 text-white opacity-15" />
        </animated.div>
        <p className="truncate font-semibold text-sm text-white/78">{place}</p>
        <div className="relative mt-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-black text-7xl tracking-tight">
              {formatTemp(current.temperature)}
            </p>
            <h2 className="mt-1 truncate font-extrabold text-2xl">
              {describeWeather(current.weatherCode)}
            </h2>
          </div>
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/14 ring-1 ring-white/20">
            <Icon className="size-9" />
          </span>
        </div>
        <p className="relative mt-5 max-w-sm text-sm text-white/78">
          Feels like {formatTemp(current.apparentTemperature)}. Today ranges from{' '}
          {formatTemp(today.tempMin)} to {formatTemp(today.tempMax)}.
        </p>
      </div>

      <div className="min-w-0 rounded-3xl border border-(--chip-line) bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs">Today&apos;s operating window</p>
            <h3 className="mt-1 font-extrabold text-(--sea-ink) text-xl">
              {Math.round(today.precipitationProbabilityMax)}% rain · UV{' '}
              {Math.round(today.uvIndexMax)}
            </h3>
          </div>
          <span className="rounded-full bg-(--chip-bg) px-3 py-1 font-bold text-(--lagoon-deep) text-xs">
            Updated now
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-(--chip-line) bg-(--chip-bg) p-3">
          <div className="mb-2 flex items-center justify-between text-(--sea-ink-soft) text-xs">
            <span className="inline-flex items-center gap-1.5">
              <ThermometerSun className="size-3.5" />
              Daily range
            </span>
            <span>
              {formatTemp(today.tempMin)} / {formatTemp(today.tempMax)}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-(--sand)">
            <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-(--lagoon) to-(--palm) opacity-80" />
            <span
              className="-top-1.5 absolute size-5 rounded-full border-2 border-white bg-(--sea-ink) shadow"
              style={{ left: `calc(${Math.min(Math.max(rangePosition, 0), 100)}% - 10px)` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <p className="rounded-2xl bg-(--chip-bg) p-3 text-muted-foreground">
            Sunrise
            <span className="mt-1 block font-extrabold text-(--sea-ink)">
              {today.sunrise.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </p>
          <p className="rounded-2xl bg-(--chip-bg) p-3 text-muted-foreground">
            Sunset
            <span className="mt-1 block font-extrabold text-(--sea-ink)">
              {today.sunset.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </p>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="min-w-0 rounded-2xl border border-(--chip-line) bg-card p-3"
          >
            <div className="flex items-center gap-1.5 text-(--sea-ink-soft) text-xs">
              <detail.icon className="size-3.5 shrink-0 text-(--lagoon-deep)" />
              <span className="truncate">{detail.label}</span>
            </div>
            <p className="mt-1 truncate font-extrabold text-(--sea-ink) text-lg">
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
