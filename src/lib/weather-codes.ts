import {
  CLEAR_DAY_ICON,
  CLEAR_NIGHT_ICON,
  CLOUDY_ICON,
  PARTLY_CLOUDY_ICON,
  WEATHER_DESCRIPTIONS,
  WEATHER_ICON_RANGES,
} from '@/constants/data'

export function describeWeather(code: number): string {
  return WEATHER_DESCRIPTIONS[code] || 'Unknown conditions'
}

export function weatherIcon(code: number, isDay = true) {
  if (code === 0) return isDay ? CLEAR_DAY_ICON : CLEAR_NIGHT_ICON
  if (code <= 2) return isDay ? PARTLY_CLOUDY_ICON : CLOUDY_ICON
  return WEATHER_ICON_RANGES.find(([maxCode]) => code <= maxCode)?.[1] || CLOUDY_ICON
}
