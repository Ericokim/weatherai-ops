import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  APP_STORAGE_KEY,
  DEFAULT_LOCATION,
  DEFAULT_UNITS,
  defaultDateRange,
  MAX_RECENTS,
  normalizeDateRange,
} from '@/constants/data'

const WeatherAppContext = createContext<WeatherAppContextValue | null>(null)

export function WeatherAppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WeatherAppState>({
    selectedLocation: DEFAULT_LOCATION,
    recentLocations: [],
    units: DEFAULT_UNITS,
    dateRange: defaultDateRange(),
  })

  // Hydrate from storage after mount to keep SSR markup stable.
  useEffect(() => {
    const stored = window.localStorage.getItem(APP_STORAGE_KEY)
    if (!stored) return
    try {
      setState((prev) => {
        const next = { ...prev, ...(JSON.parse(stored) as WeatherAppState) }
        return { ...next, dateRange: normalizeDateRange(next.dateRange) }
      })
    } catch {
      window.localStorage.removeItem(APP_STORAGE_KEY)
    }
  }, [])

  // Single place that updates state and persists it.
  const apply = useCallback((updater: (prev: WeatherAppState) => WeatherAppState) => {
    setState((prev) => {
      const next = updater(prev)
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setSelectedLocation = useCallback(
    (location: GeoLocation) =>
      apply((prev) => ({
        ...prev,
        selectedLocation: location,
        recentLocations: [
          location,
          ...prev.recentLocations.filter((item) => item.id !== location.id),
        ].slice(0, MAX_RECENTS),
      })),
    [apply]
  )

  const setUnits = useCallback((units: Units) => apply((prev) => ({ ...prev, units })), [apply])
  const setDateRange = useCallback(
    (dateRange: ForecastDateRange) =>
      apply((prev) => ({ ...prev, dateRange: normalizeDateRange(dateRange) })),
    [apply]
  )

  const value = useMemo<WeatherAppContextValue>(
    () => ({ ...state, setSelectedLocation, setUnits, setDateRange }),
    [state, setSelectedLocation, setUnits, setDateRange]
  )

  return <WeatherAppContext value={value}>{children}</WeatherAppContext>
}

export function useWeatherApp() {
  const context = useContext(WeatherAppContext)
  if (!context) {
    throw new Error('useWeatherApp must be used within a WeatherAppProvider')
  }
  return context
}
