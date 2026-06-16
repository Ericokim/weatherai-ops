import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
  Monitor,
  Moon,
  Settings,
  Sun,
} from 'lucide-react'

export const navigation: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { title: 'Overview', href: '/', icon: LayoutDashboard },
      { title: 'Locations', href: '/locations', icon: MapPin },
    ],
  },
  {
    label: 'System',
    items: [{ title: 'Settings', href: '/settings', icon: Settings }],
  },
]

export const storageKey = 'weatherai-theme'
export const themes = [
  { value: 'light', label: 'Light', description: 'Bright dashboard', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Low-light mode', icon: Moon },
  { value: 'system', label: 'System', description: 'Match device', icon: Monitor },
] as const

export const APP_STORAGE_KEY = 'weatherai-app-state'
export const MAX_RECENTS = 5
export const HOUR = 1000 * 60 * 60
export const QUERY_STALE_TIME = 1000 * 60 * 10
export const DEFAULT_FORECAST_DAYS = 7
export const MAX_FORECAST_DAYS = 16
export const MAX_PAST_DAYS = 92
export const HOURLY_WINDOW = 24

export const DEFAULT_LOCATION: GeoLocation = {
  id: 184745,
  name: 'Nairobi',
  latitude: -1.28333,
  longitude: 36.81667,
  country: 'Kenya',
  countryCode: 'KE',
  admin1: 'Nairobi County',
  timezone: 'Africa/Nairobi',
}

export const DEFAULT_UNITS: Units = {
  temperature: 'celsius',
  windSpeed: 'kmh',
  precipitation: 'mm',
}

export function dateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function defaultDateRange(): ForecastDateRange {
  const today = new Date()
  return {
    startDate: dateInputValue(today),
    endDate: dateInputValue(addDays(today, DEFAULT_FORECAST_DAYS - 1)),
  }
}

export function normalizeDateRange(dateRange?: Partial<ForecastDateRange>): ForecastDateRange {
  const minDate = dateInputValue(addDays(new Date(), -(MAX_PAST_DAYS - 1)))
  const maxDate = dateInputValue(addDays(new Date(), MAX_FORECAST_DAYS - 1))
  const fallback = defaultDateRange()
  const startDate = dateRange?.startDate || fallback.startDate
  const endDate = dateRange?.endDate || fallback.endDate
  const start = startDate < minDate ? minDate : startDate > maxDate ? maxDate : startDate
  const end = endDate < start ? start : endDate > maxDate ? maxDate : endDate

  return { startDate: start, endDate: end }
}

export const FORECAST_RANGE_PRESETS = [
  { label: 'Today', days: 1 },
  { label: 'Next 3 days', days: 3 },
  { label: 'Next 7 days', days: 7 },
  { label: 'Next 10 days', days: 10 },
  { label: 'Full 16 days', days: MAX_FORECAST_DAYS },
]

export const WIND_UNIT_LABEL: Record<WindSpeedUnit, string> = {
  kmh: 'km/h',
  mph: 'mph',
  ms: 'm/s',
  kn: 'kn',
}

export const NAV_ICON_BUTTON =
  'rounded-xl border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'

export const REFRESH_ICON_STYLE = {
  background: 'linear-gradient(150deg, var(--lagoon), var(--lagoon-deep))',
}

export const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('weatherai-theme');var mode=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='system'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='system'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;document.body.style.background=resolved==='dark'?'#0a1418':'#e7f3ec'}catch(e){}})();`

export const CURRENT_FORECAST_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_gusts_10m',
  'pressure_msl',
  'cloud_cover',
  'dew_point_2m',
]

export const HOURLY_FORECAST_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_gusts_10m',
  'precipitation',
  'precipitation_probability',
  'uv_index',
  'weather_code',
  'pressure_msl',
  'cloud_cover',
  'dew_point_2m',
]

export const DAILY_FORECAST_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'temperature_2m_mean',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'precipitation_hours',
  'uv_index_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'sunrise',
  'sunset',
  'daylight_duration',
]

export const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

export const WEATHER_ICON_RANGES: Array<[maxCode: number, icon: LucideIcon]> = [
  [3, Cloud],
  [48, CloudFog],
  [57, CloudDrizzle],
  [67, CloudRain],
  [77, CloudSnow],
  [82, CloudRain],
  [86, CloudSnow],
  [99, CloudLightning],
]

export const CLEAR_DAY_ICON = Sun
export const CLEAR_NIGHT_ICON = Moon
export const PARTLY_CLOUDY_ICON = CloudSun
export const CLOUDY_ICON = Cloud
