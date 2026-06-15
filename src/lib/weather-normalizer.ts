import { getWeatherCondition } from "@/lib/weather-code-map";
import { calculateWeatherRisk } from "@/lib/risk-engine";
import type {
  DailyForecast,
  HourlyForecast,
  OpenMeteoForecastResponse,
  WeatherResponse,
} from "@/types/weather";

type NormalizeOptions = {
  name: string;
  requestUrl: string;
  fetchedAt?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
};

function numberValue(value: number | string | undefined) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function stringValue(value: number | string | undefined) {
  return String(value ?? "");
}

export function normalizeWeatherResponse(
  raw: OpenMeteoForecastResponse,
  options: NormalizeOptions
): WeatherResponse {
  const currentWeatherCode = numberValue(raw.current.weather_code);
  const current = {
    temperature: numberValue(raw.current.temperature_2m),
    feelsLike: numberValue(raw.current.apparent_temperature),
    humidity: numberValue(raw.current.relative_humidity_2m),
    rain: numberValue(raw.current.rain),
    precipitation: numberValue(raw.current.precipitation),
    weatherCode: currentWeatherCode,
    cloudCover: numberValue(raw.current.cloud_cover),
    pressure: numberValue(raw.current.pressure_msl),
    windSpeed: numberValue(raw.current.wind_speed_10m),
    windDirection: numberValue(raw.current.wind_direction_10m),
    windGusts: numberValue(raw.current.wind_gusts_10m),
    condition: getWeatherCondition(currentWeatherCode),
    risk: calculateWeatherRisk({
      precipitation: numberValue(raw.current.precipitation),
      windGusts: numberValue(raw.current.wind_gusts_10m),
      cloudCover: numberValue(raw.current.cloud_cover),
    }),
  };

  const daily = (raw.daily.time ?? []).map((date, index): DailyForecast => {
    const weatherCode = numberValue(raw.daily.weather_code?.[index]);
    const precipitationProbabilityMax = numberValue(
      raw.daily.precipitation_probability_max?.[index]
    );
    const precipitationSum = numberValue(raw.daily.precipitation_sum?.[index]);
    const windGustsMax = numberValue(raw.daily.wind_gusts_10m_max?.[index]);
    const uvIndexMax = numberValue(raw.daily.uv_index_max?.[index]);

    return {
      date: stringValue(date),
      condition: getWeatherCondition(weatherCode),
      temperatureMax: numberValue(raw.daily.temperature_2m_max?.[index]),
      temperatureMin: numberValue(raw.daily.temperature_2m_min?.[index]),
      precipitationSum,
      precipitationProbabilityMax,
      windSpeedMax: numberValue(raw.daily.wind_speed_10m_max?.[index]),
      windGustsMax,
      sunrise: stringValue(raw.daily.sunrise?.[index]),
      sunset: stringValue(raw.daily.sunset?.[index]),
      uvIndexMax,
      evapotranspiration: numberValue(
        raw.daily.et0_fao_evapotranspiration?.[index]
      ),
      risk: calculateWeatherRisk({
        rainProbability: precipitationProbabilityMax,
        precipitation: precipitationSum,
        windGusts: windGustsMax,
        uvIndex: uvIndexMax,
      }),
    };
  });

  const hourly = (raw.hourly.time ?? []).map((time, index): HourlyForecast => {
    const weatherCode = numberValue(raw.hourly.weather_code?.[index]);
    const precipitationProbability = numberValue(
      raw.hourly.precipitation_probability?.[index]
    );
    const precipitation = numberValue(raw.hourly.precipitation?.[index]);
    const windGusts = numberValue(raw.hourly.wind_gusts_10m?.[index]);
    const uvIndex = numberValue(raw.hourly.uv_index?.[index]);
    const cloudCover = numberValue(raw.hourly.cloud_cover?.[index]);

    return {
      time: stringValue(time),
      condition: getWeatherCondition(weatherCode),
      temperature: numberValue(raw.hourly.temperature_2m?.[index]),
      feelsLike: numberValue(raw.hourly.apparent_temperature?.[index]),
      humidity: numberValue(raw.hourly.relative_humidity_2m?.[index]),
      precipitationProbability,
      precipitation,
      rain: numberValue(raw.hourly.rain?.[index]),
      cloudCover,
      windSpeed: numberValue(raw.hourly.wind_speed_10m?.[index]),
      windGusts,
      uvIndex,
      isDay: numberValue(raw.hourly.is_day?.[index]) === 1,
      risk: calculateWeatherRisk({
        rainProbability: precipitationProbability,
        precipitation,
        windGusts,
        uvIndex,
        cloudCover,
      }),
    };
  });

  return {
    location: {
      name: options.name,
      latitude: options.latitude ?? raw.latitude,
      longitude: options.longitude ?? raw.longitude,
      timezone: options.timezone ?? raw.timezone,
    },
    current,
    daily,
    hourly,
    meta: {
      source: "open-meteo",
      fetchedAt: options.fetchedAt ?? new Date().toISOString(),
      requestUrl: options.requestUrl,
    },
  };
}
