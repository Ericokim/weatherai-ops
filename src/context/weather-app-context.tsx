import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'weatherai-app-state'
const MAX_RECENTS = 5

// Sensible default so the dashboard renders before any search is made.
const DEFAULT_LOCATION: GeoLocation = {
  id: 184745,
  name: 'Nairobi',
  latitude: -1.28333,
  longitude: 36.81667,
  country: 'Kenya',
  countryCode: 'KE',
  admin1: 'Nairobi County',
  timezone: 'Africa/Nairobi',
}

const DEFAULT_UNITS: Units = {
  temperature: 'celsius',
  windSpeed: 'kmh',
  precipitation: 'mm',
}

interface WeatherAppState {
  selectedLocation: GeoLocation
  recentLocations: GeoLocation[]
  units: Units
}

interface WeatherAppContextValue extends WeatherAppState {
  setSelectedLocation: (location: GeoLocation) => void
  setUnits: (units: Units) => void
}

const WeatherAppContext = createContext<WeatherAppContextValue | null>(null)

export function WeatherAppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WeatherAppState>({
    selectedLocation: DEFAULT_LOCATION,
    recentLocations: [],
    units: DEFAULT_UNITS,
  })

  // Hydrate from storage after mount to keep SSR markup stable.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    try {
      setState((prev) => ({ ...prev, ...(JSON.parse(stored) as WeatherAppState) }))
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Single place that updates state and persists it.
  const apply = useCallback((updater: (prev: WeatherAppState) => WeatherAppState) => {
    setState((prev) => {
      const next = updater(prev)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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

  const value = useMemo<WeatherAppContextValue>(
    () => ({ ...state, setSelectedLocation, setUnits }),
    [state, setSelectedLocation, setUnits]
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
