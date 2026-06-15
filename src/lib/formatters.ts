export function formatTemperature(value: number) {
  return `${Math.round(value)}°C`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatMillimeters(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)} mm`;
}

export function formatSpeed(value: number) {
  return `${Math.round(value)} km/h`;
}

export function formatPressure(value: number) {
  return `${Math.round(value)} hPa`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
