import type { LucideIcon } from 'lucide-react'
import type { QueryClient } from '@tanstack/react-query'

declare global {
  interface MyRouterContext {
    queryClient: QueryClient
  }

  type NavRoute = '/' | '/locations' | '/settings'

  type ThemeMode = 'light' | 'dark' | 'system'

  interface NavItem {
    title: string
    href: NavRoute
    icon: LucideIcon
    badge?: string
  }

  interface NavGroup {
    label: string
    items: NavItem[]
  }

  interface Breadcrumb {
    label: string
    href: NavRoute
  }

  interface NavbarProps {
    onMenuClick: () => void
  }

  interface SidebarProps {
    mobileOpen: boolean
    onMobileOpenChange: (open: boolean) => void
  }

  interface SidebarNavProps {
    onNavigate?: () => void
  }

  interface WeatherAppState {
    selectedLocation: GeoLocation
    recentLocations: GeoLocation[]
    units: Units
    dateRange: ForecastDateRange
  }

  interface WeatherAppContextValue extends WeatherAppState {
    setSelectedLocation: (location: GeoLocation) => void
    setUnits: (units: Units) => void
    setDateRange: (dateRange: ForecastDateRange) => void
  }

  type TemperatureUnit = 'celsius' | 'fahrenheit'
  type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn'
  type PrecipitationUnit = 'mm' | 'inch'

  /** User unit preferences; passed to the forecast API and into query keys. */
  interface Units {
    temperature: TemperatureUnit
    windSpeed: WindSpeedUnit
    precipitation: PrecipitationUnit
  }

  interface ForecastDateRange {
    startDate: string
    endDate: string
  }

  /** A geocoded place returned by the Open-Meteo geocoding API. */
  interface GeoLocation {
    id: number
    name: string
    latitude: number
    longitude: number
    country?: string
    countryCode?: string
    admin1?: string
    timezone?: string
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

  /** Normalized current conditions from the Open-Meteo forecast API. */
  interface CurrentConditions {
    time: Date
    temperature: number
    apparentTemperature: number
    humidity: number
    windSpeed: number
    windGusts: number
    precipitation: number
    weatherCode: number
    isDay: boolean
    pressure: number
    cloudCover: number
    dewPoint: number
  }

  /** Normalized hourly forecast for a single hour. */
  interface HourlyForecast {
    time: Date
    temperature: number
    apparentTemperature: number
    humidity: number
    windSpeed: number
    windGusts: number
    precipitation: number
    precipitationProbability: number
    uvIndex: number
    weatherCode: number
    pressure: number
    cloudCover: number
    dewPoint: number
  }

  /** Normalized daily forecast for a single day. */
  interface DailyForecast {
    date: Date
    weatherCode: number
    tempMax: number
    tempMin: number
    tempMean: number
    precipitationSum: number
    precipitationProbabilityMax: number
    precipitationHours: number
    uvIndexMax: number
    sunrise: Date
    sunset: Date
    daylightDuration: number
    windSpeedMax: number
    windGustsMax: number
    apparentTempMax: number
    apparentTempMin: number
  }

  /** Full normalized forecast for the active location. */
  interface Forecast {
    location: GeoLocation
    timezone: string
    current: CurrentConditions
    hourly: HourlyForecast[]
    daily: DailyForecast[]
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

  interface AiInsight {
    summary: string
    riskScore: 1 | 2 | 3 | 4 | 5
    riskLevel: 'low' | 'medium' | 'high'
    recommendedActions: string[]
    keySignals: string[]
    confidence: 'low' | 'medium' | 'high'
  }

  interface AiInsightRequest {
    location: string
    units: Units
    current: {
      condition: string
      temperature: number
      apparentTemperature: number
      humidity: number
      precipitation: number
      windSpeed: number
      windGusts: number
      cloudCover: number
      pressure: number
      dewPoint: number
    }
    today: {
      tempMax: number
      tempMin: number
      rainProbability: number
      precipitationSum: number
      precipitationHours: number
      uvIndexMax: number
      windSpeedMax: number
      windGustsMax: number
      sunrise: string
      sunset: string
    }
    nextHours: Array<{
      time: string
      condition: string
      temperature: number
      apparentTemperature: number
      rainProbability: number
      precipitation: number
      windSpeed: number
      windGusts: number
      uvIndex: number
      cloudCover: number
      pressure: number
      dewPoint: number
    }>
  }
}
