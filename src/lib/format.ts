import { WIND_UNIT_LABEL } from '@/constants/data'

export { WIND_UNIT_LABEL }

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTemp(value: number): string {
  return `${Math.round(value)}°`
}

export function formatWeekday(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export function formatHour(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric' })
}
