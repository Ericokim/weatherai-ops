import type { GeocodingResult, OpenMeteoForecastResponse } from "@/types/weather";

export const DEFAULT_LOCATION = {
  name: "Nairobi, Kenya",
  latitude: -1.2921,
  longitude: 36.8219,
  timezone: "Africa/Nairobi",
};

const currentFields = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "rain",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
];

const hourlyFields = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation_probability",
  "precipitation",
  "rain",
  "weather_code",
  "cloud_cover",
  "wind_speed_10m",
  "wind_gusts_10m",
  "uv_index",
  "is_day",
];

const dailyFields = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "sunrise",
  "sunset",
  "uv_index_max",
  "et0_fao_evapotranspiration",
];

type ForecastRequest = {
  latitude: number;
  longitude: number;
  timezone: string;
  days?: number;
};

type GeocodingRequest = {
  name: string;
  count?: number;
};

export function buildForecastUrl(request: ForecastRequest) {
  const baseUrl = process.env.OPEN_METEO_BASE_URL ?? "https://api.open-meteo.com";
  const url = new URL("/v1/forecast", baseUrl);
  const days = Math.min(Math.max(request.days ?? 7, 1), 16);

  url.searchParams.set("latitude", String(request.latitude));
  url.searchParams.set("longitude", String(request.longitude));
  url.searchParams.set("timezone", request.timezone);
  url.searchParams.set("forecast_days", String(days));
  url.searchParams.set("current", currentFields.join(","));
  url.searchParams.set("hourly", hourlyFields.join(","));
  url.searchParams.set("daily", dailyFields.join(","));

  return url;
}

export function buildGeocodingUrl(request: GeocodingRequest) {
  const baseUrl =
    process.env.OPEN_METEO_GEOCODING_URL ??
    "https://geocoding-api.open-meteo.com";
  const url = new URL("/v1/search", baseUrl);

  url.searchParams.set("name", request.name);
  url.searchParams.set("count", String(request.count ?? 5));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  return url;
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Open-Meteo request failed with ${response.status}: ${body || response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function getForecast(request: ForecastRequest) {
  const url = buildForecastUrl(request);
  const data = await fetchJson<OpenMeteoForecastResponse>(url);

  return {
    data,
    requestUrl: url.toString(),
  };
}

export async function getGeocoding(request: GeocodingRequest) {
  const url = buildGeocodingUrl(request);
  const data = await fetchJson<{ results?: GeocodingResult[] }>(url);

  return {
    data,
    requestUrl: url.toString(),
  };
}
