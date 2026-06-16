import axios from 'axios'
import { env } from '#/env'

export const geocodingApi = axios.create({
  baseURL: env.VITE_OPEN_METEO_GEOCODING_URL ?? 'https://geocoding-api.open-meteo.com/v1',
})

export const forecastApi = axios.create({
  baseURL: env.VITE_OPEN_METEO_BASE_URL ?? 'https://api.open-meteo.com/v1',
})

function toWeatherError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.reason ?? error.response?.data?.error ?? error.message
    return new Error(`${fallback}${detail ? `: ${detail}` : ''}`)
  }
  return error instanceof Error ? error : new Error(fallback)
}

interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
  timezone?: string
}

interface ForecastResponse {
  timezone: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_gusts_10m: number
    pressure_msl: number
    cloud_cover: number
    dew_point_2m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    relative_humidity_2m: number[]
    wind_speed_10m: number[]
    wind_gusts_10m: number[]
    precipitation: number[]
    precipitation_probability: number[]
    uv_index: number[]
    weather_code: number[]
    pressure_msl: number[]
    cloud_cover: number[]
    dew_point_2m: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    temperature_2m_mean: number[]
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    precipitation_sum: number[]
    precipitation_probability_max: number[]
    precipitation_hours: number[]
    uv_index_max: number[]
    wind_speed_10m_max: number[]
    wind_gusts_10m_max: number[]
    sunrise: string[]
    sunset: string[]
    daylight_duration: number[]
  }
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

    return (data.results ?? []).map((r) => ({
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

const HOURLY_WINDOW = 24

/** Fetch and normalize a 7-day forecast (current, next 24h, 7 days) for a location. */
export async function fetchForecast(location: GeoLocation, units: Units): Promise<Forecast> {
  const params: Record<string, unknown> = {
    latitude: location.latitude,
    longitude: location.longitude,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,pressure_msl,cloud_cover,dew_point_2m',
    hourly:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,precipitation,precipitation_probability,uv_index,weather_code,pressure_msl,cloud_cover,dew_point_2m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,precipitation_hours,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset,daylight_duration',
    timezone: 'auto',
    forecast_days: 7,
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

  const sliceStart = Math.max(
    0,
    data.hourly.time.findIndex((t) => new Date(t).getTime() >= Date.now())
  )
  const end = sliceStart + HOURLY_WINDOW
  const idx = (i: number) => sliceStart + i

  const hourly: HourlyForecast[] = data.hourly.time.slice(sliceStart, end).map((time, i) => ({
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
  }))

  const d = data
  return {
    location,
    timezone: d.timezone,
    current: {
      time: new Date(d.current.time),
      temperature: d.current.temperature_2m,
      humidity: d.current.relative_humidity_2m,
      apparentTemperature: d.current.apparent_temperature,
      isDay: d.current.is_day === 1,
      precipitation: d.current.precipitation,
      weatherCode: d.current.weather_code,
      windSpeed: d.current.wind_speed_10m,
      windGusts: d.current.wind_gusts_10m,
      pressure: d.current.pressure_msl,
      cloudCover: d.current.cloud_cover,
      dewPoint: d.current.dew_point_2m,
    },
    hourly,
    daily: d.daily.time.map((_, i) => ({
      date: new Date(d.daily.time[i]),
      weatherCode: d.daily.weather_code[i],
      tempMax: d.daily.temperature_2m_max[i],
      tempMin: d.daily.temperature_2m_min[i],
      tempMean: d.daily.temperature_2m_mean[i],
      apparentTempMax: d.daily.apparent_temperature_max[i],
      apparentTempMin: d.daily.apparent_temperature_min[i],
      precipitationSum: d.daily.precipitation_sum[i],
      precipitationProbabilityMax: d.daily.precipitation_probability_max[i],
      precipitationHours: d.daily.precipitation_hours[i],
      uvIndexMax: d.daily.uv_index_max[i],
      windSpeedMax: d.daily.wind_speed_10m_max[i],
      windGustsMax: d.daily.wind_gusts_10m_max[i],
      sunrise: new Date(d.daily.sunrise[i]),
      sunset: new Date(d.daily.sunset[i]),
      daylightDuration: d.daily.daylight_duration[i],
    })),
  }
}
