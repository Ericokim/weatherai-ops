import type { WeatherCondition } from "@/types/weather";

const weatherCodeLabels: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  51: "Light drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  80: "Rain showers",
  95: "Thunderstorm",
};

export function getWeatherCondition(code: number): WeatherCondition {
  return {
    code,
    label: weatherCodeLabels[code] ?? "Unknown conditions",
  };
}
