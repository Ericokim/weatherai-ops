import { Brain, CloudRain, Sun, ThermometerSun, Wind } from 'lucide-react'
import { formatTemp } from '@/lib/format'

function uvLabel(uv: number): string {
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very high'
  return 'Extreme'
}

function levelColor(level: string): string {
  switch (level) {
    case 'low':
      return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
    case 'medium':
      return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30'
    default:
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
  }
}

export function WeatherInsights({
  forecast,
  aiInsight,
  aiPending,
  aiError,
}: {
  forecast: Forecast
  aiInsight?: AiInsight
  aiPending: boolean
  aiError: boolean
}) {
  const today = forecast.daily[0]
  const localActions = [
    today.precipitationProbabilityMax >= 50
      ? 'Plan around rain windows and keep outdoor work flexible.'
      : 'Rain risk is limited, so most outdoor plans can stay on schedule.',
    today.uvIndexMax >= 6
      ? 'Use sun protection around midday when UV peaks.'
      : 'UV exposure is manageable, but keep checking midday conditions.',
    forecast.current.windSpeed >= 25
      ? 'Watch wind-sensitive tasks and loose outdoor equipment.'
      : 'Wind is not the main constraint right now.',
  ]
  const localSignals = [
    `${Math.round(today.precipitationProbabilityMax)}% rain probability`,
    `UV max ${Math.round(today.uvIndexMax)}`,
    `${Math.round(today.windGustsMax)} max gusts`,
  ]
  const cards = [
    {
      title: 'UV exposure',
      value: uvLabel(today.uvIndexMax),
      detail: `Peak UV index of ${Math.round(today.uvIndexMax)} expected today.`,
      icon: Sun,
    },
    {
      title: 'Rain outlook',
      value: `${Math.round(today.precipitationProbabilityMax)}%`,
      detail: `${Math.round(today.precipitationHours)}h of rain expected today.`,
      icon: CloudRain,
    },
    {
      title: 'Temperature range',
      value: `${formatTemp(today.tempMin)} – ${formatTemp(today.tempMax)}`,
      detail: `Now ${formatTemp(forecast.current.temperature)}, feels like ${formatTemp(
        forecast.current.apparentTemperature
      )}.`,
      icon: ThermometerSun,
    },
    {
      title: 'Wind max',
      value: `${Math.round(today.windSpeedMax)}`,
      detail: `Gusts up to ${Math.round(today.windGustsMax)}.`,
      icon: Wind,
    },
  ]
  const summary =
    aiInsight?.summary ??
    (today.precipitationProbabilityMax >= 50
      ? 'Rain is the main planning factor today, with midday UV also worth managing.'
      : 'Conditions are mostly manageable today, with UV exposure and temperature swings as the main watch points.')
  const riskLevel =
    aiInsight?.riskLevel ??
    (today.precipitationProbabilityMax >= 60 || today.windGustsMax >= 40
      ? 'high'
      : today.precipitationProbabilityMax >= 35 || today.uvIndexMax >= 6
        ? 'medium'
        : 'low')
  const riskScore =
    aiInsight?.riskScore ?? (riskLevel === 'high' ? 4 : riskLevel === 'medium' ? 3 : 2)
  const confidence = aiInsight?.confidence ?? 'medium'

  return (
    <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-2xl border border-(--chip-line) bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs">Operational outlook</p>
            <p className="mt-1 font-extrabold text-card-foreground text-2xl">
              {aiPending ? 'Analyzing forecast' : `Risk ${riskScore}/5 · ${riskLevel}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wide ${levelColor(
                confidence
              )}`}
            >
              {confidence}
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-(--chip-bg) text-(--lagoon-deep)">
              <Brain className="size-5" />
            </span>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground text-sm leading-6">
          {aiPending ? 'Building a concise readout from the latest weather data.' : summary}
        </p>
        {aiError ? (
          <p className="mt-2 text-muted-foreground text-xs">
            Generated brief unavailable; showing the app's data-backed fallback.
          </p>
        ) : null}
        <div className="mt-4 grid gap-2">
          {(aiInsight?.recommendedActions.length
            ? aiInsight.recommendedActions
            : localActions
          ).map((action) => (
            <p key={action} className="rounded-xl bg-(--chip-bg) px-3 py-2 text-sm leading-5">
              {action}
            </p>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {(aiInsight?.keySignals.length ? aiInsight.keySignals : localSignals).map(
            (signal) => (
              <p
                key={signal}
                className="rounded-xl border border-(--chip-line) px-3 py-2 text-muted-foreground text-xs leading-5"
              >
                {signal}
              </p>
            )
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex items-start gap-3 rounded-2xl border border-(--chip-line) bg-card p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--chip-bg) text-(--lagoon-deep)">
              <card.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">{card.title}</p>
              <p className="mt-1 font-extrabold text-card-foreground text-xl">{card.value}</p>
              <p className="mt-1 text-muted-foreground text-sm">{card.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
