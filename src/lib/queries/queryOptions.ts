import { queryOptions } from '@tanstack/react-query'
import { getWeatherInsight } from '#/lib/ai-insight'
import { fetchForecast } from '#/lib/api'
import { describeWeather } from '#/lib/weather-codes'
import { queryKeys } from './queryKeys'

export function forecastQueryOptions(location: GeoLocation, units: Units) {
  return queryOptions({
    queryKey: queryKeys.forecast(location, units),
    queryFn: () => fetchForecast(location, units),
    staleTime: 1000 * 60 * 10,
  })
}

export function geminiInsightQueryOptions(forecast: Forecast, units: Units) {
  const today = forecast.daily[0]
  const request: AiInsightRequest = {
    location: [forecast.location.name, forecast.location.admin1, forecast.location.country]
      .filter(Boolean)
      .join(', '),
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

  return queryOptions({
    queryKey: queryKeys.geminiInsight(forecast, units),
    queryFn: () => getWeatherInsight({ data: request }),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}
