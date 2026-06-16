import axios from 'axios'
import {
  CURRENT_FORECAST_FIELDS,
  DAILY_FORECAST_FIELDS,
  HOURLY_FORECAST_FIELDS,
  HOURLY_WINDOW,
} from '@/constants/data'
import { env } from '@/env'

const geocodingApi = axios.create({
  baseURL: env.VITE_OPEN_METEO_GEOCODING_URL,
})

const forecastApi = axios.create({
  baseURL: env.VITE_OPEN_METEO_BASE_URL,
})

function toWeatherError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.reason || error.response?.data?.error || error.message
    return new Error(`${fallback}${detail ? `: ${detail}` : ''}`)
  }
  return error instanceof Error ? error : new Error(fallback)
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<GeoLocation[]> {
  const name = query.trim()
  if (name.length < 2) return []

  try {
    const { data } = await geocodingApi.get<{ results?: GeocodingResult[] }>('/search', {
      signal,
      params: { name, count: 8, language: 'en', format: 'json' },
    })

    return (data.results || []).map((r) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      countryCode: r.country_code,
      admin1: r.admin1,
      timezone: r.timezone,
    }))
  } catch (error) {
    throw toWeatherError(error, 'Could not search locations')
  }
}

function dateStart(value: string) {
  return new Date(`${value}T00:00:00`)
}

export async function fetchForecast(
  location: GeoLocation,
  units: Units,
  dateRange: ForecastDateRange
): Promise<Forecast> {
  const params: Record<string, unknown> = {
    latitude: location.latitude,
    longitude: location.longitude,
    current: CURRENT_FORECAST_FIELDS.join(','),
    hourly: HOURLY_FORECAST_FIELDS.join(','),
    daily: DAILY_FORECAST_FIELDS.join(','),
    timezone: 'auto',
    start_date: dateRange.startDate,
    end_date: dateRange.endDate,
    temperature_unit: units.temperature,
    wind_speed_unit: units.windSpeed,
    precipitation_unit: units.precipitation,
  }
  if (env.VITE_OPEN_METEO_API_KEY) params.apikey = env.VITE_OPEN_METEO_API_KEY

  let data: ForecastResponse
  try {
    const response = await forecastApi.get<ForecastResponse>('/forecast', { params })
    data = response.data
  } catch (error) {
    throw toWeatherError(error, 'Could not load weather data')
  }

  const firstHour = Math.max(Date.now(), dateStart(dateRange.startDate).getTime())
  const sliceStart = Math.max(
    0,
    data.hourly.time.findIndex((t) => new Date(t).getTime() >= firstHour)
  )
  const end = sliceStart + HOURLY_WINDOW
  const idx = (i: number) => sliceStart + i

  return {
    location,
    timezone: data.timezone,
    current: {
      time: new Date(data.current.time),
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      isDay: data.current.is_day === 1,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windGusts: data.current.wind_gusts_10m,
      pressure: data.current.pressure_msl,
      cloudCover: data.current.cloud_cover,
      dewPoint: data.current.dew_point_2m,
    },
    hourly: data.hourly.time.slice(sliceStart, end).map((time, i) => ({
      time: new Date(time),
      temperature: data.hourly.temperature_2m[idx(i)],
      apparentTemperature: data.hourly.apparent_temperature[idx(i)],
      humidity: data.hourly.relative_humidity_2m[idx(i)],
      windSpeed: data.hourly.wind_speed_10m[idx(i)],
      windGusts: data.hourly.wind_gusts_10m[idx(i)],
      precipitation: data.hourly.precipitation[idx(i)],
      precipitationProbability: data.hourly.precipitation_probability[idx(i)],
      uvIndex: data.hourly.uv_index[idx(i)],
      weatherCode: data.hourly.weather_code[idx(i)],
      pressure: data.hourly.pressure_msl[idx(i)],
      cloudCover: data.hourly.cloud_cover[idx(i)],
      dewPoint: data.hourly.dew_point_2m[idx(i)],
    })),
    daily: data.daily.time.map((time, i) => ({
      date: new Date(time),
      weatherCode: data.daily.weather_code[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      tempMean: data.daily.temperature_2m_mean[i],
      apparentTempMax: data.daily.apparent_temperature_max[i],
      apparentTempMin: data.daily.apparent_temperature_min[i],
      precipitationSum: data.daily.precipitation_sum[i],
      precipitationProbabilityMax: data.daily.precipitation_probability_max[i],
      precipitationHours: data.daily.precipitation_hours[i],
      uvIndexMax: data.daily.uv_index_max[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      windGustsMax: data.daily.wind_gusts_10m_max[i],
      sunrise: new Date(data.daily.sunrise[i]),
      sunset: new Date(data.daily.sunset[i]),
      daylightDuration: data.daily.daylight_duration[i],
    })),
  }
}
