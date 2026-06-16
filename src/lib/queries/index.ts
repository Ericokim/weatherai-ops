import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useWeatherApp } from '#/context'
import { searchLocations } from '#/lib/api'
import { queryKeys } from './queryKeys'
import { forecastQueryOptions, geminiInsightQueryOptions } from './queryOptions'

const HOUR = 1000 * 60 * 60

/** Geocoding search for the global search box. */
export function useLocationSearch(query: string) {
  const name = query.trim()
  return useQuery({
    queryKey: queryKeys.locations(name),
    queryFn: ({ signal }) => searchLocations(name, signal),
    enabled: name.length >= 2,
    staleTime: HOUR,
  })
}

/** Forecast for the active location, refetched when location or units change. */
export function useForecast() {
  const { selectedLocation, units } = useWeatherApp()
  return useSuspenseQuery(forecastQueryOptions(selectedLocation, units))
}

/** Optional Gemini-generated operational insight for the loaded forecast. */
export function useGeminiInsight(forecast: Forecast) {
  const { units } = useWeatherApp()
  return useQuery(geminiInsightQueryOptions(forecast, units))
}
