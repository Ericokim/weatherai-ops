import { createFileRoute } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LoadingState } from '#/components/shared/LoadingState'
import { PageHeader } from '#/components/shared/PageHeader'
import { RouteErrorComponent } from '#/components/shared/RouteError'
import { Button } from '#/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import { storageKey, themes } from '#/constants/data'
import { useWeatherApp } from '#/context'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/settings')({
  component: Settings,
  errorComponent: RouteErrorComponent,
  pendingComponent: () => <LoadingState label="Loading settings…" />,
})

function Settings() {
  const { units, setUnits, recentLocations } = useWeatherApp()
  const [theme, setTheme] = useState<ThemeMode>('system')

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) as ThemeMode | null
    setTheme(saved ?? 'system')
  }, [])

  function setThemeMode(mode: ThemeMode) {
    setTheme(mode)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = mode === 'dark' || (mode === 'system' && prefersDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
    window.localStorage.setItem(storageKey, mode)
  }

  function clearRecents() {
    if (recentLocations.length > 0) {
      window.localStorage.removeItem('weatherai-app-state')
      window.location.reload()
    }
  }

  return (
    <section className="grid gap-5">
      <PageHeader title="Settings" description="Customize your weather experience." />

      <div className="island-shell grid gap-4 rounded-3xl p-5 text-card-foreground">
        <h2 className="font-bold text-lg">Units</h2>
        <UnitRow
          label="Temperature"
          description="Controls all current, hourly, and daily temperature readings."
          value={units.temperature}
          options={[
            ['celsius', '°C'],
            ['fahrenheit', '°F'],
          ]}
          onChange={(temperature) => setUnits({ ...units, temperature })}
        />
        <UnitRow
          label="Wind speed"
          description="Used in the hero, hourly cards, and forecast metrics."
          value={units.windSpeed}
          options={[
            ['kmh', 'km/h'],
            ['mph', 'mph'],
            ['ms', 'm/s'],
            ['kn', 'kn'],
          ]}
          onChange={(windSpeed) => setUnits({ ...units, windSpeed })}
        />
        <UnitRow
          label="Precipitation"
          description="Used for current precipitation and daily totals."
          value={units.precipitation}
          options={[
            ['mm', 'mm'],
            ['inch', 'inch'],
          ]}
          onChange={(precipitation) => setUnits({ ...units, precipitation })}
        />
      </div>

      <div className="island-shell grid gap-4 rounded-3xl p-5 text-card-foreground">
        <h2 className="font-bold text-lg">Appearance</h2>
        <p className="text-muted-foreground text-sm">
          Choose your theme preference. System follows your device settings.
        </p>
        <div className="flex gap-2">
          {themes.map(({ value: key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setThemeMode(key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold text-sm transition',
                theme === key
                  ? 'border-(--lagoon-deep) bg-(--lagoon-deep)/10 text-(--lagoon-deep) ring-1 ring-(--lagoon-deep)/30'
                  : 'border-(--chip-line) bg-(--chip-bg) text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="island-shell grid gap-4 rounded-3xl p-5 text-card-foreground">
        <h2 className="font-bold text-lg">Data</h2>
        <div className="grid gap-3 rounded-2xl border border-(--chip-line) bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <span className="min-w-0">
            <span className="block font-bold">Recent locations</span>
            <span className="mt-1 block text-muted-foreground text-sm">
              {recentLocations.length} saved location{recentLocations.length !== 1 ? 's' : ''}
            </span>
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={clearRecents}
                disabled={recentLocations.length === 0}
                className="gap-1.5 bg-(--lagoon-deep) text-white shadow-sm hover:bg-(--lagoon-deep)/90"
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear recent locations</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid gap-2 rounded-2xl border border-(--chip-line) bg-card p-4">
          <span className="block font-bold">WeatherAI Ops</span>
          <span className="block text-muted-foreground text-xs">
            v1.0.0 &middot; Powered by Open-Meteo &amp; Gemini
          </span>
          <span className="block text-muted-foreground text-xs">
            Data refreshes every 10 minutes. Last fetch uses your selected units.
          </span>
        </div>
      </div>
    </section>
  )
}

function UnitRow<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string
  description: string
  value: T
  options: Array<[T, string]>
  onChange: (value: T) => void
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-(--chip-line) bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <span className="min-w-0">
        <span className="block font-bold">{label}</span>
        <span className="mt-1 block text-muted-foreground text-sm">{description}</span>
      </span>
      <div className="inline-flex w-fit rounded-2xl border border-(--chip-line) bg-(--chip-bg) p-1 shadow-sm">
        {options.map(([key, text]) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(key)}
                className={cn(
                  'rounded-xl px-4 font-bold transition focus-visible:ring-2 focus-visible:ring-(--lagoon-deep) focus-visible:ring-offset-2',
                  value === key
                    ? 'bg-(--lagoon-deep) text-white shadow-sm hover:bg-(--lagoon-deep)'
                    : 'text-(--sea-ink-soft) hover:bg-(--link-bg-hover) hover:text-(--sea-ink)'
                )}
              >
                {text}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Set {label.toLowerCase()} to {text}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
