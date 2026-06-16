import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { QUERY_STALE_TIME } from '@/constants/data'
import { getWeatherInsight } from '@/lib/ai-insight'
import { fetchForecast } from '@/lib/api'
import { describeWeather } from '@/lib/weather-codes'
import { queryKeys } from './queryKeys'

export function forecastQueryOptions(
  location: GeoLocation,
  units: Units,
  dateRange: ForecastDateRange
) {
  return queryOptions({
    queryKey: queryKeys.forecast(location, units, dateRange),
    queryFn: () => fetchForecast(location, units, dateRange),
    staleTime: QUERY_STALE_TIME,
    // Keep the previous forecast on screen while a new range/location loads.
    placeholderData: keepPreviousData,
  })
}

function weatherPlace(location: GeoLocation) {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

function insightRequest(forecast: Forecast, units: Units): AiInsightRequest {
  const today = forecast.daily[0]

  return {
    location: weatherPlace(forecast.location),
    units,
    current: {
      condition: describeWeather(forecast.current.weatherCode),
      temperature: forecast.current.temperature,
      apparentTemperature: forecast.current.apparentTemperature,
      humidity: forecast.current.humidity,
      precipitation: forecast.current.precipitation,
      windSpeed: forecast.current.windSpeed,
      windGusts: forecast.current.windGusts,
      cloudCover: forecast.current.cloudCover,
      pressure: forecast.current.pressure,
      dewPoint: forecast.current.dewPoint,
    },
    today: {
      tempMax: today.tempMax,
      tempMin: today.tempMin,
      rainProbability: today.precipitationProbabilityMax,
      precipitationSum: today.precipitationSum,
      precipitationHours: today.precipitationHours,
      uvIndexMax: today.uvIndexMax,
      windSpeedMax: today.windSpeedMax,
      windGustsMax: today.windGustsMax,
      sunrise: today.sunrise.toISOString(),
      sunset: today.sunset.toISOString(),
    },
    nextHours: forecast.hourly.slice(0, 12).map((hour) => ({
      time: hour.time.toISOString(),
      condition: describeWeather(hour.weatherCode),
      temperature: hour.temperature,
      apparentTemperature: hour.apparentTemperature,
      rainProbability: hour.precipitationProbability,
      precipitation: hour.precipitation,
      windSpeed: hour.windSpeed,
      windGusts: hour.windGusts,
      uvIndex: hour.uvIndex,
      cloudCover: hour.cloudCover,
      pressure: hour.pressure,
      dewPoint: hour.dewPoint,
    })),
  }
}

export function geminiInsightQueryOptions(forecast: Forecast, units: Units) {
  return queryOptions({
    queryKey: queryKeys.geminiInsight(forecast, units),
    queryFn: () => getWeatherInsight({ data: insightRequest(forecast, units) }),
    staleTime: QUERY_STALE_TIME,
    retry: 1,
  })
}
