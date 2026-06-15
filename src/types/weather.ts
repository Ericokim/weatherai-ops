export type RiskLevel = "Low" | "Moderate" | "High";

export type WeatherCondition = {
  code: number;
  label: string;
};

export type DailyForecast = {
  date: string;
  condition: WeatherCondition;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  evapotranspiration: number;
  risk: RiskLevel;
};

export type HourlyForecast = {
  time: string;
  condition: WeatherCondition;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  rain: number;
  cloudCover: number;
  windSpeed: number;
  windGusts: number;
  uvIndex: number;
  isDay: boolean;
  risk: RiskLevel;
};

export type WeatherResponse = {
  location: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    rain: number;
    precipitation: number;
    weatherCode: number;
    cloudCover: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    windGusts: number;
    condition: WeatherCondition;
    risk: RiskLevel;
  };
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  meta: {
    source: "open-meteo";
    fetchedAt: string;
    requestUrl: string;
  };
};

export type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current: Record<string, number | string>;
  hourly: Record<string, Array<number | string>>;
  daily: Record<string, Array<number | string>>;
};

export type GeocodingResult = {
  id?: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type AiInsight = {
  summary: string;
  riskLevel: "low" | "moderate" | "high";
  mainRisks: string[];
  recommendedActions: string[];
  bestOutdoorWindow: string;
  sprayingAdvice: string;
  irrigationAdvice: string;
  smsPreview: {
    en: string;
    sw: string;
  };
  confidence: number;
  source: "gemini" | "local-fallback";
  promptPreview: string;
  responsePreview: string;
  durationMs: number;
};
