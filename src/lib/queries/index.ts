import { useQuery } from '@tanstack/react-query'
import { HOUR } from '@/constants/data'
import { useWeatherApp } from '@/context'
import { searchLocations } from '@/lib/api'
import { queryKeys } from './queryKeys'
import { forecastQueryOptions, geminiInsightQueryOptions } from './queryOptions'

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

/** Forecast for the active location, refetched when location, units, or range change. */
export function useForecast() {
  const { selectedLocation, units, dateRange } = useWeatherApp()
  return useQuery(forecastQueryOptions(selectedLocation, units, dateRange))
}

/** Optional Gemini-generated operational insight for the loaded forecast. */
export function useGeminiInsight(forecast: Forecast) {
  const { units } = useWeatherApp()
  return useQuery(geminiInsightQueryOptions(forecast, units))
}
